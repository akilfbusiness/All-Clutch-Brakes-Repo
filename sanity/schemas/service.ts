// Service schema — for all service pages (e.g. Clutch Repairs, Brake Service, Transmission Repairs)
// Content is managed in Sanity so the business owner can update
// service descriptions without touching code

import { defineField, defineType } from "sanity"

export const serviceSchema = defineType({
  name: "service",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
      description: "Full-viewport background image shown in the hero section at the top of this service page. If set, this overlays the hero with a dark tint. Leave empty for a plain dark hero.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Background Video",
      type: "file",
      description: "Optional looping background video for this service page hero. Upload an MP4 (H.264, 1080p, 5–15 MB, no audio). When set, this plays instead of the hero image.",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      description: "Main image for this service. Shown at the top of the service page and in service cards.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Optional caption for this image (e.g. 'Before', 'After', 'Workshop').",
            },
          ],
        },
      ],
      description: "Additional images — before/after shots, workshop photos. These appear in a gallery below the main content.",
    }),
    defineField({
      name: "serviceAreas",
      title: "Service Areas",
      type: "array",
      of: [{ type: "reference", to: [{ type: "location" }] }],
      description: "Link this service to specific locations. Used for geo-targeted SEO — mentions the suburbs on this service page automatically.",
    }),
    defineField({
      name: "title",
      title: "Service Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL: /services/[slug]",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answerCapsule",
      title: "Answer Capsule",
      type: "text",
      rows: 2,
      description:
        "A direct 40-60 word answer to 'what is [service] at All Clutch & Brake?' — written as a standalone citable sentence for AI engines. Include: service name, location, specialisation, key differentiator, and trust signal.",
      validation: (Rule) => Rule.required().max(350),
    }),
    defineField({
      name: "body",
      title: "Service Description",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whoIsItFor",
      title: "Who Is This Service For?",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description: "5-7 questions specific to this service. These power FAQPage schema.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
    defineField({
      name: "icon",
      title: "Service Icon",
      type: "string",
      description: "Lucide icon name (e.g. 'heart', 'home', 'users'). Used in service cards.",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(155),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order services appear on the Services page. Lower number = appears first.",
    }),
    defineField({
      name: "serviceType",
      title: "Service Type (for Google schema)",
      type: "string",
      description: "Specific label Google uses in search results (e.g. 'Clutch Replacement and Repair', 'Brake Pad Replacement'). Falls back to 'Automotive Repair' if left blank.",
    }),
    defineField({
      name: "pricingDescription",
      title: "Pricing Description (for Google schema)",
      type: "string",
      description: "One sentence summarising pricing for this service — used inside the Offer schema Google reads. E.g. 'Clutch replacements from $350 depending on vehicle type. Fixed-price quotes with no hidden fees.' Max 160 chars.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "pricingTable",
      title: "Pricing Table",
      type: "array",
      description: "Optional pricing guide shown on this service page. Add rows per vehicle type or service variant. Leave empty to hide the section.",
      of: [
        {
          type: "object",
          name: "pricingRow",
          title: "Pricing Row",
          fields: [
            {
              name: "vehicleType",
              title: "Vehicle Type / Service Variant",
              type: "string",
              description: "e.g. 'Small Car', 'SUV / 4WD', 'Performance Vehicle', 'Standard Clutch Kit'",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "priceRange",
              title: "Price Range",
              type: "string",
              description: "e.g. '$350 – $550', 'From $290', 'POA'",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "notes",
              title: "Notes (optional)",
              type: "string",
              description: "e.g. 'Includes parts and labour', 'Call for exact quote'",
            },
          ],
          preview: {
            select: { title: "vehicleType", subtitle: "priceRange" },
          },
        },
      ],
    }),
    defineField({
      name: "internalLinks",
      title: "Internal Links / Related Pages",
      type: "array",
      description: "Add links to related pages for internal linking. These appear as a dedicated section on the service page — great for SEO and navigation. Can link to any page type.",
      of: [
        {
          type: "object",
          name: "internalLink",
          title: "Link",
          fields: [
            {
              name: "label",
              title: "Link Label",
              type: "string",
              description: "The clickable text shown on the page (e.g. 'Transmission Repairs', 'Contact Us')",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "description",
              title: "Short Description (optional)",
              type: "string",
              description: "One sentence describing what this page is about",
            },
            {
              name: "url",
              title: "URL / Path",
              type: "string",
              description: "Relative path (e.g. /services/transmission-repairs) or full URL for external links",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "answerCapsule",
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
})
