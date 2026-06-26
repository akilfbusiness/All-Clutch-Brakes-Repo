"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Phone } from "lucide-react"
import { PhoneLink } from "./phone-link"

const ease = [0.16, 1, 0.3, 1] as const
const STEP_DURATION = 5000

const DEFAULT_STEPS = [
  {
    number: "01",
    headline: "Call or Book Online",
    body: "Tell us what you're hearing or feeling. We'll get you in fast — often same day.",
  },
  {
    number: "02",
    headline: "Free Inspection",
    body: "We diagnose the problem at no charge and give you an upfront quote before any work begins.",
  },
  {
    number: "03",
    headline: "You Approve, We Fix",
    body: "Once you're happy with the quote, we fix it same day. You drive out like nothing ever happened.",
  },
]

interface Step {
  number: string
  headline: string
  body: string
}

interface HowItWorksSectionProps {
  phone: string
  eyebrow?: string
  headline?: string
  steps?: Step[]
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
}

export function HowItWorksSection({
  phone,
  eyebrow = "How It Works",
  headline = "Getting Fixed Is Simple",
  steps,
  primaryCtaLabel = "Call Us Today",
  secondaryCtaLabel = "Send Us an Enquiry",
}: HowItWorksSectionProps) {
  const activeSteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(Date.now())
  const reduce = useReducedMotion()

  useEffect(() => {
    // Respect prefers-reduced-motion — pause auto-advance
    if (paused || reduce) return
    startRef.current = Date.now()
    setProgress(0)

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / STEP_DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setActive(prev => (prev + 1) % activeSteps.length)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, paused, reduce, activeSteps.length])

  const handleClick = (i: number) => {
    cancelAnimationFrame(rafRef.current)
    setActive(i)
    setProgress(0)
  }

  return (
    <section className="relative bg-background pt-[58px] pb-20 md:pt-[82px] md:pb-28 overflow-hidden">

      {/* V-chevron divider */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 54" preserveAspectRatio="none" className="w-full h-[40px] md:h-[54px]" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 1440,0 720,54" fill="#0a0a0a" />
          <polyline points="0,0 720,54 1440,0" fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ stroke: "var(--accent)" }} />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 0.5, ease }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-accent/40" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">{eyebrow}</span>
            <div className="h-px w-8 bg-accent/40" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.6, ease }}
          className="mb-16 md:mb-20 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-foreground tracking-tight leading-[1.05] text-balance">
            {headline}
          </h2>
        </motion.div>

        {/* ── Interactive step selector ─────────────────────────────────────── */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >

          {/* ── DESKTOP: columns ───────────────────────────────────────────── */}
          <div className="hidden md:grid md:grid-cols-3 md:gap-x-20 lg:gap-x-32">
            {activeSteps.map((step, i) => {
              const isActive = i === active
              const isCompleted = i < active
              return (
                <button
                  key={step.number}
                  onClick={() => handleClick(i)}
                  className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                >
                  {/* Number + checkmark */}
                  <div className="flex items-center gap-3 mb-5">
                    {/* SEO: scale transform instead of font-size animation — compositor only, no layout recalc */}
                    <div className="relative h-[76px] flex items-center">
                      <span
                        className="font-bold tracking-tight leading-none text-foreground select-none tabular-nums text-[76px]"
                        style={{
                          transform: isActive ? "scale(1)" : "scale(0.45)",
                          opacity: isActive ? 1 : 0.2,
                          transformOrigin: "left center",
                          transition: reduce
                            ? "none"
                            : "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.45s cubic-bezier(0.16,1,0.3,1)",
                          display: "block",
                        }}
                      >
                        {step.number}
                      </span>
                    </div>

                    <motion.div
                      animate={{ opacity: isActive || isCompleted ? 1 : 0.2 }}
                      transition={{ duration: reduce ? 0 : 0.3 }}
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background: isCompleted ? "var(--accent)" : "transparent",
                        border: `1.5px solid ${isCompleted ? "var(--accent)" : "var(--foreground)"}`,
                      }}
                    >
                      {isCompleted && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-[1.5px] mb-6 overflow-hidden bg-border">
                    {isCompleted && <div className="absolute inset-0 bg-accent" />}
                    {isActive && !reduce && (
                      <div
                        className="absolute inset-y-0 left-0 bg-foreground"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                    {isActive && reduce && (
                      <div className="absolute inset-0 bg-foreground" />
                    )}
                  </div>

                  {/* SEO: all content always in DOM — opacity controls visibility */}
                  <div className="min-h-[100px]">
                    {/* Active content */}
                    <div
                      aria-hidden={!isActive}
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: reduce ? "none" : "opacity 0.3s ease",
                        position: isActive ? "relative" : "absolute",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-3 leading-snug">
                        {step.headline}
                      </h3>
                      <p className="text-[15px] text-foreground/60 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                    {/* Inactive title — always visible to crawlers, hidden visually when active */}
                    <p
                      aria-hidden={isActive}
                      className="text-sm font-semibold text-foreground/25 tracking-tight"
                      style={{
                        opacity: isActive ? 0 : 1,
                        transition: reduce ? "none" : "opacity 0.3s ease",
                        position: isActive ? "absolute" : "relative",
                        pointerEvents: "none",
                      }}
                    >
                      {step.headline}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* ── MOBILE: numbers row + full-width content ───────────────────── */}
          <div className="md:hidden">
            <div className="grid grid-cols-3">
              {activeSteps.map((step, i) => {
                const isActive = i === active
                const isCompleted = i < active
                return (
                  <button
                    key={step.number}
                    onClick={() => handleClick(i)}
                    className="text-left focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative h-[42px] flex items-center">
                        <span
                          className="font-bold tracking-tight leading-none text-foreground select-none tabular-nums text-[42px]"
                          style={{
                            transform: isActive ? "scale(1)" : "scale(0.48)",
                            opacity: isActive ? 1 : 0.2,
                            transformOrigin: "left center",
                            transition: reduce
                              ? "none"
                              : "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
                            display: "block",
                          }}
                        >
                          {step.number}
                        </span>
                      </div>

                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          opacity: isActive || isCompleted ? 1 : 0.2,
                          background: isCompleted ? "var(--accent)" : "transparent",
                          border: `1.5px solid ${isCompleted ? "var(--accent)" : "var(--foreground)"}`,
                          transition: reduce ? "none" : "opacity 0.3s ease",
                        }}
                      >
                        {isCompleted && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-[1.5px] overflow-hidden bg-border">
                      {isCompleted && <div className="absolute inset-0 bg-accent" />}
                      {isActive && !reduce && (
                        <div className="absolute inset-y-0 left-0 bg-foreground" style={{ width: `${progress}%` }} />
                      )}
                      {isActive && reduce && (
                        <div className="absolute inset-0 bg-foreground" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* SEO: all step content in DOM always, active one shown */}
            <div className="mt-8 relative min-h-[100px]">
              {activeSteps.map((step, i) => (
                <div
                  key={step.number}
                  aria-hidden={i !== active}
                  style={{
                    opacity: i === active ? 1 : 0,
                    transition: reduce ? "none" : "opacity 0.3s ease",
                    position: i === active ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    pointerEvents: i === active ? "auto" : "none",
                  }}
                >
                  <h3 className="text-2xl font-bold text-foreground tracking-tight mb-3 leading-snug">
                    {step.headline}
                  </h3>
                  <p className="text-[15px] text-foreground/60 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduce ? 0 : 0.6, ease, delay: reduce ? 0 : 0.3 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-16 md:mt-20 pt-10 border-t border-border"
        >
          <PhoneLink
            phone={phone}
            label="how-it-works-cta"
            className="inline-flex items-center justify-center gap-2.5 bg-[#E63946] hover:bg-[#c8303c] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors duration-200 active:scale-[0.98]"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {primaryCtaLabel}: {phone}
          </PhoneLink>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.98]"
          >
            {secondaryCtaLabel}
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
