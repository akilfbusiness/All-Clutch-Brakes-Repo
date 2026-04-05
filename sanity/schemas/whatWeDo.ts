import { defineField, defineType } from "sanity"

export const whatWeDoSchema = defineType({
  name: "whatWeDo",
  title: "What We Do Page",
  type: "document",
  fields: [
    defineField({
      name: "pageHeading",
      title: "Page Heading",
      type: "string",
      description: "Main title of the What We Do page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ourBeginningsHeading",
      title: "Our Beginnings - Heading",
      type: "string",
      description: "Heading for the 'Our Beginnings' section.",
    }),
    defineField({
      name: "ourBeginningsText",
      title: "Our Beginnings - Text",
      type: "text",
      rows: 5,
      description: "Story/history of the business — founding, growth, experience.",
    }),
    defineField({
      name: "ourMissionHeading",
      title: "Our Mission - Heading",
      type: "string",
      description: "Heading for the 'Our Mission' section.",
    }),
    defineField({
      name: "ourMissionText",
      title: "Our Mission - Text",
      type: "text",
      rows: 5,
      description: "Company mission statement, values, and approach.",
    }),
    defineField({
      name: "whyChooseUsHeading",
      title: "Why Choose Us - Heading",
      type: "string",
      description: "Heading for the 'Why Choose Us' section.",
    }),
    defineField({
      name: "whyChooseUsText",
      title: "Why Choose Us - Text",
      type: "text",
      rows: 5,
      description: "Explanation of what makes this business unique and why customers should choose them.",
    }),
    defineField({
      name: "testimonialQuote",
      title: "Featured Testimonial Quote",
      type: "text",
      rows: 3,
      description: "A customer testimonial or powerful quote.",
    }),
    defineField({
      name: "testimonialAuthor",
      title: "Testimonial Author",
      type: "string",
      description: "Name and optional title of the person who gave the testimonial.",
    }),
  ],
  preview: {
    select: {
      title: "pageHeading",
    },
  },
})
