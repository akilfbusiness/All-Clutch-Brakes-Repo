"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ChevronRight, Plus, Wrench, ArrowLeft, Phone } from "lucide-react"
import { PortableText } from "@portabletext/react"
import type { Location, InternalLink } from "@/sanity/queries"
import { PageHeroMedia } from "@/components/page-hero-media"
import { LeadQualificationForm } from "@/components/lead-qualification-form"

const SERVICES = [
  { title: "Clutch Repairs & Replacement", slug: "clutch-repairs" },
  { title: "Brake Services", slug: "brake-services" },
  { title: "Transmission Repairs", slug: "transmission-repairs" },
  { title: "Flywheel Machining", slug: "flywheel-machining" },
  { title: "Hydraulic Repairs", slug: "hydraulic-repairs" },
  { title: "Differential Services", slug: "differential-services" },
]

// Resolve hybrid internalLink — handles both reference (Sanity doc) and custom (any URL) types
function resolveLink(link: InternalLink): { href: string; label: string; description?: string } | null {
  const typeToPath: Record<string, string> = { service: "/services", post: "/blog", location: "/locations", page: "" }
  if (link.linkType === "reference" && link.page) {
    return {
      href: `${typeToPath[link.page._type] ?? ""}/${link.page.slug}`,
      label: link.labelOverride || link.page.title,
      description: link.description,
    }
  }
  if (link.linkType === "custom" && link.url && link.label) {
    return { href: link.url, label: link.label, description: link.description }
  }
  return null
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

interface Props {
  location: Location
  phone: string
  businessName: string
}

export default function LocationPageClient({ location, phone, businessName }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const isRegion = location.locationType === "region"

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-36 bg-background border-b border-border overflow-hidden">
        <PageHeroMedia imageUrl={location.heroImage} videoUrl={location.heroVideo} alt={`Clutch & Brake Service in ${location.title}`} />
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(4rem,14vw,12rem)] font-bold tracking-tighter text-foreground/[0.06] leading-none z-[2]"
        >
          {location.title}
        </span>

        <div className="container mx-auto px-6 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className={`flex items-center gap-2 text-[11px] flex-wrap uppercase tracking-widest ${location.heroImage || location.heroVideo ? "text-white/50" : "text-foreground/40"}`}>
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li><Link href="/locations" className="hover:text-accent transition-colors">Locations</Link></li>
              {location.locationType === "suburb" && location.region && (
                <>
                  <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                  <li>
                    <Link
                      href={`/locations/${location.region}`}
                      className="hover:text-accent transition-colors"
                    >
                      {location.region.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li aria-current="page" className="text-accent">{location.title}</li>
            </ol>
          </nav>

          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 border border-accent/40 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-accent" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent">
                {isRegion ? "Service Region" : "Service Area"}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`text-4xl md:text-6xl font-bold tracking-tight leading-none mb-6 ${location.heroImage || location.heroVideo ? "text-white" : "text-foreground"}`}
            >
              Clutch &amp; Brake<br />
              <span className="text-accent">{location.title}</span>
            </motion.h1>

            {location.answerCapsule && (
              <motion.p variants={fadeUp} className={`text-lg max-w-2xl mb-8 leading-relaxed ${location.heroImage || location.heroVideo ? "text-white/70" : "text-foreground/60"}`}>
                {location.answerCapsule}
              </motion.p>
            )}

            <motion.div variants={fadeUp}>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                Get Service in {location.title}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Content + Sidebar ─────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 lg:grid-cols-3">

            {/* Main */}
            <div className="lg:col-span-2 space-y-16">

              {/* Body prose */}
              {location.body && (
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-8 border-b border-border pb-4">
                    Services in {location.title}
                  </h2>
                  <div className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-accent prose-strong:text-foreground">
                    <PortableText value={location.body as Parameters<typeof PortableText>[0]["value"]} />
                  </div>
                </div>
              )}

              {/* Services grid */}
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-8 border-b border-border pb-4">
                  Services Available in {location.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border">
                  {SERVICES.map((service) => (
                    <Link
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="group relative border-r border-b border-border p-5 flex items-center gap-3 hover:bg-foreground/[0.02] transition-colors"
                    >
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300" />
                      <Wrench className="h-4 w-4 text-accent/60 group-hover:text-accent transition-colors flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                        {service.title}
                      </span>
                      <ChevronRight className="h-3 w-3 text-foreground/30 group-hover:text-accent ml-auto transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suburbs (region only) */}
              {isRegion && location.suburbsIncluded && location.suburbsIncluded.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-4 border-b border-border pb-4">
                    Suburbs We Service in {location.title}
                  </h2>
                  <p className="text-foreground/60 mb-6">
                    {businessName} provides clutch, brake, and transmission services across the following suburbs:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {location.suburbsIncluded.map((suburb) => (
                      <span
                        key={suburb}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-sm text-foreground/70 hover:border-accent/50 transition-colors"
                      >
                        <MapPin className="h-3 w-3 text-accent/50" />
                        {suburb}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {location.faqItems && location.faqItems.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-8 border-b border-border pb-4">
                    Frequently Asked Questions
                  </h2>
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="border-t border-border"
                  >
                    {location.faqItems.map((faq, i) => (
                      <motion.div key={i} variants={fadeUp} className="border-b border-border">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-accent transition-colors"
                        >
                          <span className="font-semibold">{faq.question}</span>
                          <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                            <Plus className="h-4 w-4 flex-shrink-0 text-accent" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="pb-5 text-foreground/60 leading-relaxed">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Internal Links — cross-page linking for SEO/GEO/AEO topical authority */}
              {location.internalLinks && location.internalLinks.length > 0 && (
                <section className="mb-10" aria-labelledby="location-internal-links-heading">
                  <h2
                    id="location-internal-links-heading"
                    className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
                  >
                    Related Pages
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border">
                    {location.internalLinks.map((link: InternalLink) => {
                      const resolved = resolveLink(link)
                      if (!resolved) return null
                      return (
                        <Link
                          key={link._key}
                          href={resolved.href}
                          className="group relative border-r border-b border-border p-5 hover:bg-foreground/[0.02] transition-colors"
                        >
                          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300" />
                          <span className="block font-bold text-foreground/80 group-hover:text-foreground transition-colors text-sm leading-snug mb-1">
                            {resolved.label}
                          </span>
                          {resolved.description && (
                            <span className="block text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                              {resolved.description}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )}

              <Link
                href="/locations"
                className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Locations
              </Link>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Lead Qualification Form — replaces contact card */}
                <LeadQualificationForm
                  businessName={businessName}
                  phoneNumber={phone}
                  accentColor="#2563EB"
                  services={SERVICES.map((s) => s.title)}
                  webhookUrlPartial="https://n8n-customer-automations.onrender.com/webhook/5384017c-e44f-4844-9965-6e8b78f5be0c"
                  webhookUrl1="https://n8n-customer-automations.onrender.com/webhook/1a390a21-4ada-4ffe-a366-0e7fc6afc302"
                  webhookUrl2="https://n8n-customer-automations.onrender.com/webhook/242b5f86-aaef-49a5-aa19-2137188f62c6"
                  webhookUrlCall="https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"
                />

                {/* Other locations */}
                <div className="border border-border p-6">
                  <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-foreground/50">
                    Other Service Areas
                  </h3>
                  <Link
                    href="/locations"
                    className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent/80 transition-colors text-sm"
                  >
                    View All Locations
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Strip ─────────────────────────────────────────── */}
      <section className="bg-accent py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-accent-foreground mb-4">
            Ready for Service in {location.title}?
          </h2>
          <p className="text-accent-foreground/70 mb-8 max-w-xl mx-auto">
            Contact {businessName} today for your clutch, brake, or transmission needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
            >
              Contact Us
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 border border-accent-foreground/30 hover:border-accent-foreground text-accent-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
