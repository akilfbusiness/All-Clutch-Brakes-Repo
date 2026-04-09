// Gallery schema — photo library for workshop, before/after, team photos
// These appear on the gallery page, about page, and can be used throughout the site

import { defineField, defineType } from "sanity"

export const gallerySchema = defineType({
  name: "galleryImage",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Image Title",
      type: "string",
      description: "Brief title for this image (e.g. 'Clutch Replacement - Before', 'Workshop Interior')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Upload the photo here. High quality recommended (min 1200px wide). Max file size: 5MB.",
      validation: (Rule) =>
        Rule.required().assetRequired().custom((asset: any) => {
          if (asset?.asset?._ref) return true
          if (asset?.asset?.size && asset.asset.size > 5 * 1024 * 1024) {
            return "Image must be less than 5MB. Please compress your image before uploading."
          }
          return true
        }),
    }),
    defineField({
      name: "altText",
      title: "Alt Text",
      type: "string",
      description: "Describe the image for screen readers and SEO (e.g. 'Mechanic replacing clutch on Toyota Hilux')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Organize images by type for easier filtering",
      options: {
        list: [
          { title: "Workshop & Facilities", value: "workshop" },
          { title: "Before & After", value: "before-after" },
          { title: "Team Photos", value: "team" },
          { title: "Services in Action", value: "services" },
          { title: "Customer Vehicles", value: "vehicles" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
      description: "Optional longer description or context about this image",
    }),
    defineField({
      name: "relatedService",
      title: "Related Service",
      type: "reference",
      to: [{ type: "service" }],
      description: "Link this image to a specific service (e.g. clutch replacement, brake service)",
    }),
    defineField({
      name: "relatedLocation",
      title: "Related Location",
      type: "reference",
      to: [{ type: "location" }],
      description: "Link this image to a specific location/branch",
    }),
    defineField({
      name: "featuredOnGalleryPage",
      title: "Featured on Gallery Page",
      type: "boolean",
      description: "Highlight this image in the main gallery",
      initialValue: true,
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on Homepage",
      type: "boolean",
      description: "Include this image in the homepage gallery/carousel",
      initialValue: false,
    }),
    defineField({
      name: "showOnAboutPage",
      title: "Show on About Page",
      type: "boolean",
      description: "Include this image in the About page photo section",
      initialValue: false,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Add searchable tags (e.g. 'clutch', 'brake', 'transmission', 'hilux')",
      options: { layout: "tags" },
    }),
    defineField({
      name: "dateTaken",
      title: "Date Taken",
      type: "date",
      description: "When this photo was taken",
    }),
    defineField({
      name: "photographer",
      title: "Photographer / Credit",
      type: "string",
      description: "Photo credit if applicable",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Controls the order images appear in galleries. Lower number = appears first.",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
      featured: "featuredOnGalleryPage",
    },
    prepare({ title, category, media, featured }) {
      return {
        title: `${title} ${featured ? "⭐" : ""}`,
        subtitle: category || "Uncategorized",
        media,
      }
    },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
    {
      title: "Date Taken (Newest First)",
      name: "dateDesc",
      by: [{ field: "dateTaken", direction: "desc" }],
    },
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
})
