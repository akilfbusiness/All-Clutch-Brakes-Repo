import type { Metadata } from "next"
import { getAllTestimonials, getSiteSettings } from "@/sanity/queries"
import { Star } from "lucide-react"
import type { Testimonial } from "@/sanity/queries"

export const metadata: Metadata = {
  title: "Customer Testimonials | All Clutch & Brake Service",
  description: "Read reviews from our satisfied customers across Adelaide. Expert clutch and brake repairs with over 30 years of experience.",
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
      {/* Stars */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < testimonial.rating
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <blockquote className="mb-6 text-pretty leading-relaxed text-foreground">
        &ldquo;{testimonial.testimonialText}&rdquo;
      </blockquote>

      {/* Customer Info */}
      <div className="border-t pt-4">
        <p className="font-semibold text-foreground">{testimonial.customerName}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {testimonial.suburb && <span>{testimonial.suburb}</span>}
          {testimonial.suburb && testimonial.vehicleType && (
            <span className="text-muted">•</span>
          )}
          {testimonial.vehicleType && <span>{testimonial.vehicleType}</span>}
          {testimonial.serviceDate && (
            <>
              <span className="text-muted">•</span>
              <span>{new Date(testimonial.serviceDate).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function TestimonialsPage() {
  let testimonials: Testimonial[] = []
  let settings

  try {
    ;[testimonials, settings] = await Promise.all([
      getAllTestimonials(),
      getSiteSettings(),
    ])
  } catch {
    testimonials = []
    settings = {}
  }

  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone = settings.phone?.[0] || "(08) 8277 8122"

  // Calculate average rating
  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length
        ).toFixed(1)
      : "5.0"

  return (
    <main>
      {/* Hero */}
      <section className="border-b bg-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Customer Reviews
            </div>
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              What Our Customers Say
            </h1>
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Read genuine reviews from Adelaide drivers who trust {businessName} for their clutch
              and brake repairs.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div>
                <div className="mb-1 flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold">{avgRating}</span>
                  <Star className="h-6 w-6 fill-primary text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="mb-1 text-3xl font-bold">{testimonials.length}</p>
                <p className="text-sm text-muted-foreground">Happy Customers</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="mb-1 text-3xl font-bold">30+</p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial._id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-lg text-center">
              <p className="text-muted-foreground">
                No testimonials available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/50 py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Experience Our Service?
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">
              Join hundreds of satisfied customers across Adelaide. Get your free quote today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-primary px-8 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Call {phone}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary px-8 py-4 font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Get a Quote Online
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
