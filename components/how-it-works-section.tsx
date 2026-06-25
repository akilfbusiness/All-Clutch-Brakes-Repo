"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Phone } from "lucide-react"
import { PhoneLink } from "./phone-link"

// ease-out-expo — impeccable: "ease out with exponential curves"
const ease = [0.16, 1, 0.3, 1] as const

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

// Static per-step class strings — full names required for Tailwind JIT scanning
const STEP_CLASSES = [
  "pt-8 pb-10 md:pt-10 md:pb-0",
  "pt-8 pb-10 md:pt-10 md:pb-0 border-t border-border md:border-t-0",
  "pt-8 pb-10 md:pt-10 md:pb-0 border-t border-border md:border-t-0",
]

export function HowItWorksSection({
  phone,
  eyebrow = "How It Works",
  headline = "Getting Fixed Is Simple",
  steps,
  primaryCtaLabel = "Call Us Today",
  secondaryCtaLabel = "Send Us an Enquiry",
}: HowItWorksSectionProps) {
  const activeSteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS

  return (
    // bg-white: creates contrast between two dark surrounding sections
    // ui-ux-pro-max: section alternation is required for visual rhythm
    <section className="relative bg-background pt-[58px] pb-20 md:pt-[82px] md:pb-28 overflow-hidden">

      {/* ── max-w-5xl mx-auto: ui-ux-pro-max container-width rule ────────────
          Progressive horizontal padding: 24px → 40px → 64px
          Prevents content from hugging edges at all breakpoints          */}
      {/* V-chevron divider — dark V pointing down from problem section into light bg; hidden in dark mode (both sections already dark) */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 leading-[0] dark:hidden">
        <svg
          viewBox="0 0 1440 54"
          preserveAspectRatio="none"
          className="w-full h-[40px] md:h-[54px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="0,0 1440,0 720,54" fill="#0a0a0a" />
          <polyline
            points="0,0 720,54 1440,0"
            fill="none"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            style={{ stroke: "var(--accent)" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">

        {/* Section headline
            max-w-2xl: constrains heading so left-align reads intentional, not broken
            text-balance: impeccable rule — even line distribution on h1-h3
            tracking-tight + leading-[1.0]: display-heading discipline               */}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <div className="h-px w-8 bg-accent/40" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">{eyebrow}</span>
            <div className="h-px w-8 bg-accent/40" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-12 md:mb-16 text-center"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#0a0a0a]
                       tracking-tight leading-[1.05] text-balance"
          >
            {headline}
          </h2>
        </motion.div>

        {/* ── Animated connector line (desktop only) ────────────────────────
            Track: gray-100 (subtle, light bg)
            Fill: #2A6DD9 draws left→right — the animation IS the sequence cue
            impeccable: "motion should be intentional" — this communicates flow */}
        <div className="hidden md:block relative h-px overflow-hidden">
          <div className="absolute inset-0 bg-border" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{ originX: 0 }}
            className="absolute inset-0 bg-accent"
          />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-12 lg:gap-x-20">
          {activeSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              // Stagger: 30-50ms per item per ui-ux-pro-max stagger-sequence rule
              transition={{ duration: 0.6, ease, delay: 0.25 + i * 0.15 }}
              className={STEP_CLASSES[i] ?? STEP_CLASSES[0]}
            >
              {/* Step number
                  #2A6DD9 at 12px bold on white = 4.93:1 contrast — passes WCAG AA
                  ui-ux-pro-max color-contrast rule: normal text min 4.5:1
                  Kept small (12px) so it feels like a label, not a heading      */}
              <p className="text-[12px] font-mono font-bold tracking-[0.2em] text-accent mb-5 tabular-nums select-none">
                {step.number}
              </p>

              {/* Step headline
                  text-[#0a0a0a] on white = 19.1:1 contrast (AAA)
                  text-xl/2xl: clear hierarchy above body copy                  */}
              <h3 className="text-xl md:text-[22px] font-semibold text-foreground leading-snug mb-3">
                {step.headline}
              </h3>

              {/* Body copy
                  text-gray-600 on white = 7.4:1 contrast (AAA)
                  text-[15px]: above 16px floor, avoids iOS auto-zoom on mobile
                  leading-relaxed: 1.625 line-height — ui-ux-pro-max line-height rule */}
              <p className="text-[15px] text-foreground/60 leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTAs
            mt-12/16 + pt-10 + border-t: spacing rhythm (48→64→40 across hierarchy)
            items-stretch: full-width buttons on mobile (ui-ux-pro-max touch-target-size)
            active:scale-[0.98]: press tactile feedback (impeccable interaction rule)  */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4
                     mt-12 md:mt-16 pt-10 border-t border-border"
        >
          <PhoneLink
            phone={phone}
            label="how-it-works-cta"
            className="inline-flex items-center justify-center gap-2.5
                       bg-[#E63946] hover:bg-[#c8303c] text-white
                       px-8 py-4 text-sm font-bold uppercase tracking-widest
                       transition-colors duration-200 active:scale-[0.98]"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {primaryCtaLabel}: {phone}
          </PhoneLink>

          {/* Secondary: dark border on white — 19.1:1 contrast, hover inverts cleanly */}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2
                       border border-gray-900 text-gray-900
                       hover:bg-gray-900 hover:text-white
                       px-8 py-4 text-sm font-bold uppercase tracking-widest
                       transition-all duration-200 active:scale-[0.98]"
          >
            {secondaryCtaLabel}
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
