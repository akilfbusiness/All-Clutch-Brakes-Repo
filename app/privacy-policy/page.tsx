// Privacy Policy page
// Required for any NDIS business that collects personal information
// under the Australian Privacy Act 1988
// Schema: WebPage + BreadcrumbList

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Ashar Disability Care",
  description:
    "Ashar Disability Care's Privacy Policy. Learn how we collect, use, and protect your personal information in accordance with the Australian Privacy Act 1988.",
  alternates: {
    canonical: "/privacy-policy",
  },
  // Privacy policy should not appear in Google results as a primary result
  // but should still be indexable for trust and compliance
  robots: {
    index: true,
    follow: false,
  },
}

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://ashardisabilitycare.com.au/privacy-policy",
  name: "Privacy Policy — Ashar Disability Care",
  url: "https://ashardisabilitycare.com.au/privacy-policy",
  description:
    "Privacy Policy for Ashar Disability Care, outlining how personal information is collected, used, and protected.",
  publisher: {
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
      name: "Privacy Policy",
      item: "https://ashardisabilitycare.com.au/privacy-policy",
    },
  ],
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 2025"

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main>
        <nav aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li aria-current="page">Privacy Policy</li>
          </ol>
        </nav>

        <article>
          <header>
            <h1>Privacy Policy</h1>
            <p>
              <strong>Ashar Disability Care</strong> | ABN: 11 656 510 075
            </p>
            <p>Last updated: {lastUpdated}</p>
          </header>

          <section aria-labelledby="intro-heading">
            <h2 id="intro-heading">Introduction</h2>
            <p>
              Ashar Disability Care (&quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;) is committed to protecting the privacy of
              individuals who interact with our organisation. This Privacy Policy
              outlines how we collect, use, store, and disclose personal
              information in accordance with the{" "}
              <em>Privacy Act 1988</em> (Cth) and the Australian Privacy
              Principles (APPs).
            </p>
          </section>

          <section aria-labelledby="collection-heading">
            <h2 id="collection-heading">Information We Collect</h2>
            <p>We may collect the following types of personal information:</p>
            <ul>
              <li>Name, address, phone number, and email address</li>
              <li>
                NDIS plan details and disability-related information (with your
                consent)
              </li>
              <li>Health and medical information relevant to support delivery</li>
              <li>Emergency contact details</li>
              <li>
                Information you provide through our website contact form or
                enquiries
              </li>
            </ul>
          </section>

          <section aria-labelledby="use-heading">
            <h2 id="use-heading">How We Use Your Information</h2>
            <p>We use your personal information to:</p>
            <ul>
              <li>Provide and improve our NDIS support services</li>
              <li>Respond to your enquiries</li>
              <li>Comply with our obligations as a registered NDIS provider</li>
              <li>
                Meet legal requirements under the NDIS Act and NDIS Practice
                Standards
              </li>
              <li>
                Communicate with you about your services and our organisation
              </li>
            </ul>
          </section>

          <section aria-labelledby="disclosure-heading">
            <h2 id="disclosure-heading">Disclosure of Information</h2>
            <p>
              We will not sell, rent, or trade your personal information to
              third parties. We may disclose your information to:
            </p>
            <ul>
              <li>
                NDIS Quality and Safeguards Commission as required by law
              </li>
              <li>
                Other service providers involved in delivering your NDIS supports
                (with your consent)
              </li>
              <li>
                Legal or regulatory authorities where required by law
              </li>
            </ul>
          </section>

          <section aria-labelledby="security-heading">
            <h2 id="security-heading">Security</h2>
            <p>
              We take reasonable steps to protect your personal information from
              misuse, interference, loss, and unauthorised access. Our website
              uses HTTPS encryption for all data transmissions.
            </p>
          </section>

          <section aria-labelledby="access-heading">
            <h2 id="access-heading">Access and Correction</h2>
            <p>
              You have the right to access and correct the personal information
              we hold about you. To request access or corrections, contact us at:
            </p>
            <address>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:info@ashardc.com.au">info@ashardc.com.au</a>
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href="tel:+61425760172">0425 760 172</a>
              </p>
            </address>
          </section>

          <section aria-labelledby="complaints-heading">
            <h2 id="complaints-heading">Complaints</h2>
            <p>
              If you believe we have breached the Australian Privacy Principles,
              you may lodge a complaint with us directly. If you are not
              satisfied with our response, you may contact the Office of the
              Australian Information Commissioner (OAIC) at{" "}
              <a
                href="https://www.oaic.gov.au"
                target="_blank"
                rel="noopener noreferrer"
              >
                oaic.gov.au
              </a>
              .
            </p>
          </section>

          <section aria-labelledby="changes-heading">
            <h2 id="changes-heading">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The most
              current version will always be available on this page with the
              date of last update.
            </p>
          </section>

          <section aria-labelledby="contact-privacy-heading">
            <h2 id="contact-privacy-heading">Contact Us</h2>
            <address>
              <p>Ashar Disability Care</p>
              <p>2 Yangoura Ct, Surrey Downs SA 5126</p>
              <p>
                <a href="tel:+61425760172">0425 760 172</a>
              </p>
              <p>
                <a href="mailto:info@ashardc.com.au">info@ashardc.com.au</a>
              </p>
            </address>
          </section>
        </article>
      </main>
    </>
  )
}
