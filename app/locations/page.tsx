import type { Metadata } from "next"
import Link from "next/link"
import { getSiteSettings, getAllLocations } from "@/sanity/queries"
import { ChevronRight, MapPin, Phone } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: `Service Areas | ${businessName}`,
    description: settings?.locationsPageAnswerCapsule ?? `${businessName} provides clutch, brake, and transmission services across Adelaide and surrounding suburbs.`,
    alternates: { canonical: "/locations" },
    openGraph: {
      title: `Service Areas | ${businessName}`,
      description: settings?.locationsPageAnswerCapsule ?? "",
      url: `${siteUrl}/locations`,
      type: "website",
    },
  }
}

export default async function LocationsPage() {
  const [settings, locations] = await Promise.all([
    getSiteSettings(),
    getAllLocations().catch(() => []),
  ])

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const faqs = settings?.locationsFaqs ?? []
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  const regions = locations?.filter((l) => l.locationType === "region") ?? []
  const suburbs = locations?.filter((l) => l.locationType === "suburb") ?? []

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteUrl}/locations` },
    ],
  }

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  // Default locations to show if none in Sanity yet
  const defaultRegions = [
    { title: "Adelaide CBD & Inner Suburbs", slug: "adelaide-cbd", answerCapsule: "Central Adelaide including the CBD, North Adelaide, and surrounding inner suburbs." },
    { title: "Southern Adelaide", slug: "southern-adelaide", answerCapsule: "Covering Marion, Brighton, Glenelg, Morphett Vale, and surrounding southern suburbs." },
    { title: "Northern Adelaide", slug: "northern-adelaide", answerCapsule: "Including Salisbury, Elizabeth, Gawler, and surrounding northern suburbs." },
    { title: "Eastern Adelaide", slug: "eastern-adelaide", answerCapsule: "Norwood, Burnside, Campbelltown, and Adelaide Hills foothills." },
    { title: "Western Adelaide", slug: "western-adelaide", answerCapsule: "Port Adelaide, Henley Beach, West Lakes, and surrounding western suburbs." },
  ]

  const displayRegions = regions.length > 0 ? regions : defaultRegions

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">Locations</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {settings?.locationsPageHeroTitle ?? `Service Areas`}
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              {settings?.locationsPageHeroSubtitle ?? `${businessName} provides expert clutch, brake, and transmission services across Adelaide and surrounding areas. Visit our Edwardstown workshop or contact us for mobile service options.`}
            </p>
          </div>
        </section>

        {/* Regions Grid */}
        <section className="py-16 md:py-24" aria-labelledby="regions-heading">
          <div className="container mx-auto px-4">
            <h2 id="regions-heading" className="text-3xl font-bold text-zinc-900 mb-8">
              Service Regions
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayRegions.map((region) => (
                <article 
                  key={region.slug}
                  className="group bg-white border border-zinc-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-orange-600 transition-colors">
                        <Link href={`/locations/${region.slug}`}>
                          {region.title}
                        </Link>
                      </h3>
                      {region.answerCapsule && (
                        <p className="text-zinc-600 text-sm mb-4">
                          {region.answerCapsule}
                        </p>
                      )}
                      <Link
                        href={`/locations/${region.slug}`}
                        className="inline-flex items-center gap-1 text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors"
                        aria-label={`View services in ${region.title}`}
                      >
                        View Services
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Key Suburbs */}
        {suburbs.length > 0 && (
          <section className="py-16 bg-zinc-50" aria-labelledby="suburbs-heading">
            <div className="container mx-auto px-4">
              <h2 id="suburbs-heading" className="text-3xl font-bold text-zinc-900 mb-8">
                Key Service Areas
              </h2>
              <nav aria-label="Key service areas">
                <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {suburbs.map((suburb) => (
                    <li key={suburb.slug}>
                      <Link
                        href={`/locations/${suburb.slug}`}
                        className="flex items-center gap-2 p-4 bg-white border border-zinc-200 rounded-lg hover:border-orange-300 hover:shadow transition-all"
                      >
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <span className="font-medium text-zinc-900">{suburb.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </section>
        )}

        {/* Fallback message if no locations */}
        {regions.length === 0 && suburbs.length === 0 && (
          <section className="py-8 bg-zinc-50">
            <div className="container mx-auto px-4 text-center">
              <p className="text-zinc-600">
                Individual location pages coming soon. Add locations in Sanity Studio.
              </p>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="py-16" aria-labelledby="locations-faq-heading">
            <div className="container mx-auto px-4">
              <h2 id="locations-faq-heading" className="text-3xl font-bold text-zinc-900 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white border border-zinc-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-3">{faq.question}</h3>
                    <p className="text-zinc-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-zinc-900 text-white py-16" aria-labelledby="locations-cta-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="locations-cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Not Sure If We Service Your Area?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Contact us and we&apos;ll confirm coverage in your location and discuss your needs.
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
      </main>
    </>
  )
}
