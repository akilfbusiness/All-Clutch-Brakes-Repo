// Locations index page
// Hub for all region and suburb pages — declared service area across SA
// Schema: CollectionPage + BreadcrumbList + FAQPage

import type { Metadata } from "next"
import type { FaqItem } from "@/sanity/queries"

export const metadata: Metadata = {
  title: "NDIS Services Across South Australia | Ashar Disability Care",
  description:
    "Ashar Disability Care provides NDIS support services across Adelaide and all regions of South Australia. Find NDIS support in your area — northern, southern, eastern, western Adelaide, and regional SA.",
  alternates: {
    canonical: "/locations",
  },
  openGraph: {
    title: "NDIS Services Across South Australia | Ashar Disability Care",
    description:
      "Registered NDIS provider serving all of South Australia. Find NDIS support services in your area.",
    url: "https://ashardisabilitycare.com.au/locations",
    type: "website",
  },
}

const regions = [
  {
    name: "Northern Adelaide",
    slug: "northern-adelaide",
    description:
      "NDIS support services across Elizabeth, Salisbury, Davoren Park, Para Hills, Gawler, and surrounding northern Adelaide suburbs.",
    keySuburbs: ["Elizabeth", "Salisbury", "Davoren Park", "Para Hills", "Gawler", "Smithfield", "Parafield Gardens"],
  },
  {
    name: "Southern Adelaide",
    slug: "southern-adelaide",
    description:
      "NDIS support across Morphett Vale, Noarlunga, Christies Beach, Hackham, Seaford, and surrounding southern Adelaide suburbs.",
    keySuburbs: ["Morphett Vale", "Noarlunga", "Christies Beach", "Hackham", "Seaford", "Aldinga"],
  },
  {
    name: "Eastern Adelaide",
    slug: "eastern-adelaide",
    description:
      "NDIS support services across Modbury, Tea Tree Gully, Campbelltown, Newton, Norwood, and surrounding eastern Adelaide suburbs.",
    keySuburbs: ["Modbury", "Tea Tree Gully", "Campbelltown", "Newton", "Norwood", "Burnside"],
  },
  {
    name: "Western Adelaide",
    slug: "western-adelaide",
    description:
      "NDIS support services across Woodville, Henley Beach, Semaphore, Port Adelaide, Grange, and surrounding western Adelaide suburbs.",
    keySuburbs: ["Woodville", "Henley Beach", "Semaphore", "Port Adelaide", "Grange", "Findon"],
  },
  {
    name: "CBD & Inner Suburbs",
    slug: "cbd-and-inner-suburbs",
    description:
      "NDIS support services in Adelaide CBD, Prospect, Unley, Mitcham, Kensington, and surrounding inner Adelaide suburbs.",
    keySuburbs: ["Adelaide CBD", "Prospect", "Unley", "Mitcham", "Kensington", "Parkside"],
  },
  {
    name: "Barossa & Surrounds",
    slug: "barossa-and-surrounds",
    description:
      "NDIS support services across the Barossa Valley region including Nuriootpa, Tanunda, Angaston, and Lyndoch.",
    keySuburbs: ["Nuriootpa", "Tanunda", "Angaston", "Lyndoch", "Williamstown"],
  },
  {
    name: "Fleurieu Peninsula",
    slug: "fleurieu-peninsula",
    description:
      "NDIS support services across Victor Harbor, Goolwa, Port Elliot, Willunga, and the broader Fleurieu Peninsula.",
    keySuburbs: ["Victor Harbor", "Goolwa", "Port Elliot", "Willunga", "McLaren Vale"],
  },
  {
    name: "Eyre Peninsula",
    slug: "eyre-peninsula",
    description:
      "NDIS support services across Port Lincoln, Whyalla, Ceduna, and the broader Eyre Peninsula region.",
    keySuburbs: ["Port Lincoln", "Whyalla", "Ceduna", "Streaky Bay", "Cleve"],
  },
  {
    name: "Limestone Coast",
    slug: "limestone-coast",
    description:
      "NDIS support services across Mount Gambier, Millicent, Naracoorte, Keith, and the broader Limestone Coast region.",
    keySuburbs: ["Mount Gambier", "Millicent", "Naracoorte", "Keith", "Kingston SE"],
  },
  {
    name: "Yorke & Mid North",
    slug: "yorke-and-mid-north",
    description:
      "NDIS support services across Port Pirie, Clare, Kadina, Maitland, Minlaton, and the broader Yorke Peninsula and Mid North.",
    keySuburbs: ["Port Pirie", "Clare", "Kadina", "Maitland", "Minlaton"],
  },
]

const tier1Suburbs = [
  { name: "Elizabeth", slug: "elizabeth" },
  { name: "Salisbury", slug: "salisbury" },
  { name: "Modbury", slug: "modbury" },
  { name: "Para Hills", slug: "para-hills" },
  { name: "Davoren Park", slug: "davoren-park" },
  { name: "Morphett Vale", slug: "morphett-vale" },
  { name: "Noarlunga", slug: "noarlunga" },
  { name: "Mount Gambier", slug: "mount-gambier" },
  { name: "Whyalla", slug: "whyalla" },
  { name: "Port Augusta", slug: "port-augusta" },
  { name: "Gawler", slug: "gawler" },
  { name: "Victor Harbor", slug: "victor-harbor" },
  { name: "Murray Bridge", slug: "murray-bridge" },
  { name: "Port Pirie", slug: "port-pirie" },
  { name: "Tea Tree Gully", slug: "tea-tree-gully" },
]

const faqs: FaqItem[] = [
  {
    question: "Does Ashar Disability Care service all of South Australia?",
    answer:
      "Yes. Ashar Disability Care provides NDIS support services across Adelaide and all regions of South Australia, including metropolitan Adelaide suburbs and regional areas such as the Barossa, Fleurieu Peninsula, Eyre Peninsula, Limestone Coast, and Yorke Peninsula.",
  },
  {
    question: "What areas does Ashar Disability Care cover in Adelaide?",
    answer:
      "Ashar Disability Care covers northern, southern, eastern, and western Adelaide suburbs as well as the CBD and inner suburbs. This includes areas such as Elizabeth, Salisbury, Modbury, Morphett Vale, Noarlunga, Tea Tree Gully, and hundreds of surrounding suburbs.",
  },
  {
    question: "Does Ashar Disability Care provide NDIS services in regional South Australia?",
    answer:
      "Yes. We provide NDIS support services in regional South Australia including the Barossa Valley, Fleurieu Peninsula, Eyre Peninsula (including Port Lincoln and Whyalla), Limestone Coast (including Mount Gambier), and Yorke Peninsula and Mid North regions.",
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
      name: "Locations",
      item: "https://ashardisabilitycare.com.au/locations",
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

export default function LocationsPage() {
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

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Locations</li>
          </ol>
        </nav>

        <section aria-labelledby="locations-heading">
          <h1 id="locations-heading">
            NDIS Support Services Across South Australia
          </h1>

          {/* Answer capsule */}
          <p className="answer-capsule">
            Ashar Disability Care is a registered NDIS provider delivering
            disability support services across Adelaide and all regions of
            South Australia.
          </p>
        </section>

        {/* ── REGIONS ──────────────────────────────────────────────────────── */}
        <section aria-labelledby="regions-heading">
          <h2 id="regions-heading">Service Regions</h2>
          <p>
            We provide NDIS support across all regions of South Australia.
            Select your region to learn more about the services available in
            your area.
          </p>
          <ul role="list">
            {regions.map((region) => (
              <li key={region.slug}>
                <article>
                  <h3>
                    <a href={`/locations/${region.slug}`}>{region.name}</a>
                  </h3>
                  <p>{region.description}</p>
                  <p>
                    <strong>Key areas:</strong>{" "}
                    {region.keySuburbs.join(", ")}
                  </p>
                  <a
                    href={`/locations/${region.slug}`}
                    aria-label={`NDIS services in ${region.name}`}
                  >
                    NDIS services in {region.name}
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </section>

        {/* ── TIER 1 SUBURBS ───────────────────────────────────────────────── */}
        <section aria-labelledby="suburbs-heading">
          <h2 id="suburbs-heading">Key Service Areas</h2>
          <p>
            We have dedicated service pages for our highest-demand locations
            across South Australia.
          </p>
          <nav aria-label="Key service areas">
            <ul role="list">
              {tier1Suburbs.map((suburb) => (
                <li key={suburb.slug}>
                  <a href={`/locations/${suburb.slug}`}>
                    NDIS Services in {suburb.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
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

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="locations-cta-heading">
          <h2 id="locations-cta-heading">
            Not Sure If We Service Your Area?
          </h2>
          <p>
            Contact us and we will confirm coverage in your location and
            discuss your support needs.
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
