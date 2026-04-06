import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSiteSettings, getAllFeaturedItems } from "@/sanity/queries"
import { FeaturedItemsGrid } from "@/components/featured-items-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `Featured Products & News | ${businessName}`,
    description: `Latest featured products, news, and promotions from ${businessName}.`,
    alternates: { canonical: "/featured-product" },
    openGraph: {
      title: `Featured Products & News | ${businessName}`,
      description: `Latest featured products and news from ${businessName}.`,
      url: `${siteUrl}/featured-product`,
      type: "website",
    },
  }
}

export default async function FeaturedProductPage() {
  const [settings, items] = await Promise.all([getSiteSettings(), getAllFeaturedItems()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Featured Products & News", item: `${siteUrl}/featured-product` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* HERO */}
        <section className="bg-zinc-900 text-white py-16 md:py-24">
          <div className="container mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-accent">
                  Featured Products &amp; News
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Featured Products &amp; News
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              The latest products, promotions, and news from {businessName}.
            </p>
          </div>
        </section>

        {/* ITEMS GRID */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <FeaturedItemsGrid items={items} />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zinc-900 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              Interested in Any of These?
            </h2>
            <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">
              Call us or send an enquiry and we will get you sorted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Call Now: {phone}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
