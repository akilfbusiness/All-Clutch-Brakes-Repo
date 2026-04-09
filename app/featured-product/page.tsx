import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-background">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative py-24 md:py-36 bg-background border-b border-border overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(3rem,12vw,9rem)] font-bold tracking-tighter text-foreground/[0.06] leading-none"
          >
            Featured
          </span>
          <div className="container mx-auto px-6 relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-[11px] text-foreground/40 uppercase tracking-widest">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-accent">Featured Products &amp; News</li>
              </ol>
            </nav>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-4">
              Latest from {businessName}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              Featured Products<br />&amp; News
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
              The latest products, promotions, and news from {businessName}.
            </p>
            {items.length > 0 && (
              <p className="mt-4 text-sm text-foreground/40 font-medium">{items.length} items</p>
            )}
          </div>
        </section>

        {/* ── Items Grid ────────────────────────────────────────── */}
        <section className="py-16 md:py-24 border-b border-border">
          <div className="container mx-auto px-6">
            <FeaturedItemsGrid items={items} />
          </div>
        </section>

        {/* ── CTA Strip ──────────────────────────────────────────── */}
        <section className="bg-accent py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-accent-foreground mb-4">
              Interested in Any of These?
            </h2>
            <p className="text-accent-foreground/70 mb-8 max-w-xl mx-auto">
              Call us or send an enquiry and we will get you sorted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Now: {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-accent-foreground/30 hover:border-accent-foreground text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
