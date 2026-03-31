import type { Metadata } from "next"
import Link from "next/link"
import { getSiteSettings } from "@/sanity/queries"
import { ChevronRight, Award, Users, Shield, MapPin, Phone, Mail } from "lucide-react"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"

  return {
    title: `About Us | ${businessName}`,
    description: settings?.aboutAnswerCapsule ?? `Learn about ${businessName} — Adelaide's trusted specialists in clutch, brake, and transmission repairs since establishment.`,
    alternates: { canonical: "/about" },
    openGraph: {
      title: `About Us | ${businessName}`,
      description: settings?.aboutAnswerCapsule ?? "",
      url: `${siteUrl}/about`,
      type: "website",
    },
  }
}

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const values = settings?.aboutValues ?? []
  const whoWeAreBody = settings?.aboutWhoWeAreBody ?? []
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}/about`,
    name: `About ${businessName}`,
    description: settings?.aboutAnswerCapsule ?? "",
    url: `${siteUrl}/about`,
    mainEntity: { "@id": `${siteUrl}/#business` },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
    ],
  }

  // Default values if none set in Sanity
  const defaultValues = [
    { title: "Quality Workmanship", description: "We use only quality parts and proven techniques to ensure reliable, long-lasting repairs." },
    { title: "Honest Service", description: "Transparent pricing with no hidden fees. We explain what needs doing and why." },
    { title: "Expert Knowledge", description: "Decades of experience specialising in clutch, brake, and transmission systems." },
    { title: "Customer Focus", description: "We treat every vehicle as if it were our own, with attention to detail and care." },
  ]

  const displayValues = values.length > 0 ? values : defaultValues

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-zinc-900 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex items-center gap-2 text-sm text-zinc-400">
                <li><Link href="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-orange-500">About</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {settings?.aboutHeading ?? `About ${businessName}`}
            </h1>
            <p className="text-xl text-zinc-300 max-w-3xl">
              {settings?.aboutAnswerCapsule ?? `${businessName} is Adelaide's trusted specialist for clutch, brake, and transmission repairs. Family-owned and operated, we've been serving South Australian drivers with expert service and honest advice.`}
            </p>
          </div>
        </section>

        {/* Mission Section */}
        {(settings?.aboutMissionHeading || settings?.aboutMissionBody) && (
          <section className="py-16 bg-orange-500 text-white" aria-labelledby="mission-heading">
            <div className="container mx-auto px-4 text-center">
              <h2 id="mission-heading" className="text-3xl md:text-4xl font-bold mb-6">
                {settings?.aboutMissionHeading ?? "Our Mission"}
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                {settings?.aboutMissionBody ?? "To provide Adelaide drivers with expert clutch, brake, and transmission services — delivered with honesty, quality, and fair pricing."}
              </p>
            </div>
          </section>
        )}

        {/* Who We Are Section */}
        <section className="py-16 md:py-24" aria-labelledby="who-heading">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 id="who-heading" className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                  {settings?.aboutWhoWeAreHeading ?? "Who We Are"}
                </h2>
                <div className="space-y-4 text-lg text-zinc-600">
                  {whoWeAreBody.length > 0 ? (
                    whoWeAreBody.map((para, i) => <p key={i}>{para}</p>)
                  ) : (
                    <>
                      <p>
                        {businessName} is a family-owned workshop specialising exclusively in clutch, brake, and transmission repairs. Based in Adelaide, we&apos;ve built our reputation on expert workmanship and honest service.
                      </p>
                      <p>
                        Our team of qualified mechanics brings decades of combined experience, ensuring your vehicle receives the specialist attention it deserves. We work on all makes and models, from everyday sedans to commercial vehicles.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="bg-zinc-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center text-zinc-400">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p>Team Photo</p>
                  <p className="text-sm">Add via Sanity Studio</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials Section */}
        <section className="py-16 bg-zinc-50" aria-labelledby="credentials-heading">
          <div className="container mx-auto px-4">
            <h2 id="credentials-heading" className="text-3xl font-bold text-zinc-900 mb-8 text-center">
              Our Credentials
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {settings?.abn && (
                <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                  <Award className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <dt className="text-sm text-zinc-500 mb-1">ABN</dt>
                  <dd className="font-semibold text-zinc-900">{settings.abn}</dd>
                </div>
              )}
              {settings?.registrationId && (
                <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                  <Shield className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <dt className="text-sm text-zinc-500 mb-1">Registration</dt>
                  <dd className="font-semibold text-zinc-900">{settings.registrationId}</dd>
                </div>
              )}
              {settings?.address && (
                <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                  <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <dt className="text-sm text-zinc-500 mb-1">Location</dt>
                  <dd className="font-semibold text-zinc-900">{settings.address.suburb}, {settings.address.state}</dd>
                </div>
              )}
              {settings?.areaServed && settings.areaServed.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-lg p-6 text-center">
                  <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <dt className="text-sm text-zinc-500 mb-1">Service Area</dt>
                  <dd className="font-semibold text-zinc-900">{settings.areaServed[0]}</dd>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24" aria-labelledby="values-heading">
          <div className="container mx-auto px-4">
            <h2 id="values-heading" className="text-3xl font-bold text-zinc-900 mb-8 text-center">
              Our Values
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {displayValues.map((value, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{value.title}</h3>
                  <p className="text-zinc-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-zinc-50" aria-labelledby="team-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="team-heading" className="text-3xl font-bold text-zinc-900 mb-6">
              {settings?.aboutTeamHeading ?? "Our Team"}
            </h2>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
              {settings?.aboutTeamBody ?? "Our team of qualified mechanics brings decades of combined experience in clutch, brake, and transmission repairs. We're committed to providing expert service with honest advice."}
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-zinc-900 text-white py-16" aria-labelledby="about-cta-heading">
          <div className="container mx-auto px-4 text-center">
            <h2 id="about-cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Work With Us?
            </h2>
            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your clutch, brake, or transmission needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
