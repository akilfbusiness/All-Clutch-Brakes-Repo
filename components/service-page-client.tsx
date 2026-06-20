"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { InternalLink } from "@/sanity/queries"
import { PortableText } from "@portabletext/react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Plus, ChevronRight, MapPin, ArrowLeft } from "lucide-react"
import { LeadQualificationForm } from "@/components/lead-qualification-form"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ServicePageClientProps {
  businessName: string
  phone: string
  service: {
    title: string
    slug: string
    answerCapsule: string
    body?: unknown[]
    whoIsItFor?: string
    faqItems?: { question: string; answer: string }[]
    heroImage?: string
    heroVideo?: string
    featuredImage?: string
    gallery?: { url: string; caption?: string }[]
    serviceAreas?: { title: string; slug: string }[]
  }
  relatedServices: { title: string; slug: string; description: string | null }[]
  howWeDeliverHeading: string
  deliverPoints: string[]
  pricingTable?: { vehicleType: string; priceRange: string; notes?: string }[]
  internalLinks?: InternalLink[]
}

// Resolves a hybrid InternalLink to a flat { href, label, description } object
// for rendering — works for both reference and custom link types.
function resolveLink(link: InternalLink): { href: string; label: string; description?: string } | null {
  if (link.linkType === "reference" && link.page) {
    const typeToPath: Record<string, string> = {
      service: "/services",
      post: "/blog",
      location: "/locations",
      page: "",
    }
    const base = typeToPath[link.page._type] ?? ""
    return {
      href: `${base}/${link.page.slug}`,
      label: link.labelOverride || link.page.title,
      description: link.description,
    }
  }
  if (link.linkType === "custom" && link.url && link.label) {
    return { href: link.url, label: link.label, description: link.description }
  }
  return null
}

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.65, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

// ─── PORTABLE TEXT COMPONENTS ─────────────────────────────────────────────────

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-5">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mt-10 mb-5">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-bold text-foreground tracking-tight mt-8 mb-4">{children}</h3>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic text-muted-foreground/80">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="space-y-2 mb-6">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="space-y-2 mb-6 list-decimal list-inside">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3 text-sm text-muted-foreground">
        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
        <span>{children}</span>
      </li>
    ),
  },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ServicePageClient({
  businessName, phone, service,
  relatedServices, howWeDeliverHeading, deliverPoints,
  pricingTable = [], internalLinks = [],
}: ServicePageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO — full-bleed bg image · dark overlay · Ken Burns
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-end overflow-hidden bg-background">

        {/* Background media — heroVideo > heroImage > featuredImage > dark fallback */}
        {service.heroVideo ? (
          <>
            <video
              key={service.heroVideo}
              autoPlay muted loop playsInline aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src={service.heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
          </>
        ) : (service.heroImage || service.featuredImage) ? (
          <>
            <motion.div
              initial={{ scale: 1.0 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 14, ease: "linear" }}
              className="absolute inset-0"
            >
              <Image
                src={service.heroImage ?? service.featuredImage!}
                alt={service.title}
                fill
                className="object-cover object-center"
                priority
                crossOrigin="anonymous"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
          </>
        ) : (
          /* No media — dark fallback so white text remains legible */
          <>
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-accent/10" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 container pb-16 md:pb-20 pt-40">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Breadcrumb" className="mb-8"
          >
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase text-white/40 flex-wrap">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Services</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent/80 line-clamp-1">{service.title}</li>
            </ol>
          </motion.nav>

          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="max-w-4xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-bold tracking-[0.45em] uppercase text-accent">Service</span>
              <span className="w-8 h-px bg-accent/40" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-6"
            >
              {service.title}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mb-10">
              {service.answerCapsule}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                Enquire About This Service
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2.5 border border-white/25 hover:border-white/60 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> {phone}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CONTENT — 2-col: body left · sticky sidebar right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">

            {/* ── LEFT: Main body ───────────────────────────────────────── */}
            <div>

              {/* Service body (Portable Text) */}
              {service.body && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="mb-14"
                >
                  <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">About This Service</p>
                  <div className="border-l-[3px] border-accent pl-6 mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight leading-tight">
                      About {service.title}
                    </h2>
                  </div>
                  {/* @ts-expect-error – PortableText accepts unknown[] */}
                  <PortableText value={service.body} components={ptComponents} />
                </motion.div>
              )}

              {/* Who is it for */}
              {service.whoIsItFor && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="mb-14 border border-border p-8 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                  <p className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase mb-4">Who Is This For?</p>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{service.whoIsItFor}</p>
                </motion.div>
              )}

              {/* Pricing table */}
              {pricingTable.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="mb-14"
                >
                  <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Pricing Guide</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                    How Much Does {service.title} Cost?
                  </h2>
                  <div className="border border-border overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_160px_1fr] bg-foreground/[0.04] border-b border-border px-6 py-3">
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60">Vehicle Type</span>
                      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60 text-right md:text-center">Price Range</span>
                      <span className="hidden md:block text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/60">Notes</span>
                    </div>
                    {/* Rows */}
                    {pricingTable.map((row, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease }}
                        className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_160px_1fr] items-center px-6 py-4 border-b border-border last:border-b-0 hover:bg-foreground/[0.02] transition-colors duration-200"
                      >
                        <span className="font-bold text-foreground text-sm">{row.vehicleType}</span>
                        <span className="text-accent font-bold text-sm text-right md:text-center whitespace-nowrap">{row.priceRange}</span>
                        {row.notes && (
                          <span className="hidden md:block text-xs text-muted-foreground/70 leading-relaxed">{row.notes}</span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground/50 mt-3 leading-relaxed">
                    Prices are a guide only. Final price depends on vehicle make, model, and parts required. Contact us for an exact quote.
                  </p>
                </motion.div>
              )}

              {/* How We Deliver */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                className="mb-14"
              >
                <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Our Approach</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                  {howWeDeliverHeading}
                </h2>
                <motion.div
                  variants={stagger} initial="hidden"
                  whileInView="show" viewport={{ once: true }}
                  className="border-t border-border"
                >
                  {deliverPoints.map((point, i) => (
                    <motion.div
                      key={i} variants={fadeUp}
                      className="group flex items-start gap-5 py-5 border-b border-border hover:border-accent/30 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full border border-accent/30 bg-accent/8 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                        <svg className="w-3 h-3 text-accent group-hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Gallery */}
              {service.gallery && service.gallery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="mb-14"
                >
                  <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Gallery</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                    Service Photos
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {service.gallery.map((img, i) => (
                      <motion.figure
                        key={i}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5, ease }}
                        className="relative overflow-hidden border border-border group"
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={img.url}
                            alt={img.caption ?? `${service.title} photo ${i + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            crossOrigin="anonymous"
                          />
                        </div>
                        {img.caption && (
                          <figcaption className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60 text-center p-3 border-t border-border bg-card">
                            {img.caption}
                          </figcaption>
                        )}
                      </motion.figure>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Internal links / related pages */}
              {internalLinks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="mb-14"
                >
                  <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Related Pages</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                    You May Also Be Interested In
                  </h2>
                  <motion.div
                    variants={stagger} initial="hidden"
                    whileInView="show" viewport={{ once: true }}
                    className="grid sm:grid-cols-2 gap-3"
                  >
                    {internalLinks.map((link, i) => {
                      const resolved = resolveLink(link)
                      if (!resolved) return null
                      return (
                      <motion.div key={i} variants={fadeUp}>
                        <Link
                          href={resolved.href}
                          className="group flex items-start justify-between gap-4 border border-border hover:border-accent/50 p-5 transition-all duration-300 hover:bg-foreground/[0.02]"
                        >
                          <div className="min-w-0">
                            <span className="block font-bold text-foreground text-sm group-hover:text-accent transition-colors duration-300 mb-1">
                              {resolved.label}
                            </span>
                            {resolved.description && (
                              <span className="block text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                                {resolved.description}
                              </span>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-accent/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-0.5" />
                        </Link>
                      </motion.div>
                      )
                    })}
                  </motion.div>
                </motion.div>
              )}

              {/* FAQ */}
              {service.faqItems && service.faqItems.length > 0 && (                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                >
                  <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">FAQ</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">
                    Common Questions
                  </h2>
                  <div className="border-t border-border">
                    {service.faqItems.map((faq, i) => (
                      <div key={i} className="border-b border-border">
                        <button
                          onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="group w-full flex items-center justify-between py-6 text-left cursor-pointer"
                        >
                          <span className="font-bold text-foreground text-sm md:text-base pr-8 group-hover:text-accent transition-colors duration-300">
                            {faq.question}
                          </span>
                          <motion.span
                            animate={{ rotate: openFaq === i ? 45 : 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="flex-shrink-0 w-8 h-8 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors duration-300"
                          >
                            <Plus className="h-3.5 w-3.5 text-accent" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {openFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="text-muted-foreground text-sm leading-relaxed pb-6">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* ── RIGHT: Sticky sidebar ──────────────────────────────────── */}
            <div>
              <div className="lg:sticky lg:top-28 space-y-5">

                {/* Lead Qualification Form — replaces Get a Quote card */}
                <motion.div
                  initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, ease }}
                >
                  <LeadQualificationForm
                    businessName={businessName}
                    phoneNumber={phone}
                    accentColor="#2563EB"
                    services={[service.title]}
                    webhookUrlPartial="https://n8n-customer-automations.onrender.com/webhook/5384017c-e44f-4844-9965-6e8b78f5be0c"
                    webhookUrl1="https://n8n-customer-automations.onrender.com/webhook/1a390a21-4ada-4ffe-a366-0e7fc6afc302"
                    webhookUrl2="https://n8n-customer-automations.onrender.com/webhook/242b5f86-aaef-49a5-aa19-2137188f62c6"
                    webhookUrlCall="https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"
                  />
                </motion.div>

                {/* Service areas */}
                {service.serviceAreas && service.serviceAreas.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: 0.1 }}
                    className="border border-border p-7"
                  >
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/70">Service Areas</h3>
                    </div>
                    <ul className="space-y-2">
                      {service.serviceAreas.map((area) => (
                        <li key={area.slug}>
                          <Link
                            href={`/locations/${area.slug}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
                          >
                            <ChevronRight className="h-3.5 w-3.5 text-accent/50 flex-shrink-0" />
                            {area.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Related services */}
                {relatedServices.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: 0.2 }}
                    className="border border-border p-7"
                  >
                    <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-muted-foreground/70 mb-5">Related Services</h3>
                    <ul className="space-y-0 border-t border-border">
                      {relatedServices.map((related) => (
                        <li key={related.slug} className="border-b border-border">
                          <Link
                            href={`/services/${related.slug}`}
                            className="group flex items-center justify-between py-3.5 text-sm text-muted-foreground hover:text-accent transition-colors duration-200"
                          >
                            <span>{related.title}</span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-1.5 text-accent text-xs font-bold mt-5 hover:gap-2.5 transition-all duration-300"
                    >
                      View All Services <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground tracking-tight leading-tight">
                Ready for {service.title}?
              </h2>
              <p className="mt-3 text-accent-foreground/55 text-sm md:text-base max-w-lg leading-relaxed">
                Contact {businessName} today for expert service, upfront pricing, and same-day availability.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                Contact Us
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/40 hover:bg-accent-foreground hover:text-accent text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          BACK LINK
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-border bg-background">
        <div className="container py-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-accent transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Services
          </Link>
        </div>
      </div>
    </>
  )
}
