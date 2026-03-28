// Services index page
// Hub page linking to all 6 individual service pages
// Schema: CollectionPage + BreadcrumbList + FAQPage

import type { Metadata } from "next"
import type { FaqItem } from "@/sanity/queries"

export const metadata: Metadata = {
  title: "NDIS Support Services South Australia | Ashar Disability Care",
  description:
    "Ashar Disability Care offers 6 NDIS support services across South Australia: personal care, home care, community participation, transport, accommodation support, and NDIS planning and coordination.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "NDIS Support Services South Australia | Ashar Disability Care",
    description:
      "Comprehensive NDIS support services across Adelaide and regional South Australia. Registered provider — personal care, home care, community participation, accommodation support and more.",
    url: "https://ashardisabilitycare.com.au/services",
    type: "website",
  },
}

const services = [
  {
    title: "Personal Care",
    slug: "personal-care",
    description:
      "Support with daily personal activities including hygiene, dressing, grooming, and mobility to help you live comfortably and independently.",
    answerCapsule:
      "Personal care under the NDIS covers support with daily personal activities such as hygiene, dressing, grooming, and mobility assistance.",
  },
  {
    title: "Home Care",
    slug: "home-care",
    description:
      "Assistance with household tasks including cleaning, laundry, meal preparation, and garden maintenance to maintain a safe and comfortable home.",
    answerCapsule:
      "NDIS home care provides assistance with household tasks such as cleaning, laundry, meal preparation, and garden maintenance.",
  },
  {
    title: "Community Participation",
    slug: "community-participation",
    description:
      "Support to engage with social activities, community groups, recreational programs, and events to build connections and independence.",
    answerCapsule:
      "Community participation support helps NDIS participants engage in social activities, community groups, and recreational programs to build independence.",
  },
  {
    title: "Transport",
    slug: "transport",
    description:
      "Safe and reliable transport to medical appointments, community activities, work, education, and social engagements across South Australia.",
    answerCapsule:
      "NDIS transport support provides safe, reliable travel to appointments, activities, and community engagements for participants across South Australia.",
  },
  {
    title: "Accommodation Support",
    slug: "accommodation-support",
    description:
      "Supported Independent Living (SIL) and Specialist Disability Accommodation (SDA) options to help you live where and how you choose.",
    answerCapsule:
      "NDIS accommodation support includes Supported Independent Living and Specialist Disability Accommodation to help participants live independently.",
  },
  {
    title: "NDIS Planning & Coordination",
    slug: "ndis-planning-and-coordination",
    description:
      "Expert NDIS plan management and support coordination to help you understand your plan, maximise your funding, and connect with the right providers.",
    answerCapsule:
      "NDIS planning and coordination helps participants understand their NDIS plan, maximise funding, and connect with appropriate support providers.",
  },
]

const faqs: FaqItem[] = [
  {
    question: "What NDIS services does Ashar Disability Care offer?",
    answer:
      "Ashar Disability Care offers six NDIS support services: personal care, home care, community participation, transport, accommodation support, and NDIS planning and coordination. All services are delivered across Adelaide and regional South Australia.",
  },
  {
    question: "Are Ashar Disability Care's services NDIS funded?",
    answer:
      "Yes. All services provided by Ashar Disability Care are NDIS funded. As a registered NDIS provider (Registration ID: 4-1C342A6), we work directly with NDIS participants and their plan managers.",
  },
  {
    question: "Can I access multiple NDIS services from Ashar Disability Care?",
    answer:
      "Yes. Many of our participants access multiple services. We will work with you and your support coordinator to build a personalised support plan that covers all your needs.",
  },
  {
    question: "How do I start receiving NDIS services from Ashar Disability Care?",
    answer:
      "Contact us on 0425 760 172 or email info@ashardc.com.au. We will discuss your NDIS plan, your goals, and your support needs, and then develop a service agreement to get started.",
  },
]

const breadcrumbSchema = {
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
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://ashardisabilitycare.com.au/services",
  name: "NDIS Support Services — Ashar Disability Care",
  description:
    "A comprehensive range of NDIS support services delivered across Adelaide and regional South Australia by Ashar Disability Care.",
  url: "https://ashardisabilitycare.com.au/services",
  provider: {
    "@id": "https://ashardisabilitycare.com.au/#business",
  },
}

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionPageSchema),
        }}
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
            NDIS Support Services Across South Australia
          </h1>

          {/* Answer capsule */}
          <p className="answer-capsule">
            Ashar Disability Care offers six NDIS-funded support services
            across Adelaide and regional South Australia, delivered by a
            registered NDIS provider.
          </p>
        </section>

        {/* ── SERVICES GRID ────────────────────────────────────────────────── */}
        <section aria-labelledby="services-list-heading">
          <h2 id="services-list-heading">Our Services</h2>
          <ul role="list">
            {services.map((service) => (
              <li key={service.slug}>
                <article>
                  <h3>
                    <a href={`/services/${service.slug}`}>{service.title}</a>
                  </h3>
                  <p>{service.description}</p>
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
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section aria-labelledby="how-heading">
          <h2 id="how-heading">How Our Services Work</h2>
          <ol>
            <li>
              <strong>Contact us</strong> — Call or email our team to discuss
              your NDIS plan and support needs.
            </li>
            <li>
              <strong>Assessment</strong> — We review your NDIS plan goals and
              develop a personalised support plan.
            </li>
            <li>
              <strong>Service agreement</strong> — We set up a clear service
              agreement that outlines your supports and schedule.
            </li>
            <li>
              <strong>Support begins</strong> — Your dedicated support worker
              starts delivering your agreed supports.
            </li>
          </ol>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
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

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="services-cta-heading">
          <h2 id="services-cta-heading">Ready to Get Started?</h2>
          <p>
            Contact our team today to discuss which services are right for you.
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
