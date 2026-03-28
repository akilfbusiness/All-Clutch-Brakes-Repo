// Contact page
// Schema: ContactPage + BreadcrumbList
// Form is structural only — submission logic (email/CRM) added in a later step

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Ashar Disability Care | NDIS Support Services SA",
  description:
    "Contact Ashar Disability Care to discuss your NDIS support needs. Call 0425 760 172, email info@ashardc.com.au, or fill in our enquiry form. Based in Surrey Downs, serving all of South Australia.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Ashar Disability Care | NDIS Support Services SA",
    description:
      "Get in touch with Ashar Disability Care. Our friendly team is ready to help you get started with NDIS support services across South Australia.",
    url: "https://ashardisabilitycare.com.au/contact",
    type: "website",
  },
}

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://ashardisabilitycare.com.au/contact",
  name: "Contact Ashar Disability Care",
  description:
    "Contact Ashar Disability Care to enquire about NDIS support services in South Australia.",
  url: "https://ashardisabilitycare.com.au/contact",
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
      name: "Contact",
      item: "https://ashardisabilitycare.com.au/contact",
    },
  ],
}

// Services list for the form dropdown
const serviceOptions = [
  "Personal Care",
  "Home Care",
  "Community Participation",
  "Transport",
  "Accommodation Support",
  "NDIS Planning and Coordination",
  "Not sure — I need help choosing",
]

export default function ContactPage() {
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

        <h1>Contact Ashar Disability Care</h1>

        {/* Answer capsule */}
        <p className="answer-capsule">
          Reach Ashar Disability Care by phone on 0425 760 172, by email at
          info@ashardc.com.au, or complete the enquiry form below.
        </p>

        <div>
          {/* ── CONTACT DETAILS ─────────────────────────────────────────────── */}
          <section aria-labelledby="contact-details-heading">
            <h2 id="contact-details-heading">Get in Touch</h2>

            <address>
              <dl>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href="tel:+61425760172">0425 760 172</a>
                  </dd>
                  <dd>
                    <a href="tel:+61425409849">0425 409 849</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href="mailto:info@ashardc.com.au">info@ashardc.com.au</a>
                  </dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>2 Yangoura Ct, Surrey Downs SA 5126, Australia</dd>
                </div>
                <div>
                  <dt>Business Hours</dt>
                  <dd>Monday – Friday: 9:00 AM – 5:00 PM</dd>
                  <dd>24/7 Support Available</dd>
                </div>
              </dl>
            </address>

            {/* Google Map embed placeholder — replace src with real embed URL */}
            <div aria-label="Map showing Ashar Disability Care location in Surrey Downs SA">
              {/* LOGO-HERE — Google Map embed placeholder */}
              <p>Map placeholder — replace with Google Maps embed</p>
            </div>
          </section>

          {/* ── ENQUIRY FORM ──────────────────────────────────────────────────── */}
          {/* Form is structural only — submission handler added in a later step */}
          <section aria-labelledby="form-heading">
            <h2 id="form-heading">Send an Enquiry</h2>
            <p>
              Fill in the form below and a member of our team will be in touch
              within one business day.
            </p>

            <form
              aria-label="Contact enquiry form"
              // action and onSubmit wired up in a later build step
            >
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
                  placeholder="Tell us about your support needs or ask us any questions"
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
