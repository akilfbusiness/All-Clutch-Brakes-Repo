import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getSiteSettings,
  getPageBySlug,
  getFeaturedTestimonials,
  getAllTestimonials,
  getFeaturedPromotions,
  getActivePromotions,
} from "@/sanity/queries"
import { PageHero } from "@/components/page-hero"
import { PageSections } from "@/components/page-sections"
import { Phone, ArrowRight } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  if (!page) return { title: `Not Found | ${businessName}` }

  const title       = page.metaTitle       ?? `${page.title} | ${businessName}`
  const description = page.metaDescription ?? ""

  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `${siteUrl}/${slug}`, type: "website" },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params

  // Check whether any dynamic sections are present before fetching
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)])

  if (!page) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"

  const sections = page.sections ?? []

  // Determine which dynamic data we actually need
  const needsTestimonials = sections.some((s: any) => s._type === "testimonialsSection")
  const needsPromotions   = sections.some((s: any) => s._type === "promotionsSection")
  const needsServices     = sections.some((s: any) => s._type === "servicesSection" && s.source !== "selected")
  const needsStaff        = sections.some((s: any) => s._type === "teamSection"     && s.source !== "selected")

  // Fetch only what is needed in parallel
  const [testimonials, promotions, services, staff] = await Promise.all([
    needsTestimonials
      ? sections.some((s: any) => s._type === "testimonialsSection" && s.source === "featured")
        ? getFeaturedTestimonials()
        : getAllTestimonials()
      : Promise.resolve([]),
    needsPromotions
      ? sections.some((s: any) => s._type === "promotionsSection" && s.source === "featured")
        ? getFeaturedPromotions()
        : getActivePromotions()
      : Promise.resolve([]),
    needsServices
      ? (async () => {
          const { getAllServices } = await import("@/sanity/queries")
          return getAllServices()
        })()
      : Promise.resolve([]),
    needsStaff
      ? (async () => {
          const { getAllStaff } = await import("@/sanity/queries")
          return getAllStaff()
        })()
      : Promise.resolve([]),
  ])

  const hasMedia = !!(page.heroImage || page.heroVideo)

  return (
    <>
      <PageHero
        title={page.title}
        heading={page.heroHeading}
        subheading={page.heroSubheading}
        eyebrow={page.heroEyebrow}
        heroImage={page.heroImage ?? null}
        heroVideo={page.heroVideo ?? null}
        primaryCta={page.heroPrimaryCta}
        secondaryCta={page.heroSecondaryCta}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/${slug}` },
        ]}
        category={page.category}
      />

      {/* Block-based sections */}
      {sections.length > 0 && (
        <PageSections
          sections={sections}
          businessName={businessName}
          phone={phone}
          testimonials={testimonials}
          services={services}
          staff={staff}
          promotions={promotions}
        />
      )}

      {/* Legacy body field fallback — only shown when no sections are set */}
      {sections.length === 0 && page.body && page.body.length > 0 && (
        <section className="container py-16 md:py-24">
          <article className="prose prose-lg max-w-4xl mx-auto">
            {/* PortableText rendered via PageSections richText if migrated */}
          </article>
        </section>
      )}

      {/* CTA strip — always shown at the bottom */}
      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-accent-foreground tracking-tight leading-tight">
                Need Help or Have Questions?
              </h2>
              <p className="mt-3 text-accent-foreground/55 text-sm md:text-base max-w-lg leading-relaxed">
                Our team is here to assist you. Give us a call or send an enquiry.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/90 text-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-accent-foreground/40 hover:bg-accent-foreground hover:text-accent text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                Send an Enquiry <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
