import type { Metadata } from "next"
import { getSiteSettings, getAllServices, getFeaturedTestimonials, getFeaturedPromotions } from "@/sanity/queries"
import { HomePageClient } from "@/components/home-page-client"

// ─── DEFAULT CONTENT ──────────────────────────────────────────────────────────
// Shown when Sanity has no data yet. Edit via Sanity Studio → Site Settings.

const DEFAULT_TICKER_ITEMS = [
  "Clutch Replacement", "Brake Repairs", "30+ Years Experience",
  "Same Day Service", "Free Quotes", "All Makes & Models",
  "Adelaide Specialists", "Fixed Pricing", "No Surprises",
  "Qualified Tradespeople", "Transmission Service", "Brake Machining",
]

const DEFAULT_STATS_ITEMS = [
  { displayValue: "30+",      label: "Years in Business",    subtitle: "Serving Adelaide since 1994"    },
  { displayValue: "All",      label: "Makes & Models",       subtitle: "European, Japanese, 4WD & more" },
  { displayValue: "Same\nDay", label: "Service Available",   subtitle: "Most jobs completed same day"   },
  { displayValue: "Free",     label: "Quotes & Inspections", subtitle: "No obligation, no charge, ever" },
]

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
  let settings: Awaited<ReturnType<typeof getSiteSettings>>
  let services: Awaited<ReturnType<typeof getAllServices>>
  let testimonials: Awaited<ReturnType<typeof getFeaturedTestimonials>>
  let promotions: Awaited<ReturnType<typeof getFeaturedPromotions>>
  try {
    ;[settings, services, testimonials, promotions] = await Promise.all([
      getSiteSettings(),
      getAllServices(),
      getFeaturedTestimonials(),
      getFeaturedPromotions(),
    ])
  } catch {
    settings = {}
    services = []
    testimonials = []
    promotions = []
  }

  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone        = settings.phone?.[0] || "(08) 8277 8122"
  const address      = settings.address
  const hours        = settings.businessHours?.length
    ? settings.businessHours
    : [{ days: "Monday – Friday", hours: "8:00 AM – 5:00 PM" }, { days: "Saturday – Sunday", hours: "Closed" }]

  const heroHeading    = settings.heroHeading    || "Adelaide's Clutch & Brake Specialists"
  const heroAnswer     = settings.heroAnswerCapsule || "Expert clutch replacement, brake repairs, and transmission service for all makes and models. Based in St Marys, serving all of Adelaide."
  const heroTagline    = settings.heroTagline    || "Clutch · Brake · Transmission · Adelaide"
  const heroImage      = settings.heroImage      || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=80"
  const heroVideo      = settings.heroVideo      || null
  const mechanicImage  = settings.mechanicImage  || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=900&q=80"
  const workshopImage  = settings.workshopImage  || "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&w=1920&q=80"
  const primaryCta     = settings.heroPrimaryCtaLabel   || "Call Now"
  const secondaryCta   = settings.heroSecondaryCtaLabel || "Our Services"
  const trustSignals   = settings.heroTrustSignals?.length ? settings.heroTrustSignals : ["30+ Years Experience","All Makes & Models","Same Day Service","Free Quotes"]

  const tickerItems = settings.homeTickerItems?.length ? settings.homeTickerItems : DEFAULT_TICKER_ITEMS

  const statsItems = settings.homeStatsItems?.length ? settings.homeStatsItems : DEFAULT_STATS_ITEMS

  const servicesHeading    = settings.homeServicesHeading    || "Our Services"
  const servicesSubheading = settings.homeServicesSubheading || "From clutch replacements to full brake overhauls, we handle everything in-house."

  const whyUsHeading = settings.homeWhyUsHeading || "Why Choose Us"
  const whyUsPoints  = settings.homeWhyUsPoints?.length ? settings.homeWhyUsPoints : DEFAULT_WHY_US

  const ctaHeading = settings.homeCtaHeading || "Need a Quote?"
  const ctaBody    = settings.homeCtaBody    || "Call us today or send a message and we will get back to you promptly."

  const inspectionCardHeading = settings.homeInspectionCardHeading || "Book a Free Inspection"
  const inspectionCardBody    = settings.homeInspectionCardBody    || "Not sure what is wrong with your vehicle? Bring it in and our technicians will inspect your clutch or brakes at no charge and give you an honest quote."
  const aboutDescription      = settings.homeAboutDescription      || "Based in St Marys and serving all of Adelaide — no apprentices working unsupervised, no hidden fees, no surprises. Just honest, qualified tradework backed by over three decades of experience."

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
      <HomePageClient
        businessName={businessName}
        phone={phone}
        address={address}
        hours={hours}
        heroHeading={heroHeading}
        heroAnswer={heroAnswer}
        heroTagline={heroTagline}
        heroImage={heroImage}
        heroVideo={heroVideo}
        mechanicImage={mechanicImage}
        workshopImage={workshopImage}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        trustSignals={trustSignals}
        tickerItems={tickerItems}
        statsItems={statsItems}
        servicesHeading={servicesHeading}
        servicesSubheading={servicesSubheading}
        whyUsHeading={whyUsHeading}
        whyUsPoints={whyUsPoints}
        ctaHeading={ctaHeading}
        ctaBody={ctaBody}
        inspectionCardHeading={inspectionCardHeading}
        inspectionCardBody={inspectionCardBody}
        aboutDescription={aboutDescription}
        faqs={faqs}
        serviceItems={serviceItems}
        testimonials={testimonials}
        promotions={promotions}
      />
    </>
  )
}
