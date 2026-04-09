import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Phone } from "lucide-react"
import { getSiteSettings, getProjectBySlug, getAllProjectSlugs } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [settings, project] = await Promise.all([getSiteSettings(), getProjectBySlug(slug)])
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  if (!project) return { title: `Project Not Found | ${businessName}` }

  return {
    title: `${project.title} | ${businessName}`,
    description: project.description ?? `View details of the ${project.title} project by ${businessName}.`,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.title} | ${businessName}`,
      description: project.description ?? "",
      url: `${siteUrl}/projects/${slug}`,
      type: "website",
    },
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const [settings, project] = await Promise.all([getSiteSettings(), getProjectBySlug(slug)])

  if (!project) notFound()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${siteUrl}/projects/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-background">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative bg-background border-b border-border overflow-hidden">
          {/* Full-bleed image */}
          {project.featuredImage && (
            <div className="relative h-72 md:h-[520px] w-full">
              <Image
                src={urlFor(project.featuredImage).width(1600).height(900).fit("crop").url()}
                alt={project.title}
                fill
                priority
                className="object-cover opacity-50"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            </div>
          )}

          {/* Overlay content */}
          <div
            className={`container mx-auto px-6 ${
              project.featuredImage ? "relative -mt-40 md:-mt-56 pb-16" : "py-24 md:py-36"
            }`}
          >
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-[11px] text-foreground/40 flex-wrap uppercase tracking-widest">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li><Link href="/projects" className="hover:text-accent transition-colors">Projects</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-accent truncate max-w-[200px]">{project.title}</li>
              </ol>
            </nav>

            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-4">Case Study</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none text-foreground mb-6">
              {project.title}
            </h1>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/20 text-accent/70 px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Description ───────────────────────────────────────── */}
        {project.description && (
          <section className="py-16 md:py-20 border-b border-border">
            <div className="container mx-auto px-6 max-w-3xl">
              <p className="text-foreground/70 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </section>
        )}

        {/* ── Gallery ───────────────────────────────────────────── */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-16 md:py-20 border-b border-border">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold tracking-tight mb-10 pb-4 border-b border-border">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
                {project.gallery.map((img, i) => (
                  <figure key={i} className="border-r border-b border-border group overflow-hidden">
                    {img.asset && (
                      <div className="relative h-56 w-full bg-foreground/5">
                        <Image
                          src={img.asset}
                          alt={img.caption ?? `${project.title} — image ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    {img.caption && (
                      <figcaption className="px-4 py-3 text-xs text-foreground/50 border-t border-border">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Back + CTA ────────────────────────────────────────── */}
        <section className="py-12 md:py-16 border-b border-border">
          <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent transition-colors text-sm font-medium"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to all projects
            </Link>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call Now: {phone}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border hover:border-accent text-foreground px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA Strip ──────────────────────────────────────────── */}
        <section className="bg-accent py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
              Want Similar Work Done?
            </h2>
            <p className="text-black/70 mb-8 max-w-xl mx-auto">
              {businessName} handles clutch, brake, and transmission jobs of all sizes. Get in touch today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                Contact Us
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 border border-black/30 hover:border-black text-black px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
