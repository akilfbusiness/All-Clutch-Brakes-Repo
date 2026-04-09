import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PortableText } from "@portabletext/react"
import Link from "next/link"
import { getSiteSettings, getPageBySlug } from "@/sanity/queries"
import { PageHero } from "@/components/page-hero"
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

  const title = page.metaTitle ?? `${page.title} | ${businessName}`
  const description = page.metaDescription ?? ""

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `${siteUrl}/${slug}`, type: "website" },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug(slug)])

  if (!page) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  return (
    <>
      <PageHero
        title={page.title}
        heading={page.heroHeading}
        subheading={page.heroSubheading}
        heroImage={page.heroImage}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: page.title, href: `/${slug}` },
        ]}
        category={page.category}
      />

      {page.body && page.body.length > 0 && (
        <section className="container py-16 md:py-24">
          <article className="prose prose-lg max-w-4xl mx-auto">
            <PortableText value={page.body} />
          </article>
        </section>
      )}

      <section className="bg-accent overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-[1fr_auto] items-center gap-10 py-16 md:py-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight leading-tight">
                Need Help or Have Questions?
              </h2>
              <p className="mt-3 text-black/55 text-sm md:text-base max-w-lg leading-relaxed">
                Our team is here to assist you. Give us a call or send an enquiry.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm px-8 py-4 transition-all duration-300"
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
