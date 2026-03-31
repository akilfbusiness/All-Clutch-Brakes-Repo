import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PortableText } from "@portabletext/react"
import { getAllPostSlugs, getPostBySlug, getSiteSettings } from "@/sanity/queries"
import type { Post } from "@/sanity/queries"
import { urlFor } from "@/sanity/image"
import {
  ChevronRight,
  Calendar,
  User,
  Clock,
  Phone,
  ArrowLeft,
  MapPin,
  ExternalLink,
} from "lucide-react"

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
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
  const [post, settings] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  if (!post) {
    return { title: `Post Not Found | ${businessName}` }
  }

  const title = post.seoTitle ?? post.title
  const description = post.seoDescription ?? post.answerCapsule
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `${title} | ${businessName}`,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${title} | ${businessName}`,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : [businessName],
    },
  }
}

const FALLBACK_POST: Post = {
  title: "How Often Should You Replace Your Clutch?",
  slug: "how-often-replace-clutch",
  answerCapsule:
    "Most clutches last between 60,000 and 100,000 kilometres, but driving habits, vehicle type, and conditions significantly affect lifespan. Heavy city traffic and towing reduce clutch life considerably.",
  category: "Clutch Care",
  publishedAt: "2024-01-15",
  readTimeMinutes: 6,
  author: { name: "All Clutch & Brake Team", role: "Service Team", bio: "", photo: null },
  quickAnswers: [
    {
      question: "How long does a clutch last?",
      quickAnswer:
        "Most clutches last between 60,000 and 100,000 km. City drivers and those who tow regularly may see failure as early as 40,000 km.",
    },
    {
      question: "What are the signs of a worn clutch?",
      quickAnswer:
        "Slipping (engine revs without acceleration), burning smell, difficulty shifting, and a spongy or vibrating clutch pedal are the main warning signs.",
    },
  ],
  faqItems: [
    {
      question: "What are the signs of a worn clutch?",
      answer:
        "Common signs include slipping (engine revs but car doesn't accelerate), difficulty shifting, a burning smell, clutch pedal feeling soft or spongy, and unusual noises when pressing the clutch.",
    },
    {
      question: "How much does clutch replacement cost in Adelaide?",
      answer:
        "Clutch replacement in Adelaide typically costs between $800 and $2,500 depending on the vehicle type, clutch kit quality, and whether the flywheel needs machining or replacement.",
    },
  ],
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, settings] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getSiteSettings(),
  ])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const displayPost = post ?? (slug === FALLBACK_POST.slug ? FALLBACK_POST : null)

  if (!displayPost) notFound()

  // Derive display date — prefer updatedAt, fall back to publishedAt
  const displayDate = displayPost.updatedAt ?? displayPost.publishedAt
  const formattedDisplayDate = new Date(displayDate).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  })

  // ─── Structured Data ────────────────────────────────────────────────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayPost.title,
    description: displayPost.answerCapsule,
    url: `${siteUrl}/blog/${slug}`,
    datePublished: displayPost.publishedAt,
    dateModified: displayPost.updatedAt ?? displayPost.publishedAt,
    author: {
      "@type": "Person",
      name: displayPost.author?.name ?? businessName,
    },
    publisher: {
      "@type": "LocalBusiness",
      name: businessName,
      url: siteUrl,
    },
    ...(displayPost.readTimeMinutes && {
      timeRequired: `PT${displayPost.readTimeMinutes}M`,
    }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: displayPost.title,
        item: `${siteUrl}/blog/${slug}`,
      },
    ],
  }

  const faqSchema =
    displayPost.faqItems?.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: displayPost.faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-background">

        {/* ── Hero ───────────────────────────────────────────────────────────── */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-orange-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li>
                  <Link href="/blog" className="hover:text-orange-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-orange-500 truncate max-w-[220px]">
                  {displayPost.title}
                </li>
              </ol>
            </nav>

            {/* Category badge */}
            {displayPost.category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-orange-500 text-white rounded-full mb-4">
                {displayPost.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              {displayPost.title}
            </h1>

            {/* Author / date / read time row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              {displayPost.author?.name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {displayPost.author.name}
                  {displayPost.author.role && (
                    <span className="text-zinc-500">· {displayPost.author.role}</span>
                  )}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Updated {formattedDisplayDate}
              </span>
              {displayPost.readTimeMinutes && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {displayPost.readTimeMinutes} min read
                </span>
              )}
            </div>

            {/* Geo tags */}
            {displayPost.geoTags && displayPost.geoTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <MapPin className="h-4 w-4 text-zinc-500 flex-shrink-0" />
                {displayPost.geoTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Hero Image ────────────────────────────────────────────────────── */}
        {displayPost.heroImage && (
          <div className="relative w-full h-64 md:h-96 bg-zinc-200 overflow-hidden">
            <Image
              src={urlFor(displayPost.heroImage).width(1400).height(600).url()}
              alt={displayPost.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* ── Content Layout ─────────────────────────────────────────────────── */}
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">

            {/* TL;DR / Answer Capsule box */}
            <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-xl p-5 mb-10">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2">
                TL;DR — Quick Answer
              </p>
              <p className="text-zinc-800 font-medium leading-relaxed">
                {displayPost.answerCapsule}
              </p>
            </div>

            {/* Quick Answers section */}
            {displayPost.quickAnswers && displayPost.quickAnswers.length > 0 && (
              <section className="mb-12" aria-labelledby="quick-answers-heading">
                <h2
                  id="quick-answers-heading"
                  className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2"
                >
                  Key Questions — Quick Answers
                </h2>
                <div className="space-y-4">
                  {displayPost.quickAnswers.map((qa, index) => (
                    <div
                      key={index}
                      className="bg-white border border-zinc-200 rounded-xl p-5 hover:border-orange-200 transition-colors"
                    >
                      <h3 className="text-base font-semibold text-zinc-900 mb-2">
                        {qa.question}
                      </h3>
                      <p className="text-zinc-700 leading-relaxed font-medium text-sm">
                        {qa.quickAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Main body */}
            {displayPost.body &&
            Array.isArray(displayPost.body) &&
            displayPost.body.length > 0 ? (
              <div className="prose prose-lg prose-zinc max-w-none prose-headings:font-bold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-zinc-900 mb-12">
                <PortableText value={displayPost.body} />
              </div>
            ) : (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-8 text-center mb-12">
                <p className="text-zinc-600">
                  This post is coming soon. In the meantime, contact our team at{" "}
                  {businessName} and we will answer your question directly.
                </p>
              </div>
            )}

            {/* FAQ — Short list (for schema + scanning) */}
            {displayPost.faqItems && displayPost.faqItems.length > 0 && (
              <section className="mb-12" aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="text-2xl font-bold text-zinc-900 mb-6"
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-5">
                  {displayPost.faqItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-zinc-50 border border-zinc-200 rounded-xl p-6"
                    >
                      <h3 className="text-base font-semibold text-zinc-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="text-zinc-600 leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Data Sources */}
            {displayPost.dataSources && displayPost.dataSources.length > 0 && (
              <section
                className="mb-12 bg-zinc-50 border border-zinc-200 rounded-xl p-6"
                aria-labelledby="sources-heading"
              >
                <h2
                  id="sources-heading"
                  className="text-base font-bold text-zinc-900 mb-4"
                >
                  Sources & References
                </h2>
                <ul className="space-y-2">
                  {displayPost.dataSources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline"
                      >
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Author Bio */}
            {displayPost.author?.bio && (
              <section
                className="mb-12 bg-zinc-50 border border-zinc-200 rounded-xl p-6"
                aria-label="About the author"
              >
                <h2 className="text-base font-semibold text-zinc-900 mb-3">
                  About the Author
                </h2>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  {displayPost.author.bio}
                </p>
              </section>
            )}

            {/* Related Posts */}
            {displayPost.relatedPosts && displayPost.relatedPosts.length > 0 && (
              <section className="mb-12" aria-labelledby="related-heading">
                <h2
                  id="related-heading"
                  className="text-2xl font-bold text-zinc-900 mb-6"
                >
                  Related Posts
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {displayPost.relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition-all"
                    >
                      {related.category && (
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide block mb-2">
                          {related.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-zinc-900 group-hover:text-orange-600 transition-colors mb-2 text-sm leading-snug">
                        {related.title}
                      </h3>
                      {related.readTimeMinutes && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock className="h-3 w-3" />
                          {related.readTimeMinutes} min read
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Back to Blog */}
            <div className="border-t border-zinc-200 pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-zinc-600 hover:text-orange-600 font-semibold transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Posts
              </Link>
            </div>
          </div>
        </div>

        {/* ── End CTA ─────────────────────────────────────────────────────────── */}
        <section className="bg-zinc-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {displayPost.ctaHeading ?? "Need Expert Help?"}
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              {displayPost.ctaBody ??
                `${businessName} provides expert clutch, brake, and transmission services across Adelaide.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Get a Free Quote
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
