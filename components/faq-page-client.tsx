"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, Plus, ChevronRight, ArrowRight } from "lucide-react"

export interface FaqCategory {
  category: string
  items: { question: string; answer: string }[]
}

export interface FaqPageClientProps {
  businessName: string
  phone: string
  faqCategories: FaqCategory[]
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

export function FaqPageClient({ businessName, phone, faqCategories }: FaqPageClientProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)

  function toggle(key: string) {
    setOpenKey(openKey === key ? null : key)
  }

  return (
    <>
      {/* HERO */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap">
          FAQ
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">FAQ</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Got Questions?</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8">
              Frequently Asked Questions
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              Answers to the most common questions about clutch, brake, and transmission repairs. Can&apos;t find what you need? Call us directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                Send an Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CATEGORIES */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-[2fr_3fr] gap-16 lg:gap-24">

            {/* Left sticky nav */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Categories</p>
              <nav className="space-y-2 mb-10">
                {faqCategories.map((cat) => (
                  <a
                    key={cat.category}
                    href={`#${cat.category.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center justify-between py-3 border-b border-border text-sm font-bold text-muted-foreground hover:text-accent transition-colors duration-200 group"
                  >
                    {cat.category}
                    <span className="text-[10px] font-bold tracking-[0.2em] text-accent/50 group-hover:text-accent transition-colors">
                      {cat.items.length}
                    </span>
                  </a>
                ))}
              </nav>
              <div className="w-14 h-[2px] bg-accent mb-6" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Still have questions? Call us — we&apos;re always happy to help.
              </p>
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-accent text-sm font-bold hover:gap-3 transition-all duration-300">
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>

            {/* Right accordions */}
            <div className="space-y-16">
              {faqCategories.map((cat) => (
                <div key={cat.category} id={cat.category.toLowerCase().replace(/\s+/g, "-")}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
                      {cat.category}
                    </h2>
                    <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent/60 border border-accent/20 px-2.5 py-1">
                      {cat.items.length} Q&amp;As
                    </span>
                  </div>

                  <motion.div
                    variants={stagger} initial="hidden"
                    whileInView="show" viewport={{ once: true }}
                    className="border-t border-border"
                  >
                    {cat.items.map((faq, i) => {
                      const key = `${cat.category}-${i}`
                      const isOpen = openKey === key
                      return (
                        <motion.div key={i} variants={fadeUp} className="border-b border-border">
                          <button
                            onClick={() => toggle(key)}
                            className="group w-full flex items-center justify-between py-6 text-left cursor-pointer"
                          >
                            <span className="font-bold text-foreground text-sm md:text-base pr-8 group-hover:text-accent transition-colors duration-300">
                              {faq.question}
                            </span>
                            <motion.span
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              transition={{ duration: 0.25, ease }}
                              className="flex-shrink-0 w-8 h-8 rounded-full border border-border group-hover:border-accent flex items-center justify-center transition-colors duration-300"
                            >
                              <Plus className="h-3.5 w-3.5 text-accent" />
                            </motion.span>
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.32, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <p className="text-muted-foreground text-sm leading-relaxed pb-6">{faq.answer}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
                Still Have a Question?
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                Call us directly or send an enquiry — we&apos;re always happy to help.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
