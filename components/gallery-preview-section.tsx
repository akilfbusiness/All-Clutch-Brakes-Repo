"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { HomepageGalleryImage } from "@/sanity/queries"

const ease = [0.16, 1, 0.3, 1]

interface GalleryPreviewSectionProps {
  images: HomepageGalleryImage[]
}

export function GalleryPreviewSection({ images }: GalleryPreviewSectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))
  const next = () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length))

  const active = lightboxIndex !== null ? images[lightboxIndex] : null

  return (
    <>
      <section className="py-16 md:py-24 bg-background border-t border-border">
        <div className="container px-4 md:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-10 md:mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight text-balance">
              See What We Do
            </h2>
            <p className="mt-3 text-foreground/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
              Real jobs from our workshop in Adelaide.
            </p>
          </motion.div>

          {/* Grid — 2 cols mobile, 3 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {images.map((img, index) => (
              <motion.button
                key={img._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.07, ease }}
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden rounded-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={`View image: ${img.altText || img.title}`}
              >
                {img.image ? (
                  <Image
                    src={img.image}
                    alt={img.altText || img.title || "Workshop photo"}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                    <span className="text-foreground/30 text-xs">No image</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                {/* Caption on hover */}
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs leading-snug line-clamp-2">{img.caption}</p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* See All button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3, ease }}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 border border-foreground/20 hover:border-foreground text-foreground px-7 py-3 text-sm font-bold uppercase tracking-widest transition-colors"
            >
              See All Photos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 md:left-6 text-white/70 hover:text-white p-2 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease }}
              className="relative w-full max-w-3xl max-h-[80vh] aspect-square md:aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              {active.image && (
                <Image
                  src={active.image}
                  alt={active.altText || active.title || "Workshop photo"}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-contain"
                  priority
                />
              )}
            </motion.div>

            {/* Caption */}
            {(active.caption || active.title) && (
              <div className="absolute bottom-6 left-0 right-0 text-center px-6">
                <p className="text-white/80 text-sm">{active.caption || active.title}</p>
              </div>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 md:right-6 text-white/70 hover:text-white p-2 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
