import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { getAllArticleSlugs, getArticleBySlug } from "@/sanity/queries"
import type { Article } from "@/sanity/queries"

// ─── STATIC PARAMS ────────────────────────────────────────────────────────────
// Pre-renders every article at build time from Sanity slugs.
// Google and AI crawlers receive fully rendered HTML — no server call required.
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs()
    return slugs.map((s) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

// ─── DYNAMIC METADATA ─────────────────────────────────────────────────────────
// generateMetadata runs per page — each article gets its own accurate title,
// description, OG data and canonical URL pulled directly from Sanity fields.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let article: Article | null = null
  try {
    article = await getArticleBySlug(slug)
  } catch {
    // fall through to defaults
  }

  if (!article) {
    return {
      title: "Article Not Found | Ashar Disability Care",
    }
  }

  const title = article.seoTitle ?? article.title
  const description = article.seoDescription ?? article.answerCapsule
  const url = `https://ashardisabilitycare.com.au/articles/${slug}`

  return {
    title: `${title} | Ashar Disability Care`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Ashar Disability Care`,
      description,
      url,
      type: "article",
      locale: "en_AU",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: article.author?.name ? [article.author.name] : ["Ashar Disability Care"],
      siteName: "Ashar Disability Care",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Ashar Disability Care`,
      description,
    },
  }
}

// ─── SCHEMA BUILDERS ──────────────────────────────────────────────────────────
// All schema is generated from Sanity fields automatically.
// Every new article published gets correct structured data with zero manual work.

function buildArticleSchema(article: Article, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.answerCapsule,
    url: `https://ashardisabilitycare.com.au/articles/${slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author?.name ?? "Ashar Disability Care Team",
    },
    publisher: {
      "@type": "LocalBusiness",
      name: "Ashar Disability Care",
      url: "https://ashardisabilitycare.com.au",
      address: {
        "@type": "PostalAddress",
        streetAddress: "2 Yangoura Ct",
        addressLocality: "Surrey Downs",
        addressRegion: "SA",
        postalCode: "5126",
        addressCountry: "AU",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ashardisabilitycare.com.au/articles/${slug}`,
    },
  }
}

function buildFaqSchema(faqItems: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

function buildBreadcrumbSchema(article: Article, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://ashardisabilitycare.com.au",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: "https://ashardisabilitycare.com.au/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://ashardisabilitycare.com.au/articles/${slug}`,
      },
    ],
  }
}

// ─── FALLBACK ARTICLE ─────────────────────────────────────────────────────────
// Shown when Sanity is not yet connected — prevents blank pages during development
const FALLBACK_ARTICLE: Article = {
  title: "What is the NDIS and How Does It Work in South Australia?",
  slug: "what-is-the-ndis-south-australia",
  answerCapsule:
    "The NDIS is Australia's national disability insurance scheme providing funding for people with permanent and significant disabilities to access the support services they need to live an ordinary life.",
  category: "NDIS Basics",
  publishedAt: "2024-01-15",
  author: { name: "Ashar Disability Care Team", role: "Support Team", bio: "", photo: null },
  faqItems: [
    {
      question: "Who is eligible for the NDIS in South Australia?",
      answer:
        "To be eligible for the NDIS in South Australia you must be under 65 years of age, be an Australian citizen or permanent resident, and have a permanent and significant disability that affects your ability to take part in everyday activities.",
    },
    {
      question: "How do I apply for the NDIS in SA?",
      answer:
        "You can apply for the NDIS by calling the NDIS on 1800 800 110, completing an Access Request Form, or asking a registered NDIS provider like Ashar Disability Care to help you with the application process.",
    },
    {
      question: "How long does NDIS approval take in South Australia?",
      answer:
        "NDIS access decisions in South Australia typically take between 21 and 90 days depending on the complexity of your situation and whether additional evidence is required from allied health professionals.",
    },
  ],
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let article: Article | null = null
  try {
    article = await getArticleBySlug(slug)
  } catch {
    // Sanity not connected — use fallback in dev
    article = FALLBACK_ARTICLE
  }

  // If no article found and not a known fallback slug, 404
  if (!article) {
    if (slug === FALLBACK_ARTICLE.slug) {
      article = FALLBACK_ARTICLE
    } else {
      notFound()
    }
  }

  const articleSchema = buildArticleSchema(article, slug)
  const breadcrumbSchema = buildBreadcrumbSchema(article, slug)
  const hasFaq = article.faqItems && article.faqItems.length > 0

  return (
    <>
      {/* Structured data — injected into <head> via Next.js script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {hasFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildFaqSchema(article.faqItems!)),
          }}
        />
      )}

      <main>
        {/* Breadcrumb navigation */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/articles">Articles</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{article.title}</li>
          </ol>
        </nav>

        <article>
          {/* Article header */}
          <header>
            {article.category && <span>{article.category}</span>}
            <h1>{article.title}</h1>

            {/*
              ANSWER CAPSULE — this is the most important element on the page for AEO.
              It sits immediately below the H1 and provides a direct, complete answer
              in 20-30 words. This is exactly what AI engines (ChatGPT, Perplexity,
              Google AI Overviews) extract and cite when a user asks a matching question.
            */}
            <p>{article.answerCapsule}</p>

            {/* Author and date — required for Article schema E-E-A-T signals */}
            <div>
              {article.author?.name && (
                <span>By {article.author.name}</span>
              )}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {article.updatedAt && (
                <time dateTime={article.updatedAt}>
                  Updated:{" "}
                  {new Date(article.updatedAt).toLocaleDateString("en-AU", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </header>

          {/* Article body — rendered from Sanity Portable Text */}
          {article.body && Array.isArray(article.body) && article.body.length > 0 ? (
            <div>
              <PortableText value={article.body} />
            </div>
          ) : (
            /* Placeholder body shown before Sanity content is added */
            <div>
              <p>
                This article is coming soon. In the meantime, contact our team at Ashar Disability
                Care and we will answer your question directly.
              </p>
            </div>
          )}

          {/* FAQ section — each question/answer pair generates FAQPage schema */}
          {hasFaq && (
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently Asked Questions</h2>
              <dl>
                {article.faqItems!.map((item, index) => (
                  <div key={index}>
                    <dt>
                      <h3>{item.question}</h3>
                    </dt>
                    <dd>{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Author bio */}
          {article.author?.bio && (
            <section aria-label="About the author">
              <h2>About the Author</h2>
              <p>{article.author.bio}</p>
            </section>
          )}
        </article>

        {/* CTA — conversion point for every article */}
        <aside aria-label="Contact Ashar Disability Care">
          <h2>Need NDIS Support in South Australia?</h2>
          <p>
            Ashar Disability Care is a registered NDIS provider serving participants across South
            Australia. Contact us to discuss your support needs.
          </p>
          <div>
            <Link href="/contact">Enquire now</Link>
            <a href="tel:0425760172">Call 0425 760 172</a>
          </div>
        </aside>

        {/* Back to articles */}
        <nav aria-label="Article navigation">
          <Link href="/articles">Back to all articles</Link>
        </nav>
      </main>
    </>
  )
}
