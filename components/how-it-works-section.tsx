"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Phone } from "lucide-react"
import { PhoneLink } from "./phone-link"

const ease = [0.25, 0.1, 0.25, 1]

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
  headline?: string
  steps?: Step[]
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
}

export function HowItWorksSection({
  phone,
  headline = "Getting Fixed Is Simple",
  steps,
  primaryCtaLabel = "Call Us Today",
  secondaryCtaLabel = "Send Us an Enquiry",
}: HowItWorksSectionProps) {
  const activeSteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container px-4 mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2A6DD9] mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight text-balance">
            {headline}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 mb-12 md:mb-16">
          {activeSteps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center px-4 py-8 md:py-0"
            >
              {i < activeSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] right-[-calc(50%-2.5rem)] h-px bg-gray-200 z-0" />
              )}

              <div className="relative z-10 w-16 h-16 rounded-full bg-[#2A6DD9]/10 flex items-center justify-center mb-5">
                <span className="text-xl font-black text-[#2A6DD9] tabular-nums">{step.number}</span>
              </div>

              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {step.headline}
              </h3>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-xs">
                {step.body}
              </p>

              {i < activeSteps.length - 1 && (
                <div className="md:hidden mt-8 w-px h-8 bg-gray-200 mx-auto" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <PhoneLink
            phone={phone}
            label="how-it-works-cta"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#c8303c] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {primaryCtaLabel}: {phone}
          </PhoneLink>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
          >
            {secondaryCtaLabel}
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
