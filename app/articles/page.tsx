import type { Metadata } from "next"
import Link from "next/link"
import { getAllArticles } from "@/sanity/queries"
import type { Article } from "@/sanity/queries"

export const metadata: Metadata = {
  title: "NDIS Articles & Resources | Ashar Disability Care",
  description:
    "Expert NDIS articles, guides, and resources for participants and families in South Australia. Answers to your most important disability support questions.",
  alternates: {
    canonical: "https://ashardisabilitycare.com.au/articles",
  },
  openGraph: {
    title: "NDIS Articles & Resources | Ashar Disability Care",
    description:
      "Expert NDIS articles, guides, and resources for participants and families in South Australia.",
    url: "https://ashardisabilitycare.com.au/articles",
    type: "website",
    locale: "en_AU",
  },
}

const breadcrumbSchema = {
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
  ],
}

const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "NDIS Articles & Resources",
  description:
    "Expert NDIS articles, guides, and resources for participants and families in South Australia.",
  url: "https://ashardisabilitycare.com.au/articles",
  publisher: {
    "@type": "LocalBusiness",
    name: "Ashar Disability Care",
    url: "https://ashardisabilitycare.com.au",
  },
}

// Fallback articles shown before Sanity is connected
const FALLBACK_ARTICLES: Article[] = [
  {
    title: "What is the NDIS and How Does It Work in South Australia?",
    slug: "what-is-the-ndis-south-australia",
    answerCapsule:
      "The NDIS is Australia's national disability insurance scheme providing funding for people with permanent and significant disabilities to access support services.",
    category: "NDIS Basics",
    publishedAt: "2024-01-15",
    author: { name: "Ashar Disability Care Team", role: "", bio: "", photo: null },
  },
  {
    title: "How to Find the Right NDIS Provider in Adelaide",
    slug: "find-ndis-provider-adelaide",
    answerCapsule:
      "Finding the right NDIS provider in Adelaide involves checking registration, services offered, cultural fit, and participant reviews through the NDIS provider finder.",
    category: "Provider Guidance",
    publishedAt: "2024-01-22",
    author: { name: "Ashar Disability Care Team", role: "", bio: "", photo: null },
  },
  {
    title: "Understanding Supported Independent Living (SIL) in SA",
    slug: "supported-independent-living-sa",
    answerCapsule:
      "Supported Independent Living (SIL) is NDIS-funded support that helps participants with daily tasks so they can live as independently as possible in their own home.",
    category: "Accommodation",
    publishedAt: "2024-02-01",
    author: { name: "Ashar Disability Care Team", role: "", bio: "", photo: null },
  },
]

export default async function ArticlesPage() {
  let articles: Article[] = []

  try {
    const fetched = await getAllArticles()
    articles = fetched && fetched.length > 0 ? fetched : FALLBACK_ARTICLES
  } catch {
    articles = FALLBACK_ARTICLES
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

      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">Articles</li>
          </ol>
        </nav>

        {/* Page header */}
        <section aria-labelledby="articles-heading">
          <h1 id="articles-heading">NDIS Articles &amp; Resources</h1>
          {/* Answer capsule — direct answer for AEO citation */}
          <p>
            Expert guides and answers for NDIS participants and families across South Australia —
            covering plan management, accommodation support, daily living, and everything in between.
          </p>
        </section>

        {/* Articles listing */}
        <section aria-label="Article listing">
          {articles.map((article) => (
            <article key={article.slug}>
              <header>
                <div>
                  {article.category && <span>{article.category}</span>}
                </div>
                <h2>
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
              </header>

              {/* Answer capsule — this is what AI engines pull as the direct answer */}
              {article.answerCapsule && <p>{article.answerCapsule}</p>}

              <footer>
                {article.publishedAt && (
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-AU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                {article.author?.name && <span>By {article.author.name}</span>}
              </footer>

              <Link
                href={`/articles/${article.slug}`}
                aria-label={`Read full article: ${article.title}`}
              >
                Read article
              </Link>
            </article>
          ))}
        </section>

        {/* CTA */}
        <section aria-label="Contact call to action">
          <h2>Have a question we&apos;d like to answer?</h2>
          <p>
            Contact our team — we help NDIS participants and families across South Australia
            understand their options and access the right support.
          </p>
          <Link href="/contact">Get in touch</Link>
        </section>
      </main>
    </>
  )
}
