"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { Testimonial } from "@/sanity/queries"

const ease = [0.25, 0.1, 0.25, 1]

// Placeholder fallback reviews shown when no CMS data is available
const PLACEHOLDER_REVIEWS: Testimonial[] = [
  {
    _id: "p1",
    customerName: "Mark T.",
    vehicleType: "2019 Toyota Hilux",
    rating: 5,
    testimonialText:
      "Brought my Hilux in for a clutch replacement — they diagnosed it free, quoted me on the spot, and had it done same day. Price was exactly what they said. Couldn't believe it.",
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
      "Clutch was slipping on my Ranger for weeks — kept putting it off. Finally came in and they sorted it same day. Wish I'd come sooner. Will not go anywhere else.",
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
      "Had a full clutch rebuild done. Dropped off at 8am, picked up at 4pm. Price matched the quote exactly. Been going back for 3 years now — wouldn't trust anyone else.",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-[#F4B400] text-[#F4B400]" : "fill-gray-200 text-gray-200"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

interface ReviewsWallSectionProps {
  testimonials?: Testimonial[]
  ratingValue?: string
  reviewCount?: string
}

export function ReviewsWallSection({
  testimonials,
  ratingValue = "4.9",
  reviewCount = "106+",
}: ReviewsWallSectionProps) {
  const reviews =
    testimonials && testimonials.length > 0 ? testimonials.slice(0, 6) : PLACEHOLDER_REVIEWS

  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="container max-w-6xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#2A6DD9] mb-3">
            Google Reviews
          </p>
          <h2
            id="reviews-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A0A0A] tracking-tight text-balance"
          >
            What Adelaide Drivers Say About Us
          </h2>
          <p className="mt-3 text-[#555555] text-sm md:text-base">
            {ratingValue} Stars across {reviewCount} Google Reviews
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease, delay: i * 0.08 }}
              className="bg-white p-6 flex flex-col gap-4"
            >
              <StarRating rating={review.rating} />
              <p className="text-[#1A1A1A] text-sm leading-relaxed flex-1">
                &ldquo;{review.testimonialText}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">{review.customerName}</p>
                  {review.vehicleType && (
                    <p className="text-xs text-[#777777]">{review.vehicleType}</p>
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-wide uppercase text-[#777777]">
                  Google Review
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
