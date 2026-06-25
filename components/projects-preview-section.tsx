"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { ProjectsGrid } from "@/components/projects-grid"
import type { Project } from "@/sanity/queries"

interface Props {
  projects: Project[]
}

const ease = [0.16, 1, 0.3, 1] as const

export function ProjectsPreviewSection({ projects }: Props) {
  const reduce = useReducedMotion()
  const preview = projects.slice(0, 3)

  if (preview.length === 0) return null

  return (
    <section className="bg-[#F5F5F5] py-14 md:py-20" aria-labelledby="projects-preview-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* Header row */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-accent/40" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent">Our Work</span>
              <div className="h-px w-8 bg-accent/40" />
            </div>
            <h2 id="projects-preview-heading" className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Featured Projects
            </h2>
          </div>

          {/* Desktop: text link */}
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all duration-300"
          >
            See All Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Reuse ProjectsGrid — same modal behaviour as /projects page */}
        <ProjectsGrid projects={preview} />

        {/* Mobile: solid CTA button */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-6 h-12 transition-colors"
          >
            See All Our Projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
