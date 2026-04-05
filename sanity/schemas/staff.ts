import { defineField, defineType } from "sanity"

export const staffSchema = defineType({
  name: "staff",
  title: "Staff Members",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Job Title",
      type: "string",
      description: "e.g. 'Head Mechanic', 'Service Manager', 'Technician'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Staff Photo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio / Description",
      type: "text",
      rows: 4,
      description: "Brief background, experience, specialties, or fun fact about this staff member.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order staff appear on the Meet Our Staff page. Lower number = appears first.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "photo",
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
