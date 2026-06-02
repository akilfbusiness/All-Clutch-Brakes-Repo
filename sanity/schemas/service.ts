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
        "A direct 20-30 word answer to 'what is [service] at All Clutch & Brake?' — this is what AI engines will cite.",
      validation: (Rule) => Rule.required().max(200),
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
