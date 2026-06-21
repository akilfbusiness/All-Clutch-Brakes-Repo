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
import type { InternalLink } from "@/sanity/queries"
import { PageHero } from "@/components/page-hero"
import { PageSections } from "@/components/page-sections"
import { Phone, ArrowRight } from "lucide-react"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PhoneLink } from "@/components/phone-link"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  if (!page) return { title: "Not Found" }

  const title       = page.metaTitle       ?? page.title
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
  const siteUrl      = settings?.siteUrl      ?? "https://www.allclutchandbrake.com.au"

  const sections = page.sections ?? []

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.metaDescription || "",
    url: `${siteUrl}/${slug}`,
    isPartOf: { "@type": "WebSite", name: businessName, url: siteUrl },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",       item: siteUrl },
      { "@type": "ListItem", position: 2, name: page.title,   item: `${siteUrl}/${slug}` },
    ],
  }

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

      {/* Internal Links — cross-page linking for SEO/GEO/AEO topical authority */}
      {page.internalLinks && page.internalLinks.length > 0 && (
        <section className="container py-12 md:py-16" aria-labelledby="page-internal-links-heading">
          <h2
            id="page-internal-links-heading"
            className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
          >
            Related Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 border-t border-l border-border">
            {page.internalLinks.map((link: InternalLink) => {
              const typeToPath: Record<string, string> = { service: "/services", post: "/blog", location: "/locations", page: "" }
              let href: string | null = null
              let label: string | null = null
              let description: string | undefined
              if (link.linkType === "reference" && link.page) {
                href = `${typeToPath[link.page._type] ?? ""}/${link.page.slug}`
                label = link.labelOverride || link.page.title
                description = link.description
              } else if (link.linkType === "custom" && link.url && link.label) {
                href = link.url
                label = link.label
                description = link.description
              }
              if (!href || !label) return null
              return (
                <Link
                  key={link._key}
                  href={href}
                  className="group relative border-r border-b border-border p-5 hover:bg-foreground/[0.02] transition-colors"
                >
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300" />
                  <span className="block font-bold text-foreground/80 group-hover:text-foreground transition-colors text-sm leading-snug mb-1">
                    {label}
                  </span>
                  {description && (
                    <span className="block text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                      {description}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Lead Qualification Form */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl">
          <LeadQualificationForm
            businessName={businessName}
            phoneNumber={phone}
            accentColor="#2563EB"
            services={["Clutch Repairs & Replacement", "Brake Services & Repairs", "Transmission Repairs", "Flywheel Machining", "Brake Caliper & Hydraulic Repairs"]}
            webhookUrlPartial="https://n8n-customer-automations.onrender.com/webhook/5384017c-e44f-4844-9965-6e8b78f5be0c"
            webhookUrl1="https://n8n-customer-automations.onrender.com/webhook/1a390a21-4ada-4ffe-a366-0e7fc6afc302"
            webhookUrl2="https://n8n-customer-automations.onrender.com/webhook/242b5f86-aaef-49a5-aa19-2137188f62c6"
            webhookUrlCall="https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"
          />
        </div>
      </section>

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
              <PhoneLink
                phone={phone}
                label="standalone-cta"
                className="inline-flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#E63946]/90 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> {phone}
              </PhoneLink>
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
