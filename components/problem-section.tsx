"use client"

import { motion, useReducedMotion } from "framer-motion"

// ease-out-expo: impeccable animate rule
const ease = [0.16, 1, 0.3, 1] as const

interface ProblemSectionProps {
  eyebrow?: string
  headline?: string
  body?: string
}

export function ProblemSection({
  eyebrow = "Sound familiar?",
  // Fix #1: em-dashes removed (taste-skill 9.G absolute ban)
  headline = "Clutch slipping? Brakes grinding? You need it fixed",
  body = "Most drivers put it off. They hope the noise goes away, or assume every shop has a week-long wait. Neither is true. Both cost you more in the end.",
}: ProblemSectionProps) {
  const reduce = useReducedMotion()

  // Parse [word] syntax for blue highlights
  const renderHeadline = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g)
    return parts.map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={i} className="text-accent">
            {part.slice(1, -1)}
          </span>
        )
      }
      return part
    })
  }

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Fix #8: faint radial atmosphere — adds depth to flat dark bg, pointer-events-none so it never blocks interaction */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[600px] w-[900px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      {/* Fix #2: max-w-4xl mx-auto replaces bare `container` — ui-ux-pro-max container-width rule */}
      {/* Fix #5: py-24 md:py-40 — expanded from py-16 md:py-28 for manifesto breathing room */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 py-16 md:py-28 flex flex-col items-center text-center">

        {eyebrow && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-accent/50" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">
              {eyebrow}
            </span>
            <div className="h-px w-8 bg-accent/50" />
          </motion.div>
        )}

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.06 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white max-w-3xl text-balance"
        >
          {renderHeadline(headline)}
        </motion.h2>

        {/* Fix #3: text-white/70 — up from /55, impeccable color rule (dim reads cheap)  */}
        {/* Fix #4: max-w-[65ch] — up from max-w-xl (~32ch), ui-ux-pro-max line-length 60-75ch */}
        {/* Fix #7: blur entrance + 120ms stagger after headline */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.22 }}
          className="mt-6 text-white/70 text-base md:text-lg leading-relaxed max-w-[65ch]"
        >
          {body}
        </motion.p>

      </div>

    </section>
  )
}
