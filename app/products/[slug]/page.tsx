import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, CheckCircle } from "lucide-react"
import { getSiteSettings, getProductPageBySlug } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, product] = await Promise.all([getSiteSettings(), getProductPageBySlug(slug)])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  if (!product) return { title: `Not Found | ${businessName}` }

  return {
    title: product.seoTitle ?? `${product.title} | ${businessName}`,
    description: product.seoDescription ?? product.introText ?? "",
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.seoTitle ?? `${product.title} | ${businessName}`,
      description: product.seoDescription ?? product.introText ?? "",
      url: `${siteUrl}/products/${slug}`,
      type: "website",
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const [settings, product] = await Promise.all([getSiteSettings(), getProductPageBySlug(slug)])

  if (!product) notFound()

  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: product.title, item: `${siteUrl}/products/${slug}` },
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
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-accent">{product.title}</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              {product.heading ?? product.title}
            </h1>
            {product.introText && (
              <p className="text-xl text-zinc-300 max-w-2xl leading-relaxed">
                {product.introText}
              </p>
            )}
          </div>
        </section>

        {/* GALLERY */}
        {product.galleryImages && product.galleryImages.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product.galleryImages.map((img, i) => (
                  <figure key={i} className="overflow-hidden rounded-xl bg-muted">
                    {img.asset && (
                      <div className="relative h-56 w-full">
                        <Image
                          src={img.asset}
                          alt={img.caption ?? `${product.title} — image ${i + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    {img.caption && (
                      <figcaption className="px-4 py-2 text-sm text-muted-foreground">{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DETAILED DESCRIPTION */}
        {product.detailedDescription && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="container mx-auto max-w-3xl">
              <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
                {product.detailedDescription}
              </p>
            </div>
          </section>
        )}

        {/* SECTIONS */}
        {product.sections && product.sections.length > 0 && (
          <section className="py-12 md:py-16 bg-secondary/20 border-y border-border">
            <div className="container mx-auto max-w-3xl space-y-10">
              {product.sections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-foreground mb-3">{section.heading}</h2>
                  )}
                  {section.content && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SPECIFICATIONS */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="py-12 md:py-16 border-t border-border">
            <div className="container mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground mb-6">Specifications</h2>
              <ul className="space-y-3">
                {product.specifications.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground">
                    <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-zinc-900 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              {product.ctaHeading ?? "Interested? Get in Touch"}
            </h2>
            {product.ctaText && (
              <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">{product.ctaText}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {product.ctaButtonLabel && product.ctaButtonLink ? (
                <Link
                  href={product.ctaButtonLink}
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  {product.ctaButtonLabel}
                </Link>
              ) : (
                <Link
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
                >
                  Call Now: {phone}
                </Link>
              )}
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
