// GROQ queries — all Sanity data fetching queries live here

import { sanityFetch } from "./client"

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

export interface QuickAnswer {
  question: string
  quickAnswer: string
}

export interface DataSource {
  label: string
  url: string
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
  heroTagline?: string
  heroImage?: string
  mechanicImage?: string
  workshopImage?: string
  heroPrimaryCtaLabel?: string
  heroSecondaryCtaLabel?: string
  heroTrustSignals?: string[]
  homeTickerItems?: string[]
  homeStatsItems?: { displayValue: string; label: string; subtitle?: string }[]
  homeAboutDescription?: string
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
  aboutTeamMembers?: {
    name: string
    role?: string
    bio?: string
    photo?: unknown
  }[]
  aboutCtaHeading?: string
  aboutCtaBody?: string
  aboutCtaPrimaryLabel?: string
  aboutCtaSecondaryLabel?: string
  aboutSeoTitle?: string
  aboutSeoDescription?: string
  contactHeading?: string
  contactAnswerCapsule?: string
  contactInfoHeading?: string
  contactFormHeading?: string
  contactFormSubheading?: string
  contactPrivacyNote?: string
  contactServiceOptions?: string[]
  contactFaqs?: FaqItem[]
  contactSeoTitle?: string
  contactSeoDescription?: string
  servicesPageHeroTitle?: string
  servicesPageHeroSubtitle?: string
  servicesPageHeroImage?: unknown
  servicesPageSeoTitle?: string
  servicesPageSeoDescription?: string
  locationsPageHeroTitle?: string
  locationsPageHeroSubtitle?: string
  locationsPageHeroImage?: unknown
  locationsPageSeoTitle?: string
  locationsPageSeoDescription?: string
  // Blog page fields (previously articlesPage*)
  articlesPageHeroTitle?: string
  articlesPageHeroSubtitle?: string
  articlesPageHeroImage?: unknown
  articlesPageSeoTitle?: string
  articlesPageSeoDescription?: string
  servicesPageHeading?: string
  servicesPageAnswerCapsule?: string
  servicesAllSubheading?: string
  servicesCtaHeading?: string
  servicesCtaBody?: string
  servicesHowWeDeliverHeading?: string
  servicesHowWeDeliverPoints?: string[]
  servicesFaqs?: FaqItem[]
  homeInspectionCardHeading?: string
  homeInspectionCardBody?: string
  locationsPageHeading?: string
  locationsPageAnswerCapsule?: string
  locationsFaqs?: FaqItem[]
  footerBrandLabel?: string
  footerTagline?: string
  footerCopyrightText?: string
  footerLinks?: { label: string; href: string }[]
  siteUrl?: string
  defaultSeoTitle?: string
  defaultSeoDescription?: string
  googleSearchConsoleToken?: string
  areaServed?: string[]
}

export interface Post {
  title: string
  slug: string
  answerCapsule: string
  quickAnswers?: QuickAnswer[]
  body?: unknown[]
  faqItems?: FaqItem[]
  relatedPosts?: Post[]
  dataSources?: DataSource[]
  category: string
  tags?: string[]
  geoTags?: string[]
  author?: { name: string; role: string; bio: string; photo: unknown }
  publishedAt: string
  updatedAt?: string
  readTimeMinutes?: number
  heroImage?: unknown
  ctaHeading?: string
  ctaBody?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: unknown
}

// Keep Article as an alias for backwards compatibility during migration
export type Article = Post

export interface ServiceGalleryImage {
  url: string
  caption?: string
}

export interface Service {
  title: string
  slug: string
  answerCapsule: string
  body?: unknown[]
  whoIsItFor?: string
  faqItems?: FaqItem[]
  icon?: string
  featuredImage?: string
  gallery?: ServiceGalleryImage[]
  serviceAreas?: { title: string; slug: string }[]
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

export interface NavItem {
  label: string
  linkType: "page" | "external" | "header"
  href: string
  openInNewTab?: boolean
  highlight?: "normal" | "button-primary" | "button-secondary"
}

export interface SiteNavigation {
  headerItems?: NavItem[]
  headerCtaLabel?: string
  headerCtaLink?: string
  showPhoneInHeader?: boolean
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    businessName, tagline,
    "logo": logo.asset->url,
    phone, email, address, businessHours, abn, registrationId,
    googleMapsEmbedUrl, socialLinks,
    heroHeading, heroAnswerCapsule, heroPrimaryCtaLabel, heroSecondaryCtaLabel,
    heroTagline,
    "heroImage": heroImage.asset->url,
    "mechanicImage": mechanicImage.asset->url,
    "workshopImage": workshopImage.asset->url,
    heroTrustSignals, homeTickerItems, homeStatsItems, homeAboutDescription,
    homeServicesHeading, homeServicesSubheading,
    homeWhyUsHeading, homeWhyUsBody, homeWhyUsPoints,
    homeCtaHeading, homeCtaBody, homeFaqs,
    aboutHeading, aboutAnswerCapsule, aboutMissionHeading, aboutMissionBody,
    aboutWhoWeAreHeading, aboutWhoWeAreBody, aboutValues,
    aboutTeamHeading, aboutTeamBody,
    "aboutTeamMembers": aboutTeamMembers[] {
      name, role, bio,
      "photo": photo.asset->url
    },
    aboutCtaHeading, aboutCtaBody, aboutCtaPrimaryLabel, aboutCtaSecondaryLabel,
    aboutSeoTitle, aboutSeoDescription,
    contactHeading, contactAnswerCapsule, contactInfoHeading,
    contactFormHeading, contactFormSubheading, contactPrivacyNote,
    contactServiceOptions, contactFaqs,
    contactSeoTitle, contactSeoDescription,
    servicesPageHeroTitle, servicesPageHeroSubtitle, servicesPageHeroImage,
    servicesPageSeoTitle, servicesPageSeoDescription,
    locationsPageHeroTitle, locationsPageHeroSubtitle, locationsPageHeroImage,
    locationsPageSeoTitle, locationsPageSeoDescription,
    articlesPageHeroTitle, articlesPageHeroSubtitle, articlesPageHeroImage,
    articlesPageSeoTitle, articlesPageSeoDescription,
    servicesPageHeading, servicesPageAnswerCapsule,
    servicesAllSubheading, servicesCtaHeading, servicesCtaBody,
    servicesHowWeDeliverHeading, servicesHowWeDeliverPoints,
    servicesFaqs,
    homeInspectionCardHeading, homeInspectionCardBody,
    locationsPageHeading, locationsPageAnswerCapsule, locationsFaqs,
    footerTagline, footerCopyrightText, footerLinks, footerBrandLabel,
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

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────

export const ALL_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    title, "slug": slug.current, answerCapsule,
    category, tags, geoTags, publishedAt, updatedAt,
    readTimeMinutes, heroImage, seoDescription, ogImage,
    author->{ name, role, photo }
  }
`

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    title, "slug": slug.current, answerCapsule, quickAnswers,
    body, faqItems, category, tags, geoTags,
    author->{ name, role, bio, photo },
    publishedAt, updatedAt, readTimeMinutes, heroImage,
    ctaHeading, ctaBody,
    dataSources,
    "relatedPosts": relatedPosts[]->{
      title, "slug": slug.current, category, publishedAt, readTimeMinutes, heroImage, answerCapsule
    },
    seoTitle, seoDescription, ogImage
  }
`

export const ALL_POST_SLUGS_QUERY = `*[_type == "post"] { "slug": slug.current }`

export async function getAllPosts(): Promise<Post[]> {
  const result = await sanityFetch<Post[] | null>({ query: ALL_POSTS_QUERY, tags: ["posts"] })
  return result ?? []
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return sanityFetch<Post | null>({ query: POST_BY_SLUG_QUERY, params: { slug }, tags: [`post-${slug}`] })
}

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const result = await sanityFetch<{ slug: string }[] | null>({ query: ALL_POST_SLUGS_QUERY, tags: ["posts"] })
  return result ?? []
}

// Keep old function names as aliases during migration
export const getAllArticles = getAllPosts
export const getArticleBySlug = getPostBySlug
export const getAllArticleSlugs = getAllPostSlugs

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(order asc) {
    title, "slug": slug.current, answerCapsule, icon, seoDescription
  }
`

export const SERVICE_BY_SLUG_QUERY = `
  *[_type == "service" && slug.current == $slug][0] {
    title, "slug": slug.current, answerCapsule, body,
    whoIsItFor, faqItems, icon,
    "featuredImage": featuredImage.asset->url,
    "gallery": gallery[] {
      "url": asset->url,
      caption
    },
    "serviceAreas": serviceAreas[]->{ title, "slug": slug.current },
    seoTitle, seoDescription
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

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

export const SITE_NAVIGATION_QUERY = `
  *[_type == "navigation"][0] {
    headerCtaLabel, headerCtaLink, showPhoneInHeader,
    "headerItems": headerItems[] {
      label, linkType, openInNewTab, highlight,
      "href": select(
        linkType == "external"  => externalUrl,
        defined(customSlug)     => customSlug,
        linkType == "page"      => pageReference->slug.current,
        "#"
      )
    }
  }
`

export async function getSiteNavigation(): Promise<SiteNavigation> {
  const result = await sanityFetch<SiteNavigation | null>({
    query: SITE_NAVIGATION_QUERY,
    tags: ["navigation"],
  })
  return result ?? {}
}

// ─── STAFF ────────────────────────────────────────────────────────────────────

export interface StaffMember {
  _id: string
  name: string
  role: string
  photo?: string
  bio?: string
  order?: number
}

export const ALL_STAFF_QUERY = `
  *[_type == "staff"] | order(order asc) {
    _id, name, role, bio, order,
    "photo": photo.asset->url
  }
`

export async function getAllStaff(): Promise<StaffMember[]> {
  const result = await sanityFetch<StaffMember[]>({
    query: ALL_STAFF_QUERY,
    tags: ["staff"],
  })
  return result ?? []
}

// ─── WHAT WE DO ───────────────────────────────────────────────────────────────

export interface WhatWeDoPage {
  pageHeading?: string
  ourBeginningsHeading?: string
  ourBeginningsText?: string
  ourMissionHeading?: string
  ourMissionText?: string
  whyChooseUsHeading?: string
  whyChooseUsText?: string
  testimonialQuote?: string
  testimonialAuthor?: string
}

export const WHAT_WE_DO_QUERY = `
  *[_type == "whatWeDo"][0] {
    pageHeading, ourBeginningsHeading, ourBeginningsText,
    ourMissionHeading, ourMissionText, whyChooseUsHeading, whyChooseUsText,
    testimonialQuote, testimonialAuthor
  }
`

export async function getWhatWeDo(): Promise<WhatWeDoPage> {
  const result = await sanityFetch<WhatWeDoPage | null>({
    query: WHAT_WE_DO_QUERY,
    tags: ["whatWeDo"],
  })
  return result ?? {}
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export interface ProjectGalleryImage {
  asset?: string
  caption?: string
}

export interface Project {
  _id: string
  title: string
  slug?: string
  featuredImage?: string
  gallery?: ProjectGalleryImage[]
  description?: string
  tags?: string[]
  order?: number
}

export const ALL_PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc) {
    _id, title, "slug": slug.current, description, tags, order,
    "featuredImage": featuredImage.asset->url,
    "gallery": gallery[] { "asset": asset->url, caption }
  }
`

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, description, tags, order,
    "featuredImage": featuredImage.asset->url,
    "gallery": gallery[] { "asset": asset->url, caption }
  }
`

export async function getAllProjects(): Promise<Project[]> {
  const result = await sanityFetch<Project[]>({
    query: ALL_PROJECTS_QUERY,
    tags: ["projects"],
  })
  return result ?? []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return await sanityFetch<Project | null>({
    query: PROJECT_BY_SLUG_QUERY,
    params: { slug },
    tags: ["projects"],
  })
}

// ─── FEATURED ITEMS ───────────────────────────────────────────────────────────

export interface FeaturedItem {
  _id: string
  title: string
  slug?: string
  image?: string
  category?: "product" | "news" | "promotion"
  description?: string
  specs?: string[]
  ctaLabel?: string
  ctaLink?: string
  publishedDate?: string
  featured?: boolean
  order?: number
}

export const ALL_FEATURED_ITEMS_QUERY = `
  *[_type == "featuredItem" && featured == true] | order(order asc) {
    _id, title, "slug": slug.current, category, description, specs, ctaLabel, ctaLink, publishedDate, featured, order,
    "image": image.asset->url
  }
`

export const FEATURED_ITEM_BY_SLUG_QUERY = `
  *[_type == "featuredItem" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, category, description, specs, ctaLabel, ctaLink, publishedDate, featured, order,
    "image": image.asset->url
  }
`

export async function getAllFeaturedItems(): Promise<FeaturedItem[]> {
  const result = await sanityFetch<FeaturedItem[]>({
    query: ALL_FEATURED_ITEMS_QUERY,
    tags: ["featuredItems"],
  })
  return result ?? []
}

export async function getFeaturedItemBySlug(slug: string): Promise<FeaturedItem | null> {
  return await sanityFetch<FeaturedItem | null>({
    query: FEATURED_ITEM_BY_SLUG_QUERY,
    params: { slug },
    tags: ["featuredItems"],
  })
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────

export interface Brand {
  _id: string
  name: string
  logo?: string
  description?: string
  website?: string
  order?: number
}

export const ALL_BRANDS_QUERY = `
  *[_type == "brand"] | order(order asc) {
    _id, name, description, website, order,
    "logo": logo.asset->url
  }
`

export async function getAllBrands(): Promise<Brand[]> {
  const result = await sanityFetch<Brand[]>({
    query: ALL_BRANDS_QUERY,
    tags: ["brands"],
  })
  return result ?? []
}

// ─── PRODUCT PAGES ────────────────────────────────────────────────────────────

export interface ProductPageSection {
  heading?: string
  content?: string
}

export interface ProductPageGalleryImage {
  asset?: string
  caption?: string
}

export interface ProductPage {
  _id: string
  title: string
  slug?: string
  heading?: string
  introText?: string
  galleryImages?: ProductPageGalleryImage[]
  detailedDescription?: string
  sections?: ProductPageSection[]
  specifications?: string[]
  ctaHeading?: string
  ctaText?: string
  ctaButtonLabel?: string
  ctaButtonLink?: string
  seoTitle?: string
  seoDescription?: string
}

export const PRODUCT_PAGE_BY_SLUG_QUERY = `
  *[_type == "productPage" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, heading, introText, detailedDescription, sections, specifications,
    ctaHeading, ctaText, ctaButtonLabel, ctaButtonLink, seoTitle, seoDescription,
    "galleryImages": galleryImages[] { "asset": asset->url, caption }
  }
`

export async function getProductPageBySlug(slug: string): Promise<ProductPage | null> {
  return await sanityFetch<ProductPage | null>({
    query: PRODUCT_PAGE_BY_SLUG_QUERY,
    params: { slug },
    tags: ["productPages"],
  })
}
