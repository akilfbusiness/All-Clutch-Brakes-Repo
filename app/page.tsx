// Home page — all content pulled from Sanity siteSettings
// To edit any content on this page, go to Sanity Studio → Site Settings → Home Page
// No code changes are ever needed to update page content.

import type { Metadata } from "next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const description = settings?.defaultSeoDescription ?? ""

  return {
    title: settings?.defaultSeoTitle ?? businessName,
    description,
    alternates: { canonical: "/" },
    openGraph: {
      title: settings?.defaultSeoTitle ?? businessName,
      description,
      url: siteUrl,
      type: "website",
    },
  }
}

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getAllServices(),
  ])

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const faqs = settings?.homeFaqs ?? []
  const trustSignals = settings?.heroTrustSignals ?? []
  const whyUsPoints = settings?.homeWhyUsPoints ?? []
  const regions = [
    { name: "Northern Adelaide", slug: "northern-adelaide" },
    { name: "Southern Adelaide", slug: "southern-adelaide" },
    { name: "Eastern Adelaide", slug: "eastern-adelaide" },
    { name: "Western Adelaide", slug: "western-adelaide" },
    { name: "CBD & Inner Suburbs", slug: "cbd-and-inner-suburbs" },
    { name: "Barossa & Surrounds", slug: "barossa-and-surrounds" },
    { name: "Fleurieu Peninsula", slug: "fleurieu-peninsula" },
    { name: "Eyre Peninsula", slug: "eyre-peninsula" },
    { name: "Limestone Coast", slug: "limestone-coast" },
    { name: "Yorke & Mid North", slug: "yorke-and-mid-north" },
  ]

  // ── FAQPage schema ─────────────────────────────────────────────────────────
  // Powered entirely by homeFaqs in Sanity — add/edit questions in the CMS.
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
    ],
  }

  return (
    <>
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
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading">
          <h1 id="hero-heading">
            {settings?.heroHeading ?? businessName}
          </h1>

          {/* Answer capsule — the AEO citation target. Edit in Sanity → Site Settings → Home Page */}
          {settings?.heroAnswerCapsule && (
            <p className="answer-capsule">{settings.heroAnswerCapsule}</p>
          )}

          <div>
            <a href="/contact">
              {settings?.heroPrimaryCtaLabel ?? "Get Started Today"}
            </a>
            <a href="/services">
              {settings?.heroSecondaryCtaLabel ?? "View Our Services"}
            </a>
          </div>

          {trustSignals.length > 0 && (
            <div aria-label="Trust signals">
              {trustSignals.map((signal, i) => (
                <span key={i}>{signal}</span>
              ))}
            </div>
          )}
        </section>

        {/* ── SERVICES OVERVIEW ────────────────────────────────────────────── */}
        <section aria-labelledby="services-heading">
          <h2 id="services-heading">
            {settings?.homeServicesHeading ?? "Our Services"}
          </h2>
          {settings?.homeServicesSubheading && (
            <p>{settings.homeServicesSubheading}</p>
          )}

          {services && services.length > 0 ? (
            <ul role="list">
              {services.map((service) => (
                <li key={service.slug}>
                  <article>
                    <h3>
                      <a href={`/services/${service.slug}`}>{service.title}</a>
                    </h3>
                    {service.answerCapsule && <p>{service.answerCapsule}</p>}
                    <a
                      href={`/services/${service.slug}`}
                      aria-label={`Learn more about ${service.title}`}
                    >
                      Learn more
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p>Services coming soon. Add services in Sanity Studio.</p>
          )}

          <a href="/services">View All Services</a>
        </section>

        {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
        {(settings?.homeWhyUsHeading || settings?.homeWhyUsBody) && (
          <section aria-labelledby="why-heading">
            <h2 id="why-heading">
              {settings?.homeWhyUsHeading ?? "Why Choose Us"}
            </h2>
            {settings?.homeWhyUsBody && <p>{settings.homeWhyUsBody}</p>}
            {whyUsPoints.length > 0 && (
              <ul>
                {whyUsPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
            <a href="/about">About Us</a>
          </section>
        )}

        {/* ── LOCATIONS ────────────────────────────────────────────────────── */}
        <section aria-labelledby="locations-heading">
          <h2 id="locations-heading">
            Services Across South Australia
          </h2>
          <nav aria-label="Service regions">
            <ul role="list">
              {regions.map((region) => (
                <li key={region.slug}>
                  <a href={`/locations/${region.slug}`}>{region.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="/locations">View All Locations</a>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading">Frequently Asked Questions</h2>
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
        <section aria-labelledby="cta-heading">
          <h2 id="cta-heading">
            {settings?.homeCtaHeading ?? "Ready to Get Started?"}
          </h2>
          {settings?.homeCtaBody && <p>{settings.homeCtaBody}</p>}
          <address>
            {settings?.phone && settings.phone.length > 0 && (
              <p>
                <strong>Phone:</strong>{" "}
                {settings.phone.map((p, i) => (
                  <span key={i}>
                    <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                    {i < (settings.phone?.length ?? 0) - 1 && " or "}
                  </span>
                ))}
              </p>
            )}
            {settings?.email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </p>
            )}
            {settings?.businessHours && settings.businessHours.length > 0 && (
              <p>
                <strong>Hours:</strong>{" "}
                {settings.businessHours.map((h) => `${h.days}: ${h.hours}`).join(" | ")}
              </p>
            )}
          </address>
          <a href="/contact">Contact Us</a>
        </section>
      </main>
    </>
  )
}
