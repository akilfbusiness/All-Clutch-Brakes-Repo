import type { Metadata } from "next"
import { getSiteSettings } from "@/sanity/queries"
import { FaqPageClient } from "@/components/faq-page-client"

const DEFAULT_FAQ_CATEGORIES = [
  {
    category: "Clutch",
    items: [
      { question: "How do I know if my clutch needs replacing?", answer: "Common signs include slipping (engine revs rise but car speed does not increase), difficulty changing gears, a burning smell when driving, a spongy or stiff clutch pedal, or the clutch pedal vibrating underfoot. If you notice any of these symptoms, bring it in and we will inspect it for free." },
      { question: "How long does a clutch replacement take?", answer: "Most clutch replacements take between 3 and 5 hours depending on the vehicle. In many cases your car will be ready the same day you drop it off. We will always give you an estimated timeframe before we begin." },
      { question: "How long should a clutch last?", answer: "A well-maintained clutch typically lasts between 80,000 and 150,000 km, though this varies significantly depending on driving habits. Stop-start city driving and frequent hill starts will wear a clutch faster than highway driving." },
      { question: "Can you repair a clutch or does it always need full replacement?", answer: "It depends on the damage. Some components such as the slave or master cylinder can be repaired or replaced independently. However, if the friction plate, pressure plate, or flywheel are worn, a full clutch kit replacement is usually the most cost-effective long-term solution." },
    ],
  },
  {
    category: "Brakes",
    items: [
      { question: "How often should brake pads be replaced?", answer: "Brake pads typically need replacing every 25,000 to 70,000 km depending on driving style and conditions. City driving wears pads faster than highway driving. If you hear squealing or grinding when braking, get them checked immediately." },
      { question: "What is brake rotor machining?", answer: "Brake rotor machining (also called resurfacing or skimming) is the process of removing a thin layer of metal from a rotor to restore a smooth, flat braking surface. This can extend rotor life and eliminate brake shudder or vibration. Not all rotors can be machined — if they are below minimum thickness, replacement is required." },
      { question: "Why is my steering wheel shaking when I brake?", answer: "Vibration through the steering wheel when braking usually indicates warped brake rotors. This happens when rotors overheat and deform slightly, causing uneven contact with the brake pads. Rotor machining or replacement typically resolves this." },
      { question: "How do I know if my brake fluid needs changing?", answer: "Brake fluid should generally be replaced every 2 years or 40,000 km, whichever comes first. Old fluid absorbs moisture over time, which lowers its boiling point and can cause spongy brakes or brake fade under heavy use. We test brake fluid moisture levels as part of our brake inspections." },
    ],
  },
  {
    category: "General",
    items: [
      { question: "Do you service all makes and models?", answer: "Yes — we work on all makes and models including European, Japanese, American, Korean, and 4WD vehicles. Whether you drive a daily hatchback or a heavy commercial vehicle, we can help." },
      { question: "Do you offer free quotes?", answer: "Yes. All quotes and inspections are completely free with no obligation. We will inspect your vehicle, explain exactly what needs doing and why, and give you a fixed price before any work begins." },
      { question: "How long will my repair take?", answer: "Most clutch and brake jobs are completed same day or next day. More complex repairs such as gearbox rebuilds or differential work may take longer. We will always give you a realistic timeframe before we start." },
      { question: "Do you offer a warranty on your work?", answer: "Yes. All our repairs are backed by a workmanship warranty and any parts used carry their manufacturer warranty. We will discuss the specific warranty terms with you when providing your quote." },
    ],
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  return {
    title: `FAQ | ${businessName}`,
    description: `Frequently asked questions about clutch, brake, and transmission repairs at ${businessName}.`,
    alternates: { canonical: "/faq" },
    openGraph: { title: `FAQ | ${businessName}`, url: `${siteUrl}/faq`, type: "website" },
  }
}

export default async function FAQPage() {
  const settings = await getSiteSettings()

  const businessName = settings?.businessName ?? "All Clutch & Brake Service"
  const phone        = settings?.phone?.[0]   ?? "(08) 8277 8122"
  const siteUrl      = settings?.siteUrl      ?? "https://example.com"

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: DEFAULT_FAQ_CATEGORIES.flatMap((cat) =>
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
      { "@type": "ListItem", position: 2, name: "FAQ",  item: `${siteUrl}/faq` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <FaqPageClient
        businessName={businessName}
        phone={phone}
        faqCategories={DEFAULT_FAQ_CATEGORIES}
      />
    </>
  )
}
