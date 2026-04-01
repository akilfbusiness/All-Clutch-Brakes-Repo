import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { getServiceBySlug, getAllServiceSlugs, getAllServices, getSiteSettings, type Service } from "@/sanity/queries"
import { ChevronRight, Phone, ArrowLeft, CheckCircle, Wrench, MapPin } from "lucide-react"

export async function generateStaticParams() {
  try {
    const slugs = await getAllServiceSlugs()
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
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  if (!service) return { title: `Service Not Found | ${businessName}` }

  const title = service.seoTitle ?? `${service.title} | ${businessName}`
  const description = service.seoDescription ?? service.answerCapsule ?? `${businessName} provides expert ${service.title.toLowerCase()} in Adelaide. Quality workmanship and honest service.`

  return {
    title,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      title,
      description,
      url: `${settings?.siteUrl ?? "https://example.com"}/services/${slug}`,
      type: "website",
    },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [service, settings, allServices] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getSiteSettings(),
    getAllServices(),
  ])

  if (!service) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const howWeDeliverHeading =
    settings?.servicesHowWeDeliverHeading ?? `How ${businessName} Delivers`
  const defaultDeliverPoints = [
    "Expert diagnosis by qualified mechanics",
    "Quality parts with warranty",
    "Transparent pricing with no hidden fees",
    "Work completed to manufacturer standards",
  ]
  const deliverPoints =
    settings?.servicesHowWeDeliverPoints?.length
      ? settings.servicesHowWeDeliverPoints
      : defaultDeliverPoints

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/services/${service.slug}`,
    name: service.title,
    description: service.answerCapsule,
    url: `${siteUrl}/services/${service.slug}`,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: service.serviceAreas?.length
      ? service.serviceAreas.map((a) => ({ "@type": "City", name: a.title }))
      : { "@type": "State", name: "South Australia" },
    serviceType: "Automotive Repair",
    ...(service.featuredImage && { image: service.featuredImage }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${siteUrl}/services/${slug}` },
    ],
  }

  const faqSchema = service.faqItems?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  // Related services — real services from Sanity, excluding the current one
  const relatedServices = allServices
    .filter((s) => s.slug !== slug)
    .slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          {/* Featured Image */}
          {service.featuredImage && (
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <Image
                src={service.featuredImage}
                alt={service.title}
                fill
                className="object-cover opacity-40"
                priority
                crossOrigin="anonymous"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-zinc-900/80" />
            </div>
          )}
          <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li><Link href="/services" className="hover:text-orange-500 transition-colors">Services</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">{service.title}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-orange-400 uppercase tracking-wide">Service</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.title}
            </h1>

            <p className="text-xl text-zinc-300 max-w-3xl mb-8">
              {service.answerCapsule}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Enquire About This Service
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

        {/* Content Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Service Body */}
                {service.body && (
                  <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-a:text-orange-600 mb-12">
                    <h2>About {service.title}</h2>
                    <PortableText value={service.body} />
                  </div>
                )}

                {/* Who Is It For */}
                {service.whoIsItFor && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-4">Who Is This Service For?</h2>
                    <p className="text-lg text-zinc-600">{service.whoIsItFor}</p>
                  </div>
                )}

                {/* Gallery */}
                {service.gallery && service.gallery.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {service.gallery.map((img, i) => (
                        <figure key={i} className="rounded-lg overflow-hidden border border-zinc-200">
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={img.url}
                              alt={img.caption ?? `${service.title} photo ${i + 1}`}
                              fill
                              className="object-cover"
                              crossOrigin="anonymous"
                            />
                          </div>
                          {img.caption && (
                            <figcaption className="text-xs text-zinc-500 text-center p-2 bg-zinc-50">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {/* How We Deliver */}
                <div className="mb-12 bg-zinc-50 border border-zinc-200 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-4">
                    {howWeDeliverHeading} {service.title}
                  </h2>
                  <ul className="space-y-3">
                    {deliverPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-zinc-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FAQ */}
                {service.faqItems && service.faqItems.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                      {service.faqItems.map((faq, index) => (
                        <div key={index} className="bg-white border border-zinc-200 rounded-lg p-6">
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
                    <h3 className="text-xl font-bold mb-4">Get a Quote</h3>
                    <p className="text-zinc-300 mb-6">
                      Contact us today for expert {service.title.toLowerCase()} at competitive prices.
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

                  {/* Service Areas */}
                  {service.serviceAreas && service.serviceAreas.length > 0 && (
                    <div className="bg-white border border-zinc-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        Service Areas
                      </h3>
                      <ul className="space-y-2">
                        {service.serviceAreas.map((area) => (
                          <li key={area.slug}>
                            <Link
                              href={`/locations/${area.slug}`}
                              className="flex items-center gap-2 text-zinc-600 hover:text-orange-600 transition-colors text-sm"
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                              {area.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Related Services */}
                  <div className="bg-white border border-zinc-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-zinc-900 mb-4">Related Services</h3>
                    <ul className="space-y-3">
                      {relatedServices.map((related) => (
                        <li key={related.slug}>
                          <Link
                            href={`/services/${related.slug}`}
                            className="flex items-center gap-2 text-zinc-600 hover:text-orange-600 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4" />
                            {related.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold mt-4 hover:text-orange-700 transition-colors"
                    >
                      View All Services
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
              Ready for {service.title}?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Contact {businessName} today for expert service at competitive prices.
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
              href="/services"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-orange-600 font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Services
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
