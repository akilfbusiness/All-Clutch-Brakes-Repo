// Navigation schema — fully editable site navigation with nested items
// Supports: page links, external links, header-only groups, nested children

import { defineType, defineField, defineArrayMember } from "sanity"

// Navigation Item — recursive type for nested menus
const navigationItem = defineArrayMember({
  name: "navigationItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "The text displayed in the navigation menu.",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "linkType",
      title: "Link Type",
      type: "string",
      description: "What happens when this item is clicked.",
      options: {
        list: [
          { title: "Page Link", value: "page" },
          { title: "External URL", value: "external" },
          { title: "Header Only (no link)", value: "header" },
        ],
        layout: "radio",
      },
      initialValue: "page",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageReference",
      title: "Page",
      type: "reference",
      description: "Select a page from your site.",
      to: [
        { type: "page" },
        { type: "service" },
        { type: "location" },
        { type: "article" },
      ],
      hidden: ({ parent }) => parent?.linkType !== "page",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      description: "Full URL including https://",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "mailto", "tel"],
        }),
      hidden: ({ parent }) => parent?.linkType !== "external",
    }),
    defineField({
      name: "customSlug",
      title: "Custom URL Path",
      type: "string",
      description: "Override the page URL with a custom path (e.g., '/services' for a header that links to the services listing page). Include the leading slash.",
      hidden: ({ parent }) => parent?.linkType !== "page",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in New Tab",
      type: "boolean",
      description: "Open external links in a new browser tab.",
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType === "header",
    }),
    defineField({
      name: "children",
      title: "Nested Items",
      type: "array",
      description: "Add child items that appear as a dropdown/submenu.",
      of: [
        {
          type: "object",
          name: "childItem",
          title: "Child Item",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required().max(50),
            }),
            defineField({
              name: "linkType",
              title: "Link Type",
              type: "string",
              options: {
                list: [
                  { title: "Page Link", value: "page" },
                  { title: "External URL", value: "external" },
                ],
                layout: "radio",
              },
              initialValue: "page",
            }),
            defineField({
              name: "pageReference",
              title: "Page",
              type: "reference",
              to: [
                { type: "page" },
                { type: "service" },
                { type: "location" },
                { type: "article" },
              ],
              hidden: ({ parent }) => parent?.linkType !== "page",
            }),
            defineField({
              name: "externalUrl",
              title: "External URL",
              type: "url",
              hidden: ({ parent }) => parent?.linkType !== "external",
            }),
            defineField({
              name: "customSlug",
              title: "Custom URL Path",
              type: "string",
              description: "Override with a custom path.",
              hidden: ({ parent }) => parent?.linkType !== "page",
            }),
            defineField({
              name: "openInNewTab",
              title: "Open in New Tab",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: "label",
              linkType: "linkType",
            },
            prepare({ title, linkType }) {
              const icon = linkType === "external" ? "↗" : "→"
              return {
                title: title || "Untitled",
                subtitle: `${icon} ${linkType}`,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: "highlight",
      title: "Highlight Style",
      type: "string",
      description: "Optional: make this item stand out (e.g., as a CTA button).",
      options: {
        list: [
          { title: "Normal", value: "normal" },
          { title: "Button (Primary)", value: "button-primary" },
          { title: "Button (Secondary)", value: "button-secondary" },
        ],
        layout: "radio",
      },
      initialValue: "normal",
    }),
  ],
  preview: {
    select: {
      title: "label",
      linkType: "linkType",
      childCount: "children",
    },
    prepare({ title, linkType, childCount }) {
      const hasChildren = childCount && childCount.length > 0
      const icon = linkType === "header" ? "▼" : linkType === "external" ? "↗" : "→"
      const childLabel = hasChildren ? ` (${childCount.length} items)` : ""
      return {
        title: title || "Untitled",
        subtitle: `${icon} ${linkType}${childLabel}`,
      }
    },
  },
})

// Main Navigation document — singleton for header navigation
export const navigationSchema = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  groups: [
    { name: "header", title: "Header Navigation", default: true },
    { name: "footer", title: "Footer Navigation" },
    { name: "mobile", title: "Mobile Overrides" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Configuration Name",
      type: "string",
      description: "Internal name for this navigation configuration.",
      initialValue: "Main Navigation",
      validation: (Rule) => Rule.required(),
    }),

    // === Header Navigation ===
    defineField({
      name: "headerItems",
      title: "Header Menu Items",
      type: "array",
      of: [navigationItem],
      description: "Items that appear in the main header navigation. Drag to reorder.",
      group: "header",
    }),
    defineField({
      name: "headerCtaLabel",
      title: "Header CTA Button Label",
      type: "string",
      description: "Text for the call-to-action button in the header (e.g., 'Get a Quote').",
      group: "header",
    }),
    defineField({
      name: "headerCtaLink",
      title: "Header CTA Button Link",
      type: "string",
      description: "URL or path for the CTA button (e.g., '/contact' or 'tel:0882778122').",
      group: "header",
    }),
    defineField({
      name: "showPhoneInHeader",
      title: "Show Phone Number in Header",
      type: "boolean",
      description: "Display the business phone number in the header.",
      initialValue: true,
      group: "header",
    }),

    // === Footer Navigation ===
    defineField({
      name: "footerSections",
      title: "Footer Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "footerSection",
          title: "Footer Section",
          fields: [
            defineField({
              name: "heading",
              title: "Section Heading",
              type: "string",
              description: "Title of this footer column (e.g., 'Services', 'Quick Links').",
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  name: "footerLink",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "linkType",
                      title: "Link Type",
                      type: "string",
                      options: {
                        list: [
                          { title: "Page Link", value: "page" },
                          { title: "External URL", value: "external" },
                        ],
                      },
                      initialValue: "page",
                    }),
                    defineField({
                      name: "pageReference",
                      title: "Page",
                      type: "reference",
                      to: [
                        { type: "page" },
                        { type: "service" },
                        { type: "location" },
                        { type: "article" },
                      ],
                      hidden: ({ parent }) => parent?.linkType !== "page",
                    }),
                    defineField({
                      name: "externalUrl",
                      title: "External URL",
                      type: "url",
                      hidden: ({ parent }) => parent?.linkType !== "external",
                    }),
                    defineField({
                      name: "customSlug",
                      title: "Custom URL Path",
                      type: "string",
                      hidden: ({ parent }) => parent?.linkType !== "page",
                    }),
                  ],
                  preview: {
                    select: { title: "label" },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "heading",
              links: "links",
            },
            prepare({ title, links }) {
              const count = links ? links.length : 0
              return {
                title: title || "Untitled Section",
                subtitle: `${count} link${count === 1 ? "" : "s"}`,
              }
            },
          },
        },
      ],
      description: "Footer columns with grouped links. Drag sections to reorder.",
      group: "footer",
    }),
    defineField({
      name: "footerBottomText",
      title: "Footer Bottom Text",
      type: "string",
      description: "Copyright or legal text at the very bottom (e.g., '© 2024 All Clutch & Brake Service').",
      group: "footer",
    }),
    defineField({
      name: "footerTrademark",
      title: "Trademark / Legal Notice",
      type: "text",
      rows: 2,
      description: "Additional legal text or disclaimers.",
      group: "footer",
    }),

    // === Mobile Overrides ===
    defineField({
      name: "useSeparateMobileNav",
      title: "Use Separate Mobile Navigation",
      type: "boolean",
      description: "Enable to define different navigation items for mobile devices.",
      initialValue: false,
      group: "mobile",
    }),
    defineField({
      name: "mobileItems",
      title: "Mobile Menu Items",
      type: "array",
      of: [navigationItem],
      description: "Items for mobile navigation. Only used if 'Use Separate Mobile Navigation' is enabled.",
      hidden: ({ document }) => !document?.useSeparateMobileNav,
      group: "mobile",
    }),
  ],
  preview: {
    select: {
      title: "title",
      headerCount: "headerItems",
    },
    prepare({ title, headerCount }) {
      const count = headerCount ? headerCount.length : 0
      return {
        title: title || "Navigation",
        subtitle: `${count} header item${count === 1 ? "" : "s"}`,
      }
    },
  },
})
