"use client"

import { motion } from "framer-motion"
import { PhoneLink } from "./phone-link"
import { Phone } from "lucide-react"

const ease = [0.25, 0.1, 0.25, 1]

interface RiskReversalSectionProps {
  phone: string
  eyebrow?: string
  headline?: string
  body?: string
  ctaLabel?: string
}

export function RiskReversalSection({
  phone,
  eyebrow = "Our Guarantee",
  headline = "Not Happy? We'll Make It Right. No Arguments.",
  body = "We quote before we start and we only proceed with your approval. If something isn't right after the job, call us and we fix it — that's the deal.",
  ctaLabel = "Call Us Today",
}: RiskReversalSectionProps) {
  return (
    <section className="bg-[#0a0a0a] py-20 md:py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-[#2A6DD9] text-[10px] font-bold tracking-[0.45em] uppercase mb-6"
        >
          {eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          {headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
        >
          <PhoneLink
            phone={phone}
            label="risk-reversal-cta"
            className="inline-flex items-center justify-center gap-2.5 bg-[#E63946] hover:bg-[#c8303c] text-white font-bold text-sm px-8 py-4 transition-colors w-full sm:w-auto"
          >
            <Phone className="h-4 w-4" />
            {ctaLabel}: {phone}
          </PhoneLink>
        </motion.div>

      </div>
    </section>
  )
}
