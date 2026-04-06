import { defineField, defineType } from "sanity"

export const productPageSchema = defineType({
  name: "productPage",
  title: "Product Pages (Brake Pipes, Specialty Parts, etc.)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. 'Brake Pipes', 'Specialty Parts & Components'",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL: /products/[slug] — e.g. slug 'braided-hoses' → /products/braided-hoses",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heading",
      title: "Page Heading",
      type: "string",
      description: "Main heading displayed at the top of the page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "introText",
      title: "Introduction Text",
      type: "text",
      rows: 4,
      description: "Introductory paragraph explaining what this product page is about.",
    }),
    defineField({
      name: "galleryImages",
      title: "Gallery Images",
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
              description: "Optional caption for this image.",
            },
          ],
        },
      ],
      description: "Product photos, demonstration images, or installation shots.",
    }),
    defineField({
      name: "detailedDescription",
      title: "Detailed Description",
      type: "text",
      rows: 6,
      description: "In-depth description of the product/service, materials, specifications, or process.",
    }),
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "heading",
              title: "Section Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "content",
              title: "Section Content",
              type: "text",
              rows: 4,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: "heading" },
          },
        },
      ],
      description: "Additional content sections. e.g. 'Steel Brake Pipes', 'Stainless Steel Pipes', 'Cunifer Tubes', etc.",
    }),
    defineField({
      name: "specifications",
      title: "Specifications / Available Options",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points listing sizes, materials, ratings, or available options.",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Section Heading",
      type: "string",
      description: "e.g. 'Ready to Upgrade?', 'Get a Quote Today'",
    }),
    defineField({
      name: "ctaText",
      title: "CTA Section Text",
      type: "text",
      rows: 2,
      description: "Text encouraging users to take action (contact, call, etc.).",
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "CTA Button Label",
      type: "string",
      description: "e.g. 'Contact Us', 'Get a Quote', 'Call Now'",
    }),
    defineField({
      name: "ctaButtonLink",
      title: "CTA Button Link",
      type: "string",
      description: "URL or path the button links to. e.g. '/contact' or 'tel:0882778122'",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.max(60),
      description: "Meta title for search engines.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.max(155),
      description: "Meta description for search engines.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
})
