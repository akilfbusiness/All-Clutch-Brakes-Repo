"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Users, ArrowRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { StaffMember } from "@/sanity/queries"

interface Props {
  staff: StaffMember[]
}

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
}

export function StaffGrid({ staff }: Props) {
  const [selected, setSelected] = useState<StaffMember | null>(null)

  function open(member: StaffMember) {
    setSelected(member)
    document.body.style.overflow = "hidden"
  }

  function close() {
    setSelected(null)
    document.body.style.overflow = ""
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-32 border border-dashed border-border">
        <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground/50 text-sm">
          Add staff via Sanity Studio → About → Meet Our Staff
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
        {staff.map((member, i) => (
          <motion.article
            key={member._id}
            variants={fadeUp}
            onClick={() => open(member)}
            className="group relative border-r border-b border-border cursor-pointer overflow-hidden"
          >
            {/* Photo */}
            <div className="relative h-80 w-full bg-foreground/[0.04] overflow-hidden">
              {member.photo ? (
                <Image
                  src={urlFor(member.photo).width(600).height(640).fit("crop").url()}
                  alt={member.name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-16 w-16 text-muted-foreground/20" />
                </div>
              )}
              {/* Gradient overlay — always present, intensifies on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
              {/* Watermark number */}
              <span aria-hidden className="absolute top-4 right-5 text-[64px] font-black leading-none text-white/[0.06] select-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <h2 className="text-xl font-black text-white tracking-tight">{member.name}</h2>
                {member.role && (
                  <p className="text-accent text-[10px] font-bold tracking-[0.25em] uppercase mt-1">{member.role}</p>
                )}
              </div>
            </div>

            {/* Card body */}
            <div className="p-6 relative">
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {member.bio ? (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                  {member.bio}
                </p>
              ) : (
                <p className="text-muted-foreground/40 text-sm mb-4">Team member</p>
              )}
              <span className="inline-flex items-center gap-1.5 text-accent text-xs font-bold group-hover:gap-3 transition-all duration-300">
                Read more <ArrowRight className="h-3 w-3" />
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
              className="bg-background border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
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

              {/* Photo */}
              {selected.photo && (
                <div className="relative h-72 md:h-80 w-full bg-foreground/[0.04] overflow-hidden">
                  <Image
                    src={urlFor(selected.photo).width(800).height(640).fit("crop").url()}
                    alt={selected.name}
                    fill
                    className="object-cover object-top"
                    sizes="512px"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-7 md:p-8">
                <p className="text-accent text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
                  {selected.role ?? "Team Member"}
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-5">
                  {selected.name}
                </h2>
                <div className="w-10 h-[2px] bg-accent mb-6" />
                {selected.bio && (
                  <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                    {selected.bio}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
