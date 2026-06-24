"use client"

import { motion } from "framer-motion"

const ease = [0.25, 0.1, 0.25, 1]

export function ProblemSection() {
  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden">
      {/* Top border accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="container relative z-10 py-16 md:py-28 px-6 md:px-8 flex flex-col items-center text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
          className="text-[#2A6DD9] text-[10px] font-bold tracking-[0.45em] uppercase mb-6"
        >
          Sound familiar?
        </motion.p>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.08 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white max-w-3xl text-balance"
        >
          Clutch slipping? Brakes grinding?{" "}
          You need it fixed{" "}
          <span className="text-[#2A6DD9]">today</span>
          {" "}— not next week.
        </motion.h2>

        {/* Supporting body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.18 }}
          className="mt-5 text-white/55 text-base md:text-lg leading-relaxed max-w-xl"
        >
          Most drivers put it off. They hope the noise goes away, or assume every shop
          has a week-long wait. Neither is true — and both cost you more in the end.
        </motion.p>

      </div>

      {/* Bottom border accent */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  )
}
