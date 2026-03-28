// Individual location page — dynamic route [slug]
// Handles BOTH region pages (Northern Adelaide) and Tier 1 suburb pages (Elizabeth)
// The locationType field from Sanity determines which variant renders
// Schema: LocalBusiness (areaServed) + FAQPage + BreadcrumbList
// generateStaticParams: pre-renders all location pages at build time

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLocationBySlug, getAllLocationSlugs, type Location } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"

// ── STATIC PARAMS ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ── DYNAMIC METADATA ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const location = await getLocationBySlug(slug)

  if (!location) return { title: "Location Not Found" }

  const isRegion = location.locationType === "region"

  const title =
    location.seoTitle ??
    `NDIS Support Services in ${location.title} | Ashar Disability Care`

  const description =
    location.seoDescription ??
    location.answerCapsule ??
    `Ashar Disability Care provides NDIS support services in ${location.title}, South Australia. Registered NDIS provider — personal care, home care, community participation, and more.`

  return {
    title,
    description,
    alternates: {
      canonical: `/locations/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ashardisabilitycare.com.au/locations/${slug}`,
      type: "website",
    },
  }
}

// ── SCHEMA GENERATORS ────────────────────────────────────────────────────────

function buildLocalBusinessSchema(location: Location) {
  // Per-location LocalBusiness schema — extends the root schema with
  // specific areaServed for this page. This tells Google exactly which
  // area this page is authoritative for.
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://ashardisabilitycare.com.au/locations/${location.slug}`,
    name: `Ashar Disability Care — ${location.title}`,
    url: `https://ashardisabilitycare.com.au/locations/${location.slug}`,
    parentOrganization: {
      "@id": "https://ashardisabilitycare.com.au/#business",
    },
    areaServed: location.suburbsIncluded?.length
      ? [
          { "@type": "AdministrativeArea", name: location.title },
          ...location.suburbsIncluded.map((suburb) => ({
            "@type": "City",
            name: suburb,
          })),
        ]
      : [{ "@type": "AdministrativeArea", name: location.title }],
    telephone: "+61425760172",
    email: "info@ashardc.com.au",
  }
}

function buildFaqSchema(location: Location) {
  if (!location.faqItems?.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: location.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

function buildBreadcrumbSchema(location: Location) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://ashardisabilitycare.com.au",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Locations",
      item: "https://ashardisabilitycare.com.au/locations",
    },
  ]

  // For suburb pages, add the parent region as a breadcrumb level if available
  if (location.locationType === "suburb" && location.region) {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: location.region
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      item: `https://ashardisabilitycare.com.au/locations/${location.region}`,
    })
    items.push({
      "@type": "ListItem",
      position: 4,
      name: location.title,
      item: `https://ashardisabilitycare.com.au/locations/${location.slug}`,
    })
  } else {
    items.push({
      "@type": "ListItem",
      position: 3,
      name: location.title,
      item: `https://ashardisabilitycare.com.au/locations/${location.slug}`,
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}

// ── ALL NDIS SERVICES — displayed on every location page ────────────────────
const ndisServices = [
  { title: "Personal Care", slug: "personal-care" },
  { title: "Home Care", slug: "home-care" },
  { title: "Community Participation", slug: "community-participation" },
  { title: "Transport", slug: "transport" },
  { title: "Accommodation Support", slug: "accommodation-support" },
  { title: "NDIS Planning & Coordination", slug: "ndis-planning-and-coordination" },
]

// ── PAGE COMPONENT ───────────────────────────────────────────────────────────

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const location = await getLocationBySlug(slug)

  if (!location) notFound()

  const isRegion = location.locationType === "region"
  const localBusinessSchema = buildLocalBusinessSchema(location)
  const faqSchema = buildFaqSchema(location)
  const breadcrumbSchema = buildBreadcrumbSchema(location)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/locations">Locations</a></li>
            {location.locationType === "suburb" && location.region && (
              <li>
                <a href={`/locations/${location.region}`}>
                  {location.region
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </a>
              </li>
            )}
            <li aria-current="page">{location.title}</li>
          </ol>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section aria-labelledby="location-heading">
          <h1 id="location-heading">
            NDIS Support Services in {location.title}
          </h1>

          {/* Answer capsule — answers "Does Ashar service [location]?" */}
          <p className="answer-capsule">{location.answerCapsule}</p>

          <a href="/contact">Get NDIS Support in {location.title}</a>
        </section>

        {/* ── BODY CONTENT ────────────────────────────────────────────────── */}
        {location.body && (
          <section aria-labelledby="location-body-heading">
            <h2 id="location-body-heading">
              NDIS Services Available in {location.title}
            </h2>
            <div className="prose">
              <PortableText value={location.body} />
            </div>
          </section>
        )}

        {/* ── SUBURBS COVERED (regions only) ───────────────────────────────── */}
        {isRegion && location.suburbsIncluded && location.suburbsIncluded.length > 0 && (
          <section aria-labelledby="suburbs-covered-heading">
            <h2 id="suburbs-covered-heading">
              Suburbs We Service in {location.title}
            </h2>
            <p>
              Ashar Disability Care provides NDIS support across the following
              suburbs in the {location.title} area:
            </p>
            {/* These listed suburbs are how Google ranks for suburb-level searches
                without needing individual pages for each suburb */}
            <ul role="list">
              {location.suburbsIncluded.map((suburb) => (
                <li key={suburb}>{suburb}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ── SERVICES AVAILABLE ───────────────────────────────────────────── */}
        <section aria-labelledby="location-services-heading">
          <h2 id="location-services-heading">
            NDIS Services Available in {location.title}
          </h2>
          <p>
            Ashar Disability Care provides the following NDIS-funded support
            services to participants in {location.title} and surrounding areas:
          </p>
          <ul role="list">
            {ndisServices.map((service) => (
              <li key={service.slug}>
                <a href={`/services/${service.slug}`}>{service.title}</a>
                {" "}in {location.title}
              </li>
            ))}
          </ul>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {location.faqItems && location.faqItems.length > 0 && (
          <section aria-labelledby="location-faq-heading">
            <h2 id="location-faq-heading">
              Frequently Asked Questions — NDIS Services in {location.title}
            </h2>
            <dl>
              {location.faqItems.map((faq, index) => (
                <div key={index}>
                  <dt><strong>{faq.question}</strong></dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="location-cta-heading">
          <h2 id="location-cta-heading">
            Access NDIS Support in {location.title}
          </h2>
          <p>
            Contact Ashar Disability Care to discuss NDIS support services in
            {" "}{location.title}. Our friendly team is ready to help you get started.
          </p>
          <a href="/contact">Contact Us</a>
          <address>
            <a href="tel:+61425760172">0425 760 172</a>
          </address>
        </section>
      </main>
    </>
  )
}
