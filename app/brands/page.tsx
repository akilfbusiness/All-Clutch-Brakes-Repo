import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ExternalLink } from "lucide-react"
import { getSiteSettings, getAllBrands } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"

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
            {brands.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {brands.map((brand) => (
                  <div
                    key={brand._id}
                    className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-accent/50 transition-colors"
                  >
                    {/* Logo */}
                    {brand.logo ? (
                      <div className="relative h-20 w-full mb-4">
                        <Image
                          src={urlFor(brand.logo).width(300).height(160).fit("max").url()}
                          alt={`${brand.name} logo`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-full flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold text-accent">{brand.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}

                    <h2 className="text-lg font-bold text-foreground mb-2">{brand.name}</h2>

                    {brand.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {brand.description}
                      </p>
                    )}

                    {brand.website && (
                      <a
                        href={brand.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent text-sm hover:underline mt-auto"
                      >
                        Visit website <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl font-bold text-muted-foreground">B</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No brands added yet</h2>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Brands will appear here once they are added in the CMS.
                </p>
                <p className="text-sm text-muted-foreground">
                  Go to Sanity Studio → Products → Brands → Add item
                </p>
              </div>
            )}
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
