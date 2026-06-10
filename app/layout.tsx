import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/next"
import { getSiteSettings, getAllServices } from "@/sanity/queries"
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
  let allServices: Awaited<ReturnType<typeof getAllServices>>
  try {
    settings = await getSiteSettings()
  } catch {
    settings = {}
  }
  try {
    allServices = await getAllServices()
  } catch {
    allServices = []
  }

  const siteUrl = settings?.siteUrl ?? "https://example.com"
  const businessName = settings?.businessName ?? "Business Name"
  const defaultDescription = settings?.defaultSeoDescription ?? ""
  const address = settings?.address
  const phone = settings?.phone ?? []
  const email = settings?.email ?? ""
  const businessHours = settings?.businessHours ?? []
  const structuredHours = settings?.structuredHours ?? []
  const areaServed = settings?.areaServed ?? []
  const abn = settings?.abn
  const registrationId = settings?.registrationId
  const priceRange = settings?.priceRange
  const foundingDate = settings?.foundingDate

  // ── WebSite schema ─────────────────────────────────────────────────────────
  // Declares the site as a coherent entity. Enables sitelink searchbox in Google.
  // Note: description is intentionally omitted — schema.org does not define it
  // as a valid property on WebSite and its presence triggers a validation warning.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: businessName,
    url: siteUrl,
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
  // @type is AutoRepair (subtype of LocalBusiness) — unlocks automotive-specific
  // rich results in Google Search. All values come from siteSettings in Sanity.
  // When the customer updates their address, phone, or hours in the CMS,
  // this schema automatically reflects those changes on the next build.
  //
  // OpeningHoursSpecification: uses structured dayOfWeek/opens/closes fields
  // from the "Business Hours (structured)" array in Sanity. Falls back to the
  // free-form businessHours array if no structured hours are configured — but
  // the fallback format is not parsed by Google for rich results.
  const openingHoursSpecification =
    structuredHours.length > 0
      ? structuredHours
          .filter((h: { dayOfWeek?: string[]; opens?: string; closes?: string }) =>
            h.dayOfWeek?.length && h.opens && h.closes
          )
          .map((h: { dayOfWeek: string[]; opens: string; closes: string }) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.dayOfWeek,
            opens: h.opens,
            closes: h.closes,
          }))
      : businessHours.map((h: { days: string; hours: string }) => ({
          "@type": "OpeningHoursSpecification",
          description: `${h.days}: ${h.hours}`,
        }))

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${siteUrl}/#business`,
    name: businessName,
    description: defaultDescription,
    url: siteUrl,
    logo: settings?.logo ?? `${siteUrl}/assets/logo.svg`,
    image: `${siteUrl}/opengraph-image`,
    telephone: phone.map((p: string) => `+61${p.replace(/^0/, "")}`),
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
    // geo — decimal coordinates from Site Settings → Business Details.
    // Enter once; auto-updates on every render. Get coords from Google Maps
    // (right-click your location → copy first number = lat, second = lng).
    ...(settings?.geoLatitude && settings?.geoLongitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: settings.geoLatitude,
            longitude: settings.geoLongitude,
          },
        }
      : {}),
    openingHoursSpecification,
    areaServed: areaServed.length > 0 ? areaServed : ["Australia"],
    ...(priceRange && { priceRange }),
    ...(foundingDate && { foundingDate }),
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
    // hasOfferCatalog — dynamically built from all live service documents in Sanity.
    // When a new service is added or removed in the CMS, this schema updates automatically
    // on the next page render. No hardcoding required.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Automotive Services",
      itemListElement: allServices.map((service, i) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          "@id": `${siteUrl}/services/${service.slug}`,
          name: service.title,
          url: `${siteUrl}/services/${service.slug}`,
          ...(service.answerCapsule && { description: service.answerCapsule }),
        },
        position: i + 1,
      })),
    },
    // sameAs — links entity to known external profiles for Google entity disambiguation.
    // Populated from socialLinks and googleBusinessProfileUrl in Sanity Site Settings.
    sameAs: [
      ...(settings?.socialLinks?.facebook ? [settings.socialLinks.facebook] : []),
      ...(settings?.socialLinks?.instagram ? [settings.socialLinks.instagram] : []),
      ...(settings?.socialLinks?.linkedin ? [settings.socialLinks.linkedin] : []),
      ...(settings?.googleBusinessProfileUrl ? [settings.googleBusinessProfileUrl] : []),
    ].filter(Boolean),
    // aggregateRating — sourced from Site Settings → Business Details in Sanity.
    // Update ratingValue and reviewCount whenever your review count changes.
    ...(settings?.aggregateRating?.ratingValue && settings?.aggregateRating?.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: settings.aggregateRating.ratingValue,
            reviewCount: settings.aggregateRating.reviewCount,
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
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
            strategy="lazyOnload" defers loading until the page is fully idle,
            removing it from the critical path without losing any tracking data. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-BB91T32K88"
          strategy="lazyOnload"
        />
        <Script
          id="gtag-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-BB91T32K88');`,
          }}
        />
        {/* Microsoft Clarity — session recordings and heatmaps
            Project ID: x0y17oqy9m — do not change without updating Clarity dashboard
            strategy="lazyOnload" defers until page is idle — no session data is lost
            since recordings start when users interact, which is always after idle. */}
        <Script
          id="clarity-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x0y17oqy9m");`,
          }}
        />

                {/* Convocore chat widget */}
        <Script
          id="convocore-config"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `window.VG_CONFIG={ID:"ggrq6BtNBNMIFN0V5ZUb",region:"na",render:"bottom-right",stylesheets:["https://cdn.convocore.ai/vg_live_build/styles.css"]};`,
          }}
        />
        <Script
          id="convocore-widget"
          src="https://cdn.convocore.ai/vg_live_build/vg_bundle.js"
          strategy="lazyOnload"
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
