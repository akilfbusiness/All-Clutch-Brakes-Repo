import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { PortableText, type PortableTextComponents } from "@portabletext/react"
import { getAllPostSlugs, getPostBySlug, getSiteSettings } from "@/sanity/queries"
import type { Post, InternalLink } from "@/sanity/queries"
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
  Info,
  Lightbulb,
  AlertTriangle,
  XCircle,
  Youtube,
} from "lucide-react"
import { LeadQualificationForm } from "@/components/lead-qualification-form"
import { PhoneLink } from "@/components/phone-link"

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
  if (!post) return { title: "Post Not Found" }

  const title = post.seoTitle ?? post.title
  const description = post.seoDescription ?? post.answerCapsule
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : [businessName],
    },
  }
}

// ── Callout styling map ────────────────────────────────────────────────────────
const calloutConfig = {
  info: {
    icon: Info,
    border: "border-blue-500/40",
    bg: "bg-blue-500/[0.06]",
    label: "Info",
    labelColor: "text-blue-400",
  },
  tip: {
    icon: Lightbulb,
    border: "border-green-500/40",
    bg: "bg-green-500/[0.06]",
    label: "Tip",
    labelColor: "text-green-400",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/[0.06]",
    label: "Warning",
    labelColor: "text-yellow-400",
  },
  danger: {
    icon: XCircle,
    border: "border-red-500/40",
    bg: "bg-red-500/[0.06]",
    label: "Danger",
    labelColor: "text-red-400",
  },
} as const

// ── Resolve hybrid InternalLink for blog page rendering ───────────────────────
function resolveBlogLink(link: InternalLink): { href: string; label: string; description?: string } | null {
  const typeToPath: Record<string, string> = { service: "/services", post: "/blog", location: "/locations", page: "" }
  if (link.linkType === "reference" && link.page) {
    return {
      href: `${typeToPath[link.page._type] ?? ""}/${link.page.slug}`,
      label: link.labelOverride || link.page.title,
      description: link.description,
    }
  }
  if (link.linkType === "custom" && link.url && link.label) {
    return { href: link.url, label: link.label, description: link.description }
  }
  return null
}

// ── YouTube URL → embed ID ─────────────────────────────────────────────────────
function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  return match?.[1] ?? null
}

// ── Portable Text custom components ───────────────────────────────────────────
const portableTextComponents: PortableTextComponents = {
  types: {
    // ── Image ────────────────────────────────────────────────────────────────
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden border border-border">
            <Image
              src={urlFor(value).width(900).url()}
              alt={value.alt ?? ""}
              width={900}
              height={500}
              className="w-full h-auto object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-xs text-foreground/40 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // ── Table ────────────────────────────────────────────────────────────────
    tableBlock: ({ value }: any) => {
      if (!value?.rows?.length) return null
      return (
        <div className="my-8 overflow-x-auto border border-border">
          {value.caption && (
            <p className="px-4 py-2 text-xs text-foreground/40 italic border-b border-border">
              {value.caption}
            </p>
          )}
          <table className="w-full text-sm">
            {value.headers?.length > 0 && (
              <thead className="bg-foreground/[0.05]">
                <tr>
                  {value.headers.map((header: string, i: number) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-foreground/70 border-r border-border last:border-r-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {value.rows.map((row: any, ri: number) => (
                <tr key={ri} className="border-t border-border even:bg-foreground/[0.02]">
                  {(row.cells ?? []).map((cell: string, ci: number) => (
                    <td
                      key={ci}
                      className="px-4 py-3 text-foreground/70 border-r border-border last:border-r-0"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },

    // ── Callout ──────────────────────────────────────────────────────────────
    callout: ({ value }: any) => {
      const config = calloutConfig[value.type as keyof typeof calloutConfig] ?? calloutConfig.info
      const Icon = config.icon
      return (
        <div className={`my-6 border-l-4 p-5 ${config.border} ${config.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${config.labelColor}`}>
              {value.heading ?? config.label}
            </span>
          </div>
          <p className="text-foreground/70 leading-relaxed text-sm">{value.body}</p>
        </div>
      )
    },

    // ── Comparison Block ─────────────────────────────────────────────────────
    comparisonBlock: ({ value }: any) => (
      <div className="my-8 border border-border">
        {value.heading && (
          <div className="border-b border-border px-5 py-3">
            <p className="text-sm font-bold text-foreground/80">{value.heading}</p>
          </div>
        )}
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="p-5">
            <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.15em] mb-3">
              {value.leftLabel ?? "Pros"}
            </p>
            <ul className="space-y-2">
              {(value.leftPoints ?? []).map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">+</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-5">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.15em] mb-3">
              {value.rightLabel ?? "Cons"}
            </p>
            <ul className="space-y-2">
              {(value.rightPoints ?? []).map((point: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">−</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ),

    // ── YouTube Embed ─────────────────────────────────────────────────────────
    youtubeEmbed: ({ value }: any) => {
      const id = getYoutubeId(value.url ?? "")
      if (!id) return null
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-video border border-border overflow-hidden">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={value.caption ?? "Embedded video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-foreground/40 italic">
              <Youtube className="h-3 w-3" />
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },

    // ── Pull Quote ────────────────────────────────────────────────────────────
    pullQuote: ({ value }: any) => (
      <blockquote className="my-8 border-l-4 border-accent pl-6 py-2">
        <p className="text-xl font-medium leading-relaxed text-foreground/80 italic">
          &ldquo;{value.quote}&rdquo;
        </p>
        {value.attribution && (
          <cite className="mt-3 block text-xs text-foreground/40 not-italic uppercase tracking-widest">
            — {value.attribution}
          </cite>
        )}
      </blockquote>
    ),

    // ── Divider ───────────────────────────────────────────────────────────────
    divider: ({ value }: any) => (
      <hr
        className={`border-border ${value?.style === "spaced" ? "my-16" : "my-8"}`}
      />
    ),
  },

  marks: {
    // External / internal link
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
      >
        {children}
      </a>
    ),
    code: ({ children }: any) => (
      <code className="bg-foreground/[0.08] text-accent px-1.5 py-0.5 rounded text-[0.85em] font-mono">
        {children}
      </code>
    ),
  },

  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold tracking-tight mt-8 mb-3 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold tracking-tight mt-6 mb-2 text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-border pl-5 py-1 my-6 text-foreground/60 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="leading-relaxed text-foreground/70 mb-4">{children}</p>
    ),
  },
}

// ── Fallback post ──────────────────────────────────────────────────────────────
const FALLBACK_POST: Post = {
  title: "How Often Should You Replace Your Clutch?",
  slug: "how-often-replace-clutch",
  answerCapsule:
    "Most clutches last between 60,000 and 100,000 kilometres, but driving habits, vehicle type, and conditions significantly affect lifespan. Heavy city traffic and towing reduce clutch life considerably.",
  category: "Clutch Care",
  publishedAt: "2024-01-15",
  readTimeMinutes: 6,
  author: { name: "All Clutch & Brake Team", role: "Service Team", bio: "", credentials: "", photo: null },
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

  // ── Structured data ────────────────────────────────────────────────────────
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
      ...(displayPost.author?.credentials && { description: displayPost.author.credentials }),
    },
    publisher: { "@type": "LocalBusiness", name: businessName, url: siteUrl },
    ...(displayPost.readTimeMinutes && { timeRequired: `PT${displayPost.readTimeMinutes}M` }),
    // Speakable — points AI assistants at the two highest-value sections
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#answer-capsule", "#faq-section"],
    },
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

        {/* ── Hero — AEO-ordered: Breadcrumb → Category → H1 → Answer Capsule → FAQ ── */}
        <section className="relative py-16 md:py-24 bg-background border-b border-border overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none select-none absolute -right-4 top-1/2 -translate-y-1/2 text-[clamp(5rem,14vw,10rem)] font-bold tracking-tighter text-foreground/[0.06] leading-none"
          >
            Article
          </span>
          <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto">

            {/* 1. Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex items-center gap-2 text-[11px] text-foreground/40 flex-wrap uppercase tracking-widest">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                <li aria-hidden><ChevronRight className="h-3 w-3" /></li>
                <li aria-current="page" className="text-accent truncate max-w-[180px]">{displayPost.title}</li>
              </ol>
            </nav>

            {/* 2. Category */}
            {displayPost.category && (
              <span className="inline-block text-[10px] font-bold tracking-[0.15em] uppercase border border-accent/30 text-accent px-2.5 py-1 mb-5">
                {displayPost.category}
              </span>
            )}

            {/* 3. H1 — first meaningful content for AI screener */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-8 max-w-4xl">
              {displayPost.title}
            </h1>

            {/* 4. Answer Capsule — immediately after H1, no images or meta rows between */}
            <div
              id="answer-capsule"
              className="border-l-4 border-accent bg-foreground/[0.03] p-5 mb-8 max-w-3xl"
            >
              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-2">
                TL;DR — Quick Answer
              </p>
              <p className="text-foreground/80 font-medium leading-relaxed">
                {displayPost.answerCapsule}
              </p>
            </div>

            {/* 5. FAQ — right after answer capsule to target semantic fan-out queries */}
            {displayPost.faqItems && displayPost.faqItems.length > 0 && (
              <section id="faq-section" className="max-w-3xl mb-8" aria-labelledby="faq-heading-hero">
                <h2
                  id="faq-heading-hero"
                  className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
                >
                  Got Questions? We've Got Answers
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

            {/* 6. Meta row — after the three screener signals */}
            <div className="flex flex-wrap items-center gap-5 text-[11px] text-foreground/50 uppercase tracking-widest max-w-3xl">
              {displayPost.author?.name && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {displayPost.author.name}
                  {displayPost.author.role && (
                    <span className="text-foreground/30">· {displayPost.author.role}</span>
                  )}
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

            {/* 7. Geo tags */}
            {displayPost.geoTags && displayPost.geoTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4 max-w-3xl">
                <MapPin className="h-3.5 w-3.5 text-foreground/30 flex-shrink-0" />
                {displayPost.geoTags.map((tag) => (
                  <span key={tag} className="text-[10px] text-foreground/40 border border-border px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          </div>
        </section>

        {/* ── Hero Image — below the three screener signals ─────────────────── */}
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

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">

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

            {/* Article Body */}
            {displayPost.body && Array.isArray(displayPost.body) && displayPost.body.length > 0 ? (
              <div className="mb-12">
                <PortableText value={displayPost.body} components={portableTextComponents} />
              </div>
            ) : (
              <div className="border border-border p-8 text-center mb-12">
                <p className="text-foreground/60">
                  This post is coming soon. In the meantime, contact our team at{" "}
                  {businessName} and we will answer your question directly.
                </p>
              </div>
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

            {/* Author Bio — with photo and credentials */}
            {displayPost.author?.bio && (
              <section className="mb-12 border border-border p-6" aria-label="About the author">
                <h2 className="text-[11px] font-bold text-foreground/50 uppercase tracking-[0.2em] mb-4">
                  About the Author
                </h2>
                <div className="flex items-start gap-4">
                  {displayPost.author.photo && (
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden border border-border">
                      <Image
                        src={urlFor(displayPost.author.photo).width(112).height(112).url()}
                        alt={`${displayPost.author.name} — ${displayPost.author.role ?? "Author"}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground mb-0.5">{displayPost.author.name}</p>
                    {displayPost.author.role && (
                      <p className="text-[11px] text-accent uppercase tracking-[0.12em] mb-2">
                        {displayPost.author.role}
                      </p>
                    )}
                    <p className="text-foreground/60 leading-relaxed text-sm">{displayPost.author.bio}</p>
                    {displayPost.author.credentials && (
                      <p className="mt-2 text-[11px] text-foreground/40 leading-relaxed">
                        {displayPost.author.credentials}
                      </p>
                    )}
                  </div>
                </div>
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

            {/* Internal Links — cross-type linking for SEO/GEO/AEO topical authority */}
            {displayPost.internalLinks && displayPost.internalLinks.length > 0 && (
              <section className="mb-12" aria-labelledby="internal-links-heading">
                <h2
                  id="internal-links-heading"
                  className="text-xl font-bold tracking-tight mb-6 pb-3 border-b border-border"
                >
                  Related Pages
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-border">
                  {displayPost.internalLinks.map((link: InternalLink) => {
                    const resolved = resolveBlogLink(link)
                    if (!resolved) return null
                    return (
                      <Link
                        key={link._key}
                        href={resolved.href}
                        className="group relative border-r border-b border-border p-5 hover:bg-foreground/[0.02] transition-colors"
                      >
                        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300" />
                        <span className="block font-bold text-foreground/80 group-hover:text-foreground transition-colors text-sm leading-snug mb-1">
                          {resolved.label}
                        </span>
                        {resolved.description && (
                          <span className="block text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">
                            {resolved.description}
                          </span>
                        )}
                      </Link>
                    )
                  })}
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

        {/* ── Lead Qualification Form ───────────────────────────────────────── */}
        <section className="py-16 bg-background border-t border-border">
          <div className="container mx-auto px-6 max-w-2xl">
            <LeadQualificationForm
              businessName={businessName}
              phoneNumber={phone}
              accentColor="#2563EB"
              services={["Clutch Repairs & Replacement", "Brake Services & Repairs", "Transmission Repairs", "Flywheel Machining", "Brake Caliper & Hydraulic Repairs"]}
              webhookUrlPartial="https://n8n-customer-automations.onrender.com/webhook/5384017c-e44f-4844-9965-6e8b78f5be0c"
              webhookUrl1="https://n8n-customer-automations.onrender.com/webhook/1a390a21-4ada-4ffe-a366-0e7fc6afc302"
              webhookUrl2="https://n8n-customer-automations.onrender.com/webhook/242b5f86-aaef-49a5-aa19-2137188f62c6"
              webhookUrlCall="https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"
            />
          </div>
        </section>

        {/* ── CTA Strip ─────────────────────────────────────────────────────── */}
        <section className="bg-accent py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-accent-foreground mb-4">
              {displayPost.ctaHeading ?? "Need Expert Help?"}
            </h2>
            <p className="text-accent-foreground/70 mb-8 max-w-xl mx-auto">
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
              <PhoneLink
                phone={phone}
                label="blog-article-cta"
                className="inline-flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#E63946]/90 text-white px-8 py-4 text-sm font-bold uppercase tracking-widest transition-colors"
              >
                <Phone className="h-4 w-4" />
                {phone}
              </PhoneLink>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
