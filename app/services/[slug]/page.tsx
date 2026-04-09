// Individual service page — content pulled from Sanity CMS
// Edit service content via Sanity Studio → Services
// Edit "How We Deliver" points via Sanity Studio → Site Settings → Services tab

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServiceSlugs, getAllServices, getSiteSettings } from "@/sanity/queries"
import { ServicePageClient } from "@/components/service-page-client"

export async function generateStaticParams() {
  try {
    const slugs = await getAllServiceSlugs()
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
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  if (!service) return { title: `Service Not Found | ${businessName}` }

  const title       = service.seoTitle       ?? `${service.title} | ${businessName}`
  const description = service.seoDescription ?? service.answerCapsule ?? `Expert ${service.title.toLowerCase()} in Adelaide. All makes and models. Free quotes.`

  return {
    title,
    description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title, description, url: `${siteUrl}/services/${slug}`, type: "website" },
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [service, settings, allServices] = await Promise.all([
    getServiceBySlug(slug).catch(() => null),
    getSiteSettings(),
    getAllServices(),
  ])

  if (!service) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  const howWeDeliverHeading = settings?.servicesHowWeDeliverHeading ?? `How ${businessName} Delivers`
  const deliverPoints = settings?.servicesHowWeDeliverPoints?.length
    ? settings.servicesHowWeDeliverPoints
    : [
        "Expert diagnosis by qualified mechanics",
        "Quality parts with manufacturer warranty",
        "Transparent upfront pricing — no hidden fees",
        "Work completed to manufacturer standards",
        "Most jobs finished same day or next day",
      ]

  const relatedServices = allServices
    .filter((s) => s.slug !== slug)
    .slice(0, 4)
    .map((s) => ({ title: s.title, slug: s.slug, description: s.answerCapsule ?? null }))

  // ── Structured data ────────────────────────────────────────────────────────
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/services/${service.slug}`,
    name: service.title,
    description: service.answerCapsule,
    url: `${siteUrl}/services/${service.slug}`,
    provider: { "@id": `${siteUrl}/#business` },
    areaServed: service.serviceAreas?.length
      ? service.serviceAreas.map((a) => ({ "@type": "City", name: a.title }))
      : { "@type": "State", name: "South Australia" },
    serviceType: "Automotive Repair",
    ...(service.featuredImage && { image: service.featuredImage }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",     item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${siteUrl}/services/${slug}` },
    ],
  }

  const faqSchema = service.faqItems?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: service.faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <ServicePageClient
        businessName={businessName}
        phone={phone}
        service={service}
        relatedServices={relatedServices}
        howWeDeliverHeading={howWeDeliverHeading}
        deliverPoints={deliverPoints}
      />
    </>
  )
}
