import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSiteSettings, getAllStaff } from "@/sanity/queries"
import { StaffGrid } from "@/components/staff-grid"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `Meet Our Staff | ${businessName}`,
    description: `Meet the team behind ${businessName} — qualified mechanics with decades of experience in clutch, brake, and transmission repairs.`,
    alternates: { canonical: "/meet-our" },
    openGraph: {
      title: `Meet Our Staff | ${businessName}`,
      description: `Meet the team behind ${businessName}.`,
      url: `${siteUrl}/meet-our`,
      type: "website",
    },
  }
}

export default async function MeetOurStaffPage() {
  const [settings, staff] = await Promise.all([getSiteSettings(), getAllStaff()])

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Meet Our Staff", item: `${siteUrl}/meet-our` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background">
        {/* HERO */}
        <section className="bg-zinc-900 text-white py-16 md:py-24">
          <div className="container mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li>
                  <Link href="/" className="hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li aria-current="page" className="text-accent">
                  Meet Our Staff
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Meet Our Staff
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              The qualified team behind {businessName} — experienced mechanics who take pride in honest, expert workmanship.
            </p>
          </div>
        </section>

        {/* STAFF GRID */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto">
            <StaffGrid staff={staff} />
          </div>
        </section>

        {/* VALUES STRIP */}
        <section className="bg-secondary/40 py-12 border-y border-border">
          <div className="container mx-auto">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "Qualified", label: "Tradespeople only" },
                { value: "40+", label: "Years experience" },
                { value: "Honest", label: "Transparent pricing" },
                { value: "All", label: "Makes & models" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="text-3xl font-bold text-accent mb-1">{item.value}</dt>
                  <dd className="text-sm text-muted-foreground">{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Get in Touch With Our Team
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Call us or send an enquiry and one of our team members will get back to you promptly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Call Now: {phone}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Send an Enquiry
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
