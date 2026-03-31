// GROQ queries for fetching site settings and content
// These queries pull all CMS data needed for pages

import { sanityFetch } from './sanity'

// Get all site settings including the new page-specific fields
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  businessName,
  tagline,
  logo,
  phone,
  email,
  address,
  businessHours,
  abn,
  registrationId,
  googleMapsEmbedUrl,
  socialLinks,
  
  // Home page
  heroHeading,
  heroAnswerCapsule,
  heroPrimaryCtaLabel,
  heroSecondaryCtaLabel,
  heroTrustSignals,
  homeServicesHeading,
  homeServicesSubheading,
  homeWhyUsHeading,
  homeWhyUsBody,
  homeWhyUsPoints,
  homeCtaHeading,
  homeCtaBody,
  homeFaqs,
  
  // Services page
  servicesPageHeroTitle,
  servicesPageHeroSubtitle,
  servicesPageHeroImage,
  servicesPageSeoTitle,
  servicesPageSeoDescription,
  
  // Locations page
  locationsPageHeroTitle,
  locationsPageHeroSubtitle,
  locationsPageHeroImage,
  locationsPageSeoTitle,
  locationsPageSeoDescription,
  
  // Blog page (CMS fields are still named articlesPage* for backwards compatibility)
  articlesPageHeroTitle,
  articlesPageHeroSubtitle,
  articlesPageHeroImage,
  articlesPageSeoTitle,
  articlesPageSeoDescription,
  
  // About page
  aboutHeading,
  aboutAnswerCapsule,
  aboutMissionHeading,
  aboutMissionBody,
  aboutWhoWeAreHeading,
  aboutWhoWeAreBody,
  aboutValues,
  aboutTeamHeading,
  aboutTeamBody,
  
  // Contact page
  contactHeading,
  contactAnswerCapsule,
  contactFormHeading,
  contactFormSubheading,
  contactServiceOptions,
  
  // Services and locations groups
  servicesPageHeading,
  servicesPageAnswerCapsule,
  servicesFaqs,
  locationsPageHeading,
  locationsPageAnswerCapsule,
  locationsFaqs,
  
  // Footer
  footerTagline,
  footerCopyrightText,
  footerLinks,
  
  // SEO
  siteUrl,
  defaultSeoTitle,
  defaultSeoDescription,
  googleSearchConsoleToken,
  areaServed,
}`

// Get all blog posts
export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  answerCapsule,
  publishedAt,
  updatedAt,
  category,
  readTimeMinutes,
  heroImage,
  author->{name},
  body,
}`

// Get single blog post by slug
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  answerCapsule,
  quickAnswers,
  publishedAt,
  updatedAt,
  category,
  readTimeMinutes,
  heroImage,
  author->{name},
  body,
  faqItems,
  dataSources,
  geoTags,
  ctaHeading,
  ctaBody,
  "relatedPosts": relatedPosts[]->{
    title, "slug": slug.current, category, publishedAt, readTimeMinutes
  },
  seoTitle,
  seoDescription,
}`

// Get all services
export const SERVICES_QUERY = `*[_type == "service"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  icon,
}`

// Get single service by slug
export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  body,
  icon,
  seoTitle,
  seoDescription,
}`

// Get all locations
export const LOCATIONS_QUERY = `*[_type == "location"] | order(name asc) {
  _id,
  name,
  slug,
  suburb,
  region,
  description,
}`

// Get single location by slug
export const LOCATION_BY_SLUG_QUERY = `*[_type == "location" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  suburb,
  region,
  description,
  body,
  phone,
  email,
  address,
  hours,
  seoTitle,
  seoDescription,
}`

// Fetch helper function
export async function fetchSettings() {
  return await sanityFetch<any>({
    query: SITE_SETTINGS_QUERY,
  })
}

export async function fetchPosts() {
  return await sanityFetch<any[]>({
    query: POSTS_QUERY,
  })
}

export async function fetchPostBySlug(slug: string) {
  return await sanityFetch<any>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  })
}

export async function fetchServices() {
  return await sanityFetch<any[]>({
    query: SERVICES_QUERY,
  })
}

export async function fetchServiceBySlug(slug: string) {
  return await sanityFetch<any>({
    query: SERVICE_BY_SLUG_QUERY,
    params: { slug },
  })
}

export async function fetchLocations() {
  return await sanityFetch<any[]>({
    query: LOCATIONS_QUERY,
  })
}

export async function fetchLocationBySlug(slug: string) {
  return await sanityFetch<any>({
    query: LOCATION_BY_SLUG_QUERY,
    params: { slug },
  })
}
