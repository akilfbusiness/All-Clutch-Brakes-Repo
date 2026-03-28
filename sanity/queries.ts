// GROQ queries — all Sanity data fetching queries live here
// Centralising queries means if a schema field name changes,
// you update it in one place, not scattered across every page file

import { sanityFetch } from "./client"

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    businessName,
    phone,
    email,
    address,
    businessHours,
    ndisRegistrationId,
    abn,
    socialLinks
  }
`

export async function getSiteSettings() {
  return sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["site-settings"],
  })
}

// ─── ARTICLES ─────────────────────────────────────────────────────────────────

export const ALL_ARTICLES_QUERY = `
  *[_type == "article"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    answerCapsule,
    category,
    tags,
    publishedAt,
    seoDescription,
    ogImage
  }
`

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "article" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    answerCapsule,
    body,
    faqItems,
    category,
    tags,
    author-> { name, role, bio, photo },
    publishedAt,
    updatedAt,
    seoTitle,
    seoDescription,
    ogImage
  }
`

export const ALL_ARTICLE_SLUGS_QUERY = `
  *[_type == "article"] { "slug": slug.current }
`

export async function getAllArticles() {
  return sanityFetch<Article[]>({
    query: ALL_ARTICLES_QUERY,
    tags: ["articles"],
  })
}

export async function getArticleBySlug(slug: string) {
  return sanityFetch<Article>({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`article-${slug}`],
  })
}

export async function getAllArticleSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: ALL_ARTICLE_SLUGS_QUERY,
    tags: ["articles"],
  })
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(order asc) {
    title,
    "slug": slug.current,
    answerCapsule,
    icon,
    seoDescription
  }
`

export const SERVICE_BY_SLUG_QUERY = `
  *[_type == "service" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    answerCapsule,
    body,
    whoIsItFor,
    faqItems,
    icon,
    seoTitle,
    seoDescription
  }
`

export const ALL_SERVICE_SLUGS_QUERY = `
  *[_type == "service"] { "slug": slug.current }
`

export async function getAllServices() {
  return sanityFetch<Service[]>({
    query: ALL_SERVICES_QUERY,
    tags: ["services"],
  })
}

export async function getServiceBySlug(slug: string) {
  return sanityFetch<Service>({
    query: SERVICE_BY_SLUG_QUERY,
    params: { slug },
    tags: [`service-${slug}`],
  })
}

export async function getAllServiceSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: ALL_SERVICE_SLUGS_QUERY,
    tags: ["services"],
  })
}

// ─── LOCATIONS ────────────────────────────────────────────────────────────────

export const ALL_LOCATIONS_QUERY = `
  *[_type == "location"] | order(locationType asc, title asc) {
    title,
    "slug": slug.current,
    locationType,
    region,
    answerCapsule,
    seoDescription
  }
`

export const LOCATION_BY_SLUG_QUERY = `
  *[_type == "location" && slug.current == $slug][0] {
    title,
    "slug": slug.current,
    locationType,
    region,
    suburbsIncluded,
    answerCapsule,
    body,
    faqItems,
    seoTitle,
    seoDescription
  }
`

export const ALL_LOCATION_SLUGS_QUERY = `
  *[_type == "location"] { "slug": slug.current }
`

export async function getAllLocations() {
  return sanityFetch<Location[]>({
    query: ALL_LOCATIONS_QUERY,
    tags: ["locations"],
  })
}

export async function getLocationBySlug(slug: string) {
  return sanityFetch<Location>({
    query: LOCATION_BY_SLUG_QUERY,
    params: { slug },
    tags: [`location-${slug}`],
  })
}

export async function getAllLocationSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: ALL_LOCATION_SLUGS_QUERY,
    tags: ["locations"],
  })
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
// TypeScript types matching the Sanity schemas

export interface SiteSettings {
  businessName: string
  phone: string[]
  email: string
  address: {
    street: string
    suburb: string
    state: string
    postcode: string
    country: string
  }
  businessHours: { days: string; hours: string }[]
  ndisRegistrationId: string
  abn: string
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
  }
}

export interface FaqItem {
  question: string
  answer: string
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
