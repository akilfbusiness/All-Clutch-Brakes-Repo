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
  ({ items, className, radius, autoRotateSpeed = 0.015, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isSnapping, setIsSnapping] = useState(false)
    const [effectiveRadius, setEffectiveRadius] = useState(radius ?? 520)

    // Once the user interacts (arrow or touch), auto-rotate and scroll driving
    // are permanently disabled — this ref never resets to false.
    const hasInteracted = useRef(false)

    // Responsive radius
    useEffect(() => {
      const update = () => {
        if (radius !== undefined) { setEffectiveRadius(radius); return }
        const w = window.innerWidth
        setEffectiveRadius(w < 480 ? 200 : w < 768 ? 300 : w < 1024 ? 420 : 520)
      }
      update()
      window.addEventListener("resize", update, { passive: true })
      return () => window.removeEventListener("resize", update)
    }, [radius])

    const animationFrameRef = useRef<number | null>(null)
    const lastScrollRef = useRef(0)
    const touchStartXRef = useRef<number | null>(null)
    const lastTouchXRef = useRef<number | null>(null)
    const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const anglePerItem = 360 / items.length

    const triggerSnap = () => {
      setIsSnapping(true)
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current)
      snapTimeoutRef.current = setTimeout(() => setIsSnapping(false), 600)
    }

    const goNext = () => {
      hasInteracted.current = true
      triggerSnap()
      setRotation(prev => prev - anglePerItem)
    }
    const goPrev = () => {
      hasInteracted.current = true
      triggerSnap()
      setRotation(prev => prev + anglePerItem)
    }

    // Scroll-driven rotation — disabled after first interaction
    useEffect(() => {
      const handleScroll = () => {
        if (hasInteracted.current) return
        const delta = window.scrollY - lastScrollRef.current
        lastScrollRef.current = window.scrollY
        setRotation(prev => prev + delta * 0.08)
      }
      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Auto-rotate — disabled after first interaction
    useEffect(() => {
      const autoRotate = () => {
        if (!hasInteracted.current) {
          setRotation(prev => prev + autoRotateSpeed)
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [autoRotateSpeed])

    // Touch swipe — also locks out auto-rotate/scroll on first touch
    const handleTouchStart = (e: React.TouchEvent) => {
      hasInteracted.current = true
      touchStartXRef.current = e.touches[0].clientX
      lastTouchXRef.current = e.touches[0].clientX
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
        className={`relative w-full h-full ${className ?? ""}`}
        // Higher perspective value = less pronounced zoom as cards approach
        style={{ perspective: "3000px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        {...props}
      >
        {/* Prev / Next arrows — centered below the carousel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button
            onClick={goPrev}
            aria-label="Previous service"
            className="w-11 h-11 flex items-center justify-center border border-white/20 dark:hover:border-accent text-white/60 dark:hover:text-accent transition-all duration-300 bg-black/30 backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goNext}
            aria-label="Next service"
            className="w-11 h-11 flex items-center justify-center border border-white/20 dark:hover:border-accent text-white/60 dark:hover:text-accent transition-all duration-300 bg-black/30 backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/*
          Zero-size pivot — the rotation axis is a single point at the exact
          centre of the container. Cards extend outward from this point via
          translateZ, so there is nothing to drift or shift when rotating.
        */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 0,
            height: 0,
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotation}deg)`,
            transition: isSnapping ? "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
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
                className="absolute w-[180px] h-[260px] sm:w-[220px] sm:h-[300px] md:w-[260px] md:h-[350px] lg:w-[280px] lg:h-[380px]"
                style={{
                  // Rotate each card to its position on the ring, push out by
                  // radius, then centre it on the pivot point.
                  transform: `rotateY(${itemAngle}deg) translateZ(${effectiveRadius}px) translateX(-50%) translateY(-50%)`,
                  left: 0,
                  top: 0,
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

                  <div className="absolute bottom-0 left-0 h-[2px] dark:bg-accent w-0 group-hover:w-full transition-all duration-500" />

                  <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                    <h3 className="text-base font-bold leading-snug mb-1 dark:group-hover:text-accent transition-colors duration-300">
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
