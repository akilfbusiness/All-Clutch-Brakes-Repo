import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ArrowRight } from "lucide-react"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"
import { PageHero } from "@/components/page-hero"

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

  const title = page?.title || "Miscellaneous"
  const heroHeading = page?.heroHeading
  const heroSubheading = page?.heroSubheading || `Additional products and parts available from ${businessName}. Content for this section is being updated — get in touch and we can help you find what you need.`
  const heroImage = page?.heroImage

  return (
    <>
      <PageHero
        title={title}
        heading={heroHeading}
        subheading={heroSubheading}
        heroImage={heroImage}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Miscellaneous", href: "/miscellaneous" },
        ]}
        category="Parts & Products"
      />

      <section className="container py-16 md:py-20">
        <div className="max-w-4xl">
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
      </section>

      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
                Can&apos;t Find What You Need?
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                Call us directly and we&apos;ll let you know if we have what you&apos;re looking for in stock.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5">
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300">
                Send an Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
