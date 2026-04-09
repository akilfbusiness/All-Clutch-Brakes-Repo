"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import type { Testimonial } from "@/sanity/queries"

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  if (!testimonials || testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-12 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            What Our Customers Say
          </h2>

          <div className="relative min-h-[300px] rounded-xl border bg-card p-8 shadow-sm md:p-12">
            {/* Stars */}
            <div className="mb-6 flex justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < currentTestimonial.rating
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="mb-6 text-pretty text-lg italic leading-relaxed text-foreground md:text-xl">
              &ldquo;{currentTestimonial.testimonialText}&rdquo;
            </blockquote>

            {/* Customer Info */}
            <div className="space-y-1">
              <p className="font-semibold text-foreground">
                {currentTestimonial.customerName}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                {currentTestimonial.suburb && <span>{currentTestimonial.suburb}</span>}
                {currentTestimonial.suburb && currentTestimonial.vehicleType && (
                  <span className="text-muted">•</span>
                )}
                {currentTestimonial.vehicleType && <span>{currentTestimonial.vehicleType}</span>}
              </div>
            </div>

            {/* Navigation Dots */}
            {testimonials.length > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "bg-muted hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
