"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Tag, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { Project } from "@/sanity/queries"

interface Props {
  projects: Project[]
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
}

export function ProjectsGrid({ projects }: Props) {
  const [selected,     setSelected]     = useState<Project | null>(null)
  const [galleryIndex, setGalleryIndex] = useState(0)

  function open(project: Project) {
    setSelected(project)
    setGalleryIndex(0)
    document.body.style.overflow = "hidden"
  }

  function close() {
    setSelected(null)
    document.body.style.overflow = ""
  }

  const gallery = selected?.gallery ?? []

  if (projects.length === 0) {
    return (
      <div className="text-center py-32 border border-dashed border-border">
        <Tag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground/50 text-sm">
          Add projects via Sanity Studio → About → Projects
        </p>
      </div>
    )
  }

  return (
    <>
      <motion.div
        variants={stagger} initial="hidden"
        whileInView="show" viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border"
      >
        {projects.map((project, i) => (
          <motion.article
            key={project._id}
            variants={fadeUp}
            onClick={() => open(project)}
            className="group relative border-r border-b border-border cursor-pointer overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-60 w-full bg-foreground/[0.04] overflow-hidden">
              {project.featuredImage ? (
                <Image
                  src={urlFor(project.featuredImage).width(800).height(480).fit("crop").url()}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground/30 text-xs font-bold tracking-widest uppercase">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Watermark number */}
              <span aria-hidden className="absolute top-4 right-5 text-[64px] font-bold leading-none text-white/[0.08] select-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Gallery count badge */}
              {project.gallery && project.gallery.length > 0 && (
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 text-[10px] font-bold tracking-[0.15em] px-2.5 py-1">
                  +{project.gallery.length} PHOTOS
                </span>
              )}
            </div>

            {/* Card body */}
            <div className="p-6 relative">
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <h2 className="text-base font-bold text-foreground tracking-tight mb-2 group-hover:text-accent transition-colors duration-300">
                {project.title}
              </h2>
              {project.description && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/20 text-accent/70 px-2.5 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-3 transition-all duration-300">
                View project <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* ── MODAL ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="bg-background border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent z-10" />

              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-20 w-8 h-8 border border-border hover:border-accent flex items-center justify-center transition-colors duration-200"
              >
                <X className="h-4 w-4 text-foreground" />
              </button>

              {/* Hero image */}
              {selected.featuredImage && (
                <div className="relative h-56 md:h-72 w-full bg-foreground/[0.04] overflow-hidden">
                  <Image
                    src={urlFor(selected.featuredImage).width(1200).height(576).fit("crop").url()}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
              )}

              <div className="p-7 md:p-8">
                {/* Tags */}
                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {selected.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/25 text-accent/80 px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
                  {selected.title}
                </h2>
                <div className="w-10 h-[2px] bg-accent mb-6" />

                {selected.description && (
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line mb-8">
                    {selected.description}
                  </p>
                )}

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/50 mb-4">
                      Gallery · {gallery.length} {gallery.length === 1 ? "Photo" : "Photos"}
                    </p>

                    {/* Main image */}
                    <div className="relative overflow-hidden border border-border mb-3" style={{ aspectRatio: "16/9" }}>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={galleryIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0"
                        >
                          {gallery[galleryIndex]?.asset && (
                            <Image
                              src={gallery[galleryIndex].asset!}
                              alt={gallery[galleryIndex].caption ?? `Photo ${galleryIndex + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 768px"
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setGalleryIndex((n) => (n - 1 + gallery.length) % gallery.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center transition-colors"
                            aria-label="Previous"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setGalleryIndex((n) => (n + 1) % gallery.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white w-8 h-8 flex items-center justify-center transition-colors"
                            aria-label="Next"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                          <span className="absolute bottom-3 right-3 bg-black/60 text-white/70 text-[10px] font-bold tracking-[0.15em] px-2.5 py-1">
                            {String(galleryIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {gallery.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {gallery.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => setGalleryIndex(i)}
                            className={`relative h-14 w-20 shrink-0 overflow-hidden border-2 transition-colors duration-200 ${
                              i === galleryIndex ? "border-accent" : "border-border hover:border-accent/50"
                            }`}
                          >
                            {img.asset && (
                              <Image src={img.asset} alt={img.caption ?? `Thumb ${i + 1}`} fill className="object-cover" sizes="80px" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {gallery[galleryIndex]?.caption && (
                      <p className="text-xs text-muted-foreground/50 mt-3">{gallery[galleryIndex].caption}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
