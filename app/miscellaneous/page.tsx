import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ArrowRight, ChevronRight } from "lucide-react"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const page = await getPageBySlug("miscellaneous")

  return {
    title: page?.metaTitle || `Miscellaneous | ${businessName}`,
    description: page?.metaDescription || `Miscellaneous products and parts from ${businessName}.`,
    alternates: { canonical: "/miscellaneous" },
  }
}

export default async function MiscellaneousPage() {
  const settings = await getSiteSettings()
  const page = await getPageBySlug("miscellaneous")
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  const heroSubheading = page?.heroSubheading || `Additional products and parts available from ${businessName}. Content for this section is being updated — get in touch and we can help you find what you need.`

  return (
    <>
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.06] select-none pointer-events-none whitespace-nowrap">
          Miscellaneous
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Miscellaneous</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">Parts &amp; Products</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-foreground mb-8">
              Miscellaneous
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              {heroSubheading}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4 flex-shrink-0" /> Call {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center gap-2.5 border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                Send an Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground tracking-tight leading-tight">
                Can&apos;t Find What You Need?
              </h2>
              <p className="mt-3 text-accent-foreground/60 text-sm md:text-base max-w-lg leading-relaxed">
                Call us directly and we&apos;ll let you know if we have what you&apos;re looking for in stock.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/30 hover:border-accent-foreground text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
