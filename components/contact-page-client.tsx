"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Mail, MapPin, Clock, ArrowRight, Plus, ChevronRight } from "lucide-react"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ContactPageClientProps {
  businessName: string
  phones: string[]
  email: string
  address?: { street: string; suburb: string; state: string; postcode: string } | null
  businessHours: { days: string; hours: string }[]
  contactInfoHeading: string
  formHeading: string
  formSubheading: string
  privacyNote: string
  serviceOptions: string[]
  googleMapsEmbedUrl?: string
  faqs: { question: string; answer: string }[]
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

export function ContactPageClient({
  businessName, phones, email, address, businessHours,
  contactInfoHeading, formHeading, formSubheading, privacyNote,
  serviceOptions, googleMapsEmbedUrl, faqs,
}: ContactPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const phone = phones[0] ?? "(08) 8277 8122"

  const contactRows = [
    {
      icon: Phone,
      label: "Phone",
      content: phones.map((p, i) => (
        <a
          key={i}
          href={`tel:${p.replace(/\s/g, "")}`}
          className="block text-base font-bold text-accent hover:text-accent/80 transition-colors duration-200"
        >
          {p}
        </a>
      )),
    },
    {
      icon: Mail,
      label: "Email",
      content: (
        <a
          href={`mailto:${email}`}
          className="block text-base text-muted-foreground hover:text-accent transition-colors duration-200 break-all"
        >
          {email}
        </a>
      ),
    },
    ...(address
      ? [
          {
            icon: MapPin,
            label: "Address",
            content: (
              <p className="text-base text-muted-foreground">
                {address.street}
                <br />
                {address.suburb} {address.state} {address.postcode}
              </p>
            ),
          },
        ]
      : []),
  ]

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
          Contact
        </span>

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Breadcrumb" className="mb-10"
          >
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Contact</li>
            </ol>
          </motion.nav>

          <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-4xl">
            <motion.p variants={fadeUp} className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              Get in Touch
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8"
            >
              Contact {businessName}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              Expert clutch, brake and transmission repairs in Adelaide. Call us directly or send an enquiry below.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Mail className="h-4 w-4 flex-shrink-0" /> Email Us <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT INFO + FORM
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2">

            {/* ── LEFT: Contact details ─────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease }}
            >
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Contact Details</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">
                {contactInfoHeading}
              </h2>

              {/* Contact rows */}
              <div className="border-t border-border mb-10">
                {contactRows.map(({ icon: Icon, label, content }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease }}
                    className="group flex items-start gap-5 py-6 border-b border-border hover:border-accent/30 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-accent/30 bg-accent/8 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 mt-0.5">
                      <Icon className="h-4 w-4 text-accent group-hover:text-black transition-colors duration-300" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/50 mb-1.5">{label}</p>
                      {content}
                    </div>
                  </motion.div>
                ))}

                {/* Business hours row */}
                {businessHours.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: contactRows.length * 0.1, duration: 0.5, ease }}
                    className="group flex items-start gap-5 py-6 border-b border-border"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-accent/30 bg-accent/8 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-300 mt-0.5">
                      <Clock className="h-4 w-4 text-accent group-hover:text-black transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted-foreground/50 mb-3">Opening Hours</p>
                      <dl className="space-y-2">
                        {businessHours.map((h, i) => (
                          <div key={i} className="flex justify-between items-baseline gap-4">
                            <dt className="text-sm text-muted-foreground font-medium">{h.days}</dt>
                            <dd className="text-sm text-foreground font-bold shrink-0">{h.hours}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Google Maps */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.2 }}
              >
                {googleMapsEmbedUrl ? (
                  <div className="border border-border overflow-hidden">
                    <iframe
                      src={googleMapsEmbedUrl}
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${businessName} location map`}
                    />
                  </div>
                ) : (
                  <div className="border border-border border-dashed p-10 flex flex-col items-center justify-center min-h-[200px] text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground/30 mb-3" />
                    <p className="text-xs text-muted-foreground/50 leading-relaxed max-w-[220px]">
                      Add a Google Maps Embed URL in Sanity Studio → Site Settings → Contact
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* ── RIGHT: Enquiry form ────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease, delay: 0.1 }}
            >
              <div className="border border-border p-8 md:p-10 relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

                <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-4">Free Quote</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">{formHeading}</h2>
                {formSubheading && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">{formSubheading}</p>
                )}
                {!formSubheading && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    Have a question or need to book your vehicle? Fill out the form and our team will get back to you as soon as possible.
                  </p>
                )}

                <form className="space-y-5" aria-label="Contact enquiry form">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="name" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                      Full Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="name" name="name" type="text" autoComplete="name" required
                      placeholder="Your full name"
                      className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
                    />
                  </div>

                  {/* Phone + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                        Phone <span className="text-accent">*</span>
                      </label>
                      <input
                        id="contact-phone" name="phone" type="tel" autoComplete="tel" required
                        placeholder="Your phone number"
                        className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                        Email <span className="text-accent">*</span>
                      </label>
                      <input
                        id="contact-email" name="email" type="email" autoComplete="email" required
                        placeholder="Your email address"
                        className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  {/* Suburb */}
                  <div>
                    <label htmlFor="suburb" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                      Suburb / Location
                    </label>
                    <input
                      id="suburb" name="suburb" type="text" autoComplete="address-level2"
                      placeholder="Your suburb or town"
                      className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200"
                    />
                  </div>

                  {/* Service select */}
                  <div>
                    <label htmlFor="service-type" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service-type" name="service"
                      className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground transition-colors duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">Select a service</option>
                      {serviceOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/70 mb-2">
                      Message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message" name="message" rows={5} required
                      placeholder="Tell us about your vehicle and what you need help with"
                      className="w-full bg-background border border-border focus:border-accent outline-none px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/35 transition-colors duration-200 resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-black font-bold text-sm py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Send Enquiry
                  </button>

                  <p className="text-[11px] text-muted-foreground/50 text-center leading-relaxed">
                    By submitting you agree to our{" "}
                    <Link href="/privacy-policy" className="text-accent/70 hover:text-accent transition-colors">
                      Privacy Policy
                    </Link>
                    . {privacyNote}
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
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
                  Can't find the answer? Just call us — we're always happy to chat.
                </p>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300"
                >
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </motion.div>

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
    </>
  )
}
