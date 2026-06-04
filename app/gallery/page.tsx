import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getAllGalleryImages, getSiteSettings } from "@/sanity/queries"
import { GalleryGrid } from "@/components/gallery-grid"
import { PageHeroMedia } from "@/components/page-hero-media"

export const metadata: Metadata = {
  title: "Gallery",
  description: "View our workshop, team, and completed work. Professional clutch and brake repairs in Adelaide.",
}

export default async function GalleryPage() {
  let allImages
  let settings

  try {
    ;[allImages, settings] = await Promise.all([
      getAllGalleryImages(),
      getSiteSettings(),
    ])
  } catch {
    allImages = []
    settings = {}
  }

  const businessName    = settings.businessName         || "All Clutch & Brake Service"
  const heroImage       = settings.galleryPageHeroImage  || null
  const heroVideo       = settings.galleryPageHeroVideo  || null
  const pageHeading     = settings.galleryPageHeading    || "Gallery"
  const pageSubheading  = settings.galleryPageSubheading || "Take a look at our workshop, team, and the quality work we deliver for Adelaide drivers."
  const eyebrow         = settings.galleryPageEyebrow    || "Our Work"

  // Group images by category
  const workshopImages = allImages.filter((img) => img.category === "workshop")
  const beforeAfterImages = allImages.filter((img) => img.category === "before-after")
  const teamImages = allImages.filter((img) => img.category === "team")
  const servicesImages = allImages.filter((img) => img.category === "services")
  const vehiclesImages = allImages.filter((img) => img.category === "vehicles")

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 bg-background overflow-hidden border-b border-border">
        <PageHeroMedia imageUrl={heroImage} videoUrl={heroVideo} alt={pageHeading} />
        <span aria-hidden className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.025] select-none pointer-events-none whitespace-nowrap z-[2]">
          Gallery
        </span>
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase ${heroImage || heroVideo ? "text-white/60" : "text-muted-foreground/50"}`}>
              <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
              <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
              <li className="text-accent">Gallery</li>
            </ol>
          </nav>
          <div className="max-w-4xl">
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">{eyebrow}</p>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-8 ${heroImage || heroVideo ? "text-white" : "text-foreground"}`}>
              {pageHeading}
            </h1>
            <p className={`text-base md:text-lg leading-relaxed max-w-xl ${heroImage || heroVideo ? "text-white/75" : "text-muted-foreground"}`}>
              {pageSubheading}
            </p>
          </div>
        </div>
      </section>

      {/* Workshop */}
      {workshopImages.length > 0 && (
        <section className="border-b py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">Our Workshop</h2>
            <GalleryGrid images={workshopImages} columns={3} />
          </div>
        </section>
      )}

      {/* Before & After */}
      {beforeAfterImages.length > 0 && (
        <section className="border-b py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
              Before & After
            </h2>
            <GalleryGrid images={beforeAfterImages} columns={3} />
          </div>
        </section>
      )}

      {/* Services */}
      {servicesImages.length > 0 && (
        <section className="border-b py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
            <GalleryGrid images={servicesImages} columns={3} />
          </div>
        </section>
      )}

      {/* Vehicles */}
      {vehiclesImages.length > 0 && (
        <section className="border-b py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
              Vehicles We Service
            </h2>
            <GalleryGrid images={vehiclesImages} columns={4} />
          </div>
        </section>
      )}

      {/* Team */}
      {teamImages.length > 0 && (
        <section className="border-b py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">Our Team</h2>
            <GalleryGrid images={teamImages} columns={3} />
          </div>
        </section>
      )}

      {/* Empty State */}
      {allImages.length === 0 && (
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-lg text-center">
              <p className="text-muted-foreground">
                Gallery images coming soon. Check back later!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">
              Experience the quality service that {businessName} is known for. Contact us today for
              a free quote.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
