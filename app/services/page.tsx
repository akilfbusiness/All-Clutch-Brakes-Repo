// Services index page — content pulled from both Sanity siteSettings and Service documents
// Heading, answer capsule, and FAQ items: edit in Sanity Studio → Site Settings → Services
// Individual service cards: edit in Sanity Studio → Services

import type { Metadata } from "next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"

  return {
    title: `Services | ${businessName}`,
    description: settings?.servicesPageAnswerCapsule ?? settings?.defaultSeoDescription ?? "",
    alternates: { canonical: "/services" },
    openGraph: {
      title: `Services | ${businessName}`,
      description: settings?.servicesPageAnswerCapsule ?? "",
      url: `${siteUrl}/services`,
      type: "website",
    },
  }
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getAllServices(),
  ])

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const faqs = settings?.servicesFaqs ?? []
  const phone = settings?.phone ?? []

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
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/services`,
    name: `Services — ${businessName}`,
    description: settings?.servicesPageAnswerCapsule ?? "",
    url: `${siteUrl}/services`,
    provider: { "@id": `${siteUrl}/#business` },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Services</li>
          </ol>
        </nav>

        <section aria-labelledby="services-heading">
          <h1 id="services-heading">
            {settings?.servicesPageHeading ?? `Services — ${businessName}`}
          </h1>
          {settings?.servicesPageAnswerCapsule && (
            <p className="answer-capsule">{settings.servicesPageAnswerCapsule}</p>
          )}
        </section>

        {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
        <section aria-labelledby="services-list-heading">
          <h2 id="services-list-heading">Our Services</h2>
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
                      Learn more about {service.title}
                    </a>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p>Services coming soon. Add services in Sanity Studio → Services.</p>
          )}
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
        <section aria-labelledby="services-cta-heading">
          <h2 id="services-cta-heading">Ready to Get Started?</h2>
          <p>Contact our team today to discuss which services are right for you.</p>
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
