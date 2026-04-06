"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ExternalLink } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { Brand } from "@/sanity/queries"

interface Props {
  brands: Brand[]
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
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-muted-foreground">B</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No brands added yet</h2>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          Brands will appear here once they are added in the CMS.
        </p>
        <p className="text-sm text-muted-foreground">
          Go to Sanity Studio → Products → Brands → Add item
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <div
            key={brand._id}
            onClick={() => open(brand)}
            className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-accent/50 transition-colors cursor-pointer group"
          >
            {brand.logo ? (
              <div className="relative h-20 w-full mb-4">
                <Image
                  src={urlFor(brand.logo).width(300).height(160).fit("max").url()}
                  alt={`${brand.name} logo`}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ) : (
              <div className="h-20 w-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-accent">{brand.name.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <h2 className="text-lg font-bold text-foreground mb-1">{brand.name}</h2>
            {brand.description && (
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{brand.description}</p>
            )}
            <p className="text-accent text-xs font-semibold mt-3">Click to view →</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-8 relative"
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {/* Logo */}
              {selected.logo && (
                <div className="relative h-28 w-full mb-6">
                  <Image
                    src={urlFor(selected.logo).width(400).height(224).fit("max").url()}
                    alt={`${selected.name} logo`}
                    fill
                    className="object-contain"
                    sizes="400px"
                    priority
                  />
                </div>
              )}

              <h2 className="text-2xl font-bold text-foreground mb-3">{selected.name}</h2>

              {selected.description && (
                <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                  {selected.description}
                </p>
              )}

              {selected.website && (
                <a
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
                >
                  Visit website <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
