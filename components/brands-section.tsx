"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { Brand } from "@/sanity/queries"

interface Props {
  brands: Brand[]
}

const ease = [0.16, 1, 0.3, 1] as const

const PLACEHOLDER_BRANDS: Brand[] = [
  { _id: "p1", name: "Exedy",  order: 1 },
  { _id: "p2", name: "DBA",    order: 2 },
  { _id: "p3", name: "Bendix", order: 3 },
  { _id: "p4", name: "Sachs",  order: 4 },
  { _id: "p5", name: "Bosch",  order: 5 },
  { _id: "p6", name: "Ferodo", order: 6 },
  { _id: "p7", name: "ATE",    order: 7 },
  { _id: "p8", name: "Monroe", order: 8 },
]

export function BrandsSection({ brands }: Props) {
  const reduce = useReducedMotion()
  const items = brands.length > 0 ? brands : PLACEHOLDER_BRANDS
  const marqueeItems = [...items, ...items]

  return (
    <section className="relative bg-white pt-[88px] pb-14 md:pt-[120px] md:pb-20 overflow-hidden" aria-labelledby="brands-heading">
      <style>{`
        @keyframes brands-marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>

      {/* Wave divider — dark #0a0a0a (guarantee section) arches down into brands white */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[70px] md:h-[100px]" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,0 L 1440,0 L 1440,28 C 1080,88 360,88 0,28 Z" fill="#0a0a0a" />
          <path d="M 1440,28 C 1080,88 360,88 0,28" fill="none" stroke="#2A6DD9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* Section header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 mb-10 md:mb-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#2A6DD9]/40" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2A6DD9]">
              Products We Work With
            </span>
            <div className="h-px w-8 bg-[#2A6DD9]/40" />
          </div>
          <h2 id="brands-heading" className="text-2xl md:text-3xl font-bold text-[#0a0a0a] tracking-tight">
            Trusted Brands, Premium Parts
          </h2>
        </motion.div>
      </div>

      {/* ── Mobile: auto-scrolling marquee ─────────────────────────────────── */}
      <div className="md:hidden overflow-hidden">
        <div
          className="flex gap-3 w-max px-3"
          style={{ animation: reduce ? "none" : "brands-marquee 32s linear infinite" }}
        >
          {marqueeItems.map((brand, i) => (
            <BrandTile key={`${brand._id}-${i}`} brand={brand} tileClass="w-[130px] h-[80px] flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* ── Desktop: compact auto-fill grid ────────────────────────────────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="hidden md:grid max-w-6xl mx-auto px-4 sm:px-6 lg:px-10"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}
      >
        {items.map((brand) => (
          <BrandTile key={brand._id} brand={brand} tileClass="w-full h-[88px]" />
        ))}
      </motion.div>
    </section>
  )
}

function BrandTile({ brand, tileClass }: { brand: Brand; tileClass: string }) {
  const inner = (
    <div
      className={`group flex items-center justify-center border border-gray-100 hover:border-[#2A6DD9]/30 bg-white hover:bg-[#2A6DD9]/[0.02] transition-all duration-200 p-3 ${tileClass}`}
    >
      {brand.logo ? (
        <Image
          src={urlFor(brand.logo).width(220).height(110).url()}
          alt={brand.name}
          width={110}
          height={55}
          className="object-contain max-h-full w-auto opacity-60 group-hover:opacity-100 transition-opacity duration-200"
        />
      ) : (
        <span className="text-[11px] font-bold tracking-wider uppercase text-gray-400 group-hover:text-[#2A6DD9] transition-colors duration-200 text-center leading-tight">
          {brand.name}
        </span>
      )}
    </div>
  )

  if (brand.website) {
    return (
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${brand.name} website`}
        className="block"
      >
        {inner}
      </a>
    )
  }

  return <div>{inner}</div>
}
