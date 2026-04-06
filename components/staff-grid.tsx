"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Users } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { urlFor } from "@/sanity/image"
import type { StaffMember } from "@/sanity/queries"

interface Props {
  staff: StaffMember[]
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
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">No staff added yet</h2>
        <p className="text-muted-foreground mb-2 max-w-md mx-auto">
          Staff members will appear here once they are added in the CMS.
        </p>
        <p className="text-sm text-muted-foreground">
          Go to Sanity Studio → About → Meet Our Staff → Add item
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <article
            key={member._id}
            onClick={() => open(member)}
            className="bg-card border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors cursor-pointer"
          >
            <div className="relative h-72 w-full bg-muted overflow-hidden">
              {member.photo ? (
                <Image
                  src={urlFor(member.photo).width(600).height(576).fit("crop").url()}
                  alt={member.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className="h-20 w-20 text-muted-foreground/30" />
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-1">{member.name}</h2>
              {member.role && (
                <p className="text-accent font-semibold text-sm mb-3">{member.role}</p>
              )}
              {member.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              )}
              <p className="text-accent text-xs font-semibold mt-4">Click to read more →</p>
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
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close */}
              <button
                onClick={close}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {/* Photo */}
              {selected.photo && (
                <div className="relative h-72 md:h-80 w-full bg-muted rounded-t-2xl overflow-hidden">
                  <Image
                    src={urlFor(selected.photo).width(800).height(640).fit("crop").url()}
                    alt={selected.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 512px"
                    priority
                  />
                </div>
              )}

              <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{selected.name}</h2>
                {selected.role && (
                  <p className="text-accent font-semibold text-base mb-4">{selected.role}</p>
                )}
                {selected.bio && (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
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
