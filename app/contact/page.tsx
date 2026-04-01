import type { Metadata } from "next"
import Link from "next/link"
import { getSiteSettings } from "@/sanity/queries"
import { ChevronRight, Phone, Mail, MapPin, Clock } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: settings?.contactSeoTitle ?? `Contact Us | ${businessName}`,
    description:
      settings?.contactSeoDescription ??
      settings?.contactAnswerCapsule ??
      `Contact ${businessName} for expert clutch, brake, and transmission repairs in Adelaide. Call us or send an enquiry online.`,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: settings?.contactSeoTitle ?? `Contact Us | ${businessName}`,
      description: settings?.contactSeoDescription ?? settings?.contactAnswerCapsule ?? "",
      url: `${siteUrl}/contact`,
      type: "website",
    },
  }
}

export default async function ContactPage() {
  const settings = await getSiteSettings()

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone ?? ["(08) 8277 8122"]
  const email = settings?.email ?? "info@allclutchandbrake.com.au"
  const address = settings?.address
  const businessHours = settings?.businessHours ?? []

  const contactInfoHeading = settings?.contactInfoHeading ?? "Get in Touch"
  const formHeading = settings?.contactFormHeading ?? "Send an Enquiry"
  const formSubheading = settings?.contactFormSubheading ?? ""
  const privacyNote =
    settings?.contactPrivacyNote ??
    "We will only use your information to respond to your enquiry."
  const serviceOptions = settings?.contactServiceOptions ?? [
    "Clutch Repairs",
    "Brake Services",
    "Transmission Repairs",
    "Flywheel Machining",
    "General Enquiry",
  ]
  const faqs = settings?.contactFaqs ?? []

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

  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }
      : null

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-background">
        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-orange-500">
                  Contact
                </li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {settings?.contactHeading ?? `Contact ${businessName}`}
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              {settings?.contactAnswerCapsule ??
                `Get in touch with ${businessName} for expert clutch, brake, and transmission services in Adelaide. Call us directly or send an enquiry using the form below.`}
            </p>
          </div>
        </section>

        {/* ── CONTACT INFO + FORM ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2">

              {/* Left — contact details + map */}
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 mb-8">
                  {contactInfoHeading}
                </h2>

                <address className="not-italic space-y-6">
                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 mb-1">Phone</h3>
                      {phone.map((p, i) => (
                        <a
                          key={i}
                          href={`tel:${p.replace(/\s/g, "")}`}
                          className="block text-lg text-orange-600 hover:text-orange-700 font-medium"
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 mb-1">Email</h3>
                      <a
                        href={`mailto:${email}`}
                        className="text-lg text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  {address && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 mb-1">Address</h3>
                        <p className="text-zinc-600">
                          {address.street}
                          <br />
                          {address.suburb} {address.state} {address.postcode}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Business Hours */}
                  {businessHours.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-zinc-900 mb-2">Opening Hours</h3>
                        <dl className="space-y-1">
                          {businessHours.map((h, i) => (
                            <div key={i} className="flex gap-2 text-zinc-600">
                              <dt className="font-medium min-w-[160px]">{h.days}:</dt>
                              <dd>{h.hours}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>
                  )}
                </address>

                {/* Map */}
                <div className="mt-8">
                  {settings?.googleMapsEmbedUrl ? (
                    <div className="rounded-lg overflow-hidden border border-zinc-200">
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
                    <div className="bg-zinc-100 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                      <div className="text-zinc-400">
                        <MapPin className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm">
                          Add a Google Maps Embed URL in Site Settings → Business Details
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right — enquiry form */}
              <div>
                <div className="bg-white border border-zinc-200 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">{formHeading}</h2>
                  {formSubheading && (
                    <p className="text-zinc-600 mb-6">{formSubheading}</p>
                  )}

                  <form className="space-y-6" aria-label="Contact enquiry form">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-zinc-700 mb-2"
                      >
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Your full name"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-zinc-700 mb-2"
                        >
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          placeholder="Your phone number"
                          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-zinc-700 mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          placeholder="Your email address"
                          className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="suburb"
                        className="block text-sm font-medium text-zinc-700 mb-2"
                      >
                        Suburb / Location
                      </label>
                      <input
                        id="suburb"
                        name="suburb"
                        type="text"
                        autoComplete="address-level2"
                        placeholder="Your suburb or town"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-zinc-700 mb-2"
                      >
                        Service Interested In
                      </label>
                      <select
                        id="service"
                        name="service"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors bg-white"
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-zinc-700 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        required
                        placeholder="Tell us about your vehicle and what you need help with"
                        className="w-full px-4 py-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
                    >
                      Send Enquiry
                    </button>

                    <p className="text-sm text-zinc-500 text-center">
                      By submitting this form you agree to our{" "}
                      <Link href="/privacy-policy" className="text-orange-600 hover:underline">
                        Privacy Policy
                      </Link>
                      . {privacyNote}
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ─────────────────────────────────────────────────── */}
        {faqs.length > 0 && (
          <section className="bg-zinc-50 py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-3xl">
              <h2 className="text-2xl font-bold text-zinc-900 mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-zinc-200 pb-6 last:border-0 last:pb-0">
                    <h3 className="font-semibold text-zinc-900 mb-2">{faq.question}</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
