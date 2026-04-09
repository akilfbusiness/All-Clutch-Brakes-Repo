// Services index page — all content pulled from Sanity CMS
// Edit heading, subtitle, CTAs, FAQs via Sanity Studio → Site Settings → Services tab
// Edit individual service cards via Sanity Studio → Services

import type { Metadata } from "next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"
import { ServicesPageClient } from "@/components/services-page-client"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl        = settings?.siteUrl        ?? "https://example.com"
  const businessName   = settings?.businessName   ?? "All Clutch & Brake Service"
  const title          = `Our Services | ${businessName}`
  const description    = settings?.servicesPageSeoDescription ?? settings?.defaultSeoDescription ?? ""

  return {
    title,
    description,
    alternates: { canonical: "/services" },
    openGraph: { title, description, url: `${siteUrl}/services`, type: "website" },
  }
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getAllServices(),
  ])

  const businessName   = settings?.businessName   ?? "All Clutch & Brake Service"
  const phone          = settings?.phone?.[0]     ?? "(08) 8277 8122"
  const siteUrl        = settings?.siteUrl        ?? "https://example.com"

  const pageTitle    = settings?.servicesPageHeroTitle    ?? "Our Services"
  const pageSubtitle = settings?.servicesPageHeroSubtitle ?? "From clutch replacements to full brake overhauls — all work carried out in-house by qualified tradespeople with upfront fixed pricing."

  const ctaHeading = settings?.servicesCtaHeading ?? "Ready to Book?"
  const ctaBody    = settings?.servicesCtaBody    ?? "Call us today or send a message and we'll get back to you promptly."

  const faqs = settings?.servicesFaqs ?? []

  const serviceItems = services.map((s) => ({
    title:       s.title,
    slug:        s.slug        ?? null,
    description: s.answerCapsule ?? null,
  }))

  // ── Breadcrumb schema ──────────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/services`,
    name: `Services — ${businessName}`,
    description: settings?.servicesPageSeoDescription ?? "",
    url: `${siteUrl}/services`,
    provider: { "@id": `${siteUrl}/#business` },
  }

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <ServicesPageClient
        businessName={businessName}
        phone={phone}
        pageTitle={pageTitle}
        pageSubtitle={pageSubtitle}
        ctaHeading={ctaHeading}
        ctaBody={ctaBody}
        services={serviceItems}
        faqs={faqs}
      />
    </>
  )
}
