import type { Metadata } from "next"
import Link from "next/link"
import { getSiteSettings } from "@/sanity/queries"
import { ChevronRight, Phone, Mail, MapPin } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: `Privacy Policy | ${businessName}`,
    description: `${businessName}'s Privacy Policy. Learn how we collect, use, and protect your personal information in accordance with Australian privacy laws.`,
    alternates: { canonical: "/privacy-policy" },
    robots: { index: true, follow: false },
  }
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const email = settings?.email ?? "info@allclutchandbrake.com.au"
  const abn = settings?.abn ?? ""
  const address = settings?.address

  const lastUpdated = "March 2026"

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/privacy-policy`,
    name: `Privacy Policy — ${businessName}`,
    url: `${siteUrl}/privacy-policy`,
    description: `Privacy Policy for ${businessName}, outlining how personal information is collected, used, and protected.`,
    publisher: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${siteUrl}/privacy-policy` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">Privacy Policy</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-zinc-400">
              <strong className="text-white">{businessName}</strong>
              {abn && <> | ABN: {abn}</>}
            </p>
            <p className="text-zinc-400 mt-2">Last updated: {lastUpdated}</p>
          </div>
        </section>

        {/* Content */}
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg prose-zinc prose-headings:font-bold prose-a:text-orange-600">
              <section>
                <h2>Introduction</h2>
                <p>
                  {businessName} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to 
                  protecting the privacy of individuals who interact with our organisation. This Privacy 
                  Policy outlines how we collect, use, store, and disclose personal information in 
                  accordance with the <em>Privacy Act 1988</em> (Cth) and the Australian Privacy 
                  Principles (APPs).
                </p>
              </section>

              <section>
                <h2>Information We Collect</h2>
                <p>We may collect the following types of personal information:</p>
                <ul>
                  <li>Name, address, phone number, and email address</li>
                  <li>Vehicle information (make, model, registration)</li>
                  <li>Service history and repair records</li>
                  <li>Payment information for processing transactions</li>
                  <li>Information you provide through our website contact form or enquiries</li>
                </ul>
              </section>

              <section>
                <h2>How We Use Your Information</h2>
                <p>We use your personal information to:</p>
                <ul>
                  <li>Provide and improve our automotive repair services</li>
                  <li>Respond to your enquiries and booking requests</li>
                  <li>Process payments and maintain service records</li>
                  <li>Send service reminders and relevant updates (with your consent)</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>
              </section>

              <section>
                <h2>Disclosure of Information</h2>
                <p>
                  We will not sell, rent, or trade your personal information to third parties. 
                  We may disclose your information to:
                </p>
                <ul>
                  <li>Parts suppliers when required to fulfil repairs</li>
                  <li>Payment processors for secure transaction handling</li>
                  <li>Legal or regulatory authorities where required by law</li>
                </ul>
              </section>

              <section>
                <h2>Security</h2>
                <p>
                  We take reasonable steps to protect your personal information from misuse, 
                  interference, loss, and unauthorised access. Our website uses HTTPS encryption 
                  for all data transmissions. Physical records are stored securely at our premises.
                </p>
              </section>

              <section>
                <h2>Access and Correction</h2>
                <p>
                  You have the right to access and correct the personal information we hold about you. 
                  To request access or corrections, contact us using the details below.
                </p>
              </section>

              <section>
                <h2>Complaints</h2>
                <p>
                  If you believe we have breached the Australian Privacy Principles, you may lodge 
                  a complaint with us directly. If you are not satisfied with our response, you may 
                  contact the Office of the Australian Information Commissioner (OAIC) at{" "}
                  <a href="https://www.oaic.gov.au" target="_blank" rel="noopener noreferrer">
                    oaic.gov.au
                  </a>.
                </p>
              </section>

              <section>
                <h2>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. The most current version 
                  will always be available on this page with the date of last update.
                </p>
              </section>
            </div>

            {/* Contact Section */}
            <div className="max-w-3xl mx-auto mt-12 bg-zinc-50 border border-zinc-200 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Contact Us</h2>
              <address className="not-italic space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-orange-500" />
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-orange-600 hover:underline">
                    {phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-orange-500" />
                  <a href={`mailto:${email}`} className="text-orange-600 hover:underline">
                    {email}
                  </a>
                </div>
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-orange-500 mt-0.5" />
                    <span className="text-zinc-600">
                      {address.street}, {address.suburb} {address.state} {address.postcode}
                    </span>
                  </div>
                )}
              </address>
            </div>
          </div>
        </article>
      </main>
    </>
  )
}
