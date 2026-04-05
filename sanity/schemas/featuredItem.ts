import { defineField, defineType } from "sanity"

export const featuredItemSchema = defineType({
  name: "featuredItem",
  title: "Featured Products & News",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. 'Xtreme 70 Series Clutch', 'New DBA Brake Package Available'",
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL: /featured-products/[slug]",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: "Main image for this product/news item.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Product", value: "product" },
          { title: "News", value: "news" },
          { title: "Promotion", value: "promotion" },
        ],
      },
      description: "Is this a product, news update, or promotion?",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
      description: "Brief overview of the product or news.",
    }),
    defineField({
      name: "specs",
      title: "Specifications / Key Features",
      type: "array",
      of: [{ type: "string" }],
      description: "Bullet points highlighting key features or specs. e.g. '1000 HP rated', 'Available in 3 friction materials'",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      description: "e.g. 'Learn More', 'Get a Quote', 'Shop Now'",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Button Link",
      type: "string",
      description: "URL or path the button links to. e.g. '/contact' or 'https://example.com'",
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "datetime",
      description: "When this item was published or featured.",
    }),
    defineField({
      name: "featured",
      title: "Featured / Highlighted",
      type: "boolean",
      description: "Toggle to highlight this item on the featured products page.",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order items appear. Lower number = appears first.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "image",
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
