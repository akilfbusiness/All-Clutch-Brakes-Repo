import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocationBySlug, getAllLocationSlugs, getSiteSettings } from "@/sanity/queries"
import LocationPageClient from "@/components/location-page-client"

export async function generateStaticParams() {
  try {
    const slugs = await getAllLocationSlugs()
    return slugs.map(({ slug }) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [location, settings] = await Promise.all([
    getLocationBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  if (!location) return { title: `Location Not Found | ${businessName}` }

  const title = location.seoTitle ?? `Clutch & Brake Service in ${location.title} | ${businessName}`
  const description =
    location.seoDescription ??
    location.answerCapsule ??
    `${businessName} provides clutch, brake, and transmission services in ${location.title}.`

  return {
    title,
    description,
    alternates: { canonical: `/locations/${slug}` },
    openGraph: {
      title,
      description,
      url: `${settings?.siteUrl ?? "https://example.com"}/locations/${slug}`,
      type: "website",
    },
  }
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [location, settings] = await Promise.all([
    getLocationBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  if (!location) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/locations/${location.slug}`,
    name: `${businessName} — ${location.title}`,
    url: `${siteUrl}/locations/${location.slug}`,
    areaServed: location.suburbsIncluded?.length
      ? [
          { "@type": "AdministrativeArea", name: location.title },
          ...location.suburbsIncluded.map((s) => ({ "@type": "City", name: s })),
        ]
      : [{ "@type": "AdministrativeArea", name: location.title }],
    telephone: phone,
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteUrl}/locations` },
      ...(location.locationType === "suburb" && location.region
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: location.region.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
              item: `${siteUrl}/locations/${location.region}`,
            },
            { "@type": "ListItem", position: 4, name: location.title, item: `${siteUrl}/locations/${slug}` },
          ]
        : [{ "@type": "ListItem", position: 3, name: location.title, item: `${siteUrl}/locations/${slug}` }]),
    ],
  }

  const faqSchema = location.faqItems?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: location.faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <LocationPageClient location={location} phone={phone} businessName={businessName} />
    </>
  )
}
