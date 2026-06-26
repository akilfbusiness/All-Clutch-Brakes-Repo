"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Star } from "lucide-react"
import type { Testimonial } from "@/sanity/queries"

const ease = [0.16, 1, 0.3, 1] as const

const PLACEHOLDER_REVIEWS: Testimonial[] = [
  {
    _id: "p1",
    customerName: "Mark T.",
    vehicleType: "2019 Toyota Hilux",
    rating: 5,
    testimonialText:
      "Brought my Hilux in for a clutch replacement. They diagnosed it free, quoted me on the spot, and had it done same day. Price was exactly what they said. Couldn't believe it.",
  },
  {
    _id: "p2",
    customerName: "Sarah L.",
    vehicleType: "2017 Mazda CX-5",
    rating: 5,
    testimonialText:
      "Brakes were grinding badly. Dropped it off in the morning and picked it up that afternoon. They machined the rotors in-house which saved me a lot. Honest and fast.",
  },
  {
    _id: "p3",
    customerName: "James R.",
    vehicleType: "2018 Ford Ranger",
    rating: 5,
    testimonialText:
      "Clutch was slipping on my Ranger for weeks. Finally came in and they sorted it same day. Wish I'd come sooner. Will not go anywhere else.",
  },
  {
    _id: "p4",
    customerName: "David K.",
    vehicleType: "2015 Holden Colorado",
    rating: 5,
    testimonialText:
      "They replaced the flywheel and clutch kit. Quoted me upfront, no hidden charges at the end. The car drives like new. These guys are the real specialists.",
  },
  {
    _id: "p5",
    customerName: "Lisa M.",
    vehicleType: "2016 Holden Commodore",
    rating: 5,
    testimonialText:
      "Took my Commodore in for brake pad and rotor replacement. They were upfront about what needed doing and what could wait. Refreshing honesty from a mechanic.",
  },
  {
    _id: "p6",
    customerName: "Tom W.",
    vehicleType: "2014 Subaru WRX",
    rating: 5,
    testimonialText:
      "Had a full clutch rebuild done. Dropped off at 8am, picked up at 4pm. Price matched the quote exactly. Been going back for 3 years now.",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 shrink-0 ${
            i < rating ? "fill-[#F4B400] text-[#F4B400]" : "fill-gray-200 text-gray-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

interface ReviewsWallSectionProps {
  testimonials?: Testimonial[]
  eyebrow?: string
  ratingValue?: string
  reviewCount?: string
}

export function ReviewsWallSection({
  testimonials,
  eyebrow = "Google Reviews",
  ratingValue = "4.9",
  reviewCount = "106+",
}: ReviewsWallSectionProps) {
  const reduce = useReducedMotion()
  const reviews =
    testimonials && testimonials.length > 0 ? testimonials.slice(0, 6) : PLACEHOLDER_REVIEWS

  return (
    <section className="relative bg-[#F5F5F5] overflow-hidden" aria-labelledby="reviews-heading">

      {/* Tilt divider — white → grey, 3-strip fan (non-overlapping trapezoids = no opacity stacking) */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 leading-[0]">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="w-full h-[60px] md:h-[80px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Strip 1 — just below white cut, most visible */}
          <polygon points="0,60 1440,36 1440,46 0,68" fill="#909090" fillOpacity="0.22" />
          {/* Strip 2 — middle, fading */}
          <polygon points="0,68 1440,46 1440,58 0,76" fill="#909090" fillOpacity="0.13" />
          {/* Strip 3 — barely there, whisper */}
          <polygon points="0,76 1440,58 1440,68 0,80" fill="#909090" fillOpacity="0.07" />
          {/* White — covers top, creates clean tilt cut */}
          <polygon points="0,0 1440,0 1440,36 0,60" fill="#ffffff" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-[76px] pb-16 md:pt-[120px] md:pb-24">

        {/* Eyebrow */}
        {eyebrow && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="flex items-center gap-2 mb-6"
          >
            <div className="h-px w-8 bg-[#2A6DD9]/40" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#2A6DD9]">{eyebrow}</span>
            <div className="h-px w-8 bg-[#2A6DD9]/40" />
          </motion.div>
        )}

        {/* Header — rating anchor left, heading right */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
        >
          {/* 4.9 ★ — trust anchor */}
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-5xl md:text-6xl font-extrabold text-[#0a0a0a] leading-none tracking-tight">
                {ratingValue}
              </span>
              <div className="flex gap-0.5 pb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[#F4B400] text-[#F4B400]" aria-hidden="true" />
                ))}
              </div>
            </div>
            <p className="mt-1.5 text-gray-500 text-sm">
              Based on {reviewCount} Google Reviews
            </p>
          </div>

          <h2
            id="reviews-heading"
            className="text-2xl md:text-3xl lg:text-[34px] font-bold text-[#0a0a0a] tracking-tight leading-tight text-balance sm:text-right"
          >
            What Adelaide Drivers Say
          </h2>
        </motion.div>

        {/* Card grid — equal heights within each row, hover highlight replaces permanent blue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reviews.map((review, i) => (
            <motion.article
              key={review._id}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease, delay: 0.08 + i * 0.07 }}
              className="group flex flex-col gap-3 p-5 md:p-6 bg-white border border-gray-200
                         hover:border-[#2A6DD9]/50 hover:bg-[#2A6DD9]/[0.02]
                         transition-colors duration-200 cursor-default"
            >
              {/* Decorative open-quote — highlights on hover */}
              <span
                aria-hidden="true"
                className="text-4xl font-bold leading-none select-none -mb-1
                           text-gray-200 group-hover:text-[#2A6DD9]/40
                           transition-colors duration-200"
              >
                &ldquo;
              </span>

              {/* Full quote text — smaller type */}
              <p className="text-[#1A1A1A] text-xs leading-relaxed flex-1 italic">
                {review.testimonialText}
              </p>

              {/* Attribution */}
              <div className="flex items-end justify-between pt-3 border-t border-gray-100 mt-auto">
                <div className="min-w-0">
                  <StarRating rating={review.rating} />
                  <p className="text-sm font-semibold text-[#0a0a0a] mt-1.5 truncate">
                    {review.customerName}
                  </p>
                  {review.vehicleType && (
                    /* text-gray-500 = #6b7280, ~4.6:1 contrast on white — passes WCAG AA */
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{review.vehicleType}</p>
                  )}
                </div>
                {/* role="img" makes aria-label valid on this span — it represents
                    the Google review platform badge, which is meaningful to AT users. */}
                {/* text-gray-500 = #6b7280, ~4.6:1 on white — passes WCAG AA for small bold text */}
                <span
                  role="img"
                  className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-500 shrink-0 ml-4"
                  aria-label="Google Review"
                >
                  Google
                </span>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
