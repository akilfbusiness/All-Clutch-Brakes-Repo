import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ChevronRight, ArrowRight } from "lucide-react"
import { getSiteSettings, getAllBrands } from "@/sanity/queries"
import { BrandsGrid } from "@/components/brands-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  return {
    title: `Brands We Stock | ${businessName}`,
    description: `The trusted brands stocked and used by ${businessName} — quality parts for clutch, brake, and transmission repairs.`,
    alternates: { canonical: "/brands" },
    openGraph: { title: `Brands | ${businessName}`, url: `${siteUrl}/brands`, type: "website" },
  }
}

export default async function BrandsPage() {
  const [settings, brands] = await Promise.all([getSiteSettings(), getAllBrands()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",   item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${siteUrl}/brands` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap">
          Brands
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Brands</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Quality Parts</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8">
              Brands We Stock
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              We source only trusted brands — quality parts backed by manufacturer warranties so you get repairs that last.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS GRID */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">All Brands</h2>
            {brands.length > 0 && (
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/70 border border-accent/20 px-3 py-1">
                {brands.length} Brands
              </span>
            )}
          </div>
          <BrandsGrid brands={brands} />
        </div>
      </section>

      {/* TRUST NOTE */}
      <section className="bg-background border-t border-border py-10">
        <div className="container">
          <p className="text-muted-foreground/60 text-sm text-center">
            All parts are sourced from trusted suppliers and backed by manufacturer warranties.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground tracking-tight leading-tight">
                Need a Part or a Quote?
              </h2>
              <p className="mt-3 text-accent-foreground/55 text-sm md:text-base max-w-lg leading-relaxed">
                Call us today and we&apos;ll let you know if we have what you need in stock.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/40 hover:bg-accent-foreground hover:text-accent text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
