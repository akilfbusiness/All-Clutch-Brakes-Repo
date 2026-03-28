import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

// ─── METADATA BASE ─────────────────────────────────────────────────────────────
// metadataBase is the canonical root URL for the entire site.
// Every relative URL in metadata (OG images, canonical tags) resolves against this.
// Without it, Next.js cannot generate correct canonical URLs — duplicate content risk.

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ashardisabilitycare.com.au"
  ),
  title: {
    // Template means every page title becomes: "Page Name | Ashar Disability Care"
    // The home page uses the default (no pipe suffix)
    default: "Ashar Disability Care | NDIS Support Services South Australia",
    template: "%s | Ashar Disability Care",
  },
  description:
    "Ashar Disability Care is a registered NDIS provider in South Australia offering personal care, home care, community participation, transport, accommodation support, and NDIS planning across Adelaide and regional SA.",
  // Canonical — tells Google which URL is the authoritative one
  // Prevents duplicate indexing of http vs https, www vs non-www
  alternates: {
    canonical: "/",
  },
  // Open Graph — controls how pages appear when shared or cited by AI engines
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://ashardisabilitycare.com.au",
    siteName: "Ashar Disability Care",
    title: "Ashar Disability Care | NDIS Support Services South Australia",
    description:
      "Registered NDIS provider offering disability support services across South Australia. Personal care, home care, community participation, accommodation support and more.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ashar Disability Care — NDIS Support Services South Australia",
      },
    ],
  },
  // Twitter/X card
  twitter: {
    card: "summary_large_image",
    title: "Ashar Disability Care | NDIS Support Services South Australia",
    description:
      "Registered NDIS provider offering disability support services across South Australia.",
    images: ["/opengraph-image"],
  },
  // Robots — allow all search engines and named AI crawlers by default
  // Individual pages can override this (e.g. /studio should not be indexed)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Verification placeholders — add real values from Google Search Console
  verification: {
    google: "add-google-search-console-verification-token-here",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

// ─── STRUCTURED DATA ───────────────────────────────────────────────────────────

// WebSite schema — declares the site as a coherent entity to Google and AI engines
// The SearchAction enables a sitelink searchbox in Google results
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ashar Disability Care",
  url: "https://ashardisabilitycare.com.au",
  description:
    "Registered NDIS provider offering disability support services across South Australia.",
  inLanguage: "en-AU",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://ashardisabilitycare.com.au/articles?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
}

// LocalBusiness schema — the single most important schema for a local service business
// Tells Google and AI engines exactly who the business is, where it is, what it does,
// and who it serves. This powers local pack rankings and AI citations.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
  "@id": "https://ashardisabilitycare.com.au/#business",
  name: "Ashar Disability Care",
  alternateName: "Ashar DC",
  description:
    "Ashar Disability Care is a registered NDIS provider in South Australia offering personal care, home care, community participation, transport, accommodation support, and NDIS planning and coordination across Adelaide and regional South Australia.",
  url: "https://ashardisabilitycare.com.au",
  logo: "https://ashardisabilitycare.com.au/assets/logo.svg",
  image: "https://ashardisabilitycare.com.au/opengraph-image",
  telephone: ["+61425760172", "+61425409849"],
  email: "info@ashardc.com.au",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2 Yangoura Ct",
    addressLocality: "Surrey Downs",
    addressRegion: "SA",
    postalCode: "5126",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    // Surrey Downs, SA approximate coordinates
    latitude: -34.8354,
    longitude: 138.7089,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  // areaServed — declares the service area without needing 450 suburb pages
  // AI engines use this to answer "does Ashar service [area]?" queries
  areaServed: [
    {
      "@type": "State",
      name: "South Australia",
    },
    {
      "@type": "City",
      name: "Adelaide",
    },
    "Northern Adelaide",
    "Southern Adelaide",
    "Eastern Adelaide",
    "Western Adelaide",
    "CBD and Inner Suburbs",
    "Barossa and Surrounds",
    "Fleurieu Peninsula",
    "Eyre Peninsula",
    "Limestone Coast",
    "Yorke and Mid North",
  ],
  // hasOfferCatalog — declares the services offered
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "NDIS Support Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Personal Care" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Home Care" } },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Community Participation" },
      },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Transport" } },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Accommodation Support" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "NDIS Planning and Coordination",
        },
      },
    ],
  },
  // identifier — NDIS registration and ABN as structured identifiers
  identifier: [
    {
      "@type": "PropertyValue",
      name: "NDIS Registration ID",
      value: "4-1C342A6",
    },
    {
      "@type": "PropertyValue",
      name: "ABN",
      value: "11656510075",
    },
  ],
  priceRange: "NDIS Funded",
  currenciesAccepted: "AUD",
  paymentAccepted: "NDIS",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // lang="en-AU" — declares Australian English content to all engines
    <html lang="en-AU">
      <head>
        {/* WebSite schema — injected once at the root, applies site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* LocalBusiness schema — injected once at the root, applies site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
