// About page
// Purpose: E-E-A-T signal — Expertise, Experience, Authoritativeness, Trustworthiness
// Google and AI engines weigh NDIS/health content heavily on E-E-A-T
// A well-structured About page with real business details is critical
// Schema: AboutPage + BreadcrumbList (LocalBusiness already in root layout)

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Ashar Disability Care | Registered NDIS Provider South Australia",
  description:
    "Learn about Ashar Disability Care, a registered NDIS provider based in Surrey Downs, South Australia. Delivering personalised disability support services across Adelaide and regional SA.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Ashar Disability Care | Registered NDIS Provider South Australia",
    description:
      "Ashar Disability Care is a registered NDIS provider committed to delivering high-quality, person-centred disability support across South Australia.",
    url: "https://ashardisabilitycare.com.au/about",
    type: "website",
  },
}

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://ashardisabilitycare.com.au/about",
  name: "About Ashar Disability Care",
  description:
    "Ashar Disability Care is a registered NDIS provider based in Surrey Downs, South Australia, delivering personalised disability support services across Adelaide and regional SA.",
  url: "https://ashardisabilitycare.com.au/about",
  mainEntity: {
    "@id": "https://ashardisabilitycare.com.au/#business",
  },
}

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
      name: "About",
      item: "https://ashardisabilitycare.com.au/about",
    },
  ],
}

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        {/* Breadcrumb nav — visible to users and reinforces BreadcrumbList schema */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        {/* ── INTRO ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="about-heading">
          <h1 id="about-heading">About Ashar Disability Care</h1>

          {/* Answer capsule */}
          <p className="answer-capsule">
            Ashar Disability Care is a registered NDIS provider in South
            Australia delivering personalised, person-centred disability support
            services across Adelaide and regional SA.
          </p>
        </section>

        {/* ── MISSION ───────────────────────────────────────────────────────── */}
        <section aria-labelledby="mission-heading">
          <h2 id="mission-heading">Our Mission</h2>
          <p>
            Our mission is to empower people living with disability to live
            the life they choose. We believe every person deserves access to
            high-quality, respectful, and personalised support that helps them
            achieve their goals and participate fully in their community.
          </p>
        </section>

        {/* ── WHO WE ARE ────────────────────────────────────────────────────── */}
        <section aria-labelledby="who-heading">
          <h2 id="who-heading">Who We Are</h2>
          <p>
            Based in Surrey Downs, South Australia, Ashar Disability Care is a
            registered NDIS provider serving participants across Adelaide and
            regional South Australia. Our team of trained support workers is
            dedicated to delivering compassionate, flexible, and effective
            disability support.
          </p>
          <p>
            We understand the NDIS system and work closely with participants,
            their families, and their support coordinators to ensure every
            person gets the most from their NDIS plan.
          </p>
        </section>

        {/* ── REGISTRATION & CREDENTIALS ───────────────────────────────────── */}
        {/* These details are critical for E-E-A-T and NDIS trust signals */}
        <section aria-labelledby="credentials-heading">
          <h2 id="credentials-heading">Our Credentials</h2>
          <dl>
            <div>
              <dt>NDIS Registration ID</dt>
              <dd>4-1C342A6</dd>
            </div>
            <div>
              <dt>ABN</dt>
              <dd>11 656 510 075</dd>
            </div>
            <div>
              <dt>Registered With</dt>
              <dd>NDIS Quality and Safeguards Commission</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>2 Yangoura Ct, Surrey Downs SA 5126</dd>
            </div>
            <div>
              <dt>Service Area</dt>
              <dd>Adelaide and all regions of South Australia</dd>
            </div>
          </dl>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────────────── */}
        <section aria-labelledby="values-heading">
          <h2 id="values-heading">Our Values</h2>
          <ul>
            <li>
              <strong>Person-Centred:</strong> Every support plan is built
              around the individual — their goals, preferences, and needs.
            </li>
            <li>
              <strong>Respect:</strong> We treat every participant with dignity,
              respect, and compassion.
            </li>
            <li>
              <strong>Quality:</strong> We are committed to delivering the
              highest standard of disability support in line with NDIS
              Practice Standards.
            </li>
            <li>
              <strong>Integrity:</strong> We operate transparently and
              ethically in everything we do.
            </li>
            <li>
              <strong>Community:</strong> We are proud members of the South
              Australian community, dedicated to making a real difference.
            </li>
          </ul>
        </section>

        {/* ── TEAM ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="team-heading">
          <h2 id="team-heading">Our Team</h2>
          {/* LOGO-HERE — team photo placeholder */}
          <p>
            Our experienced team of support workers and coordinators are the
            heart of Ashar Disability Care. Every team member is trained,
            screened, and committed to delivering outstanding support.
          </p>
          <p>
            {/* Placeholder — add team member profiles here */}
            Team profiles coming soon.
          </p>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section aria-labelledby="about-cta-heading">
          <h2 id="about-cta-heading">Get in Touch</h2>
          <p>
            Ready to find out how Ashar Disability Care can support you or your
            loved one? Contact our friendly team today.
          </p>
          <a href="/contact">Contact Us</a>
          <a href="/services">View Our Services</a>
        </section>
      </main>
    </>
  )
}
