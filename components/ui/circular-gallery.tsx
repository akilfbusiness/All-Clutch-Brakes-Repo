"use client"

import React, { useState, useEffect, useRef, HTMLAttributes } from "react"
import Link from "next/link"
import { ArrowRight, Wrench } from "lucide-react"

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
  sectionRef?: React.RefObject<HTMLDivElement>
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 560, autoRotateSpeed = 0.015, sectionRef, ...props }, ref) => {
    const [rotation, setRotation] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const animationFrameRef = useRef<number | null>(null)
    const lastScrollRef = useRef(0)

    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

        // Track rotation based on scroll delta — smoother than full-page mapping
        const delta = window.scrollY - lastScrollRef.current
        lastScrollRef.current = window.scrollY
        setRotation(prev => prev + delta * 0.08)

        scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 150)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })
      return () => {
        window.removeEventListener("scroll", handleScroll)
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      }
    }, [])

    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling) setRotation(prev => prev + autoRotateSpeed)
        animationFrameRef.current = requestAnimationFrame(autoRotate)
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate)
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      }
    }, [isScrolling, autoRotateSpeed])

    const anglePerItem = 360 / items.length

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Services carousel"
        className={`relative w-full h-full flex items-center justify-center ${className ?? ""}`}
        style={{ perspective: "2000px" }}
        {...props}
      >
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

            return (
              <div
                key={i}
                role="group"
                aria-label={service.title}
                className="absolute w-[280px] h-[380px]"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-140px",
                  marginTop: "-190px",
                  opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <Link
                  href={service.slug ? `/services/${service.slug}` : "/services"}
                  className="group block relative w-full h-full overflow-hidden shadow-2xl"
                  tabIndex={normalizedAngle < 45 ? 0 : -1}
                >
                  {/* Image */}
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

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:from-black/80 transition-all duration-500" />

                  {/* Number badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.25em] text-white/60 bg-black/50 px-2 py-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Accent bottom line on hover */}
                  <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-500" />

                  {/* Card footer */}
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
