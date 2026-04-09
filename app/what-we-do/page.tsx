// What We Do page — content pulled from Sanity CMS

import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ChevronRight, ArrowRight, Quote } from "lucide-react"
import { getSiteSettings, getWhatWeDo } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getWhatWeDo()])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const heading = page?.pageHeading ?? `What We Do | ${businessName}`

  return {
    title: heading,
    description: page?.ourBeginningsText?.slice(0, 160) ?? `Learn what ${businessName} does — our history, mission, and values.`,
    alternates: { canonical: "/what-we-do" },
    openGraph: { title: heading, description: page?.ourBeginningsText?.slice(0, 160) ?? "", url: `${siteUrl}/what-we-do`, type: "website" },
  }
}

export default async function WhatWeDoPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getWhatWeDo()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",       item: siteUrl },
      { "@type": "ListItem", position: 2, name: "What We Do", item: `${siteUrl}/what-we-do` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-black leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap">
          What We Do
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">What We Do</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Our Expertise</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] text-foreground mb-8">
              {page?.pageHeading ?? "What We Do"}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              Adelaide&apos;s specialist clutch and brake workshop — built on decades of honest, expert service.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link href="/services"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                Our Services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR BEGINNINGS ─────────────────────────────────────────────────── */}
      {(page?.ourBeginningsHeading || page?.ourBeginningsText) && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <div className="grid gap-16 lg:grid-cols-2 items-start">
              <div>
                <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Our Story</p>
                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight mb-8">
                  {page?.ourBeginningsHeading ?? "Our Beginnings"}
                </h2>
                <div className="w-14 h-[2px] bg-accent mb-8" />
                <div className="space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                  {page?.ourBeginningsText
                    ? page.ourBeginningsText.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
                    : <p>{businessName} has been serving Adelaide drivers with expert clutch and brake repairs for over three decades.</p>
                  }
                </div>
              </div>
              <div className="border border-border p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
                <dl className="grid grid-cols-2 gap-y-8 gap-x-6">
                  {[
                    { value: "1984", label: "Established" },
                    { value: "40+",  label: "Years Experience" },
                    { value: "All",  label: "Makes & Models" },
                    { value: "Free", label: "Quotes & Inspections" },
                  ].map((stat) => (
                    <div key={stat.label} className="group cursor-default">
                      <dt className="text-4xl md:text-5xl font-black text-foreground group-hover:text-accent transition-colors duration-300 mb-2">{stat.value}</dt>
                      <div className="w-8 h-[2px] bg-accent/40 mb-2" />
                      <dd className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">{stat.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MISSION ────────────────────────────────────────────────────────── */}
      {(page?.ourMissionHeading || page?.ourMissionText) && (
        <section className="py-20 md:py-28 bg-accent">
          <div className="container">
            <div className="max-w-3xl">
              <p className="text-black/60 text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Our Mission</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight mb-8">
                {page?.ourMissionHeading ?? "Our Mission"}
              </h2>
              <div className="w-14 h-[2px] bg-black/30 mb-8" />
              <p className="text-black/70 text-base md:text-lg leading-relaxed">
                {page?.ourMissionText ?? "To provide Adelaide drivers with expert clutch, brake, and transmission services — delivered with honesty, quality, and fair pricing."}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ──────────────────────────────────────────────────── */}
      {(page?.whyChooseUsHeading || page?.whyChooseUsText) && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <div className="max-w-3xl">
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Why Us</p>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight mb-8">
                {page?.whyChooseUsHeading ?? "Why Choose Us"}
              </h2>
              <div className="w-14 h-[2px] bg-accent mb-8" />
              <div className="space-y-5 text-muted-foreground text-sm md:text-base leading-relaxed">
                {page?.whyChooseUsText
                  ? page.whyChooseUsText.split("\n").filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
                  : <p>We are a family-owned workshop with over three decades of experience. We use quality parts, offer transparent pricing, and treat every vehicle as if it were our own.</p>
                }
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIAL ────────────────────────────────────────────────────── */}
      {page?.testimonialQuote && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <figure className="max-w-3xl">
              <Quote className="h-10 w-10 text-accent mb-8 opacity-70" />
              <blockquote className="text-2xl md:text-3xl font-black text-foreground leading-snug tracking-tight mb-8">
                &ldquo;{page.testimonialQuote}&rdquo;
              </blockquote>
              <div className="w-14 h-[2px] bg-accent mb-6" />
              {page.testimonialAuthor && (
                <figcaption className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">
                  — {page.testimonialAuthor}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      )}

      {/* ── CTA STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                Ready to Work With Us?
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                Call us today for a free quote or bring your vehicle in for a no-obligation inspection.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
