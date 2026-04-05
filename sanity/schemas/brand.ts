import { defineField, defineType } from "sanity"

export const brandSchema = defineType({
  name: "brand",
  title: "Brands",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "e.g. 'AP Racing', 'DBA', 'Brembo'",
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      description: "Logo image for this brand.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief description of the brand, their specialty, or why we carry them.",
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
      description: "Link to the brand's official website (optional).",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order brands appear on the Brands page. Lower number = appears first.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
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
