"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Tag, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { Project } from "@/sanity/queries"

interface Props {
  projects: Project[]
}

export function ProjectsGrid({ projects }: Props) {
  const [selected, setSelected] = useState<Project | null>(null)
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
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Tag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No projects yet</h2>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          Projects will appear here once they are added in the CMS.
        </p>
        <p className="text-sm text-muted-foreground">
          Go to Sanity Studio → About → Projects → Add item
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project._id}
            onClick={() => open(project)}
            className="bg-card border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors cursor-pointer"
          >
            <div className="relative h-56 w-full bg-muted overflow-hidden">
              {project.featuredImage ? (
                <Image
                  src={urlFor(project.featuredImage).width(800).height(448).fit("crop").url()}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">No image</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-lg font-bold text-foreground mb-2 text-balance">{project.title}</h2>
              {project.description && (
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>
              )}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-accent text-xs font-semibold mt-4">Click to view →</p>
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
              className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {/* Hero image */}
              {selected.featuredImage && (
                <div className="relative h-64 md:h-80 w-full bg-muted rounded-t-2xl overflow-hidden">
                  <Image
                    src={urlFor(selected.featuredImage).width(1200).height(640).fit("crop").url()}
                    alt={selected.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                {/* Title + tags */}
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
                  {selected.title}
                </h2>
                {selected.tags && selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
                        <Tag className="h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {selected.description && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
                    {selected.description}
                  </p>
                )}

                {/* Gallery */}
                {gallery.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Gallery ({gallery.length} photos)
                    </h3>
                    {/* Main gallery image */}
                    <div className="relative h-56 md:h-72 w-full bg-muted rounded-xl overflow-hidden mb-3">
                      {gallery[galleryIndex]?.asset && (
                        <Image
                          src={gallery[galleryIndex].asset!}
                          alt={gallery[galleryIndex].caption ?? `Photo ${galleryIndex + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      )}
                      {gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setGalleryIndex((i) => (i + 1) % gallery.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            {galleryIndex + 1} / {gallery.length}
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
                            className={`relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                              i === galleryIndex ? "border-accent" : "border-transparent"
                            }`}
                          >
                            {img.asset && (
                              <Image src={img.asset} alt={img.caption ?? `Thumb ${i + 1}`} fill className="object-cover" sizes="64px" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {gallery[galleryIndex]?.caption && (
                      <p className="text-sm text-muted-foreground mt-2">{gallery[galleryIndex].caption}</p>
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
