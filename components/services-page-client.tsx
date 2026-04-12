"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, ArrowRight, ChevronRight, Wrench } from "lucide-react"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ServiceCardItem {
  title: string
  slug: string | null
  description: string | null
  image: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ServicesPageClientProps {
  businessName: string
  phone: string
  pageTitle: string
  pageSubtitle: string
  ctaHeading: string
  ctaBody: string
  services: ServiceCardItem[]
  faqs: FaqItem[]
}

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ServicesPageClient({
  businessName, phone, pageTitle, pageSubtitle,
  ctaHeading, ctaBody, services, faqs,
}: ServicesPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        {/* Giant watermark */}
        <span
          aria-hidden
          className="absolute bottom-0 right-0 text-[120px] md:text-[200px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap"
        >
          Services
        </span>

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Breadcrumb" className="mb-10"
          >
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Services</li>
            </ol>
          </motion.nav>

          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="max-w-4xl"
          >
            <motion.p variants={fadeUp} className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              What We Do
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8"
            >
              {pageTitle}
            </motion.h1>
            {pageSubtitle && (
              <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                {pageSubtitle}
              </motion.p>
            )}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                Get a Free Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          SERVICE CARD GRID — image-top, white bg
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="flex items-center justify-between mb-14"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              All Services
            </h2>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/70 border border-accent/20 px-3 py-1">
              {services.length} Total
            </span>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border"
          >
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-background group">
                <Link
                  href={service.slug ? `/services/${service.slug}` : "/services"}
                  className="block h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Wrench className="w-8 h-8 text-accent/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.25em] text-white/80 bg-black/40 px-2 py-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-6 border-t border-border group-hover:border-accent/40 transition-colors duration-300">
                    <h3 className="text-base font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-snug mb-2">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-accent text-[11px] font-bold tracking-wide group-hover:gap-3 transition-all duration-300">
                      Full Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="relative py-24 md:py-32 bg-background border-t border-border overflow-hidden">
          <span aria-hidden className="absolute top-6 right-6 md:right-10 text-[100px] md:text-[160px] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none">
            FAQ
          </span>
          <div className="container">
            <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">

              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                className="lg:sticky lg:top-32 lg:self-start"
              >
                <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Got Questions?</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-8">
                  Frequently Asked Questions
                </h2>
                <div className="w-14 h-[2px] bg-accent mb-6" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                  Can't find the answer you need? Call us — we're always happy to chat.
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </motion.div>

              {/* Accordion */}
              <motion.div
                variants={stagger} initial="hidden"
                whileInView="show" viewport={{ once: true }}
                className="border-t border-border"
              >
                {faqs.map((faq, i) => (
                  <motion.div key={i} variants={fadeUp} className="border-b border-border">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="group w-full flex items-center justify-between py-7 text-left cursor-pointer"
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
                          transition={{ duration: 0.32, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground text-sm leading-relaxed pb-7">{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}


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
                {ctaHeading}
              </h2>
              <p className="mt-3 text-accent-foreground/55 text-sm md:text-base max-w-lg leading-relaxed">{ctaBody}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2.5 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/40 hover:bg-accent-foreground hover:text-accent text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                Get a Quote Online
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
