import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, Tag } from "lucide-react"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* HERO IMAGE */}
        <section className="relative bg-zinc-900 text-white">
          {project.featuredImage && (
            <div className="relative h-72 md:h-[480px] w-full">
              <Image
                src={urlFor(project.featuredImage).width(1600).height(900).fit("crop").url()}
                alt={project.title}
                fill
                priority
                className="object-cover opacity-60"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            </div>
          )}
          <div className={`container mx-auto py-12 md:py-16 ${project.featuredImage ? "relative -mt-40 md:-mt-56" : ""}`}>
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li><Link href="/projects" className="hover:text-accent transition-colors">Projects</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-accent truncate max-w-[200px]">{project.title}</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance text-white mb-4">
              {project.title}
            </h1>
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-accent/20 text-accent px-3 py-1 rounded-full font-medium"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DESCRIPTION */}
        {project.description && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto max-w-3xl">
              <p className="text-foreground text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          </section>
        )}

        {/* GALLERY */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-12 md:py-16 bg-secondary/20 border-y border-border">
            <div className="container mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Project Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((img, i) => (
                  <figure key={i} className="overflow-hidden rounded-xl bg-muted">
                    {img.asset && (
                      <div className="relative h-56 w-full">
                        <Image
                          src={img.asset}
                          alt={img.caption ?? `${project.title} — image ${i + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    {img.caption && (
                      <figcaption className="px-4 py-2 text-sm text-muted-foreground">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BACK + CTA */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to all projects
            </Link>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Call Now: {phone}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
