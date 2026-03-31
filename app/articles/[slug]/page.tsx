import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { getAllArticleSlugs, getArticleBySlug, getSiteSettings } from "@/sanity/queries"
import type { Article } from "@/sanity/queries"
import { ChevronRight, Calendar, User, Clock, Phone, ArrowLeft } from "lucide-react"

export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.map((s) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  if (!article) {
    return { title: `Article Not Found | ${businessName}` }
  }

  const title = article.seoTitle ?? article.title
  const description = article.seoDescription ?? article.answerCapsule
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `${title} | ${businessName}`,
    description,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      title: `${title} | ${businessName}`,
      description,
      url: `${siteUrl}/articles/${slug}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author?.name ? [article.author.name] : [businessName],
    },
  }
}

const FALLBACK_ARTICLE: Article = {
  title: "How Often Should You Replace Your Clutch?",
  slug: "how-often-replace-clutch",
  answerCapsule: "Most clutches last between 60,000 and 100,000 kilometres, but driving habits, vehicle type, and conditions significantly affect lifespan. Heavy city traffic and towing reduce clutch life considerably.",
  category: "Clutch Care",
  publishedAt: "2024-01-15",
  author: { name: "All Clutch & Brake Team", role: "Service Team", bio: "", photo: null },
  faqItems: [
    {
      question: "What are the signs of a worn clutch?",
      answer: "Common signs include slipping (engine revs but car doesn't accelerate), difficulty shifting, a burning smell, clutch pedal feeling soft or spongy, and unusual noises when pressing the clutch.",
    },
    {
      question: "How much does clutch replacement cost in Adelaide?",
      answer: "Clutch replacement in Adelaide typically costs between $800 and $2,500 depending on the vehicle type, clutch kit quality, and whether the flywheel needs machining or replacement.",
    },
  ],
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [article, settings] = await Promise.all([
    getArticleBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const displayArticle = article ?? (slug === FALLBACK_ARTICLE.slug ? FALLBACK_ARTICLE : null)

  if (!displayArticle) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayArticle.title,
    description: displayArticle.answerCapsule,
    url: `${siteUrl}/articles/${slug}`,
    datePublished: displayArticle.publishedAt,
    dateModified: displayArticle.updatedAt ?? displayArticle.publishedAt,
    author: {
      "@type": "Person",
      name: displayArticle.author?.name ?? businessName,
    },
    publisher: {
      "@type": "LocalBusiness",
      name: businessName,
      url: siteUrl,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${siteUrl}/articles` },
      { "@type": "ListItem", position: 3, name: displayArticle.title, item: `${siteUrl}/articles/${slug}` },
    ],
  }

  const faqSchema = displayArticle.faqItems?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: displayArticle.faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li><Link href="/articles" className="hover:text-orange-500 transition-colors">Articles</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500 truncate max-w-[200px]">{displayArticle.title}</li>
              </ol>
            </nav>

            {displayArticle.category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full mb-4">
                {displayArticle.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {displayArticle.title}
            </h1>

            <p className="text-xl text-zinc-300 max-w-3xl mb-6">
              {displayArticle.answerCapsule}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              {displayArticle.author?.name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {displayArticle.author.name}
                </span>
              )}
              {displayArticle.publishedAt && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={displayArticle.publishedAt}>
                    {new Date(displayArticle.publishedAt).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
              )}
              {displayArticle.updatedAt && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Updated: {new Date(displayArticle.updatedAt).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {displayArticle.body && Array.isArray(displayArticle.body) && displayArticle.body.length > 0 ? (
                <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
                  <PortableText value={displayArticle.body} />
                </div>
              ) : (
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-8 text-center">
                  <p className="text-zinc-600">
                    This article is coming soon. In the meantime, contact our team at {businessName} and we will answer your question directly.
                  </p>
                </div>
              )}

              {/* FAQ Section */}
              {displayArticle.faqItems && displayArticle.faqItems.length > 0 && (
                <section className="mt-16" aria-labelledby="faq-heading">
                  <h2 id="faq-heading" className="text-2xl font-bold text-zinc-900 mb-8">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-6">
                    {displayArticle.faqItems.map((item, index) => (
                      <div key={index} className="bg-zinc-50 border border-zinc-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">
                          {item.question}
                        </h3>
                        <p className="text-zinc-600">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Author Bio */}
              {displayArticle.author?.bio && (
                <section className="mt-16 bg-zinc-50 border border-zinc-200 rounded-lg p-6" aria-label="About the author">
                  <h2 className="text-lg font-semibold text-zinc-900 mb-3">About the Author</h2>
                  <p className="text-zinc-600">{displayArticle.author.bio}</p>
                </section>
              )}
            </div>
          </div>
        </article>

        {/* CTA Section */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need Expert Help?</h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              {businessName} provides expert clutch, brake, and transmission services across Adelaide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Contact Us
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

        {/* Back to Articles */}
        <section className="py-8 bg-zinc-100">
          <div className="container mx-auto px-4">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-orange-600 font-semibold transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
