"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, MapPin, ChevronRight, ArrowRight, Plus } from "lucide-react"

interface Region { title: string; slug: string; answerCapsule?: string | null }
interface Suburb { title: string; slug: string }
interface FaqItem { question: string; answer: string }

export interface LocationsPageClientProps {
  businessName: string
  phone: string
  pageTitle: string
  pageSubtitle: string
  displayRegions: Region[]
  suburbs: Suburb[]
  faqs: FaqItem[]
}

const ease = [0.22, 1, 0.36, 1] as const
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }

export function LocationsPageClient({ businessName, phone, pageTitle, pageSubtitle, displayRegions, suburbs, faqs }: LocationsPageClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap">
          Locations
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Service Areas</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Where We Work</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8">{pageTitle}</h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">{pageSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                Get a Quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGIONS GRID */}
      <section className="py-20 md:py-28 bg-background border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between mb-14">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Service Regions</h2>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/70 border border-accent/20 px-3 py-1">
              {displayRegions.length} Regions
            </span>
          </div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
            {displayRegions.map((region, i) => (
              <motion.article key={region.slug} variants={fadeUp}
                className="group relative border-r border-b border-border overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 p-7 md:p-9">
                  <span aria-hidden className="absolute top-4 right-5 text-[64px] font-bold leading-none text-foreground/[0.06] select-none pointer-events-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-full border border-accent/30 bg-accent/8 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                    <MapPin className="h-4 w-4 text-accent group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight mb-3">
                    <Link href={`/locations/${region.slug}`} className="before:absolute before:inset-0">
                      {region.title}
                    </Link>
                  </h3>
                  {region.answerCapsule && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{region.answerCapsule}</p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-3 transition-all duration-300">
                    View Services <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SUBURBS */}
      {suburbs.length > 0 && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">Key Service Areas</h2>
            <div className="flex flex-wrap gap-3">
              {suburbs.map((suburb) => (
                <Link key={suburb.slug} href={`/locations/${suburb.slug}`}
                  className="group inline-flex items-center gap-2 border border-border hover:border-accent text-muted-foreground hover:text-accent font-bold text-sm px-4 py-2.5 transition-all duration-300">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {suburb.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="relative py-24 md:py-32 bg-background border-b border-border">
          <span aria-hidden className="absolute top-6 right-6 md:right-10 text-[100px] md:text-[160px] font-bold leading-none text-foreground/[0.03] select-none pointer-events-none">FAQ</span>
          <div className="container">
            <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Got Questions?</p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-8">Common Questions</h2>
                <div className="w-14 h-[2px] bg-accent mb-6" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">Can&apos;t find the answer? Call us.</p>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </div>
              <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="border-t border-border">
                {faqs.map((faq, i) => (
                  <motion.div key={i} variants={fadeUp} className="border-b border-border">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="group w-full flex items-center justify-between py-7 text-left cursor-pointer">
                      <span className="font-bold text-foreground text-sm md:text-base pr-8 group-hover:text-accent transition-colors duration-300">{faq.question}</span>
                      <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.25, ease }}
                        className="flex-shrink-0 w-8 h-8 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors duration-300">
                        <Plus className="h-3.5 w-3.5 text-accent" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: "easeInOut" }} className="overflow-hidden">
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

      {/* CTA */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">Not Sure If We Service Your Area?</h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">Contact us and we&apos;ll confirm coverage in your location.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
