import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Tag } from "lucide-react"
import { getSiteSettings, getAllProjects } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `Projects | ${businessName}`,
    description: `Browse past projects completed by ${businessName} — real work, real results.`,
    alternates: { canonical: "/projects" },
    openGraph: {
      title: `Projects | ${businessName}`,
      description: `Browse past projects completed by ${businessName} — real work, real results.`,
      url: `${siteUrl}/projects`,
      type: "website",
    },
  }
}

export default async function ProjectsPage() {
  const [settings, projects] = await Promise.all([getSiteSettings(), getAllProjects()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${siteUrl}/projects` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* HERO */}
        <section className="bg-zinc-900 text-white py-16 md:py-24">
          <div className="container mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-accent">
                  Projects
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Our Projects
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              A showcase of the work we do — clutch, brake, and transmission jobs across all makes and models.
            </p>
          </div>
        </section>

        {/* PROJECTS GRID */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            {projects.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <article
                    key={project._id}
                    className="bg-card border border-border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors"
                  >
                    <Link href={project.slug ? `/projects/${project.slug}` : "#"} className="block">
                      {/* Image */}
                      <div className="relative h-56 w-full bg-muted overflow-hidden">
                      {project.featuredImage ? (
                        <Image
                          src={urlFor(project.featuredImage).width(800).height(448).fit("crop").url()}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-foreground mb-2 text-balance">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 text-xs bg-secondary text-muted-foreground px-2 py-1 rounded-md"
                            >
                              <Tag className="h-3 w-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                      </div>
                    </article>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-3">No projects yet</h2>
                <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                  Projects will appear here once they are added in the CMS.
                </p>
                <p className="text-sm text-muted-foreground">
                  Go to Sanity Studio → About → Projects → Add item
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zinc-900 py-16">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
              Want Us to Work on Your Vehicle?
            </h2>
            <p className="text-zinc-300 text-lg mb-8 max-w-xl mx-auto">
              Get in touch for a free quote. We work on all makes and models.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Call Now: {phone}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
