import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getSiteSettings } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  return {
    title: `Miscellaneous | ${businessName}`,
    description: `Miscellaneous products and parts from ${businessName}.`,
    alternates: { canonical: "/miscellaneous" },
  }
}

export default async function MiscellaneousPage() {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  return (
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
                Miscellaneous
              </li>
            </ol>
          </nav>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
            Miscellaneous
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl">
            Additional products and parts available from {businessName}.
          </p>
        </div>
      </section>

      {/* CONTENT — populated via Sanity in future */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Content for this page is coming soon. In the meantime, get in touch and we can help you find what you need.
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
  )
}
