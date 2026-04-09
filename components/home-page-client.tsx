"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useInView, useMotionValue, useTransform as useMotionTransform, animate,
} from "framer-motion"
import { Phone, Plus, ArrowRight, MapPin, Clock, Wrench } from "lucide-react"
import { TestimonialsCarousel } from "./testimonials-carousel"
import { PromotionsBanner } from "./promotions-banner"
import type { Testimonial, Promotion } from "@/sanity/queries"

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface HourItem { days: string; hours: string }

export interface ServiceItem {
  title: string
  slug: string | null
  description: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export interface HomePageClientProps {
  businessName: string
  phone: string
  address?: { street?: string; suburb?: string; state?: string; postcode?: string } | null
  hours: HourItem[]
  heroHeading: string
  heroAnswer: string
  heroTagline: string
  heroImage: string
  mechanicImage: string
  workshopImage: string
  primaryCta: string
  secondaryCta: string
  trustSignals: string[]
  tickerItems: string[]
  statsItems: { displayValue: string; label: string; subtitle?: string }[]
  servicesHeading: string
  servicesSubheading: string
  whyUsHeading: string
  whyUsPoints: string[]
  ctaHeading: string
  ctaBody: string
  inspectionCardHeading: string
  inspectionCardBody: string
  aboutDescription: string
  faqs: FaqItem[]
  serviceItems: ServiceItem[]
  testimonials: Testimonial[]
  promotions: Promotion[]
}

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────────

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count   = useMotionValue(0)
  const rounded = useMotionTransform(count, (v) => Math.round(v).toLocaleString() + suffix)
  const ref     = useRef<HTMLSpanElement>(null)
  const inView  = useInView(ref, { once: true })
  useEffect(() => {
    if (inView) void animate(count, to, { duration: 2.4, ease: "easeOut" })
  }, [inView, count, to])
  return <motion.span ref={ref}>{rounded}</motion.span>
}

// ─── TICKER ───────────────────────────────────────────────────────────────────

const DEFAULT_TICKER_ITEMS = [
  "Clutch Replacement", "Brake Repairs", "30+ Years Experience",
  "Same Day Service", "Free Quotes", "All Makes & Models",
  "Adelaide Specialists", "Fixed Pricing", "No Surprises",
  "Qualified Tradespeople", "Transmission Service", "Brake Machining",
]

function Ticker({ items, reverse = false }: { items?: string[]; reverse?: boolean }) {
  const resolved = items?.length ? items : DEFAULT_TICKER_ITEMS
  const doubled = [...resolved, ...resolved]
  return (
    <div
      className="overflow-hidden border-b border-border bg-background py-4 select-none"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div
        className="ticker-track flex items-center gap-0"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center flex-shrink-0">
            <span className="text-[11px] font-bold tracking-[0.28em] uppercase text-muted-foreground/65 px-6 whitespace-nowrap">
              {item}
            </span>
            <svg aria-hidden className="flex-shrink-0 w-[5px] h-[5px] fill-accent opacity-60" viewBox="0 0 6 6">
              <polygon points="3,0 6,3 3,6 0,3" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── SECTION NUMBER WATERMARK ─────────────────────────────────────────────────

function SectionNum({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      className="absolute top-6 right-6 md:right-10 text-[100px] md:text-[160px] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
    >
      {n}
    </span>
  )
}

// ─── FAQ ROW ─────────────────────────────────────────────────────────────────

function FaqRow({
  faq, index, openFaq, setOpenFaq, ease,
}: {
  faq: FaqItem
  index: number
  openFaq: number | null
  setOpenFaq: (i: number | null) => void
  ease: readonly number[]
}) {
  return (
    <motion.div variants={fadeUp} className="border-b border-border">
      <button
        onClick={() => setOpenFaq(openFaq === index ? null : index)}
        className="group w-full flex items-center justify-between py-7 text-left cursor-pointer"
      >
        <span className="font-bold text-foreground text-sm md:text-base pr-8 group-hover:text-accent transition-colors duration-300">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: openFaq === index ? 45 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="flex-shrink-0 w-8 h-8 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors duration-300"
        >
          <Plus className="h-3.5 w-3.5 text-accent" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {openFaq === index && (
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
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function HomePageClient({
  businessName, phone, address, hours,
  heroHeading, heroAnswer, heroTagline, heroImage, mechanicImage, workshopImage,
  primaryCta, secondaryCta,
  trustSignals, tickerItems, statsItems,
  servicesHeading, servicesSubheading,
  whyUsHeading, whyUsPoints, ctaHeading, ctaBody,
  inspectionCardBody, aboutDescription, faqs, serviceItems,
  testimonials, promotions,
}: HomePageClientProps) {

  const [openService,  setOpenService]  = useState<number | null>(null)
  const [openFaq,      setOpenFaq]      = useState<number | null>(null)
  const [showAllFaqs,  setShowAllFaqs]  = useState(false)
  const [mousePos,     setMousePos]     = useState({ x: 40, y: 60 })

  // Split headline into two tone lines
  const words = heroHeading.split(" ")
  const half  = Math.ceil(words.length / 2)
  const line1 = words.slice(0, half).join(" ")
  const line2 = words.slice(half).join(" ")

  // Parallax on hero image
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"])

  // Cursor glow
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }, [])

  return (
    <>
      {/* PROMOTIONS BANNER */}
      {promotions && promotions.length > 0 && (
        <PromotionsBanner promotions={promotions} />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          01 · HERO
          Full viewport · background image · Ken Burns · parallax · cursor glow
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      >
          {/* Parallax image wrapper */}
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-[-15%] will-change-transform"
          >
            {/* Ken Burns zoom */}
            <motion.img
              src={heroImage}
              alt="Mechanic working on vehicle"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: 12, ease: "linear" }}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Static dark overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Cursor-following glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, oklch(0.70 0.19 55 / 0.12), transparent 55%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 container py-40 md:py-48">
          <motion.div
            initial="hidden" animate="show" variants={stagger}
            className="max-w-5xl"
          >
            <motion.p
              variants={fadeUp}
              className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-8"
            >
              {heroTagline}
            </motion.p>

            {/* Two-tone headline */}
            <motion.h1 variants={fadeUp} className="leading-[1.0] tracking-tight mb-8">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                {line1}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-accent">
                {line2}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-white/55 max-w-xl leading-relaxed mb-12"
            >
              {heroAnswer}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:gap-4 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {primaryCta}: {phone}
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 border border-white/25 hover:border-white/60 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:gap-4 hover:-translate-y-0.5 active:translate-y-0"
              >
                {secondaryCta} <ArrowRight className="h-4 w-4 flex-shrink-0" />
              </Link>
            </motion.div>

            {/* Trust signal pills */}
            {trustSignals.length > 0 && (
              <motion.div variants={fadeUp} className="flex flex-wrap gap-2 pt-2">
                {trustSignals.map((signal, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 border border-white/10 bg-white/[0.04] backdrop-blur-sm px-3 py-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                    {signal}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2.5"
        >
          <div className="relative w-px h-12 bg-white/15 overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.3 }}
              className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
            />
          </div>
          <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white/25">Scroll</span>
        </motion.div>

        {/* Info strip at bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease }}
          className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10"
        >
          <div className="container flex flex-wrap gap-6 py-4 text-[11px] text-white/45">
            {address && (
              <span className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                {address.street}, {address.suburb} {address.state} {address.postcode}
              </span>
            )}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white/70 transition-colors">
              <Phone className="h-3.5 w-3.5 text-accent flex-shrink-0" />
              {phone}
            </a>
            {hours[0] && (
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                {hours[0].days}: {hours[0].hours}
              </span>
            )}
          </div>
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          TICKER STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="border-t border-border">
        <Ticker items={tickerItems} />
      </div>


      {/* ══════════════════════════════════════════════════════════════════════
          02 · STATS
          Giant full-bleed columns · animated counters · cinematic scale
      ═════════════════════════════════════════════════════════════════════�� */}
      <section className="relative bg-background border-b border-border overflow-hidden">
        <SectionNum n="02" />
        <motion.div
          variants={stagger} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border"
        >
          {statsItems.map((stat, i) => (
            <motion.div
              key={i} variants={fadeUp}
              className="group flex flex-col justify-between p-8 md:p-12 lg:p-16 min-h-[280px] md:min-h-[340px] border-b lg:border-b-0 border-border hover:bg-foreground/[0.025] transition-colors duration-500 cursor-default"
            >
              <div>
                <p className="text-6xl md:text-7xl lg:text-8xl xl:text-[100px] font-bold text-foreground group-hover:text-accent leading-none tracking-tight whitespace-pre-line transition-colors duration-500">
                  {stat.displayValue}
                </p>
                <div className="mt-6 mb-5 w-full h-px bg-border group-hover:bg-accent/30 transition-colors duration-500" />
                <p className="text-[11px] font-bold text-foreground/80 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-6">
                {stat.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          03 · SERVICES
          Premium card grid · expand on click · Framer stagger entrance
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-background overflow-hidden">
        <SectionNum n="03" />
        <div className="container">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          >
            <div>
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-4">
                What We Do
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-foreground">
                {servicesHeading}
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs md:text-right">
                {servicesSubheading}
              </p>
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/70 border border-accent/20 px-3 py-1">
                {serviceItems.length} Services
              </span>
            </div>
          </motion.div>

          {/* Card grid */}
          <motion.div
            variants={stagger} initial="hidden"
            whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-border"
          >
            {serviceItems.slice(0, 8).map((service, i) => {
              const isOpen = openService === i
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative border-r border-b border-border"
                >
                  <button
                    onClick={() => setOpenService(isOpen ? null : i)}
                    className="group w-full text-left cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover background wash */}
                    <div className={`absolute inset-0 bg-accent/[0.03] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

                    {/* Accent bottom line slide-in */}
                    <div className={`absolute bottom-0 left-0 h-[2px] bg-accent transition-all duration-500 ${isOpen ? "w-full" : "w-0 group-hover:w-full"}`} />

                    <div className="relative z-10 p-7 md:p-9">
                      {/* Watermark number */}
                      <span
                        aria-hidden
                        className="absolute top-4 right-5 text-[72px] font-bold leading-none text-foreground/[0.035] select-none pointer-events-none"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Top row: icon + toggle */}
                      <div className="flex items-start justify-between mb-8">
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 flex-shrink-0 ${isOpen ? "bg-accent border-accent" : "border-accent/30 bg-accent/8 group-hover:bg-accent group-hover:border-accent"}`}>
                          <Wrench className={`w-4 h-4 transition-colors duration-300 ${isOpen ? "text-black" : "text-accent group-hover:text-black"}`} />
                        </div>
                        <motion.div
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3, ease }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${isOpen ? "border-accent" : "border-border group-hover:border-accent"}`}
                        >
                          <Plus className="h-3.5 w-3.5 text-accent" />
                        </motion.div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-lg md:text-xl font-bold leading-snug tracking-tight transition-colors duration-300 pr-6 mb-1 ${isOpen ? "text-accent" : "text-foreground group-hover:text-accent"}`}>
                        {service.title}
                      </h3>

                      {/* Collapsed hint */}
                      {!isOpen && (
                        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/40 mt-2">
                          Tap to expand
                        </p>
                      )}

                      {/* Expanded content */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-5 mt-4 border-t border-border/50">
                              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                                {service.description
                                  ? service.description
                                  : `Professional ${service.title.toLowerCase()} for all makes and models. Upfront fixed pricing — no hidden costs, no surprises.`}
                              </p>
                              {service.slug && (
                                <Link
                                  href={`/services/${service.slug}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 text-accent text-xs font-bold tracking-wide hover:gap-3 transition-all duration-300"
                                >
                                  Full Service Details <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-3 text-sm font-bold text-foreground border border-border hover:border-accent hover:text-accent px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              View All {serviceItems.length} Services <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          TICKER STRIP 2
      ══════════════════════════════════════════════════════════════════════ */}
      <Ticker items={tickerItems} reverse />


      {/* ══════════════════════════════════════════════════════════════════════
          04 · WHY CHOOSE US
          60/40 split · orange left-border heading · feature rows · mechanic photo
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-background border-t border-border overflow-hidden">
        <div className="grid lg:grid-cols-[3fr_2fr]">

          {/* Left */}
          <div className="relative py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20">
            <SectionNum n="04" />

            <motion.div
              initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease }}
            >
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">
                Our Promise
              </p>
              {/* Autovera-style orange left-border heading */}
              <div className="border-l-[3px] border-accent pl-6 mb-16">
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-tight text-foreground">
                  {whyUsHeading}
                </h2>
              </div>
            </motion.div>

            {/* Feature rows with border separators */}
            <motion.div
              variants={stagger} initial="hidden"
              whileInView="show" viewport={{ once: true }}
              className="border-t border-border"
            >
              {whyUsPoints.map((point, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="group flex items-start gap-5 py-6 md:py-7 border-b border-border hover:border-accent/40 transition-colors duration-300"
                >
                  {/* Orange circular icon */}
                  <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-full border border-accent/40 bg-accent/8 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                    <svg
                      className="w-3.5 h-3.5 text-accent group-hover:text-black transition-colors duration-300"
                      fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}
                    >
                      <path d="M2.5 7l3.5 3.5 5.5-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {point}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Phone className="h-4 w-4" /> Call {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Get a Free Quote
              </Link>
            </motion.div>
          </div>

          {/* Right — mechanic photo full height */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="relative min-h-[400px] lg:min-h-0"
          >
            <img
              src={mechanicImage}
              alt="Qualified mechanic at All Clutch & Brake Service"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient fade into left edge */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent lg:flex" />
            {/* Badge */}
            <div className="absolute bottom-8 left-8 bg-black/80 backdrop-blur-sm border border-border/60 px-6 py-4">
              <p className="text-accent font-bold text-3xl leading-none">30+</p>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1.5">Years Experience</p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          05 · ABOUT
          Full-width background image · stacked stats left · about card right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <img
          src={workshopImage}
          alt="Workshop"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/82" />

        <div className="relative z-10 grid lg:grid-cols-2">

          {/* Left — Stacked stats */}
          <motion.div
            initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease }}
            className="flex flex-col justify-center py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20 border-b lg:border-b-0 lg:border-r border-white/10"
          >
            {[
              { isNum: true,  num: 30,   suffix: "+", label: "Years in Business"   },
              { isNum: true,  num: 1000, suffix: "s", label: "Vehicles Serviced"   },
              { isNum: true,  num: 100,  suffix: "%", label: "Honest Fixed Pricing" },
            ].map((stat, i) => (
              <div key={i} className="py-10 border-b border-white/10 last:border-0">
                <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none">
                  <Counter to={stat.num!} suffix={stat.suffix} />
                </p>
                <div className="mt-5 mb-4 w-14 h-[2px] bg-accent" />
                <p className="text-white/45 text-[10px] font-bold tracking-[0.3em] uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Right — About text */}
          <motion.div
            initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="flex flex-col justify-center py-24 md:py-32 px-6 md:px-10 lg:px-16 xl:px-20"
          >
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-8">
              Adelaide&apos;s Most Trusted Clutch &amp; Brake Specialists.
            </h2>
            <div className="space-y-4 text-white/55 text-sm leading-relaxed mb-10">
              <p>{inspectionCardBody}</p>
              {aboutDescription && <p>{aboutDescription}</p>}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-colors duration-300"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 border border-white/25 hover:border-white/60 text-white font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                Learn More About Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          06 · FAQ
          Two-column · heading left · animated accordion right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-background">
        <SectionNum n="06" />
        <div className="container">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">
                Got Questions?
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-8">
                Frequently Asked Questions
              </h2>
              <div className="w-14 h-[2px] bg-accent mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Can't find what you're looking for? Call us — we're always happy to answer.
              </p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </motion.div>

            {/* Right — Accordion */}
            <div>
              {/* First 6 — animated via whileInView stagger */}
              <motion.div
                variants={stagger} initial="hidden"
                whileInView="show" viewport={{ once: true }}
                className="border-t border-border"
              >
                {faqs.slice(0, 6).map((faq, i) => (
                  <FaqRow key={i} faq={faq} index={i} openFaq={openFaq} setOpenFaq={setOpenFaq} ease={ease} />
                ))}
              </motion.div>

              {/* Items 7+ — animated directly on mount so whileInView doesn't block them */}
              <AnimatePresence initial={false}>
                {showAllFaqs && (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                  >
                    {faqs.slice(6).map((faq, i) => (
                      <FaqRow key={i + 6} faq={faq} index={i + 6} openFaq={openFaq} setOpenFaq={setOpenFaq} ease={ease} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {faqs.length > 6 && (
                <motion.button
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, ease }}
                  onClick={() => { setShowAllFaqs(!showAllFaqs); if (showAllFaqs) setOpenFaq(null) }}
                  className="mt-8 inline-flex items-center gap-2 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-7 py-3.5 transition-all duration-300"
                >
                  <motion.span
                    animate={{ rotate: showAllFaqs ? 45 : 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </motion.span>
                  {showAllFaqs ? "Show Less" : `Show All ${faqs.length} Questions`}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          07 · TESTIMONIALS
          Customer reviews carousel
      ══════════════════════════════════════════════════════════════════════ */}
      {testimonials && testimonials.length > 0 && (
        <TestimonialsCarousel testimonials={testimonials} />
      )}


      {/* ══════════════════════════════════════════════════════════════════════
          08 · CTA STRIP
          Full-width accent bar · heading left · buttons right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
                {ctaHeading}
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                {ctaBody}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2.5 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-colors duration-300"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300"
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
