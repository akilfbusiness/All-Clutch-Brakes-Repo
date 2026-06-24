"use client"

import { motion } from "framer-motion"

const ease = [0.25, 0.1, 0.25, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stagger = {
  show: { transition: { staggerChildren: 0.12 } },
}

interface ProblemSectionProps {
  phone?: string
}

export function ProblemSection({ phone }: ProblemSectionProps) {
  const painPoints = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      heading: "Ignored, it gets worse",
      body: "A slipping clutch or grinding brake doesn't fix itself. Every kilometre you drive, the damage compounds — and so does the repair bill.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      heading: "Most shops make you wait",
      body: "Book in for next Tuesday. Drop it off Monday. Maybe ready by Friday. Meanwhile you're stranded, borrowing cars, missing work.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
      ),
      heading: "You don't know who to trust",
      body: "Clutch and brake work is specialist. A general mechanic might miss the real cause — and you end up paying twice.",
    },
  ]

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* Top border accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#E63946]/60 to-transparent" />

      <div className="container relative z-10 py-24 md:py-32">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-[#E63946] text-[10px] font-bold tracking-[0.45em] uppercase mb-8"
        >
          Sound familiar?
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.08 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white max-w-4xl text-balance"
        >
          Clutch slipping? Brakes grinding?{" "}
          <br className="hidden md:block" />
          You need it fixed{" "}
          <span className="text-[#E63946]">today</span>
          {" "}— not next week.
        </motion.h2>

        {/* Supporting body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.18 }}
          className="mt-6 text-white/55 text-base md:text-lg leading-relaxed max-w-2xl"
        >
          Most drivers put it off. They hope the noise goes away, or assume every shop has a week-long wait.
          Neither is true — and both cost you more in the end.
        </motion.p>

        {/* Divider */}
        <div className="mt-16 mb-16 w-full h-px bg-white/10" />

        {/* Pain point cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10"
        >
          {painPoints.map((point, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col gap-5 bg-[#0a0a0a] p-8 md:p-10 group"
            >
              <div className="w-10 h-10 flex items-center justify-center text-[#E63946] flex-shrink-0">
                {point.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-3 leading-snug">
                  {point.heading}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {point.body}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Resolution line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="w-8 h-px bg-[#E63946] flex-shrink-0" />
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            All Clutch &amp; Brake diagnoses it free, quotes it upfront, and fixes it{" "}
            <span className="text-white font-semibold">same day</span> — so you drive out like nothing ever happened.
          </p>
        </motion.div>

      </div>

      {/* Bottom border accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
