// GROQ queries — all Sanity data fetching queries live here

import { sanityFetch } from "./client"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

export interface SiteSettings {
  businessName?: string
  tagline?: string
  logo?: string
  phone?: string[]
  email?: string
  address?: {
    street: string
    suburb: string
    state: string
    postcode: string
    country: string
  }
  businessHours?: { days: string; hours: string }[]
  abn?: string
  registrationId?: string
  googleMapsEmbedUrl?: string
  socialLinks?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  heroHeading?: string
  heroAnswerCapsule?: string
  heroPrimaryCtaLabel?: string
  heroSecondaryCtaLabel?: string
  heroTrustSignals?: string[]
  homeServicesHeading?: string
  homeServicesSubheading?: string
  homeWhyUsHeading?: string
  homeWhyUsBody?: string
  homeWhyUsPoints?: string[]
  homeCtaHeading?: string
  homeCtaBody?: string
  homeFaqs?: FaqItem[]
  aboutHeading?: string
  aboutAnswerCapsule?: string
  aboutMissionHeading?: string
  aboutMissionBody?: string
  aboutWhoWeAreHeading?: string
  aboutWhoWeAreBody?: string[]
  aboutValues?: { title: string; description: string }[]
  aboutTeamHeading?: string
  aboutTeamBody?: string
  contactHeading?: string
  contactAnswerCapsule?: string
  contactFormHeading?: string
  contactFormSubheading?: string
  contactServiceOptions?: string[]
  servicesPageHeading?: string
  servicesPageAnswerCapsule?: string
  servicesFaqs?: FaqItem[]
  locationsPageHeading?: string
  locationsPageAnswerCapsule?: string
  locationsFaqs?: FaqItem[]
  footerTagline?: string
  footerCopyrightText?: string
  footerLinks?: { label: string; href: string }[]
  siteUrl?: string
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  googleSearchConsoleToken?: string
  areaServed?: string[]
}

export interface Article {
  title: string
  slug: string
  answerCapsule: string
  body?: unknown[]
  faqItems?: FaqItem[]
  category: string
  tags?: string[]
  author?: { name: string; role: string; bio: string; photo: unknown }
  publishedAt: string
  updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: unknown
}

export interface Service {
  title: string
  slug: string
  answerCapsule: string
  body?: unknown[]
  whoIsItFor?: string
  faqItems?: FaqItem[]
  icon?: string
  seoTitle?: string
  seoDescription?: string
}

export interface Location {
  title: string
  slug: string
  locationType: "region" | "suburb"
  region?: string
  suburbsIncluded?: string[]
  answerCapsule: string
  body?: unknown[]
  faqItems?: FaqItem[]
  seoTitle?: string
  seoDescription?: string
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    businessName, tagline,
    "logo": logo.asset->url,
    phone, email, address, businessHours, abn, registrationId,
    googleMapsEmbedUrl, socialLinks,
    heroHeading, heroAnswerCapsule, heroPrimaryCtaLabel, heroSecondaryCtaLabel,
    heroTrustSignals, homeServicesHeading, homeServicesSubheading,
    homeWhyUsHeading, homeWhyUsBody, homeWhyUsPoints,
    homeCtaHeading, homeCtaBody, homeFaqs,
    aboutHeading, aboutAnswerCapsule, aboutMissionHeading, aboutMissionBody,
    aboutWhoWeAreHeading, aboutWhoWeAreBody, aboutValues,
    aboutTeamHeading, aboutTeamBody,
    contactHeading, contactAnswerCapsule, contactFormHeading,
    contactFormSubheading, contactServiceOptions,
    servicesPageHeading, servicesPageAnswerCapsule, servicesFaqs,
    locationsPageHeading, locationsPageAnswerCapsule, locationsFaqs,
    footerTagline, footerCopyrightText, footerLinks,
    siteUrl, defaultSeoTitle, defaultSeoDescription,
    googleSearchConsoleToken, areaServed
  }
`

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await sanityFetch<SiteSettings | null>({
    query: SITE_SETTINGS_QUERY,
    tags: ["site-settings"],
  })
  return result ?? {}
}

// ─── ARTICLES ─────────────────────────────────────────────────────────────────

export const ALL_ARTICLES_QUERY = `
  *[_type == "article"] | order(publishedAt desc) {
    title, "slug": slug.current, answerCapsule,
    category, tags, publishedAt, seoDescription, ogImage
  }
`

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    title, "slug": slug.current, answerCapsule, body, faqItems,
    category, tags, author-> { name, role, bio, photo },
    publishedAt, updatedAt, seoTitle, seoDescription, ogImage
  }
`

export const ALL_ARTICLE_SLUGS_QUERY = `*[_type == "article"] { "slug": slug.current }`

export async function getAllArticles(): Promise<Article[]> {
  const result = await sanityFetch<Article[] | null>({ query: ALL_ARTICLES_QUERY, tags: ["articles"] })
  return result ?? []
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return sanityFetch<Article | null>({ query: ARTICLE_BY_SLUG_QUERY, params: { slug }, tags: [`article-${slug}`] })
}

export async function getAllArticleSlugs(): Promise<{ slug: string }[]> {
  const result = await sanityFetch<{ slug: string }[] | null>({ query: ALL_ARTICLE_SLUGS_QUERY, tags: ["articles"] })
  return result ?? []
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(order asc) {
    title, "slug": slug.current, answerCapsule, icon, seoDescription
  }
`

export const SERVICE_BY_SLUG_QUERY = `
  *[_type == "service" && slug.current == $slug][0] {
    title, "slug": slug.current, answerCapsule, body,
    whoIsItFor, faqItems, icon, seoTitle, seoDescription
  }
`

export const ALL_SERVICE_SLUGS_QUERY = `*[_type == "service"] { "slug": slug.current }`

export async function getAllServices(): Promise<Service[]> {
  const result = await sanityFetch<Service[] | null>({ query: ALL_SERVICES_QUERY, tags: ["services"] })
  return result ?? []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  return sanityFetch<Service | null>({ query: SERVICE_BY_SLUG_QUERY, params: { slug }, tags: [`service-${slug}`] })
}

export async function getAllServiceSlugs(): Promise<{ slug: string }[]> {
  const result = await sanityFetch<{ slug: string }[] | null>({ query: ALL_SERVICE_SLUGS_QUERY, tags: ["services"] })
  return result ?? []
}

// ─── LOCATIONS ────────────────────────────────────────────────────────────────

export const ALL_LOCATIONS_QUERY = `
  *[_type == "location"] | order(locationType asc, title asc) {
    title, "slug": slug.current, locationType, region, answerCapsule, seoDescription
  }
`

export const LOCATION_BY_SLUG_QUERY = `
  *[_type == "location" && slug.current == $slug][0] {
    title, "slug": slug.current, locationType, region,
    suburbsIncluded, answerCapsule, body, faqItems, seoTitle, seoDescription
  }
`

export const ALL_LOCATION_SLUGS_QUERY = `*[_type == "location"] { "slug": slug.current }`

export async function getAllLocations(): Promise<Location[]> {
  const result = await sanityFetch<Location[] | null>({ query: ALL_LOCATIONS_QUERY, tags: ["locations"] })
  return result ?? []
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  return sanityFetch<Location | null>({ query: LOCATION_BY_SLUG_QUERY, params: { slug }, tags: [`location-${slug}`] })
}

export async function getAllLocationSlugs(): Promise<{ slug: string }[]> {
  const result = await sanityFetch<{ slug: string }[] | null>({ query: ALL_LOCATION_SLUGS_QUERY, tags: ["locations"] })
  return result ?? []
}
