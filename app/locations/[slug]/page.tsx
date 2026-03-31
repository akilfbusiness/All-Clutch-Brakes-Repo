import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { getLocationBySlug, getAllLocationSlugs, getSiteSettings, type Location } from "@/sanity/queries"
import { ChevronRight, MapPin, Phone, ArrowLeft, CheckCircle } from "lucide-react"

export async function generateStaticParams() {
  try {
    const slugs = await getAllLocationSlugs()
    return slugs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [location, settings] = await Promise.all([
    getLocationBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  if (!location) return { title: `Location Not Found | ${businessName}` }

  const title = location.seoTitle ?? `Clutch & Brake Service in ${location.title} | ${businessName}`
  const description = location.seoDescription ?? location.answerCapsule ?? `${businessName} provides clutch, brake, and transmission services in ${location.title}. Expert mechanics serving Adelaide.`

  return {
    title,
    description,
    alternates: { canonical: `/locations/${slug}` },
    openGraph: {
      title,
      description,
      url: `${settings?.siteUrl ?? "https://example.com"}/locations/${slug}`,
      type: "website",
    },
  }
}

const services = [
  { title: "Clutch Repairs & Replacement", slug: "clutch-repairs" },
  { title: "Brake Services", slug: "brake-services" },
  { title: "Transmission Repairs", slug: "transmission-repairs" },
  { title: "Flywheel Machining", slug: "flywheel-machining" },
  { title: "Hydraulic Repairs", slug: "hydraulic-repairs" },
  { title: "Differential Services", slug: "differential-services" },
]

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [location, settings] = await Promise.all([
    getLocationBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  if (!location) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const isRegion = location.locationType === "region"

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/locations/${location.slug}`,
    name: `${businessName} — ${location.title}`,
    url: `${siteUrl}/locations/${location.slug}`,
    areaServed: location.suburbsIncluded?.length
      ? [
          { "@type": "AdministrativeArea", name: location.title },
          ...location.suburbsIncluded.map((suburb) => ({ "@type": "City", name: suburb })),
        ]
      : [{ "@type": "AdministrativeArea", name: location.title }],
    telephone: phone,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteUrl}/locations` },
      ...(location.locationType === "suburb" && location.region
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: location.region.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
              item: `${siteUrl}/locations/${location.region}`,
            },
            { "@type": "ListItem", position: 4, name: location.title, item: `${siteUrl}/locations/${slug}` },
          ]
        : [{ "@type": "ListItem", position: 3, name: location.title, item: `${siteUrl}/locations/${slug}` }]),
    ],
  }

  const faqSchema = location.faqItems?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: location.faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li><Link href="/locations" className="hover:text-orange-500 transition-colors">Locations</Link></li>
                {location.locationType === "suburb" && location.region && (
                  <>
                    <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                    <li>
                      <Link href={`/locations/${location.region}`} className="hover:text-orange-500 transition-colors">
                        {location.region.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                      </Link>
                    </li>
                  </>
                )}
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">{location.title}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-orange-400 uppercase tracking-wide">
                {isRegion ? "Service Region" : "Service Area"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Clutch &amp; Brake Service in {location.title}
            </h1>

            <p className="text-xl text-zinc-300 max-w-3xl mb-8">
              {location.answerCapsule}
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Get Service in {location.title}
            </Link>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {location.body && (
                  <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-a:text-orange-600 mb-12">
                    <h2>Services in {location.title}</h2>
                    <PortableText value={location.body} />
                  </div>
                )}

                {/* Services Available */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                    Services Available in {location.title}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="flex items-center gap-3 p-4 bg-white border border-zinc-200 rounded-lg hover:border-orange-300 hover:shadow transition-all"
                      >
                        <CheckCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                        <span className="font-medium text-zinc-900">{service.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Suburbs Covered (regions only) */}
                {isRegion && location.suburbsIncluded && location.suburbsIncluded.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                      Suburbs We Service in {location.title}
                    </h2>
                    <p className="text-zinc-600 mb-6">
                      {businessName} provides clutch, brake, and transmission services across the following suburbs:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {location.suburbsIncluded.map((suburb) => (
                        <span
                          key={suburb}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm"
                        >
                          <MapPin className="h-3 w-3" />
                          {suburb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ */}
                {location.faqItems && location.faqItems.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {location.faqItems.map((faq, index) => (
                        <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold text-zinc-900 mb-3">{faq.question}</h3>
                          <p className="text-zinc-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Contact Card */}
                  <div className="bg-zinc-900 text-white rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Get Service in {location.title}</h3>
                    <p className="text-zinc-300 mb-6">
                      Contact us today to discuss your clutch, brake, or transmission needs.
                    </p>
                    <div className="space-y-4">
                      <Link
                        href="/contact"
                        className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        Request a Quote
                      </Link>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        {phone}
                      </a>
                    </div>
                  </div>

                  {/* Other Locations */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">Other Service Areas</h3>
                    <Link
                      href="/locations"
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      View All Locations
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Service in {location.title}?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Contact {businessName} today to discuss your clutch, brake, or transmission needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                {phone}
              </a>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <section className="py-8 bg-zinc-100">
          <div className="container mx-auto px-4">
            <Link
              href="/locations"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-orange-600 font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Locations
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
