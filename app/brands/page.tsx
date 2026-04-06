import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSiteSettings, getAllBrands } from "@/sanity/queries"
import { BrandsGrid } from "@/components/brands-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `Brands | ${businessName}`,
    description: `The trusted brands stocked and used by ${businessName} — quality parts for clutch, brake, and transmission repairs.`,
    alternates: { canonical: "/brands" },
    openGraph: {
      title: `Brands | ${businessName}`,
      description: `Trusted brands stocked by ${businessName}.`,
      url: `${siteUrl}/brands`,
      type: "website",
    },
  }
}

export default async function BrandsPage() {
  const [settings, brands] = await Promise.all([getSiteSettings(), getAllBrands()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Brands", item: `${siteUrl}/brands` },
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
                  Brands
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Brands We Stock
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              We source only quality, trusted brands — so you get parts that last.
            </p>
          </div>
        </section>

        {/* BRANDS GRID */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <BrandsGrid brands={brands} />
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-secondary/40 py-10 border-y border-border">
          <div className="container mx-auto text-center">
            <p className="text-muted-foreground text-lg">
              All parts are sourced from trusted suppliers and backed by manufacturer warranties.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Need a Part or a Quote?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Call us today and we will let you know if we have what you need in stock.
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
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
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
