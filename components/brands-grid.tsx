"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ExternalLink, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { Brand } from "@/sanity/queries"

interface Props {
  brands: Brand[]
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

export function BrandsGrid({ brands }: Props) {
  const [selected, setSelected] = useState<Brand | null>(null)

  function open(brand: Brand) {
    setSelected(brand)
    document.body.style.overflow = "hidden"
  }

  function close() {
    setSelected(null)
    document.body.style.overflow = ""
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-32 border border-dashed border-border">
        <p className="text-4xl font-black text-foreground/10 mb-4">B</p>
        <p className="text-muted-foreground/50 text-sm">Add brands via Sanity Studio → Products → Brands</p>
      </div>
    )
  }

  return (
    <>
      <motion.div
        variants={stagger} initial="hidden"
        whileInView="show" viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-border"
      >
        {brands.map((brand) => (
          <motion.div
            key={brand._id}
            variants={fadeUp}
            onClick={() => open(brand)}
            className="group relative border-r border-b border-border p-8 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden hover:bg-foreground/[0.025] transition-colors duration-300"
          >
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            {brand.logo ? (
              <div className="relative h-16 w-full mb-4">
                <Image
                  src={urlFor(brand.logo).width(300).height(128).fit("max").url()}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 45vw, 20vw"
                />
              </div>
            ) : (
              <div className="h-16 w-full flex items-center justify-center mb-4">
                <span className="text-3xl font-black text-accent/60 group-hover:text-accent transition-colors duration-300">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}

            <h2 className="text-sm font-black text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight">{brand.name}</h2>
            {brand.description && (
              <p className="text-muted-foreground/60 text-xs leading-relaxed line-clamp-2 mt-1">{brand.description}</p>
            )}
            <span className="inline-flex items-center gap-1 text-accent text-[10px] font-bold mt-3 group-hover:gap-2 transition-all duration-300">
              View <ArrowRight className="h-2.5 w-2.5" />
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-border w-full max-w-md relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent z-10" />
              <button onClick={close} aria-label="Close"
                className="absolute top-4 right-4 z-20 w-8 h-8 border border-border hover:border-accent flex items-center justify-center transition-colors duration-200">
                <X className="h-4 w-4 text-foreground" />
              </button>

              {selected.logo && (
                <div className="relative h-40 w-full bg-foreground/[0.03] border-b border-border overflow-hidden">
                  <Image
                    src={urlFor(selected.logo).width(400).height(240).fit("max").url()}
                    alt={`${selected.name} logo`}
                    fill
                    className="object-contain p-6"
                    sizes="400px"
                    priority
                  />
                </div>
              )}

              <div className="p-7">
                <p className="text-accent text-[10px] font-bold tracking-[0.35em] uppercase mb-2">Brand</p>
                <h2 className="text-2xl font-black text-foreground tracking-tight mb-4">{selected.name}</h2>
                <div className="w-10 h-[2px] bg-accent mb-5" />
                {selected.description && (
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line mb-6">
                    {selected.description}
                  </p>
                )}
                {selected.website && (
                  <a href={selected.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-6 py-3 transition-all duration-300 hover:-translate-y-0.5">
                    Visit Website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
