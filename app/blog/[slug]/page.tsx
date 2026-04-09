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
  if (!post) return { title: `Post Not Found | ${businessName}` }

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

  const displayDate = displayPost.updatedAt ?? displayPost.publishedAt
  const formattedDisplayDate = new Date(displayDate).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  })

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayPost.title,
    description: displayPost.answerCapsule,
    url: `${siteUrl}/blog/${slug}`,
    datePublished: displayPost.publishedAt,
    dateModified: displayPost.updatedAt ?? displayPost.publishedAt,
    author: { "@type": "Person", name: displayPost.author?.name ?? businessName },
    publisher: { "@type": "LocalBusiness", name: businessName, url: siteUrl },
    ...(displayPost.readTimeMinutes && { timeRequired: `PT${displayPost.readTimeMinutes}M` }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: displayPost.title, item: `${siteUrl}/blog/${slug}` },
    ],
  }

  const faqSchema = displayPost.faqItems?.length
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <main className="min-h-screen bg-background">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative py-16 md:py-24 bg-background border-b border-border overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(5rem,14vw,10rem)] font-bold tracking-tighter text-foreground/[0.06] leading-none"
          >
            Article
          </span>
          <div className="container mx-auto px-6 relative">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-[11px] text-foreground/40 flex-wrap uppercase tracking-widest">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-accent truncate max-w-[180px]">{displayPost.title}</li>
              </ol>
            </nav>

            {/* Category */}
            {displayPost.category && (
              <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/30 text-accent px-2.5 py-1 mb-5">
                {displayPost.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-6 max-w-4xl">
              {displayPost.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 text-[11px] text-foreground/50 uppercase tracking-widest">
              {displayPost.author?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {displayPost.author.name}
                  {displayPost.author.role && <span className="text-foreground/30">· {displayPost.author.role}</span>}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Updated {formattedDisplayDate}
              </span>
              {displayPost.readTimeMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {displayPost.readTimeMinutes} min read
                </span>
              )}
            </div>

            {/* Geo tags */}
            {displayPost.geoTags && displayPost.geoTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <MapPin className="h-3.5 w-3.5 text-foreground/30 flex-shrink-0" />
                {displayPost.geoTags.map((tag) => (
                  <span key={tag} className="text-[10px] text-foreground/40 border border-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── Hero Image ────────────────────────────────────────── */}
        {displayPost.heroImage && (
          <div className="relative w-full h-64 md:h-[480px] bg-foreground/5 overflow-hidden border-b border-border">
            <Image
              src={urlFor(displayPost.heroImage).width(1400).height(600).url()}
              alt={displayPost.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        )}

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">

            {/* TL;DR box */}
            <div className="border-l-4 border-accent bg-foreground/[0.03] p-5 mb-10">
              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">
                TL;DR — Quick Answer
              </p>
              <p className="text-foreground/80 font-medium leading-relaxed">
                {displayPost.answerCapsule}
              </p>
            </div>

            {/* Quick Answers */}
            {displayPost.quickAnswers && displayPost.quickAnswers.length > 0 && (
              <section className="mb-12" aria-labelledby="quick-answers-heading">
                <h2
                  id="quick-answers-heading"
                  className="text-xl font-bold tracking-tight mb-5 pb-3 border-b border-border"
                >
                  Key Questions — Quick Answers
                </h2>
                <div className="space-y-3">
                  {displayPost.quickAnswers.map((qa, index) => (
                    <div key={index} className="border border-border p-5 hover:border-accent/40 transition-colors">
                      <h3 className="text-sm font-bold text-foreground mb-2">{qa.question}</h3>
                      <p className="text-foreground/60 leading-relaxed text-sm">{qa.quickAnswer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Main body */}
            {displayPost.body && Array.isArray(displayPost.body) && displayPost.body.length > 0 ? (
              <div className="prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground mb-12">
                <PortableText value={displayPost.body} />
              </div>
            ) : (
              <div className="border border-border p-8 text-center mb-12">
                <p className="text-foreground/60">
                  This post is coming soon. In the meantime, contact our team at{" "}
                  {businessName} and we will answer your question directly.
                </p>
              </div>
            )}

            {/* FAQ */}
            {displayPost.faqItems && displayPost.faqItems.length > 0 && (
              <section className="mb-12" aria-labelledby="faq-heading">
                <h2
                  id="faq-heading"
                  className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {displayPost.faqItems.map((item, index) => (
                    <div key={index} className="border border-border p-5">
                      <h3 className="text-sm font-bold text-foreground mb-3">{item.question}</h3>
                      <p className="text-foreground/60 leading-relaxed text-sm">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Data Sources */}
            {displayPost.dataSources && displayPost.dataSources.length > 0 && (
              <section className="mb-12 border border-border p-6" aria-labelledby="sources-heading">
                <h2
                  id="sources-heading"
                  className="text-[11px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-4"
                >
                  Sources &amp; References
                </h2>
                <ul className="space-y-2">
                  {displayPost.dataSources.map((source, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-foreground/30 flex-shrink-0 mt-0.5" />
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
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
              <section className="mb-12 border border-border p-6" aria-label="About the author">
                <h2 className="text-[11px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-3">
                  About the Author
                </h2>
                <p className="text-foreground/60 leading-relaxed text-sm">{displayPost.author.bio}</p>
              </section>
            )}

            {/* Related Posts */}
            {displayPost.relatedPosts && displayPost.relatedPosts.length > 0 && (
              <section className="mb-12" aria-labelledby="related-heading">
                <h2
                  id="related-heading"
                  className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
                >
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border">
                  {displayPost.relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/blog/${related.slug}`}
                      className="group relative border-r border-b border-border p-5 hover:bg-foreground/[0.02] transition-colors"
                    >
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300" />
                      {related.category && (
                        <span className="text-[10px] font-bold text-accent/70 uppercase tracking-[0.15em] block mb-2">
                          {related.category}
                        </span>
                      )}
                      <h3 className="font-bold text-foreground/80 group-hover:text-foreground transition-colors text-sm leading-snug mb-2">
                        {related.title}
                      </h3>
                      {related.readTimeMinutes && (
                        <span className="flex items-center gap-1 text-[11px] text-foreground/40">
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
            <div className="border-t border-border pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent font-semibold transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Posts
              </Link>
            </div>
          </div>
        </div>

        {/* ── CTA Strip ──────────────────────────────────────────── */}
        <section className="bg-accent py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
              {displayPost.ctaHeading ?? "Need Expert Help?"}
            </h2>
            <p className="text-black/70 mb-8 max-w-xl mx-auto">
              {displayPost.ctaBody ??
                `${businessName} provides expert clutch, brake, and transmission services across Adelaide.`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                Get a Free Quote
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
