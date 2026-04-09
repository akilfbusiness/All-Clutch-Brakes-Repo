"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ArrowRight, Check, Plus, ChevronRight, ArrowUpRight } from "lucide-react"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface ProductPageSection {
  heading?: string
  content?: string
}

export interface ProductPageGalleryImage {
  asset?: string
  caption?: string
}

export interface ProductPageClientProps {
  businessName: string
  phone: string
  product: {
    _id: string
    title: string
    slug?: string
    heading?: string
    introText?: string
    galleryImages?: ProductPageGalleryImage[]
    detailedDescription?: string
    sections?: ProductPageSection[]
    specifications?: string[]
    ctaHeading?: string
    ctaText?: string
    ctaButtonLabel?: string
    ctaButtonLink?: string
  }
}

// ─── ANIMATION PRESETS ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function ProductPageClient({ businessName, phone, product }: ProductPageClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const images = product.galleryImages?.filter((img) => !!img.asset) ?? []
  const heading = product.heading ?? product.title

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-0 md:pt-48 bg-background overflow-hidden border-b border-border">
        {/* Giant watermark */}
        <span
          aria-hidden
          className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap"
        >
          {product.title}
        </span>

        <div className="container relative z-10 pb-16 md:pb-24">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            aria-label="Breadcrumb" className="mb-10"
          >
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent truncate max-w-[200px]">{product.title}</li>
            </ol>
          </motion.nav>

          <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-20 items-end">
            {/* Left: heading + intro */}
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.p variants={fadeUp} className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
                Products &amp; Parts
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-6"
              >
                {heading}
              </motion.h1>
              {product.introText && (
                <motion.p variants={fadeUp} className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
                  {product.introText}
                </motion.p>
              )}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: stat pills */}
            {product.specifications && product.specifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.3 }}
                className="hidden lg:block"
              >
                <div className="border border-border p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/50 mb-4">Key Specifications</p>
                  <ul className="space-y-3">
                    {product.specifications.slice(0, 5).map((spec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                  {product.specifications.length > 5 && (
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/35 mt-4">
                      +{product.specifications.length - 5} more below
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      {images.length > 0 && (
        <section className="py-20 md:py-28 bg-background border-b border-border">
          <div className="container">
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, ease }}
              className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-8"
            >
              Gallery
            </motion.p>

            {/* Main image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.7, ease }}
              className="relative overflow-hidden mb-4 border border-border"
              style={{ aspectRatio: "16/7" }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeImage].asset!}
                    alt={images[activeImage].caption ?? `${product.title} — image ${activeImage + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 90vw"
                    priority={activeImage === 0}
                  />
                  {images[activeImage].caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-3">
                      <p className="text-xs text-white/70">{images[activeImage].caption}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Image counter */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 text-[10px] font-bold tracking-[0.2em] text-white/70">
                {String(activeImage + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </div>
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-shrink-0 w-20 h-14 overflow-hidden border-2 transition-all duration-300 ${
                      i === activeImage ? "border-accent" : "border-border hover:border-accent/50"
                    }`}
                  >
                    <Image
                      src={img.asset!}
                      alt={img.caption ?? `Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {i === activeImage && (
                      <div className="absolute inset-0 bg-accent/10" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT (description + sections + specs)
      ══════════════════════════════════════════════════════════════════════ */}
      {(product.detailedDescription || (product.sections && product.sections.length > 0) || (product.specifications && product.specifications.length > 0)) && (
        <section className="py-20 md:py-28 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-16 lg:gap-24 items-start">

              {/* ── LEFT: Description + Sections ─────────────────────────── */}
              <div>
                {product.detailedDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                    className="mb-14"
                  >
                    <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-6">Overview</p>
                    <div className="border-l-[3px] border-accent pl-6">
                      <p className="text-foreground text-base md:text-lg leading-relaxed whitespace-pre-line">
                        {product.detailedDescription}
                      </p>
                    </div>
                  </motion.div>
                )}

                {product.sections && product.sections.length > 0 && (
                  <motion.div
                    variants={stagger} initial="hidden"
                    whileInView="show" viewport={{ once: true }}
                    className="space-y-10"
                  >
                    {product.sections.map((section, i) => (
                      <motion.div key={i} variants={fadeUp} className="border-t border-border pt-10 first:border-t-0 first:pt-0">
                        {section.heading && (
                          <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight mb-4">
                            {section.heading}
                          </h2>
                        )}
                        {section.content && (
                          <p className="text-muted-foreground text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {section.content}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* ── RIGHT: Specs sidebar ──────────────────────────────────── */}
              {product.specifications && product.specifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.15 }}
                  className="lg:sticky lg:top-32 lg:self-start"
                >
                  <div className="border border-border relative overflow-hidden">
                    {/* Accent corner decoration */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
                    <div className="absolute top-0 right-0 w-16 h-16 bg-accent/[0.04]" />

                    <div className="p-7">
                      <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted-foreground/50 mb-1">
                        Specifications
                      </p>
                      <h3 className="text-xl font-bold text-foreground tracking-tight mb-7">
                        What's Included
                      </h3>

                      <ul className="space-y-0 border-t border-border">
                        {product.specifications.map((spec, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 py-4 border-b border-border group"
                          >
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mt-0.5 group-hover:bg-accent group-hover:border-accent transition-all duration-300">
                              <Check className="h-3 w-3 text-accent group-hover:text-black transition-colors duration-300" />
                            </span>
                            <span className="text-sm text-muted-foreground leading-relaxed">{spec}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-7 space-y-3">
                        <a
                          href={`tel:${phone.replace(/\s/g, "")}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm py-3.5 transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <Phone className="h-4 w-4" /> Call {phone}
                        </a>
                        <Link
                          href="/contact"
                          className="w-full inline-flex items-center justify-center gap-2 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm py-3.5 transition-all duration-300"
                        >
                          Enquire Online <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent-foreground tracking-tight leading-tight">
                {product.ctaHeading ?? "Interested? Get in Touch"}
              </h2>
              {product.ctaText && (
                <p className="mt-3 text-accent-foreground/55 text-sm md:text-base max-w-lg leading-relaxed">
                  {product.ctaText}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              {product.ctaButtonLabel && product.ctaButtonLink ? (
                <Link
                  href={product.ctaButtonLink}
                  className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {product.ctaButtonLabel}
                </Link>
              ) : (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/40 hover:bg-accent-foreground hover:text-accent text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                Get a Quote Online
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
