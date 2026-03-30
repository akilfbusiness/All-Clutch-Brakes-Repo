// About page — all content pulled from Sanity siteSettings
// To edit: Sanity Studio → Site Settings → About Page
// E-E-A-T signal — do not remove credentials section

import type { Metadata } from "next"
import { getSiteSettings } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"

  return {
    title: `About ${businessName}`,
    description: settings?.aboutAnswerCapsule ?? settings?.defaultSeoDescription ?? "",
    alternates: { canonical: "/about" },
    openGraph: {
      title: `About ${businessName}`,
      description: settings?.aboutAnswerCapsule ?? "",
      url: `${siteUrl}/about`,
      type: "website",
    },
  }
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const values = settings?.aboutValues ?? []
  const whoWeAreBody = settings?.aboutWhoWeAreBody ?? []

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about`,
    name: `About ${businessName}`,
    description: settings?.aboutAnswerCapsule ?? "",
    url: `${siteUrl}/about`,
    mainEntity: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
    ],
  }

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
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        {/* ── INTRO ─────────────────────────────────────────────────────────── */}
        <section aria-labelledby="about-heading">
          <h1 id="about-heading">
            {settings?.aboutHeading ?? `About ${businessName}`}
          </h1>
          {settings?.aboutAnswerCapsule && (
            <p className="answer-capsule">{settings.aboutAnswerCapsule}</p>
          )}
        </section>

        {/* ── MISSION ───────────────────────────────────────────────────────── */}
        {(settings?.aboutMissionHeading || settings?.aboutMissionBody) && (
          <section aria-labelledby="mission-heading">
            <h2 id="mission-heading">
              {settings?.aboutMissionHeading ?? "Our Mission"}
            </h2>
            {settings?.aboutMissionBody && <p>{settings.aboutMissionBody}</p>}
          </section>
        )}

        {/* ── WHO WE ARE ────────────────────────────────────────────────────── */}
        {(settings?.aboutWhoWeAreHeading || whoWeAreBody.length > 0) && (
          <section aria-labelledby="who-heading">
            <h2 id="who-heading">
              {settings?.aboutWhoWeAreHeading ?? "Who We Are"}
            </h2>
            {whoWeAreBody.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </section>
        )}

        {/* ── CREDENTIALS ───────────────────────────────────────────────────── */}
        {/* Critical for E-E-A-T — always visible. Values come from siteSettings business details. */}
        <section aria-labelledby="credentials-heading">
          <h2 id="credentials-heading">Our Credentials</h2>
          <dl>
            {settings?.abn && (
              <div>
                <dt>ABN</dt>
                <dd>{settings.abn}</dd>
              </div>
            )}
            {settings?.registrationId && (
              <div>
                <dt>Registration ID</dt>
                <dd>{settings.registrationId}</dd>
              </div>
            )}
            {settings?.address && (
              <div>
                <dt>Location</dt>
                <dd>
                  {settings.address.street}, {settings.address.suburb}{" "}
                  {settings.address.state} {settings.address.postcode}
                </dd>
              </div>
            )}
            {settings?.areaServed && settings.areaServed.length > 0 && (
              <div>
                <dt>Service Area</dt>
                <dd>{settings.areaServed.slice(0, 3).join(", ")}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────────────── */}
        {values.length > 0 && (
          <section aria-labelledby="values-heading">
            <h2 id="values-heading">Our Values</h2>
            <ul>
              {values.map((value, i) => (
                <li key={i}>
                  <strong>{value.title}:</strong> {value.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── TEAM ──────────────────────────────────────────────────────────── */}
        <section aria-labelledby="team-heading">
          <h2 id="team-heading">
            {settings?.aboutTeamHeading ?? "Our Team"}
          </h2>
          {/* LOGO-HERE — team photo placeholder */}
          {settings?.aboutTeamBody ? (
            <p>{settings.aboutTeamBody}</p>
          ) : (
            <p>Team profiles coming soon.</p>
          )}
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section aria-labelledby="about-cta-heading">
          <h2 id="about-cta-heading">Get in Touch</h2>
          <a href="/contact">Contact Us</a>
          <a href="/services">View Our Services</a>
        </section>
      </main>
    </>
  )
}
