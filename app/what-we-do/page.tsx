import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Quote } from "lucide-react"
import { getSiteSettings, getWhatWeDo } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getWhatWeDo()])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const heading = page?.pageHeading ?? `What We Do | ${businessName}`

  return {
    title: heading,
    description:
      page?.ourBeginningsText?.slice(0, 160) ??
      `Learn what ${businessName} does — our history, mission, and values as Adelaide's clutch and brake specialists.`,
    alternates: { canonical: "/what-we-do" },
    openGraph: {
      title: heading,
      description: page?.ourBeginningsText?.slice(0, 160) ?? "",
      url: `${siteUrl}/what-we-do`,
      type: "website",
    },
  }
}

export default async function WhatWeDoPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getWhatWeDo()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "What We Do", item: `${siteUrl}/what-we-do` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* HERO */}
        <section className="bg-zinc-900 text-white py-16 md:py-24">
          <div className="container mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-accent">
                  What We Do
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              {page?.pageHeading ?? "What We Do"}
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              Adelaide&apos;s specialist clutch and brake workshop — built on decades of honest, expert service.
            </p>
          </div>
        </section>

        {/* OUR BEGINNINGS */}
        {(page?.ourBeginningsHeading || page?.ourBeginningsText) && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 items-start">
                <div>
                  <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block">
                    Our Story
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                    {page.ourBeginningsHeading ?? "Our Beginnings"}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {page?.ourBeginningsText
                      ? page.ourBeginningsText.split("\n").filter(Boolean).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))
                      : (
                        <p>
                          {businessName} has been serving Adelaide drivers with expert clutch and brake
                          repairs for over three decades. Our story is one of passion, precision, and
                          unwavering commitment to our customers.
                        </p>
                      )}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-8 lg:mt-12">
                  <dl className="grid grid-cols-2 gap-6">
                    {[
                      { value: "1984", label: "Established" },
                      { value: "40+", label: "Years Experience" },
                      { value: "All", label: "Makes & Models" },
                      { value: "Free", label: "Quotes" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <dt className="text-4xl font-bold text-accent mb-1">{stat.value}</dt>
                        <dd className="text-sm text-muted-foreground">{stat.label}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* OUR MISSION */}
        {(page?.ourMissionHeading || page?.ourMissionText) && (
          <section className="bg-accent py-16 md:py-20">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-6 text-balance">
                {page.ourMissionHeading ?? "Our Mission"}
              </h2>
              <p className="text-xl text-accent-foreground/80 max-w-3xl mx-auto leading-relaxed">
                {page.ourMissionText ??
                  "To provide Adelaide drivers with expert clutch, brake, and transmission services — delivered with honesty, quality, and fair pricing."}
              </p>
            </div>
          </section>
        )}

        {/* WHY CHOOSE US */}
        {(page?.whyChooseUsHeading || page?.whyChooseUsText) && (
          <section className="py-16 md:py-24 bg-secondary/30">
            <div className="container mx-auto">
              <div className="max-w-3xl mx-auto">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 block text-center">
                  Why Us
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center text-balance">
                  {page.whyChooseUsHeading ?? "Why Choose Us"}
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  {page?.whyChooseUsText
                    ? page.whyChooseUsText.split("\n").filter(Boolean).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    : (
                      <p>
                        We are a family-owned workshop with over three decades of experience. We use
                        quality parts, offer transparent pricing, and treat every vehicle as if it
                        were our own.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TESTIMONIAL */}
        {page?.testimonialQuote && (
          <section className="py-16 bg-zinc-900">
            <div className="container mx-auto">
              <figure className="max-w-3xl mx-auto text-center">
                <Quote className="h-12 w-12 text-accent mx-auto mb-6 opacity-60" />
                <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6 text-balance">
                  &ldquo;{page.testimonialQuote}&rdquo;
                </blockquote>
                {page.testimonialAuthor && (
                  <figcaption className="text-accent font-semibold">
                    — {page.testimonialAuthor}
                  </figcaption>
                )}
              </figure>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Ready to Work With Us?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Call us today for a free quote or bring your vehicle in for a no-obligation inspection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Call Now: {phone}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
