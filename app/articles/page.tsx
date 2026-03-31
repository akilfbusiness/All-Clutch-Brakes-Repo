import type { Metadata } from "next"
import Link from "next/link"
import { getAllArticles } from "@/sanity/queries"
import type { Article } from "@/sanity/queries"
import { getSiteSettings } from "@/sanity/queries"
import { Phone, ChevronRight, Calendar, User } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: `Articles & Resources | ${businessName}`,
    description: "Expert guides and answers about clutch, brake, and transmission repairs. Tips, maintenance advice, and industry insights from Adelaide's specialists.",
    alternates: { canonical: "/articles" },
    openGraph: {
      title: `Articles & Resources | ${businessName}`,
      description: "Expert guides and answers about clutch, brake, and transmission repairs.",
      url: `${siteUrl}/articles`,
      type: "website",
    },
  }
}

// Fallback articles shown before Sanity is connected
const FALLBACK_ARTICLES: Article[] = [
  {
    title: "How Often Should You Replace Your Clutch?",
    slug: "how-often-replace-clutch",
    answerCapsule: "Most clutches last between 60,000 and 100,000 kilometres, but driving habits, vehicle type, and conditions significantly affect lifespan.",
    category: "Clutch Care",
    publishedAt: "2024-01-15",
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
  {
    title: "Signs Your Brakes Need Immediate Attention",
    slug: "signs-brakes-need-attention",
    answerCapsule: "Squealing sounds, vibrations when braking, longer stopping distances, and a soft brake pedal are warning signs that require immediate inspection.",
    category: "Brake Safety",
    publishedAt: "2024-01-22",
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
  {
    title: "Manual vs Automatic Transmission: Maintenance Differences",
    slug: "manual-vs-automatic-transmission-maintenance",
    answerCapsule: "Manual transmissions typically require clutch replacement and gear oil changes, while automatics need regular fluid and filter services.",
    category: "Transmission",
    publishedAt: "2024-02-01",
    author: { name: "All Clutch & Brake Team", role: "", bio: "", photo: null },
  },
]

export default async function ArticlesPage() {
  const [settings, fetched] = await Promise.all([
    getSiteSettings(),
    getAllArticles().catch(() => null),
  ])

  const articles = fetched && fetched.length > 0 ? fetched : FALLBACK_ARTICLES
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/articles` },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Articles & Resources | ${businessName}`,
    description: "Expert guides and answers about clutch, brake, and transmission repairs.",
    url: `${siteUrl}/articles`,
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
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                </li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">Articles</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Articles &amp; Resources
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              Expert guides and answers about clutch, brake, and transmission repairs. 
              Tips, maintenance advice, and industry insights from Adelaide&apos;s specialists.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 md:py-24" aria-label="Article listing">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article 
                  key={article.slug}
                  className="group bg-white border border-zinc-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    {article.category && (
                      <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full mb-4">
                        {article.category}
                      </span>
                    )}
                    
                    <h2 className="text-xl font-bold text-zinc-900 mb-3 group-hover:text-orange-600 transition-colors">
                      <Link href={`/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    {article.answerCapsule && (
                      <p className="text-zinc-600 mb-4 line-clamp-3">
                        {article.answerCapsule}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                      {article.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={article.publishedAt}>
                            {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </span>
                      )}
                      {article.author?.name && (
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {article.author.name}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                      aria-label={`Read full article: ${article.title}`}
                    >
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
