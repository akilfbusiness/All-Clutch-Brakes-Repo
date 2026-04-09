"use client"

import { useState } from "react"
import Image from "next/image"
import { urlFor } from "@/sanity/client"
import type { GalleryImage } from "@/sanity/queries"
import { X } from "lucide-react"

interface GalleryGridProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
}

export function GalleryGrid({ images, columns = 3 }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  if (!images || images.length === 0) {
    return null
  }

  const gridClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

  return (
    <>
      <div className={`grid gap-4 ${gridClass}`}>
        {images.map((image) => (
          <button
            key={image._id}
            onClick={() => setSelectedImage(image)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted transition-transform hover:scale-[1.02]"
          >
            {image.image && (
              <Image
                src={urlFor(image.image).width(600).height(600).url()}
                alt={image.altText || image.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            )}
            {image.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-sm font-medium text-white">{image.title}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[90vh] max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {selectedImage.image && (
              <Image
                src={urlFor(selectedImage.image).width(1200).height(1200).url()}
                alt={selectedImage.altText || selectedImage.title}
                width={1200}
                height={1200}
                className="h-auto max-h-[90vh] w-auto rounded-lg object-contain"
              />
            )}
            {selectedImage.caption && (
              <p className="mt-4 text-center text-sm text-white/90">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
