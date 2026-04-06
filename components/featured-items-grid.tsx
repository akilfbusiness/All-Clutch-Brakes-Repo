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
  product: "bg-accent/20 text-accent",
  news: "bg-blue-500/20 text-blue-400",
  promotion: "bg-green-500/20 text-green-400",
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
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Nothing featured yet</h2>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          Featured items will appear here once they are added and marked as featured in the CMS.
        </p>
        <p className="text-sm text-muted-foreground">
          Go to Sanity Studio → Products → Featured Items &amp; News → Add item
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item._id}
            onClick={() => open(item)}
            className="bg-card border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors flex flex-col cursor-pointer"
          >
            {item.image && (
              <div className="relative h-56 w-full bg-muted overflow-hidden">
                <Image
                  src={urlFor(item.image).width(800).height(448).fit("crop").url()}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-6 flex flex-col flex-1">
              {item.category && (
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md mb-3 w-fit ${CATEGORY_COLOURS[item.category] ?? "bg-secondary text-muted-foreground"}`}>
                  <Tag className="h-3 w-3" />
                  {CATEGORY_LABELS[item.category] ?? item.category}
                </span>
              )}
              <h2 className="text-lg font-bold text-foreground mb-2 text-balance">{item.title}</h2>
              {item.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {item.description}
                </p>
              )}
              <p className="text-accent text-xs font-semibold mt-auto">Click for details →</p>
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
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {/* Image */}
              {selected.image && (
                <div className="relative h-64 w-full bg-muted rounded-t-2xl overflow-hidden">
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
                {/* Category badge */}
                {selected.category && (
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md mb-3 w-fit ${CATEGORY_COLOURS[selected.category] ?? "bg-secondary text-muted-foreground"}`}>
                    <Tag className="h-3 w-3" />
                    {CATEGORY_LABELS[selected.category] ?? selected.category}
                  </span>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
                  {selected.title}
                </h2>

                {selected.description && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
                    {selected.description}
                  </p>
                )}

                {/* Specs */}
                {selected.specs && selected.specs.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Specifications
                    </h3>
                    <ul className="space-y-2">
                      {selected.specs.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <Star className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                {selected.ctaLabel && selected.ctaLink && (
                  <Link
                    href={selected.ctaLink}
                    onClick={close}
                    className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg text-sm font-semibold transition-colors"
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
