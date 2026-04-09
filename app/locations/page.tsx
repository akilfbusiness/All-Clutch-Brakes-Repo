// Locations index — content from Sanity CMS

import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ChevronRight, MapPin, ArrowRight, Plus } from "lucide-react"
import { getSiteSettings, getAllLocations } from "@/sanity/queries"
import { LocationsPageClient } from "@/components/locations-page-client"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const description  = settings?.locationsPageAnswerCapsule ?? `${businessName} provides clutch, brake, and transmission services across Adelaide and surrounding suburbs.`

  return {
    title: `Service Areas | ${businessName}`,
    description,
    alternates: { canonical: "/locations" },
    openGraph: { title: `Service Areas | ${businessName}`, description, url: `${siteUrl}/locations`, type: "website" },
  }
}

export default async function LocationsPage() {
  const [settings, locations] = await Promise.all([getSiteSettings(), getAllLocations().catch(() => [])])

  const siteUrl      = settings?.siteUrl      ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const faqs         = settings?.locationsFaqs ?? []

  const regions = locations?.filter((l) => l.locationType === "region") ?? []
  const suburbs = locations?.filter((l) => l.locationType === "suburb") ?? []

  const defaultRegions = [
    { title: "Adelaide CBD & Inner Suburbs", slug: "adelaide-cbd",    answerCapsule: "Central Adelaide including the CBD, North Adelaide, and surrounding inner suburbs." },
    { title: "Southern Adelaide",            slug: "southern-adelaide", answerCapsule: "Covering Marion, Brighton, Glenelg, Morphett Vale, and surrounding southern suburbs." },
    { title: "Northern Adelaide",            slug: "northern-adelaide", answerCapsule: "Including Salisbury, Elizabeth, Gawler, and surrounding northern suburbs." },
    { title: "Eastern Adelaide",             slug: "eastern-adelaide",  answerCapsule: "Norwood, Burnside, Campbelltown, and Adelaide Hills foothills." },
    { title: "Western Adelaide",             slug: "western-adelaide",  answerCapsule: "Port Adelaide, Henley Beach, West Lakes, and surrounding western suburbs." },
  ]

  const displayRegions = regions.length > 0 ? regions : defaultRegions

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",      item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteUrl}/locations` },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <LocationsPageClient
        businessName={businessName}
        phone={phone}
        pageTitle={settings?.locationsPageHeroTitle ?? "Service Areas"}
        pageSubtitle={settings?.locationsPageHeroSubtitle ?? `${businessName} provides expert clutch, brake, and transmission services across Adelaide and surrounding areas.`}
        displayRegions={displayRegions}
        suburbs={suburbs}
        faqs={faqs}
      />
    </>
  )
}
