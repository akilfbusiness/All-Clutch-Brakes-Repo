"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, ArrowRight, ChevronRight, Check, MapPin, Award, Shield } from "lucide-react"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface AboutPageClientProps {
  businessName: string
  phone: string
  aboutHeading?: string
  aboutAnswerCapsule?: string
  aboutMissionHeading?: string
  aboutMissionBody?: string
  whoWeAreHeading?: string
  whoWeAreBody: string[]
  displayValues: { title: string; description: string }[]
  abn?: string
  registrationId?: string
  address?: { street?: string; suburb?: string; state?: string; postcode?: string } | null
  areaServed: string[]
  ctaHeading: string
  ctaBody: string
  ctaPrimaryLabel: string
  ctaSecondaryLabel: string
}

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function AboutPageClient({
  businessName, phone,
  aboutHeading, aboutAnswerCapsule,
  aboutMissionHeading, aboutMissionBody,
  whoWeAreHeading, whoWeAreBody,
  displayValues,
  abn, registrationId, address, areaServed,
  ctaHeading, ctaBody, ctaPrimaryLabel, ctaSecondaryLabel,
}: AboutPageClientProps) {

  const credentials = [
    ...(abn            ? [{ icon: Award,   label: "ABN",          value: abn }]              : []),
    ...(registrationId ? [{ icon: Shield,  label: "Registration", value: registrationId }]   : []),
    ...(address        ? [{ icon: MapPin,  label: "Location",     value: `${address.suburb}, ${address.state}` }] : []),
    ...(areaServed.length ? [{ icon: MapPin, label: "Service Area", value: areaServed[0] }]  : []),
  ]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span
          aria-hidden
          className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-black leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap"
        >
          About Us
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
              <li className="text-accent">About</li>
            </ol>
          </motion.nav>

          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
            <motion.p variants={fadeUp} className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              Our Story
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] text-foreground mb-8"
            >
              {aboutHeading ?? `About ${businessName}`}
            </motion.h1>
            {aboutAnswerCapsule && (
              <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                {aboutAnswerCapsule}
              </motion.p>
            )}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                View Our Services <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          MISSION
      ══════════════════════════════════════════════════════════════════════ */}
      {(aboutMissionHeading || aboutMissionBody) && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease }}
              className="max-w-3xl"
            >
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Our Mission</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-tight mb-8">
                {aboutMissionHeading ?? "Our Mission"}
              </h2>
              <div className="w-14 h-[2px] bg-accent mb-8" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                {aboutMissionBody}
              </p>
            </motion.div>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════════════════════════════
          WHO WE ARE
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-background border-b border-border">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease }}
            >
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">
                Who We Are
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight mb-8">
                {whoWeAreHeading ?? `Adelaide's Trusted Clutch &amp; Brake Specialists`}
              </h2>
              <div className="w-14 h-[2px] bg-accent mb-8" />
              <div className="space-y-5">
                {whoWeAreBody.length > 0 ? (
                  whoWeAreBody.map((para, i) => (
                    <p key={i} className="text-muted-foreground text-sm md:text-base leading-relaxed">{para}</p>
                  ))
                ) : (
                  <>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      {businessName} is a family-owned workshop specialising exclusively in clutch, brake, and transmission repairs. Based in Adelaide, we&apos;ve built our reputation on expert workmanship and honest service.
                    </p>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                      Our team of qualified mechanics brings decades of combined experience, ensuring your vehicle receives the specialist attention it deserves. We work on all makes and models, from everyday sedans to commercial vehicles.
                    </p>
                  </>
                )}
              </div>
              <div className="mt-10">
                <Link
                  href="/meet-our"
                  className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300"
                >
                  Meet Our Team <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Right — Values */}
            <motion.div
              variants={stagger} initial="hidden"
              whileInView="show" viewport={{ once: true }}
            >
              {displayValues.map((value, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="group flex items-start gap-5 py-6 border-b border-border last:border-0 hover:border-accent/30 transition-colors duration-300"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mt-0.5 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                    <Check className="h-3.5 w-3.5 text-accent group-hover:text-black transition-colors duration-300" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-foreground tracking-tight mb-1.5 group-hover:text-accent transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CREDENTIALS
      ══════════════════════════════════════════════════════════════════════ */}
      {credentials.length > 0 && (
        <section className="bg-background border-b border-border">
          <div className="container">
            <div className={`grid grid-cols-2 md:grid-cols-${Math.min(credentials.length, 4)} divide-x divide-border`}>
              {credentials.map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5, ease }}
                  className="group px-6 py-8 md:px-10 md:py-12 hover:bg-foreground/[0.025] transition-colors duration-500 cursor-default"
                >
                  <div className="w-8 h-8 rounded-full border border-accent/30 bg-accent/8 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                    <Icon className="h-3.5 w-3.5 text-accent group-hover:text-black transition-colors duration-300" />
                  </div>
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/50 mb-1.5">{label}</p>
                  <p className="text-base font-black text-foreground">{value}</p>
                </motion.div>
              ))}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                {ctaHeading}
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">{ctaBody}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                {ctaPrimaryLabel}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                {ctaSecondaryLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
