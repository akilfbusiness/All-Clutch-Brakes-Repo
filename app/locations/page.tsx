// Locations index page — content pulled from Sanity siteSettings and Location documents
// Heading, answer capsule, FAQ items: edit in Sanity Studio → Site Settings → Locations
// Individual location/region pages: edit in Sanity Studio → Locations

import type { Metadata } from "next"
import { getSiteSettings, getAllLocations } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"

  return {
    title: `Locations | ${businessName}`,
    description: settings?.locationsPageAnswerCapsule ?? settings?.defaultSeoDescription ?? "",
    alternates: { canonical: "/locations" },
    openGraph: {
      title: `Locations | ${businessName}`,
      description: settings?.locationsPageAnswerCapsule ?? "",
      url: `${siteUrl}/locations`,
      type: "website",
    },
  }
}

export default async function LocationsPage() {
  const [settings, locations] = await Promise.all([
    getSiteSettings(),
    getAllLocations(),
  ])

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const faqs = settings?.locationsFaqs ?? []
  const phone = settings?.phone ?? []

  // Split into regions and suburbs
  const regions = locations?.filter((l) => l.locationType === "region") ?? []
  const suburbs = locations?.filter((l) => l.locationType === "suburb") ?? []

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${siteUrl}/locations` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Locations</li>
          </ol>
        </nav>

        <section aria-labelledby="locations-heading">
          <h1 id="locations-heading">
            {settings?.locationsPageHeading ?? `Service Areas — ${businessName}`}
          </h1>
          {settings?.locationsPageAnswerCapsule && (
            <p className="answer-capsule">{settings.locationsPageAnswerCapsule}</p>
          )}
        </section>

        {/* ── REGIONS ──────────────────────────────────────────────────────── */}
        {regions.length > 0 && (
          <section aria-labelledby="regions-heading">
            <h2 id="regions-heading">Service Regions</h2>
            <ul role="list">
              {regions.map((region) => (
                <li key={region.slug}>
                  <article>
                    <h3>
                      <a href={`/locations/${region.slug}`}>{region.title}</a>
                    </h3>
                    {region.answerCapsule && <p>{region.answerCapsule}</p>}
                    <a
                      href={`/locations/${region.slug}`}
                      aria-label={`Services in ${region.title}`}
                    >
                      Services in {region.title}
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── SUBURB PAGES ─────────────────────────────────────────────────── */}
        {suburbs.length > 0 && (
          <section aria-labelledby="suburbs-heading">
            <h2 id="suburbs-heading">Key Service Areas</h2>
            <nav aria-label="Key service areas">
              <ul role="list">
                {suburbs.map((suburb) => (
                  <li key={suburb.slug}>
                    <a href={`/locations/${suburb.slug}`}>
                      Services in {suburb.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        )}

        {/* Fallback if no location documents exist yet */}
        {regions.length === 0 && suburbs.length === 0 && (
          <section>
            <p>Location pages coming soon. Add locations in Sanity Studio → Locations.</p>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section aria-labelledby="locations-faq-heading">
            <h2 id="locations-faq-heading">Frequently Asked Questions</h2>
            <dl>
              {faqs.map((faq, index) => (
                <div key={index}>
                  <dt><strong>{faq.question}</strong></dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="locations-cta-heading">
          <h2 id="locations-cta-heading">{"Not Sure If We Service Your Area?"}</h2>
          <p>
            Contact us and we will confirm coverage in your location and discuss
            your needs.
          </p>
          <a href="/contact">Contact Us</a>
          {phone.length > 0 && (
            <address>
              <a href={`tel:${phone[0].replace(/\s/g, "")}`}>{phone[0]}</a>
            </address>
          )}
        </section>
      </main>
    </>
  )
}
