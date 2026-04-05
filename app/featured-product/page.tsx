import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, Tag } from "lucide-react"
import { getSiteSettings, getAllFeaturedItems } from "@/sanity/queries"

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

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  news: "News",
  promotion: "Promotion",
}

const CATEGORY_COLOURS: Record<string, string> = {
  product: "bg-accent/20 text-accent",
  news: "bg-blue-500/20 text-blue-400",
  promotion: "bg-green-500/20 text-green-400",
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
            {items.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article
                    key={item._id}
                    className="bg-card border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors flex flex-col"
                  >
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-56 w-full bg-muted overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      {/* Category badge */}
                      {item.category && (
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md mb-3 w-fit ${
                            CATEGORY_COLOURS[item.category] ?? "bg-secondary text-muted-foreground"
                          }`}
                        >
                          <Tag className="h-3 w-3" />
                          {CATEGORY_LABELS[item.category] ?? item.category}
                        </span>
                      )}

                      <h2 className="text-lg font-bold text-foreground mb-2 text-balance">
                        {item.title}
                      </h2>

                      {item.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                          {item.description}
                        </p>
                      )}

                      {/* Specs */}
                      {item.specs && item.specs.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {item.specs.map((spec, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA */}
                      {item.ctaLabel && item.ctaLink && (
                        <Link
                          href={item.ctaLink}
                          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors mt-auto"
                        >
                          {item.ctaLabel}
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">Nothing featured yet</h2>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Featured items will appear here once they are added and marked as featured in the CMS.
                </p>
                <p className="text-sm text-muted-foreground">
                  Go to Sanity Studio → Products → Featured Items &amp; News → Add item
                </p>
              </div>
            )}
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
