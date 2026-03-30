import Link from "next/link"
import type { Metadata } from "next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, MapPin, Clock, CheckCircle, ChevronRight } from "lucide-react"

// ─── DEFAULT CONTENT ──────────────────────────────────────────────────────────
// Shown when Sanity has no data yet. Edit via Sanity Studio → Site Settings.

const DEFAULT_SERVICES = [
  "Clutch Replacement","Clutch Repairs","Brake Pad Replacement",
  "Brake Rotor Machining & Replacement","Brake Caliper Repairs","Brake Fluid Flush",
  "Hand Brake Adjustments","ABS Brake Repairs","Manual Transmission Repairs",
  "Automatic Transmission Service","CV Joint Replacement","Driveshaft Repairs",
  "Diff Service & Repairs","Flywheel Machining & Replacement","Pressure Plate Replacement",
  "Clutch Slave & Master Cylinder","Brake Booster Replacement","Wheel Bearing Replacement",
  "Suspension Inspections","Log Book Servicing",
]

const DEFAULT_WHY_US = [
  "Over 30 years of experience in clutch and brake repairs",
  "Qualified tradespeople — no apprentices working on your car unsupervised",
  "Fixed pricing — you get the quote upfront, no surprises",
  "All makes and models including European, Japanese, American, and 4WD",
  "Most jobs completed same day or next day",
  "Courtesy pickup and drop-off within the local area",
]

const DEFAULT_FAQS = [
  {
    question: "How do I know if my clutch needs replacing?",
    answer: "Common signs include slipping (engine revs rise but speed does not increase), difficulty changing gears, a burning smell, or a spongy/stiff clutch pedal. Bring it in and we will inspect it for free.",
  },
  {
    question: "How long does a clutch replacement take?",
    answer: "Most clutch replacements take 3–5 hours. In many cases your car will be ready the same day you drop it off.",
  },
  {
    question: "How often should brake pads be replaced?",
    answer: "Brake pads typically need replacing every 25,000–70,000 km depending on driving style. If you hear squealing or grinding when braking, get them checked immediately.",
  },
  {
    question: "Do you service all makes and models?",
    answer: "Yes — we work on all makes and models including European, Japanese, American, Korean, and 4WD vehicles.",
  },
]

// ─── METADATA ─────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings.businessName ?? "All Clutch & Brake Service"
  const description =
    settings.defaultSeoDescription ??
    "Expert clutch replacement and brake repairs in Adelaide. All makes and models. Free quotes. Call (08) 8277 8122."
  return {
    title: settings.defaultSeoTitle ?? businessName,
    description,
    alternates: { canonical: "/" },
    openGraph: { title: settings.defaultSeoTitle ?? businessName, description, type: "website" },
  }
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [settings, services] = await Promise.all([getSiteSettings(), getAllServices()])

  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone        = settings.phone?.[0] || "(08) 8277 8122"
  const address      = settings.address
  const hours        = settings.businessHours?.length
    ? settings.businessHours
    : [{ days: "Monday – Friday", hours: "8:00 AM – 5:00 PM" }, { days: "Saturday – Sunday", hours: "Closed" }]

  const heroHeading    = settings.heroHeading    || "Adelaide's Clutch & Brake Specialists"
  const heroAnswer     = settings.heroAnswerCapsule || "Expert clutch replacement, brake repairs, and transmission service for all makes and models. Based in St Marys, serving all of Adelaide."
  const primaryCta     = settings.heroPrimaryCtaLabel   || "Call Now"
  const secondaryCta   = settings.heroSecondaryCtaLabel || "Our Services"
  const trustSignals   = settings.heroTrustSignals?.length ? settings.heroTrustSignals : ["30+ Years Experience","All Makes & Models","Same Day Service","Free Quotes"]

  const servicesHeading    = settings.homeServicesHeading    || "Our Services"
  const servicesSubheading = settings.homeServicesSubheading || "From clutch replacements to full brake overhauls, we handle everything in-house."

  const whyUsHeading = settings.homeWhyUsHeading || "Why Choose Us"
  const whyUsPoints  = settings.homeWhyUsPoints?.length ? settings.homeWhyUsPoints : DEFAULT_WHY_US

  const ctaHeading = settings.homeCtaHeading || "Need a Quote?"
  const ctaBody    = settings.homeCtaBody    || "Call us today or send a message and we will get back to you promptly."

  const faqs = settings.homeFaqs?.length ? settings.homeFaqs : DEFAULT_FAQS

  const serviceItems = services.length > 0
    ? services.map((s) => ({ title: s.title, slug: s.slug, description: s.answerCapsule }))
    : DEFAULT_SERVICES.map((name) => ({ title: name, slug: null, description: null }))

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              {heroHeading}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/75 leading-relaxed max-w-2xl text-pretty">
              {heroAnswer}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <a href={`tel:${phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {primaryCta}: {phone}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/services">
                  {secondaryCta} <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {trustSignals.map((signal, i) => (
                <span key={i} className="flex items-center gap-1.5 text-sm text-primary-foreground/65">
                  <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO BAR ───────────────────────────────────────────────────────── */}
      <div className="bg-muted border-b">
        <div className="container py-3">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {address && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                {address.street}, {address.suburb} {address.state} {address.postcode}
              </span>
            )}
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4 text-accent flex-shrink-0" />
              {phone}
            </a>
            {hours[0] && (
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                {hours[0].days}: {hours[0].hours}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── SERVICES ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mb-10 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{servicesHeading}</h2>
            <p className="text-muted-foreground max-w-2xl text-pretty">{servicesSubheading}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {serviceItems.map((service, i) => (
              <Card key={i} className="group transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  {service.slug ? (
                    <Link href={`/services/${service.slug}`} className="block space-y-1.5">
                      <h3 className="font-semibold group-hover:text-accent transition-colors">{service.title}</h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                      )}
                      <span className="text-xs font-medium text-accent flex items-center gap-1 mt-2">
                        Learn more <ChevronRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ) : (
                    <h3 className="font-semibold">{service.title}</h3>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ──────────────────────────────────────────────────── */}
      <section className="bg-muted py-16 md:py-20">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-tight">{whyUsHeading}</h2>
              <ul className="space-y-3">
                {whyUsPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <CardContent className="p-8 space-y-4">
                <h3 className="text-xl font-semibold">Book a Free Inspection</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Not sure what is wrong with your vehicle? Bring it in and our technicians
                  will inspect your clutch or brakes at no charge and give you an honest quote.
                </p>
                <div className="space-y-2 pt-2">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <a href={`tel:${phone.replace(/\s/g, "")}`}>
                      <Phone className="mr-2 h-4 w-4" /> Call {phone}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Send a Message</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">{ctaHeading}</h2>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-pretty">{ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <a href={`tel:${phone.replace(/\s/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> {phone}
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
