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
      google: settings?.googleSearchConsoleToken ?? "B0H89QwbrWBFKLm7JdU5N3fRTxIUPYpPyorMZlm0R9g",
      other: {
        // Bing Webmaster Tools — add msvalidate token here once confirmed in Bing Webmaster
        "msvalidate.01": settings?.bingVerificationToken ?? "",
      },
    },
    icons: {
      icon: "/icon-light-32x32.png",
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
    // sameAs — links entity to known external profiles for Google entity disambiguation.
    // Add/remove URLs as the business creates new profiles. Leave empty array if not set.
    sameAs: [
      ...(settings?.socialLinks?.facebook ? [settings.socialLinks.facebook] : []),
      ...(settings?.socialLinks?.instagram ? [settings.socialLinks.instagram] : []),
      ...(settings?.socialLinks?.linkedin ? [settings.socialLinks.linkedin] : []),
      ...(settings?.googleBusinessProfileUrl ? [settings.googleBusinessProfileUrl] : []),
    ].filter(Boolean),
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
        {/* Google Analytics 4 — Measurement ID: G-BB91T32K88
            Loads the gtag.js library asynchronously then initialises the data layer.
            Do not change the measurement ID without updating GA4 dashboard. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BB91T32K88" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BB91T32K88');`,
          }}
        />
        {/* Microsoft Clarity — session recordings and heatmaps
            Project ID: x0y17oqy9m — do not change this without updating Clarity dashboard */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x0y17oqy9m");`,
          }}
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
