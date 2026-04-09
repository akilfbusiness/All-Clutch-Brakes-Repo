import type { Metadata } from "next"
import { getAllGalleryImages, getSiteSettings } from "@/sanity/queries"
import { GalleryGrid } from "@/components/gallery-grid"

export const metadata: Metadata = {
  title: "Gallery | All Clutch & Brake Service",
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

  const businessName = settings.businessName || "All Clutch & Brake Service"

  // Group images by category
  const workshopImages = allImages.filter((img) => img.category === "workshop")
  const beforeAfterImages = allImages.filter((img) => img.category === "before-after")
  const teamImages = allImages.filter((img) => img.category === "team")
  const servicesImages = allImages.filter((img) => img.category === "services")
  const vehiclesImages = allImages.filter((img) => img.category === "vehicles")

  return (
    <main>
      {/* Hero */}
      <section className="border-b bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Our Work
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Gallery
            </h1>
            <p className="text-pretty text-lg text-muted-foreground md:text-xl">
              Take a look at our workshop, team, and the quality work we deliver for Adelaide
              drivers.
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
