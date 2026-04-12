"use client"

import React, { useState, useEffect, useRef, HTMLAttributes } from "react"
import Link from "next/link"
import { ArrowRight, Wrench, ChevronLeft, ChevronRight } from "lucide-react"

export interface ServiceGalleryItem {
  title: string
  slug: string | null
  description: string | null
  image: string | null
}

interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: ServiceGalleryItem[]
  radius?: number
  autoRotateSpeed?: number
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 560, autoRotateSpeed = 0.015, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isInteracting, setIsInteracting] = useState(false)
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const interactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const lastScrollRef = useRef(0)
    const touchStartXRef = useRef<number | null>(null)
    const lastTouchXRef = useRef<number | null>(null)

    const anglePerItem = 360 / items.length

    // Pause auto-rotate temporarily after any interaction
    const pauseAutoRotate = () => {
      setIsInteracting(true)
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current)
      interactTimeoutRef.current = setTimeout(() => setIsInteracting(false), 2000)
    }

    // Arrow navigation — snap by one card angle
    const goNext = () => {
      pauseAutoRotate()
      setRotation(prev => prev - anglePerItem)
    }
    const goPrev = () => {
      pauseAutoRotate()
      setRotation(prev => prev + anglePerItem)
    }

    // Scroll-driven rotation
    useEffect(() => {
      const handleScroll = () => {
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
        const delta = window.scrollY - lastScrollRef.current
        lastScrollRef.current = window.scrollY
        setRotation(prev => prev + delta * 0.08)
        pauseAutoRotate()
        scrollTimeoutRef.current = setTimeout(() => {}, 150)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => {
        window.removeEventListener("scroll", handleScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }, [])

    // Auto-rotate when not interacting
    useEffect(() => {
      const autoRotate = () => {
        if (!isInteracting) setRotation(prev => prev + autoRotateSpeed)
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [isInteracting, autoRotateSpeed])

    // Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX
      lastTouchXRef.current = e.touches[0].clientX
      pauseAutoRotate()
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (lastTouchXRef.current === null) return
      const delta = e.touches[0].clientX - lastTouchXRef.current
      lastTouchXRef.current = e.touches[0].clientX
      setRotation(prev => prev + delta * 0.3)
    }

    const handleTouchEnd = () => {
      touchStartXRef.current = null
      lastTouchXRef.current = null
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Services carousel"
        className={`relative w-full h-full flex items-center justify-center ${className ?? ""}`}
        style={{ perspective: "2000px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous service"
          className="absolute left-4 md:left-8 z-20 w-11 h-11 flex items-center justify-center border border-white/20 hover:border-accent text-white/60 hover:text-accent transition-all duration-300 hover:-translate-x-0.5 bg-black/30 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next service"
          className="absolute right-4 md:right-8 z-20 w-11 h-11 flex items-center justify-center border border-white/20 hover:border-accent text-white/60 hover:text-accent transition-all duration-300 hover:translate-x-0.5 bg-black/30 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* 3D ring */}
        <div
          className="relative w-full h-full"
          style={{ transform: `rotateY(${rotation}deg)`, transformStyle: "preserve-3d" }}
        >
          {items.map((service, i) => {
            const itemAngle = i * anglePerItem
            const totalRotation = rotation % 360
            const relativeAngle = (itemAngle + totalRotation + 360) % 360
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle)
            const opacity = Math.max(0.25, 1 - normalizedAngle / 180)
            const isFront = normalizedAngle < 45

            return (
              <div
                key={i}
                role="group"
                aria-label={service.title}
                className="absolute w-[260px] h-[360px] md:w-[280px] md:h-[380px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-130px",
                  marginTop: "-180px",
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <Link
                  href={service.slug ? `/services/${service.slug}` : "/services"}
                  className="group block relative w-full h-full overflow-hidden shadow-2xl"
                  tabIndex={isFront ? 0 : -1}
                >
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <Wrench className="w-10 h-10 text-accent/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:from-black/80 transition-all duration-500" />

                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.25em] text-white/60 bg-black/50 px-2 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-500" />

                  <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                    <h3 className="text-base font-bold leading-snug mb-1 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 mb-3">
                        {service.description}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-accent text-[11px] font-bold tracking-wide group-hover:gap-3 transition-all duration-300">
                      Learn More <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)

CircularGallery.displayName = "CircularGallery"
export { CircularGallery }
