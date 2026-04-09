import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, getSiteSettings } from "@/sanity/queries"
import type { Post } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { ChevronRight, Calendar, User, Clock, Phone, ArrowRight } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: settings?.articlesPageSeoTitle ?? `Blog | ${businessName}`,
    description:
      settings?.articlesPageSeoDescription ??
      "Expert guides and answers about clutch, brake, and transmission repairs. Tips, maintenance advice, and industry insights from Adelaide's specialists.",
    alternates: { canonical: "/blog" },
    openGraph: {
      title: settings?.articlesPageSeoTitle ?? `Blog | ${businessName}`,
      description:
        settings?.articlesPageSeoDescription ??
        "Expert guides and answers about clutch, brake, and transmission repairs.",
      url: `${siteUrl}/blog`,
      type: "website",
    },
  }
}

const FALLBACK_POSTS: Post[] = [
  {
    title: "How Often Should You Replace Your Clutch?",
    slug: "how-often-replace-clutch",
    answerCapsule:
      "Most clutches last between 60,000 and 100,000 kilometres, but driving habits, vehicle type, and conditions significantly affect lifespan.",
    category: "Clutch Care",
    publishedAt: "2024-01-15",
    readTimeMinutes: 6,
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
  {
    title: "Signs Your Brakes Need Immediate Attention",
    slug: "signs-brakes-need-attention",
    answerCapsule:
      "Squealing sounds, vibrations when braking, longer stopping distances, and a soft brake pedal are warning signs that require immediate inspection.",
    category: "Brake Safety",
    publishedAt: "2024-01-22",
    readTimeMinutes: 5,
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
  {
    title: "Manual vs Automatic Transmission: Maintenance Differences",
    slug: "manual-vs-automatic-transmission-maintenance",
    answerCapsule:
      "Manual transmissions typically require clutch replacement and gear oil changes, while automatics need regular fluid and filter services.",
    category: "Transmission",
    publishedAt: "2024-02-01",
    readTimeMinutes: 8,
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
]

export default async function BlogPage() {
  const [settings, fetched] = await Promise.all([
    getSiteSettings(),
    getAllPosts().catch(() => null),
  ])

  const posts = fetched && fetched.length > 0 ? fetched : FALLBACK_POSTS
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog | ${businessName}`,
    description: "Expert guides and answers about clutch, brake, and transmission repairs.",
    url: `${siteUrl}/blog`,
    publisher: { "@type": "LocalBusiness", name: businessName, url: siteUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }} />

      <main className="min-h-screen bg-background">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative py-24 md:py-36 bg-background border-b border-border overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(5rem,16vw,13rem)] font-bold tracking-tighter text-foreground/[0.06] leading-none"
          >
            Blog
          </span>
          <div className="container mx-auto px-6 relative">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-[11px] text-foreground/40 uppercase tracking-widest">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-accent">Blog</li>
              </ol>
            </nav>

            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-accent mb-4">
              Resources &amp; Insights
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-6">
              {settings?.articlesPageHeroTitle ?? "Blog & Resources"}
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl leading-relaxed">
              {settings?.articlesPageHeroSubtitle ??
                "Expert guides and answers about clutch, brake, and transmission repairs from Adelaide's specialists."}
            </p>
            <p className="mt-4 text-sm text-foreground/40 font-medium">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>
        </section>

        {/* ── Posts Grid ─────────────────────────────────────────── */}
        <section className="py-16 md:py-24" aria-label="Blog post listing">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group border-r border-b border-border flex flex-col relative overflow-hidden"
                >
                  {/* Accent hover line */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-500 z-10" />

                  {/* Featured image */}
                  {post.heroImage ? (
                    <div className="relative h-52 w-full overflow-hidden bg-foreground/5 flex-shrink-0">
                      <Image
                        src={urlFor(post.heroImage).width(600).height(300).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      {post.category && (
                        <span className="absolute top-4 left-4 text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/30 text-accent bg-background/80 px-2.5 py-1 backdrop-blur-sm">
                          {post.category}
                        </span>
                      )}
                    </div>
                  ) : (
                    post.category && (
                      <div className="px-6 pt-6">
                        <span className="text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/20 text-accent/70 px-2.5 py-1">
                          {post.category}
                        </span>
                      </div>
                    )
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Read time */}
                    {post.readTimeMinutes && (
                      <div className="flex items-center gap-1.5 text-[11px] text-foreground/40 mb-3">
                        <Clock className="h-3 w-3" />
                        {post.readTimeMinutes} min read
                      </div>
                    )}

                    <h2 className="text-lg font-bold tracking-tight leading-snug mb-3 group-hover:text-accent transition-colors flex-1">
                      <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                        {post.title}
                      </Link>
                    </h2>

                    {post.answerCapsule && (
                      <p className="text-foreground/60 mb-5 line-clamp-3 text-sm leading-relaxed">
                        {post.answerCapsule}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="flex items-center justify-between text-[11px] text-foreground/40 mt-auto pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <time dateTime={post.publishedAt}>
                              {new Date(post.publishedAt).toLocaleDateString("en-AU", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </time>
                          </span>
                        )}
                        {post.author?.name && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author.name}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-accent group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Strip ──────────────────────────────────────────── */}
        <section className="bg-accent py-16" aria-label="Contact call to action">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">
              Have a Question We Can Answer?
            </h2>
            <p className="text-black/70 mb-8 max-w-xl mx-auto">
              Contact our team — we&apos;re happy to provide expert advice on clutch, brake, and transmission issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                Get in Touch
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
