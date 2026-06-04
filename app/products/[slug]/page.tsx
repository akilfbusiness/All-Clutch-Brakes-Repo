// Individual product page — content pulled from Sanity CMS
// Edit product content via Sanity Studio → Product Pages

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getSiteSettings, getProductPageBySlug } from "@/sanity/queries"
import { ProductPageClient } from "@/components/product-page-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, product] = await Promise.all([getSiteSettings(), getProductPageBySlug(slug)])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  if (!product) return { title: "Not Found" }

  const title       = product.seoTitle       ?? product.title
  const description = product.seoDescription ?? product.introText ?? ""

  return {
    title,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: { title, description, url: `${siteUrl}/products/${slug}`, type: "website" },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const [settings, product] = await Promise.all([getSiteSettings(), getProductPageBySlug(slug)])

  if (!product) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  // ── Structured data ────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: siteUrl },
      { "@type": "ListItem", position: 2, name: product.title,  item: `${siteUrl}/products/${slug}` },
    ],
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.heading ?? product.title,
    description: product.detailedDescription ?? product.introText ?? "",
    url: `${siteUrl}/products/${slug}`,
    brand: { "@type": "Brand", name: businessName },
    ...(product.specifications?.length && {
      additionalProperty: product.specifications.map((spec: string) => ({
        "@type": "PropertyValue",
        value: spec,
      })),
    }),
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "AUD",
      seller: { "@type": "LocalBusiness", name: businessName, url: siteUrl },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <ProductPageClient
        businessName={businessName}
        phone={phone}
        product={product}
      />
    </>
  )
}
