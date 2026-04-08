// Contact page — all content pulled from Sanity CMS
// Edit contact details, form options, FAQs via Sanity Studio → Site Settings → Contact tab

import type { Metadata } from "next"
import { getSiteSettings } from "@/sanity/queries"
import { ContactPageClient } from "@/components/contact-page-client"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const title        = settings?.contactSeoTitle ?? `Contact Us | ${businessName}`
  const description  = settings?.contactSeoDescription ?? settings?.contactAnswerCapsule ?? `Contact ${businessName} for expert clutch, brake, and transmission repairs in Adelaide.`

  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title, description, url: `${siteUrl}/contact`, type: "website" },
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phones       = settings?.phone        ?? ["(08) 8277 8122"]
  const email        = settings?.email        ?? "info@allclutchandbrake.com.au"
  const address      = settings?.address      ?? null
  const businessHours = settings?.businessHours ?? []

  const contactInfoHeading = settings?.contactInfoHeading ?? "Get in Touch"
  const formHeading        = settings?.contactFormHeading    ?? "Send an Enquiry"
  const formSubheading     = settings?.contactFormSubheading ?? ""
  const privacyNote        = settings?.contactPrivacyNote    ?? "We will only use your information to respond to your enquiry."
  const serviceOptions     = settings?.contactServiceOptions ?? [
    "Clutch Repairs",
    "Brake Services",
    "Transmission Repairs",
    "Flywheel Machining",
    "General Enquiry",
  ]
  const faqs = settings?.contactFaqs ?? []

  // ── Structured data ────────────────────────────────────────────────────────
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact`,
    name: `Contact ${businessName}`,
    description: settings?.contactAnswerCapsule ?? "",
    url: `${siteUrl}/contact`,
    mainEntity: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <ContactPageClient
        businessName={businessName}
        phones={phones}
        email={email}
        address={address}
        businessHours={businessHours}
        contactInfoHeading={contactInfoHeading}
        formHeading={formHeading}
        formSubheading={formSubheading}
        privacyNote={privacyNote}
        serviceOptions={serviceOptions}
        googleMapsEmbedUrl={settings?.googleMapsEmbedUrl}
        faqs={faqs}
      />
    </>
  )
}
