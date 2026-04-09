import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { getSiteSettings } from "@/sanity/queries"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import "./globals.css"

const _plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700", "800"] })
const _geistMono   = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

// ─── METADATA ──────────────────────────────────────────────────────────────────
// metadataBase and all title/description values are pulled from Sanity siteSettings.
// To change the site title, description, or URL, edit the CMS — never this file.

export async function generateMetadata(): Promise<Metadata> {
  let settings: Awaited<ReturnType<typeof getSiteSettings>>
  try {
    settings = await getSiteSettings()
  } catch {
    settings = {}
  }

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const defaultTitle = settings?.defaultSeoTitle ?? businessName
  const defaultDescription = settings?.defaultSeoDescription ?? ""

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${businessName}`,
    },
    description: defaultDescription,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_AU",
      url: siteUrl,
      siteName: businessName,
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${businessName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: defaultDescription,
      images: ["/opengraph-image"],
    },
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
    verification: {
      google: settings?.googleSearchConsoleToken ?? "",
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
}

// ─── ROOT LAYOUT ───────────────────────────────────────────────────────────────

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>>
  try {
    settings = await getSiteSettings()
  } catch {
    settings = {}
  }

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const defaultDescription = settings?.defaultSeoDescription ?? ""
  const address = settings?.address
  const phone = settings?.phone ?? []
  const email = settings?.email ?? ""
  const businessHours = settings?.businessHours ?? []
  const areaServed = settings?.areaServed ?? []
  const abn = settings?.abn
  const registrationId = settings?.registrationId

  // ── WebSite schema ─────────────────────────────────────────────────────────
  // Declares the site as a coherent entity. Enables sitelink searchbox in Google.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessName,
    url: siteUrl,
    description: defaultDescription,
    inLanguage: "en-AU",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  // ── LocalBusiness schema ───────────────────────────────────────────────────
  // All values come from siteSettings in Sanity.
  // When the customer updates their address, phone, or hours in the CMS,
  // this schema automatically reflects those changes on the next build.
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: businessName,
    description: defaultDescription,
    url: siteUrl,
    logo: settings?.logo ?? `${siteUrl}/assets/logo.svg`,
    image: `${siteUrl}/opengraph-image`,
    telephone: phone.map((p) => `+61${p.replace(/^0/, "")}`),
    email,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.street,
        addressLocality: address.suburb,
        addressRegion: address.state,
        postalCode: address.postcode,
        addressCountry: "AU",
      },
    }),
    openingHoursSpecification: businessHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      description: `${h.days}: ${h.hours}`,
    })),
    areaServed: areaServed.length > 0 ? areaServed : ["Australia"],
    ...(abn || registrationId
      ? {
          identifier: [
            ...(abn ? [{ "@type": "PropertyValue", name: "ABN", value: abn }] : []),
            ...(registrationId
              ? [{ "@type": "PropertyValue", name: "Registration ID", value: registrationId }]
              : []),
          ],
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
    },
  }

  return (
    // lang="en-AU" — declares Australian English content to all search and AI engines
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        {/* WebSite schema — injected once at root, applies site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* LocalBusiness schema — injected once at root, applies site-wide */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${_plusJakarta.variable} ${_geistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header settings={settings} />
          <main>{children}</main>
          <Footer settings={settings} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
