// About page — content pulled from Sanity CMS
// Edit content via Sanity Studio → Site Settings → About tab

import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ChevronRight, ArrowRight, Check } from "lucide-react"
import { getSiteSettings } from "@/sanity/queries"
import { AboutPageClient } from "@/components/about-page-client"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const title        = settings?.aboutSeoTitle ?? `About Us | ${businessName}`
  const description  = settings?.aboutSeoDescription ?? settings?.aboutAnswerCapsule ?? `Learn about ${businessName} — Adelaide's trusted specialists in clutch, brake, and transmission repairs.`

  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: { title, description, url: `${siteUrl}/about`, type: "website" },
  }
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"

  const values       = settings?.aboutValues       ?? []
  const whoWeAreBody = settings?.aboutWhoWeAreBody ?? []

  const ctaHeading        = settings?.aboutCtaHeading        ?? "Ready to Work With Us?"
  const ctaBody           = settings?.aboutCtaBody           ?? "Contact us today to discuss your clutch, brake, or transmission needs."
  const ctaPrimaryLabel   = settings?.aboutCtaPrimaryLabel   ?? "Contact Us"
  const ctaSecondaryLabel = settings?.aboutCtaSecondaryLabel ?? "View Our Services"

  const defaultValues = [
    { title: "Quality Workmanship",  description: "We use only quality parts and proven techniques to ensure reliable, long-lasting repairs." },
    { title: "Honest Service",       description: "Transparent pricing with no hidden fees. We explain what needs doing and why." },
    { title: "Expert Knowledge",     description: "Decades of experience specialising in clutch, brake, and transmission systems." },
    { title: "Customer Focus",       description: "We treat every vehicle as if it were our own, with attention to detail and care." },
  ]
  const displayValues = values.length > 0 ? values : defaultValues

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about`,
    name: `About ${businessName}`,
    description: settings?.aboutAnswerCapsule ?? "",
    url: `${siteUrl}/about`,
    mainEntity: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <AboutPageClient
        businessName={businessName}
        phone={phone}
        aboutHeading={settings?.aboutHeading}
        aboutAnswerCapsule={settings?.aboutAnswerCapsule}
        aboutMissionHeading={settings?.aboutMissionHeading}
        aboutMissionBody={settings?.aboutMissionBody}
        whoWeAreHeading={settings?.aboutWhoWeAreHeading}
        whoWeAreBody={whoWeAreBody}
        displayValues={displayValues}
        abn={settings?.abn}
        registrationId={settings?.registrationId}
        address={settings?.address ?? null}
        areaServed={settings?.areaServed ?? []}
        ctaHeading={ctaHeading}
        ctaBody={ctaBody}
        ctaPrimaryLabel={ctaPrimaryLabel}
        ctaSecondaryLabel={ctaSecondaryLabel}
      />
    </>
  )
}
