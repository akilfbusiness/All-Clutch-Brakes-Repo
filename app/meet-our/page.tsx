// Meet Our Staff page — content pulled from Sanity CMS
// Edit staff members via Sanity Studio → About → Meet Our Staff

import type { Metadata } from "next"
import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, ChevronRight, ArrowRight } from "lucide-react"
import { getSiteSettings, getAllStaff } from "@/sanity/queries"
import { StaffGrid } from "@/components/staff-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  return {
    title: `Meet Our Staff | ${businessName}`,
    description: `Meet the qualified team behind ${businessName} — experienced mechanics who take pride in honest, expert workmanship.`,
    alternates: { canonical: "/meet-our" },
    openGraph: {
      title: `Meet Our Staff | ${businessName}`,
      description: `Meet the team behind ${businessName}.`,
      url: `${siteUrl}/meet-our`,
      type: "website",
    },
  }
}

export default async function MeetOurStaffPage() {
  const [settings, staff] = await Promise.all([getSiteSettings(), getAllStaff()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",          item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Meet Our Staff", item: `${siteUrl}/meet-our` },
    ],
  }

  const ease = [0.22, 1, 0.36, 1]

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
  }

  const stagger = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span
          aria-hidden
          className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-black leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap"
        >
          Our Team
        </span>

        <div className="container relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Meet Our Staff</li>
            </ol>
          </nav>

          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              The Team
            </p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[0.95] text-foreground mb-8">
              Meet Our Staff
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              The qualified mechanics behind {businessName} — decades of combined experience, honest advice, and a genuine passion for getting it right.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                Send an Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CREDENTIALS STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {[
              { value: "Qualified", label: "Tradespeople only" },
              { value: "40+",       label: "Years combined experience" },
              { value: "Honest",    label: "Transparent pricing" },
              { value: "All",       label: "Makes & models" },
            ].map((item, i) => (
              <div key={i} className="group px-6 py-8 md:px-10 md:py-12 hover:bg-foreground/[0.025] transition-colors duration-500 cursor-default">
                <p className="text-3xl md:text-4xl font-black text-foreground group-hover:text-accent transition-colors duration-500 mb-3">
                  {item.value}
                </p>
                <div className="w-10 h-px bg-border group-hover:bg-accent/40 transition-colors duration-500 mb-3" />
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground/60">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          STAFF GRID
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-14">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              The Team
            </h2>
            {staff.length > 0 && (
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent/70 border border-accent/20 px-3 py-1">
                {staff.length} {staff.length === 1 ? "Member" : "Members"}
              </span>
            )}
          </div>

          <StaffGrid staff={staff} />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-tight">
                Get in Touch With Our Team
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                Call us or send an enquiry and one of our team members will get back to you promptly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2.5 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
