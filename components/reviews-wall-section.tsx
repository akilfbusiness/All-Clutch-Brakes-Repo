"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const ease = [0.25, 0.1, 0.25, 1]

const reviews = [
  {
    quote:
      "Brought my Hilux in for a clutch replacement — they diagnosed it free, quoted me on the spot, and had it done same day. Price was exactly what they said. Couldn't believe it.",
    name: "Mark T.",
    vehicle: "2019 Toyota Hilux",
  },
  {
    quote:
      "Brakes were grinding badly. Dropped it off in the morning and picked it up that afternoon. They machined the rotors in-house which saved me a lot. Honest and fast.",
    name: "Sarah L.",
    vehicle: "2017 Mazda CX-5",
  },
  {
    quote:
      "Clutch was slipping on my Ranger for weeks — kept putting it off. Finally came in and they sorted it same day. Wish I'd come sooner. Will not go anywhere else.",
    name: "James R.",
    vehicle: "2018 Ford Ranger",
  },
  {
    quote:
      "They replaced the flywheel and clutch kit. Quoted me upfront, no hidden charges at the end. The car drives like new. These guys are the real specialists.",
    name: "David K.",
    vehicle: "2015 Holden Colorado",
  },
  {
    quote:
      "Took my Commodore in for brake pad and rotor replacement. They were upfront about what needed doing and what could wait. Refreshing honesty from a mechanic.",
    name: "Lisa M.",
    vehicle: "2016 Holden Commodore",
  },
  {
    quote:
      "Had a full clutch rebuild done. Dropped off at 8am, picked up at 4pm. Price matched the quote exactly. Been going back for 3 years now — wouldn't trust anyone else.",
    name: "Tom W.",
    vehicle: "2014 Subaru WRX",
  },
]

function StarRating() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#F4B400] text-[#F4B400]" aria-hidden="true" />
      ))}
    </div>
  )
}

export function ReviewsWallSection() {
  return (
    <section className="bg-[#F5F5F5] py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="container max-w-6xl mx-auto px-4">

        {/* Header */}
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
            4.9 Stars across 106+ Google Reviews
          </p>
        </motion.div>

        {/* 6-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease, delay: i * 0.08 }}
              className="bg-white p-6 flex flex-col gap-4"
            >
              <StarRating />
              <p className="text-[#1A1A1A] text-sm leading-relaxed flex-1">
                &ldquo;{review.quote}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
                <div>
                  <p className="text-sm font-bold text-[#0A0A0A]">{review.name}</p>
                  <p className="text-xs text-[#777777]">{review.vehicle}</p>
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
