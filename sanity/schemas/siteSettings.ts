// siteSettings schema — the single source of truth for ALL site content
// The customer edits this document in Sanity Studio to control every page.
// No code changes required to update any content on the website.

import { defineField, defineType } from "sanity"

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  groups: [
    { name: "business", title: "Business Details" },
    { name: "homepage", title: "Home Page" },
    { name: "servicespage", title: "Services Page" },
    { name: "locationspage", title: "Locations Page" },
    { name: "articlespage", title: "Articles Page" },
    { name: "about", title: "About Page" },
    { name: "contact", title: "Contact Page" },
    { name: "services", title: "Services" },
    { name: "locations", title: "Locations" },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO & Social" },
  ],
  fields: [

    // ─── BUSINESS DETAILS ──────────────────────────────────────────────────────
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      group: "business",
      description: "The full trading name of the business. Used site-wide in titles, schema, and the footer.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      group: "business",
      description: "A short one-line description of the business. Appears in the header and footer.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "business",
      description: "Upload the business logo here. Replaces the LOGO-HERE placeholder throughout the site.",
      options: { hotspot: true },
    }),
    defineField({
      name: "phone",
      title: "Phone Numbers",
      type: "array",
      of: [{ type: "string" }],
      group: "business",
      description: "All contact phone numbers. Add multiple if needed.",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "string",
      group: "business",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      group: "business",
      fields: [
        { name: "street", title: "Street", type: "string" },
        { name: "suburb", title: "Suburb", type: "string" },
        { name: "state", title: "State", type: "string" },
        { name: "postcode", title: "Postcode", type: "string" },
        { name: "country", title: "Country", type: "string" },
      ],
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "array",
      group: "business",
      of: [
        {
          type: "object",
          fields: [
            { name: "days", title: "Days (e.g. Monday - Friday)", type: "string" },
            { name: "hours", title: "Hours (e.g. 9:00 AM - 5:00 PM)", type: "string" },
          ],
          preview: { select: { title: "days", subtitle: "hours" } },
        },
      ],
    }),
    defineField({
      name: "abn",
      title: "ABN",
      type: "string",
      group: "business",
      description: "Australian Business Number. Displayed in the footer and about page.",
    }),
    defineField({
      name: "registrationId",
      title: "Business Registration ID",
      type: "string",
      group: "business",
      description: "Industry registration or licence number (e.g. NDIS Registration ID). Optional.",
    }),
    defineField({
      name: "googleMapsEmbedUrl",
      title: "Google Maps Embed URL",
      type: "url",
      group: "business",
      description: "Paste the full Google Maps embed URL for the contact page map.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "object",
      group: "business",
      fields: [
        { name: "facebook", title: "Facebook URL", type: "url" },
        { name: "instagram", title: "Instagram URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
        { name: "twitter", title: "Twitter / X URL", type: "url" },
      ],
    }),

    // ─── HOME PAGE ─────────────────────────────────────────────────────────────
    defineField({
      name: "heroHeading",
      title: "Hero Heading (H1)",
      type: "string",
      group: "homepage",
      description: "The main heading on the home page. Highly visible to search engines.",
      validation: (Rule) => Rule.required().max(100),
    }),
    defineField({
      name: "heroAnswerCapsule",
      title: "Hero Answer Capsule",
      type: "text",
      group: "homepage",
      rows: 3,
      description: "20-30 word direct answer that appears below the H1. This is what AI engines cite. Keep it factual and concise.",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "heroPrimaryCtaLabel",
      title: "Hero Primary CTA Button Label",
      type: "string",
      group: "homepage",
      description: "e.g. 'Get Started Today'",
    }),
    defineField({
      name: "heroSecondaryCtaLabel",
      title: "Hero Secondary CTA Button Label",
      type: "string",
      group: "homepage",
      description: "e.g. 'View Our Services'",
    }),
    defineField({
      name: "heroTrustSignals",
      title: "Hero Trust Signals",
      type: "array",
      group: "homepage",
      of: [{ type: "string" }],
      description: "Short trust signals displayed below the CTA buttons (e.g. 'ABN: 11 656 510 075', 'Registered Provider', '24/7 Support Available').",
    }),
    defineField({
      name: "homeServicesHeading",
      title: "Services Section Heading",
      type: "string",
      group: "homepage",
      description: "Heading for the services overview section on the home page.",
    }),
    defineField({
      name: "homeServicesSubheading",
      title: "Services Section Subheading",
      type: "text",
      group: "homepage",
      rows: 2,
      description: "Supporting text below the services section heading.",
    }),
    defineField({
      name: "homeWhyUsHeading",
      title: "Why Choose Us Heading",
      type: "string",
      group: "homepage",
    }),
    defineField({
      name: "homeWhyUsBody",
      title: "Why Choose Us Body Text",
      type: "text",
      group: "homepage",
      rows: 4,
    }),
    defineField({
      name: "homeWhyUsPoints",
      title: "Why Choose Us Bullet Points",
      type: "array",
      group: "homepage",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "homeCtaHeading",
      title: "Bottom CTA Heading",
      type: "string",
      group: "homepage",
    }),
    defineField({
      name: "homeCtaBody",
      title: "Bottom CTA Body Text",
      type: "text",
      group: "homepage",
      rows: 3,
    }),
    defineField({
      name: "homeFaqs",
      title: "Home Page FAQ Items",
      type: "array",
      group: "homepage",
      description: "These power both the visible FAQ section and the FAQPage schema for AI citations.",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() },
            { name: "answer", title: "Answer", type: "text", rows: 4, validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ─── SERVICES PAGE ─────────────────────────────────────────────────────────
    defineField({
      name: "servicesPageHeroTitle",
      title: "Hero Title",
      type: "string",
      group: "servicespage",
      description: "Main heading for the services page hero section (H1).",
    }),
    defineField({
      name: "servicesPageHeroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      group: "servicespage",
      rows: 2,
      description: "Supporting text below the hero title. Appears in the dark hero section.",
    }),
    defineField({
      name: "servicesPageHeroImage",
      title: "Hero Image",
      type: "image",
      group: "servicespage",
      description: "Background image for the hero section. Leave empty for dark background.",
      options: { hotspot: true },
    }),
    defineField({
      name: "servicesPageSeoTitle",
      title: "SEO Title",
      type: "string",
      group: "servicespage",
      description: "Browser tab title and search result title.",
    }),
    defineField({
      name: "servicesPageSeoDescription",
      title: "SEO Description",
      type: "text",
      group: "servicespage",
      rows: 2,
      description: "Meta description for search results (120-160 characters).",
    }),

    // ─── LOCATIONS PAGE ────────────────────────────────────────────────────────
    defineField({
      name: "locationsPageHeroTitle",
      title: "Hero Title",
      type: "string",
      group: "locationspage",
      description: "Main heading for the locations page hero section (H1).",
    }),
    defineField({
      name: "locationsPageHeroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      group: "locationspage",
      rows: 2,
      description: "Supporting text below the hero title. Appears in the dark hero section.",
    }),
    defineField({
      name: "locationsPageHeroImage",
      title: "Hero Image",
      type: "image",
      group: "locationspage",
      description: "Background image for the hero section. Leave empty for dark background.",
      options: { hotspot: true },
    }),
    defineField({
      name: "locationsPageSeoTitle",
      title: "SEO Title",
      type: "string",
      group: "locationspage",
      description: "Browser tab title and search result title.",
    }),
    defineField({
      name: "locationsPageSeoDescription",
      title: "SEO Description",
      type: "text",
      group: "locationspage",
      rows: 2,
      description: "Meta description for search results (120-160 characters).",
    }),

    // ─── ARTICLES PAGE ─────────────────────────────────────────────────────────
    defineField({
      name: "articlesPageHeroTitle",
      title: "Hero Title",
      type: "string",
      group: "articlespage",
      description: "Main heading for the articles page hero section (H1).",
    }),
    defineField({
      name: "articlesPageHeroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      group: "articlespage",
      rows: 2,
      description: "Supporting text below the hero title. Appears in the dark hero section.",
    }),
    defineField({
      name: "articlesPageHeroImage",
      title: "Hero Image",
      type: "image",
      group: "articlespage",
      description: "Background image for the hero section. Leave empty for dark background.",
      options: { hotspot: true },
    }),
    defineField({
      name: "articlesPageSeoTitle",
      title: "SEO Title",
      type: "string",
      group: "articlespage",
      description: "Browser tab title and search result title.",
    }),
    defineField({
      name: "articlesPageSeoDescription",
      title: "SEO Description",
      type: "text",
      group: "articlespage",
      rows: 2,
      description: "Meta description for search results (120-160 characters).",
    }),

    // ─── ABOUT PAGE ────────────────────────────────────────────────────────────
    defineField({
      name: "aboutHeading",
      title: "About Page H1",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutAnswerCapsule",
      title: "About Answer Capsule",
      type: "text",
      group: "about",
      rows: 3,
      description: "20-30 word direct answer below the H1 on the About page.",
    }),
    defineField({
      name: "aboutMissionHeading",
      title: "Mission Section Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutMissionBody",
      title: "Mission Body Text",
      type: "text",
      group: "about",
      rows: 4,
    }),
    defineField({
      name: "aboutWhoWeAreHeading",
      title: "Who We Are Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutWhoWeAreBody",
      title: "Who We Are Body Text",
      type: "array",
      group: "about",
      of: [{ type: "text" }],
      description: "Add one paragraph per item.",
    }),
    defineField({
      name: "aboutValues",
      title: "Our Values",
      type: "array",
      group: "about",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Value Title", type: "string" },
            { name: "description", title: "Description", type: "text", rows: 2 },
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "aboutTeamHeading",
      title: "Team Section Heading",
      type: "string",
      group: "about",
    }),
    defineField({
      name: "aboutTeamBody",
      title: "Team Section Body",
      type: "text",
      group: "about",
      rows: 3,
    }),

    // ─── CONTACT PAGE ──────────────────────────────────────────────────────────
    defineField({
      name: "contactHeading",
      title: "Contact Page H1",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactAnswerCapsule",
      title: "Contact Answer Capsule",
      type: "text",
      group: "contact",
      rows: 3,
    }),
    defineField({
      name: "contactFormHeading",
      title: "Form Section Heading",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactFormSubheading",
      title: "Form Section Subheading",
      type: "text",
      group: "contact",
      rows: 2,
    }),
    defineField({
      name: "contactServiceOptions",
      title: "Service Options (Form Dropdown)",
      type: "array",
      group: "contact",
      of: [{ type: "string" }],
      description: "The list of services shown in the enquiry form dropdown.",
    }),

    // ─── SERVICES ──────────────────────────────────────────────────────────────
    defineField({
      name: "servicesPageHeading",
      title: "Services Page H1",
      type: "string",
      group: "services",
    }),
    defineField({
      name: "servicesPageAnswerCapsule",
      title: "Services Answer Capsule",
      type: "text",
      group: "services",
      rows: 3,
    }),
    defineField({
      name: "servicesFaqs",
      title: "Services Page FAQ Items",
      type: "array",
      group: "services",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 4 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ─── LOCATIONS ─────────────────────────────────────────────────────────────
    defineField({
      name: "locationsPageHeading",
      title: "Locations Page H1",
      type: "string",
      group: "locations",
    }),
    defineField({
      name: "locationsPageAnswerCapsule",
      title: "Locations Answer Capsule",
      type: "text",
      group: "locations",
      rows: 3,
    }),
    defineField({
      name: "locationsFaqs",
      title: "Locations Page FAQ Items",
      type: "array",
      group: "locations",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text", rows: 4 },
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ─── FOOTER ────────────────────────────────────────────────────────────────
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
      group: "footer",
      description: "Short description shown in the footer below the logo.",
    }),
    defineField({
      name: "footerCopyrightText",
      title: "Footer Copyright Text",
      type: "string",
      group: "footer",
      description: "e.g. '© 2026 All Clutch & Brake Service. All rights reserved.'",
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Navigation Links",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "URL", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),

    // ─── SEO ───────────────────────────────────────────────────────────────────
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      group: "seo",
      description: "The full production URL including https:// (e.g. https://allclutchbrakeservice.com.au)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "defaultSeoTitle",
      title: "Default SEO Title",
      type: "string",
      group: "seo",
      description: "Used as the fallback page title if a page has no specific title set.",
    }),
    defineField({
      name: "defaultSeoDescription",
      title: "Default SEO Description",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Used as the fallback meta description if a page has no specific description set.",
    }),
    defineField({
      name: "googleSearchConsoleToken",
      title: "Google Search Console Verification Token",
      type: "string",
      group: "seo",
      description: "Paste the content value from Google Search Console verification meta tag here.",
    }),
    defineField({
      name: "areaServed",
      title: "Service Area",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
      description: "List the regions and areas served. Used in LocalBusiness schema areaServed field.",
    }),
  ],
  preview: {
    select: { title: "businessName" },
  },
})
