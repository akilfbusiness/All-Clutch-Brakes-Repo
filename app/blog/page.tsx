import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, getSiteSettings } from "@/sanity/queries"
import type { Post } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import { Phone, ChevronRight, Calendar, User, Clock } from "lucide-react"

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
    description:
      "Expert guides and answers about clutch, brake, and transmission repairs.",
    url: `${siteUrl}/blog`,
    publisher: {
      "@type": "LocalBusiness",
      name: businessName,
      url: siteUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-orange-500">
                  Blog
                </li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {settings?.articlesPageHeroTitle ?? "Blog & Resources"}
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              {settings?.articlesPageHeroSubtitle ??
                "Expert guides and answers about clutch, brake, and transmission repairs. Tips, maintenance advice, and industry insights from Adelaide's specialists."}
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-16 md:py-24" aria-label="Blog post listing">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                >
                  {/* Featured image */}
                  {post.heroImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100 flex-shrink-0">
                      <Image
                        src={urlFor(post.heroImage).width(600).height(300).url()}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Category + read time */}
                    <div className="flex items-center justify-between mb-3">
                      {post.category && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                          {post.category}
                        </span>
                      )}
                      {post.readTimeMinutes && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {post.readTimeMinutes} min read
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-orange-600 transition-colors flex-1">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {post.answerCapsule && (
                      <p className="text-zinc-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {post.answerCapsule}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-5">
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

                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors text-sm mt-auto"
                      aria-label={`Read full post: ${post.title}`}
                    >
                      Read Post
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-zinc-900 text-white py-16" aria-label="Contact call to action">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Have a Question We Can Answer?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Contact our team — we&apos;re happy to provide expert advice on clutch,
              brake, and transmission issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Get in Touch
              </Link>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                {phone}
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
