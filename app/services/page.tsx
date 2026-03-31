// Services index page — content pulled from both Sanity siteSettings and Service documents
// Heading, answer capsule, and FAQ items: edit in Sanity Studio → Site Settings → Services
// Individual service cards: edit in Sanity Studio → Services

import Link from "next/link"
import type { Metadata } from "next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, ChevronRight, Wrench } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"

  return {
    title: `Services | ${businessName}`,
    description: settings?.servicesPageAnswerCapsule ?? settings?.defaultSeoDescription ?? "",
    alternates: { canonical: "/services" },
    openGraph: {
      title: `Services | ${businessName}`,
      description: settings?.servicesPageAnswerCapsule ?? "",
      url: `${siteUrl}/services`,
      type: "website",
    },
  }
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getAllServices(),
  ])

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const faqs = settings?.servicesFaqs ?? []
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  const faqSchema = faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
    ],
  }

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/services`,
    name: `Services — ${businessName}`,
    description: settings?.servicesPageAnswerCapsule ?? "",
    url: `${siteUrl}/services`,
    provider: { "@id": `${siteUrl}/#business` },
  }

  return (
    <>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      {/* ── HERO SECTION ───────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-primary-foreground/60">
              <li>
                <Link href="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li aria-current="page" className="text-primary-foreground">
                Services
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
              {settings?.servicesPageHeading ?? `Our Services`}
            </h1>
            {settings?.servicesPageAnswerCapsule && (
              <p className="text-lg text-primary-foreground/75 leading-relaxed max-w-2xl text-pretty">
                {settings.servicesPageAnswerCapsule}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-10 space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">All Services</h2>
            <p className="text-muted-foreground">
              Click on a service to learn more about what we offer.
            </p>
          </div>

          {services && services.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((service) => (
                <Card key={service.slug} className="group transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <Link href={`/services/${service.slug}`} className="block space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                          <Wrench className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h3 className="font-semibold group-hover:text-accent transition-colors">
                            {service.title}
                          </h3>
                          {service.answerCapsule && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {service.answerCapsule}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-accent flex items-center gap-1 mt-3">
                        Learn more <ChevronRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold mb-2">Services Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add services in Sanity Studio → Services to display them here.
                </p>
                <Button asChild variant="outline">
                  <a href="/studio/structure/service">Add Services in Studio</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* ── FAQ SECTION ────────────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-muted py-16 md:py-20">
          <div className="container max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA SECTION ────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-pretty">
            Contact our team today to discuss which services are right for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Call {phone}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/contact">Get a Quote Online</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
