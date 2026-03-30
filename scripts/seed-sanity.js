// Sanity seed script — All Clutch & Brake Service
// Creates the siteSettings document in Sanity with real business data.
// Requires SANITY_API_WRITE_TOKEN env var (Editor or above)

const { createClient } = require("@sanity/client")

const client = createClient({
  projectId: "ihlh7pw2",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",

  // Business Details
  businessName: "All Clutch & Brake Service",
  tagline: "Adelaide's Clutch & Brake Specialists",
  phone: ["(08) 8277 8122"],
  email: "info@allclutchandbrake.com.au",
  address: {
    street: "Unit 1/3 Adelaide Terrace",
    suburb: "St Marys",
    state: "SA",
    postcode: "5042",
    country: "Australia",
  },
  businessHours: [
    { days: "Monday - Friday", hours: "8:00 AM - 5:00 PM" },
    { days: "Saturday", hours: "Closed" },
    { days: "Sunday", hours: "Closed" },
  ],
  abn: "",
  siteUrl: "https://v0-all-clutch-and-brake-service-nod.vercel.app",
  areaServed: [
    "St Marys", "Adelaide", "South Australia",
    "Mitcham", "Morphett Vale", "Christies Beach",
    "Noarlunga", "Marion", "Edwardstown",
  ],

  // Home Page
  heroHeading: "Adelaide's Clutch & Brake Specialists",
  heroAnswerCapsule: "Expert clutch replacement, brake repairs, and transmission service for all makes and models. Based in St Marys, Adelaide — call (08) 8277 8122 for a free quote.",
  heroPrimaryCtaLabel: "Call Now",
  heroSecondaryCtaLabel: "Our Services",
  heroTrustSignals: [
    "30+ Years Experience",
    "All Makes & Models",
    "Same Day Service Available",
    "Free Quotes",
  ],
  homeServicesHeading: "Our Services",
  homeServicesSubheading: "From clutch replacements to full brake overhauls — we handle everything in-house with no subcontracting.",
  homeWhyUsHeading: "Why Choose All Clutch & Brake",
  homeWhyUsPoints: [
    "Over 30 years of experience in clutch and brake repairs",
    "Qualified tradespeople — no apprentices working on your car unsupervised",
    "Fixed pricing — you get the quote upfront, no surprises",
    "All makes and models including European, Japanese, American, and 4WD",
    "Most jobs completed same day or next day",
    "Located in St Marys — easy access from all Adelaide suburbs",
  ],
  homeCtaHeading: "Need a Clutch or Brake Quote?",
  homeCtaBody: "Call us on (08) 8277 8122 or send a message and we will get back to you promptly with an honest, fixed price.",
  homeFaqs: [
    {
      question: "How do I know if my clutch needs replacing?",
      answer: "Common signs include slipping (engine revs rise but speed does not increase), difficulty changing gears, a burning smell, or a spongy/stiff clutch pedal. Bring it in and we will inspect it for free.",
    },
    {
      question: "How long does a clutch replacement take?",
      answer: "Most clutch replacements take 3-5 hours. In many cases your car will be ready the same day you drop it off.",
    },
    {
      question: "How often should brake pads be replaced?",
      answer: "Brake pads typically need replacing every 25,000-70,000 km depending on driving style. If you hear squealing or grinding when braking, get them checked immediately.",
    },
    {
      question: "Do you service all makes and models?",
      answer: "Yes — we work on all makes and models including European, Japanese, American, Korean, and 4WD vehicles.",
    },
    {
      question: "Do you provide a warranty on clutch and brake work?",
      answer: "Yes. All parts and labour come with a warranty. Ask us for details when you book.",
    },
  ],

  // About Page
  aboutHeading: "About All Clutch & Brake Service",
  aboutAnswerCapsule: "All Clutch & Brake Service is an Adelaide-based specialist workshop with over 30 years experience in clutch, brake, and transmission repairs for all makes and models.",
  aboutMissionHeading: "Our Mission",
  aboutMissionBody: "To provide honest, fixed-price automotive repairs with no hidden costs, no subcontracting, and no unnecessary work — every time.",
  aboutWhoWeAreHeading: "Who We Are",
  aboutWhoWeAreBody: [
    "All Clutch & Brake Service has been serving Adelaide drivers for over 30 years from our workshop in St Marys.",
    "We specialise exclusively in clutch, brake, and transmission repairs — meaning every job that comes through our doors is done by people who work on these systems every single day.",
    "We work on all makes and models, from everyday hatchbacks to European performance vehicles and heavy 4WDs.",
  ],

  // Contact Page
  contactHeading: "Contact All Clutch & Brake Service",
  contactAnswerCapsule: "Call (08) 8277 8122 or visit us at Unit 1/3 Adelaide Terrace, St Marys SA 5042. Monday to Friday 8am-5pm.",
  contactFormHeading: "Send Us a Message",
  contactFormSubheading: "Describe your vehicle issue and we will get back to you with an honest quote.",
  contactServiceOptions: [
    "Clutch Replacement", "Clutch Repairs", "Brake Pad Replacement",
    "Brake Rotor Service", "Brake Caliper Repairs", "Brake Fluid Flush",
    "ABS Repairs", "Manual Transmission", "Automatic Transmission", "Other",
  ],

  // Services Page
  servicesPageHeading: "Clutch, Brake & Transmission Services in Adelaide",
  servicesPageAnswerCapsule: "All Clutch & Brake Service offers expert clutch replacement, brake repairs, and transmission service for all makes and models in Adelaide, SA.",

  // Locations Page
  locationsPageHeading: "Serving All of Adelaide",
  locationsPageAnswerCapsule: "Based in St Marys, we service vehicles from all Adelaide suburbs and surrounding South Australian regions.",

  // Footer
  footerTagline: "Expert clutch and brake service in Adelaide since 1990.",
  footerCopyrightText: "© " + new Date().getFullYear() + " All Clutch & Brake Service. All rights reserved.",
  footerLinks: [
    { label: "Services", href: "/services" },
    { label: "Locations", href: "/locations" },
    { label: "Articles", href: "/articles" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],

  // SEO
  defaultSeoTitle: "All Clutch & Brake Service Adelaide | Expert Clutch & Brake Repairs",
  defaultSeoDescription: "Adelaide's clutch and brake specialists. Expert clutch replacement, brake repairs, and transmission service. All makes and models. St Marys SA. Call (08) 8277 8122.",
}

async function seed() {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("ERROR: SANITY_API_WRITE_TOKEN is not set. Get an Editor token from sanity.io/manage -> API -> Tokens.")
    process.exit(1)
  }
  console.log("Seeding Sanity siteSettings for All Clutch & Brake Service...")
  try {
    const result = await client.createOrReplace(siteSettings)
    console.log("SUCCESS — siteSettings document created:", result._id)
    console.log("You can now edit all content in Sanity Studio -> Site Settings")
  } catch (err) {
    console.error("Seed failed:", err.message)
    process.exit(1)
  }
}

seed()
