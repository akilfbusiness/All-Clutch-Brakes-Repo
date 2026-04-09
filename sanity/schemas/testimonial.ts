// Testimonial schema — customer reviews and feedback
// These appear on the homepage, service pages, and dedicated testimonials page

import { defineField, defineType } from "sanity"

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      description: "Full name or first name + last initial (e.g. 'John Smith' or 'Sarah T.')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suburb",
      title: "Suburb",
      type: "string",
      description: "Customer's suburb for local trust signals (e.g. 'Modbury', 'Golden Grove')",
    }),
    defineField({
      name: "vehicleType",
      title: "Vehicle Type",
      type: "string",
      description: "e.g. 'Toyota Hilux', '2015 Holden Commodore', 'Ford Ranger'",
    }),
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      description: "Rating out of 5 stars",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial Text",
      type: "text",
      rows: 4,
      description: "The customer's review or feedback. Keep it authentic and specific.",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "serviceProvided",
      title: "Service Provided",
      type: "reference",
      to: [{ type: "service" }],
      description: "Link to the service this testimonial is about. Optional.",
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      description: "Show this testimonial in the homepage carousel",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Review Date",
      type: "date",
      description: "When this review was submitted or received",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "Review Source",
      type: "string",
      description: "Where this review came from (e.g. 'Google Reviews', 'Facebook', 'Email')",
      options: {
        list: [
          { title: "Google Reviews", value: "google" },
          { title: "Facebook", value: "facebook" },
          { title: "Email", value: "email" },
          { title: "In Person", value: "in-person" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "verified",
      title: "Verified Customer",
      type: "boolean",
      description: "Mark as verified if you can confirm this is a real customer",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "customerName",
      subtitle: "testimonial",
      rating: "rating",
      featured: "featured",
    },
    prepare({ title, subtitle, rating, featured }) {
      return {
        title: `${title} ${featured ? "⭐ (Featured)" : ""}`,
        subtitle: `${"★".repeat(rating)} - ${subtitle?.substring(0, 60)}...`,
      }
    },
  },
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Rating (Highest First)",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
  ],
})
