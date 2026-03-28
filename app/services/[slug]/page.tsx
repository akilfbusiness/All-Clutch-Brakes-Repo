// Individual service page — dynamic route [slug]
// Template: pulled from Sanity, generates metadata and schema per service
// Schema: Service + FAQPage + BreadcrumbList
// generateStaticParams: pre-renders all service pages at build time (zero runtime Sanity calls)
// generateMetadata: generates unique title, description, OG per service from Sanity

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServiceSlugs, type Service } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"

// ── STATIC PARAMS ────────────────────────────────────────────────────────────
// Called at build time — fetches all service slugs from Sanity once
// and pre-renders a static page for each one.
// After build, no Sanity API calls are made for these pages at runtime.
export async function generateStaticParams() {
  const slugs = await getAllServiceSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

// ── DYNAMIC METADATA ─────────────────────────────────────────────────────────
// Generates unique metadata per service page from Sanity content
// Falls back to sensible defaults if Sanity fields are not filled
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) return { title: "Service Not Found" }

  const title =
    service.seoTitle ??
    `${service.title} | NDIS Support Services South Australia | Ashar Disability Care`

  const description =
    service.seoDescription ??
    service.answerCapsule ??
    `Ashar Disability Care provides ${service.title} across Adelaide and regional South Australia. Registered NDIS provider.`

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ashardisabilitycare.com.au/services/${slug}`,
      type: "website",
    },
  }
}

// ── SCHEMA GENERATORS ────────────────────────────────────────────────────────

function buildServiceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://ashardisabilitycare.com.au/services/${service.slug}`,
    name: service.title,
    description: service.answerCapsule,
    url: `https://ashardisabilitycare.com.au/services/${service.slug}`,
    provider: {
      "@id": "https://ashardisabilitycare.com.au/#business",
    },
    areaServed: {
      "@type": "State",
      name: "South Australia",
    },
    serviceType: "NDIS Support Service",
  }
}

function buildFaqSchema(service: Service) {
  if (!service.faqItems?.length) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

function buildBreadcrumbSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ashardisabilitycare.com.au",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://ashardisabilitycare.com.au/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://ashardisabilitycare.com.au/services/${service.slug}`,
      },
    ],
  }
}

// ── PAGE COMPONENT ───────────────────────────────────────────────────────────

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  // If slug does not exist in Sanity, return 404
  if (!service) notFound()

  const serviceSchema = buildServiceSchema(service)
  const faqSchema = buildFaqSchema(service)
  const breadcrumbSchema = buildBreadcrumbSchema(service)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
            <li><a href="/services">Services</a></li>
            <li aria-current="page">{service.title}</li>
          </ol>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section aria-labelledby="service-heading">
          <h1 id="service-heading">
            {service.title} — NDIS Support South Australia
          </h1>

          {/* Answer capsule — direct answer to "what is [service] under NDIS?"
              This is the AEO citation target for this page */}
          <p className="answer-capsule">{service.answerCapsule}</p>

          <a href="/contact">Enquire About This Service</a>
        </section>

        {/* ── SERVICE BODY ────────────────────────────────────────────────── */}
        {service.body && (
          <section aria-labelledby="service-body-heading">
            <h2 id="service-body-heading">About {service.title}</h2>
            <div className="prose">
              <PortableText value={service.body} />
            </div>
          </section>
        )}

        {/* ── WHO IS IT FOR ────────────────────────────────────────────────── */}
        {service.whoIsItFor && (
          <section aria-labelledby="who-heading">
            <h2 id="who-heading">Who Is This Service For?</h2>
            <p>{service.whoIsItFor}</p>
          </section>
        )}

        {/* ── HOW ASHAR DELIVERS IT ────────────────────────────────────────── */}
        <section aria-labelledby="delivery-heading">
          <h2 id="delivery-heading">How Ashar Disability Care Delivers {service.title}</h2>
          <p>
            Ashar Disability Care is a registered NDIS provider (Registration
            ID: 4-1C342A6) delivering {service.title.toLowerCase()} across
            Adelaide and regional South Australia. We work with each participant
            to understand their goals and design a support plan that fits their
            life.
          </p>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        {service.faqItems && service.faqItems.length > 0 && (
          <section aria-labelledby="service-faq-heading">
            <h2 id="service-faq-heading">
              Frequently Asked Questions About {service.title}
            </h2>
            <dl>
              {service.faqItems.map((faq, index) => (
                <div key={index}>
                  <dt><strong>{faq.question}</strong></dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* ── RELATED SERVICES ─────────────────────────────────────────────── */}
        <section aria-labelledby="related-heading">
          <h2 id="related-heading">Other Services We Offer</h2>
          <p>
            Ashar Disability Care provides a full range of NDIS support
            services across South Australia.
          </p>
          <a href="/services">View All Services</a>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="service-cta-heading">
          <h2 id="service-cta-heading">
            Ready to Access {service.title}?
          </h2>
          <p>
            Contact Ashar Disability Care today to discuss how we can support
            you with {service.title.toLowerCase()} under your NDIS plan.
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
