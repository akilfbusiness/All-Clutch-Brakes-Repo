import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, HelpCircle } from "lucide-react"
import { getSiteSettings } from "@/sanity/queries"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  return {
    title: `FAQ | ${businessName}`,
    description: `Frequently asked questions about clutch, brake, and transmission repairs at ${businessName}.`,
    alternates: { canonical: "/faq" },
    openGraph: {
      title: `FAQ | ${businessName}`,
      description: `Frequently asked questions about ${businessName}.`,
      url: `${siteUrl}/faq`,
      type: "website",
    },
  }
}

const DEFAULT_FAQS = [
  {
    category: "Clutch",
    items: [
      {
        question: "How do I know if my clutch needs replacing?",
        answer:
          "Common signs include slipping (engine revs rise but car speed does not increase), difficulty changing gears, a burning smell when driving, a spongy or stiff clutch pedal, or the clutch pedal vibrating underfoot. If you notice any of these symptoms, bring it in and we will inspect it for free.",
      },
      {
        question: "How long does a clutch replacement take?",
        answer:
          "Most clutch replacements take between 3 and 5 hours depending on the vehicle. In many cases your car will be ready the same day you drop it off. We will always give you an estimated timeframe before we begin.",
      },
      {
        question: "How long should a clutch last?",
        answer:
          "A well-maintained clutch typically lasts between 80,000 and 150,000 km, though this varies significantly depending on driving habits. Stop-start city driving and frequent hill starts will wear a clutch faster than highway driving.",
      },
      {
        question: "Can you repair a clutch or does it always need full replacement?",
        answer:
          "It depends on the damage. Some components such as the slave or master cylinder can be repaired or replaced independently. However, if the friction plate, pressure plate, or flywheel are worn, a full clutch kit replacement is usually the most cost-effective long-term solution.",
      },
    ],
  },
  {
    category: "Brakes",
    items: [
      {
        question: "How often should brake pads be replaced?",
        answer:
          "Brake pads typically need replacing every 25,000 to 70,000 km depending on driving style and conditions. City driving wears pads faster than highway driving. If you hear squealing or grinding when braking, get them checked immediately.",
      },
      {
        question: "What is brake rotor machining?",
        answer:
          "Brake rotor machining (also called resurfacing or skimming) is the process of removing a thin layer of metal from a rotor to restore a smooth, flat braking surface. This can extend rotor life and eliminate brake shudder or vibration. Not all rotors can be machined — if they are below minimum thickness, replacement is required.",
      },
      {
        question: "Why is my steering wheel shaking when I brake?",
        answer:
          "Vibration through the steering wheel when braking usually indicates warped brake rotors. This happens when rotors overheat and deform slightly, causing uneven contact with the brake pads. Rotor machining or replacement typically resolves this.",
      },
      {
        question: "How do I know if my brake fluid needs changing?",
        answer:
          "Brake fluid should generally be replaced every 2 years or 40,000 km, whichever comes first. Old fluid absorbs moisture over time, which lowers its boiling point and can cause spongy brakes or brake fade under heavy use. We test brake fluid moisture levels as part of our brake inspections.",
      },
    ],
  },
  {
    category: "General",
    items: [
      {
        question: "Do you service all makes and models?",
        answer:
          "Yes — we work on all makes and models including European, Japanese, American, Korean, and 4WD vehicles. Whether you drive a daily hatchback or a heavy commercial vehicle, we can help.",
      },
      {
        question: "Do you offer free quotes?",
        answer:
          "Yes. All quotes and inspections are completely free with no obligation. We will inspect your vehicle, explain exactly what needs doing and why, and give you a fixed price before any work begins.",
      },
      {
        question: "How long will my repair take?",
        answer:
          "Most clutch and brake jobs are completed same day or next day. More complex repairs such as gearbox rebuilds or differential work may take longer. We will always give you a realistic timeframe before we start.",
      },
      {
        question: "Do you offer a warranty on your work?",
        answer:
          "Yes. All our repairs are backed by a workmanship warranty and any parts used carry their manufacturer warranty. We will discuss the specific warranty terms with you when providing your quote.",
      },
    ],
  },
]

export default async function FAQPage() {
  const settings = await getSiteSettings()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone = settings?.phone?.[0] ?? "(08) 8277 8122"
  const siteUrl = settings?.siteUrl ?? "https://example.com"

  // Combine all FAQs from siteSettings for schema
  const allFaqItems = [
    ...(settings?.homeFaqs ?? []),
    ...(settings?.contactFaqs ?? []),
    ...(settings?.servicesFaqs ?? []),
    ...(settings?.locationsFaqs ?? []),
  ]

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DEFAULT_FAQS.flatMap((cat) =>
      cat.items.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      }))
    ),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${siteUrl}/faq` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                  FAQ
                </li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl">
              Answers to the most common questions about clutch, brake, and transmission repairs.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-16">
              {DEFAULT_FAQS.map((group) => (
                <div key={group.category}>
                  <h2 className="text-2xl font-bold text-foreground mb-8 pb-4 border-b border-border flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <HelpCircle className="h-4 w-4 text-accent-foreground" />
                    </span>
                    {group.category} Questions
                  </h2>

                  <dl className="space-y-8">
                    {group.items.map((faq, i) => (
                      <div
                        key={i}
                        className="border-b border-border/50 pb-8 last:border-0 last:pb-0"
                      >
                        <dt className="text-lg font-semibold text-foreground mb-3">
                          {faq.question}
                        </dt>
                        <dd className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STILL HAVE QUESTIONS */}
        <section className="bg-secondary/40 border-y border-border py-16">
          <div className="container mx-auto max-w-3xl text-center">
            <HelpCircle className="h-12 w-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-3 text-balance">
              Still Have a Question?
            </h2>
            <p className="text-muted-foreground mb-6">
              Call us directly or send an enquiry — we are happy to help.
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
