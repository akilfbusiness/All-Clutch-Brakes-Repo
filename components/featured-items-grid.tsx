"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Tag, Star } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { FeaturedItem } from "@/sanity/queries"

interface Props {
  items: FeaturedItem[]
}

const CATEGORY_LABELS: Record<string, string> = {
  product: "Product",
  news: "News",
  promotion: "Promotion",
}

const CATEGORY_COLOURS: Record<string, string> = {
  product: "border-accent/30 text-accent",
  news: "border-blue-500/30 text-blue-400",
  promotion: "border-green-500/30 text-green-400",
}

export function FeaturedItemsGrid({ items }: Props) {
  const [selected, setSelected] = useState<FeaturedItem | null>(null)

  function open(item: FeaturedItem) {
    setSelected(item)
    document.body.style.overflow = "hidden"
  }

  function close() {
    setSelected(null)
    document.body.style.overflow = ""
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 border border-border flex items-center justify-center mx-auto mb-6">
          <Star className="h-10 w-10 text-foreground/30" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Nothing featured yet</h2>
        <p className="text-foreground/60 mb-2 max-w-md mx-auto">
          Featured items will appear here once they are added and marked as featured in the CMS.
        </p>
        <p className="text-sm text-foreground/40">
          Go to Sanity Studio → Products → Featured Items &amp; News → Add item
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Border-grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
        {items.map((item) => (
          <article
            key={item._id}
            onClick={() => open(item)}
            className="group relative border-r border-b border-border flex flex-col cursor-pointer overflow-hidden hover:bg-foreground/[0.02] transition-colors"
          >
            {/* Accent hover line */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500 z-10" />

            {item.image && (
              <div className="relative h-56 w-full bg-foreground/5 overflow-hidden flex-shrink-0">
                <Image
                  src={urlFor(item.image).width(800).height(448).fit("crop").url()}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              {item.category && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase border px-2.5 py-1 mb-3 w-fit ${CATEGORY_COLOURS[item.category] ?? "border-border text-foreground/50"}`}
                >
                  <Tag className="h-3 w-3" />
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              )}
              <h2 className="text-base font-black uppercase tracking-tight text-foreground mb-2 group-hover:text-accent transition-colors">
                {item.title}
              </h2>
              {item.description && (
                <p className="text-foreground/60 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {item.description}
                </p>
              )}
              <p className="text-[11px] text-accent font-bold uppercase tracking-widest mt-auto">
                Click for details →
              </p>
            </div>
          </article>
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
              className="relative bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

              {/* Square close button */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-8 h-8 border border-border hover:border-accent flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>

              {/* Image */}
              {selected.image && (
                <div className="relative h-64 w-full bg-foreground/5 overflow-hidden">
                  <Image
                    src={urlFor(selected.image).width(800).height(512).fit("crop").url()}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 512px"
                    priority
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                {selected.category && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase border px-2.5 py-1 mb-4 w-fit ${CATEGORY_COLOURS[selected.category] ?? "border-border text-foreground/50"}`}
                  >
                    <Tag className="h-3 w-3" />
                    {CATEGORY_LABELS[selected.category] ?? selected.category}
                  </span>
                )}

                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-foreground mb-3">
                  {selected.title}
                </h2>

                {selected.description && (
                  <p className="text-foreground/60 leading-relaxed whitespace-pre-line mb-6 text-sm">
                    {selected.description}
                  </p>
                )}

                {/* Specs */}
                {selected.specs && selected.specs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[11px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-3">
                      Specifications
                    </h3>
                    <ul className="space-y-2">
                      {selected.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <Star className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selected.ctaLabel && selected.ctaLink && (
                  <Link
                    href={selected.ctaLink}
                    onClick={close}
                    className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
                  >
                    {selected.ctaLabel}
                  </Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
