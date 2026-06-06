// Generic Page schema — flexible block-based builder for any custom page.
// Pages created here can be linked into the navigation and will be rendered
// at /{slug} by the dynamic page renderer (app/[slug]/page.tsx).
//
// Hero   → Full-viewport header with optional image/video background.
// Sections → Block-based content sections the editor composes in any order.
// SEO    → Meta title, description, and social share image.
// Settings → Slug, category, sitemap visibility, publish date.

import { defineType, defineField, defineArrayMember } from "sanity"

// ─── REUSABLE CTA OBJECT ──────────────────────────────────────────────────────

const ctaObject = {
  type: "object" as const,
  name: "cta",
  title: "Call to Action",
  fields: [
    { name: "label", title: "Button Label", type: "string" as const },
    {
      name: "href", title: "Button URL", type: "string" as const,
      description: "Internal path (e.g. /contact) or full URL (https://...)",
    },
    {
      name: "style", title: "Button Style", type: "string" as const,
      options: {
        list: [
          { title: "Primary (filled)", value: "primary" },
          { title: "Secondary (outline)", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    },
  ],
  preview: { select: { title: "label", subtitle: "href" } },
}

// ─── SECTION BLOCK DEFINITIONS ────────────────────────────────────────────────

const richTextSection = defineArrayMember({
  type: "object",
  name: "richTextSection",
  title: "Rich Text",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link", type: "object", title: "Link",
                fields: [
                  {
                    name: "href", type: "url", title: "URL",
                    validation: (Rule: any) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  },
                  { name: "openInNewTab", type: "boolean", title: "Open in new tab", initialValue: false },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
      description: "Rich text content with headings, lists, links, and inline images.",
    }),
    defineField({
      name: "maxWidth",
      title: "Content Width",
      type: "string",
      options: {
        list: [
          { title: "Narrow (prose)", value: "narrow" },
          { title: "Normal", value: "normal" },
          { title: "Wide", value: "wide" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
  preview: { select: { title: "content.0.children.0.text" }, prepare: ({ title }: any) => ({ title: title ?? "Rich Text Section" }) },
})

const imageTextSection = defineArrayMember({
  type: "object",
  name: "imageTextSection",
  title: "Image + Text",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string", description: "Small uppercase label above the heading." }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body Text", type: "text", rows: 4 }),
    defineField({
      name: "image", title: "Image", type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "imagePosition", title: "Image Position", type: "string",
      options: { list: [{ title: "Left", value: "left" }, { title: "Right", value: "right" }], layout: "radio" },
      initialValue: "right",
    }),
    defineField({ ...ctaObject, name: "cta", title: "CTA Button (optional)" }),
  ],
  preview: { select: { title: "heading", media: "image" }, prepare: ({ title, media }: any) => ({ title: title ?? "Image + Text", media }) },
})

const fullWidthBannerSection = defineArrayMember({
  type: "object",
  name: "fullWidthBannerSection",
  title: "Full-Width Banner",
  fields: [
    defineField({
      name: "backgroundImage", title: "Background Image", type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "backgroundVideo", title: "Background Video", type: "file",
      description: "Optional looping video. Upload an MP4 (H.264, 5–15 MB, no audio).",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body Text", type: "text", rows: 3 }),
    defineField({ ...ctaObject, name: "cta", title: "CTA Button (optional)" }),
    defineField({
      name: "overlayOpacity", title: "Dark Overlay Opacity", type: "string",
      description: "Controls how dark the overlay is over the background media.",
      options: {
        list: [
          { title: "Light (30%)", value: "light" },
          { title: "Medium (55%)", value: "medium" },
          { title: "Dark (75%)", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "medium",
    }),
  ],
  preview: { select: { title: "heading", media: "backgroundImage" }, prepare: ({ title, media }: any) => ({ title: title ?? "Full-Width Banner", media }) },
})

const statsSection = defineArrayMember({
  type: "object",
  name: "statsSection",
  title: "Stats / Numbers",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({
      name: "stats", title: "Stat Items", type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "value", title: "Display Value (e.g. '30+', 'Since 1984')", type: "string", validation: (Rule: any) => Rule.required() },
          { name: "label", title: "Label (e.g. 'Years in Business')", type: "string", validation: (Rule: any) => Rule.required() },
          { name: "subtitle", title: "Subtitle (optional)", type: "string" },
        ],
        preview: { select: { title: "value", subtitle: "label" } },
      }],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Stats Section" }) },
})

const gallerySection = defineArrayMember({
  type: "object",
  name: "gallerySection",
  title: "Image Gallery",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({
      name: "images", title: "Images", type: "array",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt", type: "string", title: "Alt Text" },
          { name: "caption", type: "string", title: "Caption" },
        ],
      }],
    }),
    defineField({
      name: "columns", title: "Columns", type: "string",
      options: {
        list: [
          { title: "2 columns", value: "2" },
          { title: "3 columns", value: "3" },
          { title: "4 columns", value: "4" },
        ],
        layout: "radio",
      },
      initialValue: "3",
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Image Gallery" }) },
})

const faqSection = defineArrayMember({
  type: "object",
  name: "faqSection",
  title: "FAQ Accordion",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2 }),
    defineField({
      name: "items", title: "FAQ Items", type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "question", title: "Question", type: "string", validation: (Rule: any) => Rule.required() },
          { name: "answer", title: "Answer", type: "text", rows: 4, validation: (Rule: any) => Rule.required() },
        ],
        preview: { select: { title: "question" } },
      }],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "FAQ Accordion" }) },
})

const testimonialsSection = defineArrayMember({
  type: "object",
  name: "testimonialsSection",
  title: "Testimonials",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({
      name: "source", title: "Testimonials Source", type: "string",
      options: {
        list: [
          { title: "Auto — pull featured testimonials from CMS", value: "featured" },
          { title: "Manual — enter testimonials below", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "featured",
    }),
    defineField({
      name: "manualItems", title: "Manual Testimonials", type: "array",
      description: "Only used when Source is set to 'Manual'.",
      of: [{
        type: "object",
        fields: [
          { name: "quote", title: "Quote", type: "text", rows: 3, validation: (Rule: any) => Rule.required() },
          { name: "name", title: "Customer Name", type: "string" },
          { name: "suburb", title: "Suburb", type: "string" },
          { name: "rating", title: "Star Rating", type: "number", options: { list: [1, 2, 3, 4, 5] } },
        ],
        preview: { select: { title: "name", subtitle: "suburb" } },
      }],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Testimonials" }) },
})

const servicesSection = defineArrayMember({
  type: "object",
  name: "servicesSection",
  title: "Services Block",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2 }),
    defineField({
      name: "source", title: "Services Source", type: "string",
      options: {
        list: [
          { title: "Auto — show all services from CMS", value: "all" },
          { title: "Pick — select specific services", value: "selected" },
        ],
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "selectedServices", title: "Selected Services", type: "array",
      description: "Only used when Source is set to 'Pick'.",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Services Block" }) },
})

const teamSection = defineArrayMember({
  type: "object",
  name: "teamSection",
  title: "Team Members",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({ name: "subheading", title: "Subheading", type: "text", rows: 2 }),
    defineField({
      name: "source", title: "Team Source", type: "string",
      options: {
        list: [
          { title: "Auto — show all staff from CMS", value: "all" },
          { title: "Pick — select specific staff members", value: "selected" },
        ],
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "selectedStaff", title: "Selected Staff", type: "array",
      description: "Only used when Source is set to 'Pick'.",
      of: [{ type: "reference", to: [{ type: "staff" }] }],
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Team Members" }) },
})

const promotionsSection = defineArrayMember({
  type: "object",
  name: "promotionsSection",
  title: "Promotions & Specials",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Section Heading", type: "string" }),
    defineField({
      name: "source", title: "Promotions Source", type: "string",
      options: {
        list: [
          { title: "Auto — show all active promotions", value: "active" },
          { title: "Auto — show featured promotions only", value: "featured" },
        ],
        layout: "radio",
      },
      initialValue: "featured",
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Promotions & Specials" }) },
})

const contactFormSection = defineArrayMember({
  type: "object",
  name: "contactFormSection",
  title: "Contact Form",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow Label", type: "string" }),
    defineField({ name: "heading", title: "Form Heading", type: "string", description: "e.g. 'Send an Enquiry'" }),
    defineField({ name: "subheading", title: "Form Subheading", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "Contact Form" }) },
})

const embedSection = defineArrayMember({
  type: "object",
  name: "embedSection",
  title: "Embed (YouTube / Map / etc.)",
  fields: [
    defineField({ name: "heading", title: "Section Heading (optional)", type: "string" }),
    defineField({
      name: "embedUrl", title: "Embed URL", type: "url",
      description: "Paste the embed/iframe src URL. For YouTube use the /embed/ format. For Google Maps use the embed URL from the 'Share → Embed a map' option.",
      validation: (Rule: any) => Rule.required(),
    }),
    defineField({ name: "height", title: "Height (px)", type: "number", description: "Default: 450", initialValue: 450 }),
    defineField({ name: "title", title: "Iframe Title (for accessibility)", type: "string" }),
  ],
  preview: { select: { title: "heading", subtitle: "embedUrl" }, prepare: ({ title, subtitle }: any) => ({ title: title ?? "Embed", subtitle }) },
})

const ctaBannerSection = defineArrayMember({
  type: "object",
  name: "ctaBannerSection",
  title: "CTA Strip",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body Text", type: "text", rows: 2 }),
    defineField({ ...ctaObject, name: "primaryCta", title: "Primary Button" }),
    defineField({ ...ctaObject, name: "secondaryCta", title: "Secondary Button (optional)" }),
    defineField({
      name: "style", title: "Strip Style", type: "string",
      options: {
        list: [
          { title: "Accent background (blue/brand)", value: "accent" },
          { title: "Dark background", value: "dark" },
          { title: "Light background", value: "light" },
        ],
        layout: "radio",
      },
      initialValue: "accent",
    }),
  ],
  preview: { select: { title: "heading" }, prepare: ({ title }: any) => ({ title: title ?? "CTA Strip" }) },
})

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

export const pageSchema = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "hero",     title: "Hero",     default: true },
    { name: "sections", title: "Sections" },
    { name: "seo",      title: "SEO" },
    { name: "settings", title: "Settings" },
  ],
  fields: [

    // ═══════════════════════════════════════════════════════════════════════════
    // HERO GROUP
    // ═══════════════════════════════════════════════════════════════════════════

    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      description: "Used in the browser tab and as the H1. Also used as the fallback hero heading.",
      validation: (Rule) => Rule.required().max(70),
      group: "hero",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      description: "Optional override for the hero H1. Falls back to Page Title if empty.",
      group: "hero",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 2,
      description: "Short description shown below the hero heading.",
      group: "hero",
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow Label",
      type: "string",
      description: "Small uppercase label above the heading. e.g. 'Our Story', 'Services'",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-viewport background image. Used as fallback when no video is set.",
      group: "hero",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Background Video",
      type: "file",
      description: "Optional looping background video. Upload an MP4 (H.264, 1080p, 5–15 MB, no audio). When set, plays instead of the background image.",
      options: { accept: "video/mp4,video/webm" },
      group: "hero",
    }),
    defineField({
      name: "heroPrimaryCta",
      title: "Hero Primary Button",
      type: "object",
      group: "hero",
      fields: [
        { name: "label", title: "Button Label", type: "string" },
        { name: "href",  title: "URL or Path", type: "string" },
      ],
    }),
    defineField({
      name: "heroSecondaryCta",
      title: "Hero Secondary Button",
      type: "object",
      group: "hero",
      fields: [
        { name: "label", title: "Button Label", type: "string" },
        { name: "href",  title: "URL or Path", type: "string" },
      ],
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTIONS GROUP
    // ═══════════════════════════════════════════════════════════════════════════

    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      group: "sections",
      description: "Build the page by adding and reordering sections. Each section type has its own layout and fields.",
      of: [
        richTextSection,
        imageTextSection,
        fullWidthBannerSection,
        statsSection,
        gallerySection,
        faqSection,
        testimonialsSection,
        servicesSection,
        teamSection,
        promotionsSection,
        contactFormSection,
        embedSection,
        ctaBannerSection,
      ],
      options: {
        insertMenu: {
          views: [{ name: "list" }],
          groups: [
            { name: "content",   title: "Content",    of: ["richTextSection", "imageTextSection", "fullWidthBannerSection"] },
            { name: "data",      title: "Dynamic",    of: ["testimonialsSection", "servicesSection", "teamSection", "promotionsSection"] },
            { name: "layout",    title: "Layout",     of: ["statsSection", "gallerySection", "ctaBannerSection"] },
            { name: "forms",     title: "Forms & Embeds", of: ["faqSection", "contactFormSection", "embedSection"] },
          ],
        },
      },
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // SEO GROUP
    // ═══════════════════════════════════════════════════════════════════════════

    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "SEO title override. Falls back to Page Title if empty. Ideal: 50–60 characters.",
      validation: (Rule) => Rule.max(70),
      group: "seo",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "SEO description for search engines. Ideal: 150–160 characters.",
      validation: (Rule) => Rule.max(160),
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description: "Image shown when the page is shared on social media.",
      group: "seo",
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "If enabled, search engines will not index this page.",
      initialValue: false,
      group: "seo",
    }),

    // ═══════════════════════════════════════════════════════════════════════════
    // SETTINGS GROUP
    // ═══════════════════════════════════════════════════════════════════════════

    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "The URL path for this page. e.g. 'about-us' becomes /about-us.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: "settings",
    }),
    defineField({
      name: "category",
      title: "Page Category",
      type: "string",
      description: "Organises pages in the CMS. Does not affect the URL.",
      options: {
        list: [
          { title: "General",      value: "general" },
          { title: "Legal",        value: "legal" },
          { title: "Landing Page", value: "landing" },
          { title: "Support",      value: "support" },
        ],
        layout: "dropdown",
      },
      initialValue: "general",
      group: "settings",
    }),
    defineField({
      name: "showInSitemap",
      title: "Show in Sitemap",
      type: "boolean",
      description: "Include this page in the XML sitemap.",
      initialValue: true,
      group: "settings",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
      description: "Optional publish date for display or sorting purposes.",
      group: "settings",
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Links / Related Pages",
      type: "array",
      group: "seo",
      description:
        "Link to any page on the site for internal linking and topical authority. Use 'Existing Page' to search and select from your services, blog posts, and location pages — the URL resolves automatically. Use 'Custom Link' for any URL you want to enter manually (external pages, /contact, anchor links, etc.).",
      of: [
        {
          type: "object",
          name: "internalLinkReference",
          title: "Existing Page (search & select)",
          fields: [
            { name: "linkType", type: "string", hidden: true, initialValue: "reference" },
            {
              name: "page",
              title: "Page",
              type: "reference",
              description: "Search by title — links to services, blog posts, location pages, and more.",
              to: [
                { type: "service" },
                { type: "post" },
                { type: "location" },
                { type: "page" },
              ],
              validation: Rule => Rule.required(),
            },
            { name: "labelOverride", title: "Label Override (optional)", type: "string", description: "Leave blank to use the page title." },
            { name: "description", title: "Short Description (optional)", type: "string", description: "One sentence shown under the link. Used by crawlers." },
          ],
          preview: {
            select: { title: "labelOverride", refTitle: "page.title", subtitle: "description" },
            prepare({ title, refTitle, subtitle }: { title?: string; refTitle?: string; subtitle?: string }) {
              return { title: title || refTitle || "Linked page", subtitle: subtitle || "Reference link" }
            },
          },
        },
        {
          type: "object",
          name: "internalLinkCustom",
          title: "Custom Link (manual URL)",
          fields: [
            { name: "linkType", type: "string", hidden: true, initialValue: "custom" },
            { name: "label", title: "Link Label", type: "string", description: "The clickable link text.", validation: Rule => Rule.required() },
            { name: "url", title: "URL", type: "string", description: "Relative path (e.g. /contact) or full URL (https://...).", validation: Rule => Rule.required() },
            { name: "description", title: "Short Description (optional)", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title || "Custom link", subtitle: subtitle || "" }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      category: "category",
      media: "heroImage",
    },
    prepare({ title, slug, category, media }: any) {
      return {
        title: title || "Untitled Page",
        subtitle: `/${slug || "no-slug"} • ${category || "general"}`,
        media,
      }
    },
  },
})
