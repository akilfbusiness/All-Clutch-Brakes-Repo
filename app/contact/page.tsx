// Contact page — all content pulled from Sanity siteSettings
// To edit: Sanity Studio → Site Settings → Contact Page & Business Details
// Form is structural only — submission logic added in a later phase

import type { Metadata } from "next"
import { getSiteSettings } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"

  return {
    title: `Contact ${businessName}`,
    description: settings?.contactAnswerCapsule ?? settings?.defaultSeoDescription ?? "",
    alternates: { canonical: "/contact" },
    openGraph: {
      title: `Contact ${businessName}`,
      description: settings?.contactAnswerCapsule ?? "",
      url: `${siteUrl}/contact`,
      type: "website",
    },
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const phone = settings?.phone ?? []
  const serviceOptions = settings?.contactServiceOptions ?? []

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${siteUrl}/contact`,
    name: `Contact ${businessName}`,
    description: settings?.contactAnswerCapsule ?? "",
    url: `${siteUrl}/contact`,
    mainEntity: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Contact</li>
          </ol>
        </nav>

        <h1>{settings?.contactHeading ?? `Contact ${businessName}`}</h1>

        {/* Answer capsule */}
        {settings?.contactAnswerCapsule && (
          <p className="answer-capsule">{settings.contactAnswerCapsule}</p>
        )}

        <div>
          {/* ── CONTACT DETAILS ─────────────────────────────────────────────── */}
          <section aria-labelledby="contact-details-heading">
            <h2 id="contact-details-heading">Get in Touch</h2>

            <address>
              <dl>
                {phone.length > 0 && (
                  <div>
                    <dt>Phone</dt>
                    {phone.map((p, i) => (
                      <dd key={i}>
                        <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
                      </dd>
                    ))}
                  </div>
                )}
                {settings?.email && (
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${settings.email}`}>{settings.email}</a>
                    </dd>
                  </div>
                )}
                {settings?.address && (
                  <div>
                    <dt>Address</dt>
                    <dd>
                      {settings.address.street}, {settings.address.suburb}{" "}
                      {settings.address.state} {settings.address.postcode},{" "}
                      {settings.address.country}
                    </dd>
                  </div>
                )}
                {settings?.businessHours && settings.businessHours.length > 0 && (
                  <div>
                    <dt>Business Hours</dt>
                    {settings.businessHours.map((h, i) => (
                      <dd key={i}>
                        {h.days}: {h.hours}
                      </dd>
                    ))}
                  </div>
                )}
              </dl>
            </address>

            {/* Google Map embed — URL set in Sanity → Site Settings → Business Details */}
            {settings?.googleMapsEmbedUrl ? (
              <div aria-label={`Map showing ${businessName} location`}>
                <iframe
                  src={settings.googleMapsEmbedUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${businessName} location map`}
                />
              </div>
            ) : (
              <div aria-label="Map placeholder">
                {/* Add Google Maps embed URL in Sanity → Site Settings → Business Details */}
                <p>Map placeholder — add Google Maps embed URL in Sanity Studio.</p>
              </div>
            )}
          </section>

          {/* ── ENQUIRY FORM ──────────────────────────────────────────────────── */}
          <section aria-labelledby="form-heading">
            <h2 id="form-heading">
              {settings?.contactFormHeading ?? "Send an Enquiry"}
            </h2>
            {settings?.contactFormSubheading && (
              <p>{settings.contactFormSubheading}</p>
            )}

            <form aria-label="Contact enquiry form">
              <div>
                <label htmlFor="name">
                  Full Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="phone">
                  Phone Number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  aria-required="true"
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label htmlFor="email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label htmlFor="suburb">Suburb / Location</label>
                <input
                  id="suburb"
                  name="suburb"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="Your suburb or town"
                />
              </div>

              {serviceOptions.length > 0 && (
                <div>
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service">
                    <option value="">Select a service</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  aria-required="true"
                  placeholder="Tell us about your needs or ask us any questions"
                />
              </div>

              <button type="submit">Send Enquiry</button>

              <p>
                <small>
                  By submitting this form you agree to our{" "}
                  <a href="/privacy-policy">Privacy Policy</a>. We will only
                  use your information to respond to your enquiry.
                </small>
              </p>
            </form>
          </section>
        </div>
      </main>
    </>
  )
}
