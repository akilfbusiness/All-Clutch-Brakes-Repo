// Home page
// Priority: 1.0 in sitemap — the most important page on the site
// Schema: LocalBusiness (in root layout) + FAQPage + BreadcrumbList
// Answer capsule sits immediately below the H1 — the AEO citation target

import type { Metadata } from "next"
import type { FaqItem } from "@/sanity/queries"

export const metadata: Metadata = {
  title: "Ashar Disability Care | NDIS Support Services South Australia",
  description:
    "Ashar Disability Care is a registered NDIS provider in South Australia. We offer personal care, home care, community participation, transport, accommodation support, and NDIS planning across Adelaide and regional SA.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ashar Disability Care | NDIS Support Services South Australia",
    description:
      "Registered NDIS provider offering disability support services across South Australia. Personal care, home care, community participation, accommodation support and more.",
    url: "https://ashardisabilitycare.com.au",
    type: "website",
  },
}

// FAQ data — these power the FAQPage schema and the visible FAQ section
// Written to target the highest-volume NDIS search queries in SA
const faqs: FaqItem[] = [
  {
    question: "What is Ashar Disability Care?",
    answer:
      "Ashar Disability Care is a registered NDIS provider based in Surrey Downs, South Australia, offering personalised disability support services including personal care, home care, community participation, transport, accommodation support, and NDIS planning and coordination across Adelaide and regional SA.",
  },
  {
    question: "What NDIS services does Ashar Disability Care provide?",
    answer:
      "Ashar Disability Care provides six core NDIS services: personal care, home care, community participation, transport, accommodation support, and NDIS planning and coordination. All services are delivered by trained support workers across South Australia.",
  },
  {
    question: "Is Ashar Disability Care a registered NDIS provider?",
    answer:
      "Yes. Ashar Disability Care is a registered NDIS provider with Registration ID 4-1C342A6 and ABN 11656510075, fully registered with the NDIS Quality and Safeguards Commission in South Australia.",
  },
  {
    question: "What areas does Ashar Disability Care service?",
    answer:
      "Ashar Disability Care services Adelaide and regional South Australia, including northern, southern, eastern, and western Adelaide suburbs, as well as the Barossa, Fleurieu Peninsula, Eyre Peninsula, Limestone Coast, and Yorke and Mid North regions.",
  },
  {
    question: "How do I get started with Ashar Disability Care?",
    answer:
      "Contact us by phone on 0425 760 172 or 0425 409 849, or email info@ashardc.com.au. Our team will discuss your NDIS plan and support needs and guide you through getting started with our services.",
  },
]

// FAQPage schema — the single most important AEO signal
// When someone asks an AI engine a question that matches one of these,
// your answer is what gets cited
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

// BreadcrumbList schema — home page is always the root breadcrumb
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
  ],
}

// NDIS services list — used in the services overview section
const services = [
  {
    title: "Personal Care",
    description:
      "Support with daily personal activities including hygiene, dressing, grooming, and mobility.",
    href: "/services/personal-care",
    icon: "heart",
  },
  {
    title: "Home Care",
    description:
      "Assistance with household tasks to maintain a clean, safe, and comfortable living environment.",
    href: "/services/home-care",
    icon: "home",
  },
  {
    title: "Community Participation",
    description:
      "Support to engage with community activities, social groups, and recreational programs.",
    href: "/services/community-participation",
    icon: "users",
  },
  {
    title: "Transport",
    description:
      "Safe, reliable transport to appointments, activities, and community engagements.",
    href: "/services/transport",
    icon: "car",
  },
  {
    title: "Accommodation Support",
    description:
      "Supported Independent Living (SIL) and Specialist Disability Accommodation (SDA) across SA.",
    href: "/services/accommodation-support",
    icon: "building",
  },
  {
    title: "NDIS Planning & Coordination",
    description:
      "Expert NDIS plan management and support coordination to maximise your funding and outcomes.",
    href: "/services/ndis-planning-and-coordination",
    icon: "clipboard",
  },
]

export default function HomePage() {
  return (
    <>
      {/* Structured data — injected per page, in addition to root layout schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="hero-heading">
          <h1 id="hero-heading">
            NDIS Support Services Across South Australia
          </h1>

          {/* Answer capsule — sits directly below H1, 20-30 words
              This is the exact text AI engines will read and potentially cite
              when answering queries about NDIS services in SA */}
          <p className="answer-capsule">
            Ashar Disability Care is a registered NDIS provider delivering
            personalised disability support services across Adelaide and
            regional South Australia.
          </p>

          <div>
            <a href="/contact">Get Started Today</a>
            <a href="/services">View Our Services</a>
          </div>

          {/* Trust signals — NDIS registration prominently displayed */}
          <div aria-label="Trust signals">
            <span>NDIS Registered Provider</span>
            <span>Registration ID: 4-1C342A6</span>
            <span>ABN: 11 656 510 075</span>
            <span>24/7 Support Available</span>
          </div>
        </section>

        {/* ── SERVICES OVERVIEW ────────────────────────────────────────────── */}
        <section aria-labelledby="services-heading">
          <h2 id="services-heading">Our NDIS Services</h2>
          <p>
            We provide a comprehensive range of NDIS-funded support services
            tailored to your individual needs and goals.
          </p>
          <ul role="list">
            {services.map((service) => (
              <li key={service.href}>
                <article>
                  <h3>
                    <a href={service.href}>{service.title}</a>
                  </h3>
                  <p>{service.description}</p>
                  <a href={service.href} aria-label={`Learn more about ${service.title}`}>
                    Learn more
                  </a>
                </article>
              </li>
            ))}
          </ul>
          <a href="/services">View All Services</a>
        </section>

        {/* ── ABOUT / WHY CHOOSE US ─────────────────────────────────────────── */}
        <section aria-labelledby="about-heading">
          <h2 id="about-heading">Why Choose Ashar Disability Care?</h2>
          <p>
            We are a locally based, registered NDIS provider committed to
            delivering high-quality, person-centred disability support across
            South Australia. Our team understands the NDIS and works with
            participants to ensure they get the most from their plan.
          </p>
          <ul>
            <li>Registered NDIS provider — fully compliant with NDIS Quality and Safeguards Commission</li>
            <li>Personalised support plans tailored to individual goals</li>
            <li>Experienced, trained support workers across SA</li>
            <li>24/7 support availability</li>
            <li>Serving Adelaide and all regions of South Australia</li>
          </ul>
          <a href="/about">About Us</a>
        </section>

        {/* ── LOCATIONS ────────────────────────────────────────────────────── */}
        <section aria-labelledby="locations-heading">
          <h2 id="locations-heading">NDIS Services Across South Australia</h2>
          <p>
            Ashar Disability Care supports NDIS participants across Adelaide
            and regional South Australia. Whether you are in the northern
            suburbs, the Fleurieu Peninsula, or regional SA, we are here to
            help.
          </p>
          <nav aria-label="Service regions">
            <ul role="list">
              {[
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
              ].map((region) => (
                <li key={region.slug}>
                  <a href={`/locations/${region.slug}`}>{region.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a href="/locations">View All Locations</a>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <dl>
            {faqs.map((faq, index) => (
              <div key={index}>
                <dt>
                  <strong>{faq.question}</strong>
                </dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="cta-heading">
          <h2 id="cta-heading">Ready to Get Started?</h2>
          <p>
            Contact our friendly team today to discuss your NDIS support needs.
            We are here to help you live the life you choose.
          </p>
          <address>
            <p>
              <strong>Phone:</strong>{" "}
              <a href="tel:+61425760172">0425 760 172</a> or{" "}
              <a href="tel:+61425409849">0425 409 849</a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@ashardc.com.au">info@ashardc.com.au</a>
            </p>
            <p>
              <strong>Hours:</strong> Monday – Friday, 9:00 AM – 5:00 PM
              (24/7 support available)
            </p>
          </address>
          <a href="/contact">Contact Us</a>
        </section>
      </main>
    </>
  )
}
