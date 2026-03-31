// Sanity Studio configuration
// Enhanced desk structure with All Pages view, Navigation editing, and organised content

import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { colorInput } from "@sanity/color-input"
import { media } from "sanity-plugin-media"
import { schemaTypes } from "./schemas/index"
import { sanityConfig } from "./config"

// Custom desk structure with enhanced organisation
const deskStructure = (S: any) =>
  S.list()
    .title("Content Management")
    .items([
      // === Quick Access Section ===
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(() => "⚙️")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site Settings")
        ),
      S.listItem()
        .title("Navigation")
        .id("navigation")
        .icon(() => "🧭")
        .child(
          S.document()
            .schemaType("navigation")
            .documentId("mainNavigation")
            .title("Site Navigation")
        ),
      S.divider(),

      // === All Pages View ===
      S.listItem()
        .title("All Pages")
        .id("allPages")
        .icon(() => "📄")
        .child(
          S.list()
            .title("All Pages")
            .items([
              // Generic Pages
              S.listItem()
                .title("Generic Pages")
                .schemaType("page")
                .child(
                  S.documentTypeList("page")
                    .title("Generic Pages")
                    .filter('_type == "page"')
                ),
              // Services
              S.listItem()
                .title("Service Pages")
                .schemaType("service")
                .child(
                  S.documentTypeList("service")
                    .title("Service Pages")
                    .filter('_type == "service"')
                ),
              // Locations
              S.listItem()
                .title("Location Pages")
                .schemaType("location")
                .child(
                  S.documentTypeList("location")
                    .title("Location Pages")
                    .filter('_type == "location"')
                ),
              // Articles
              S.listItem()
                .title("Article Pages")
                .schemaType("article")
                .child(
                  S.documentTypeList("article")
                    .title("Article Pages")
                    .filter('_type == "article"')
                ),
              S.divider(),
              // Combined view of ALL pages
              S.listItem()
                .title("View All (Combined)")
                .icon(() => "📚")
                .child(
                  S.documentList()
                    .title("All Pages (Combined)")
                    .filter('_type in ["page", "service", "location", "article"]')
                    .defaultOrdering([{ field: "_updatedAt", direction: "desc" }])
                ),
            ])
        ),
      S.divider(),

      // === Content Types Section ===
      S.listItem()
        .title("Pages")
        .icon(() => "📝")
        .schemaType("page")
        .child(S.documentTypeList("page").title("Pages")),
      S.listItem()
        .title("Services")
        .icon(() => "🔧")
        .schemaType("service")
        .child(S.documentTypeList("service").title("Services")),
      S.listItem()
        .title("Locations")
        .icon(() => "📍")
        .schemaType("location")
        .child(S.documentTypeList("location").title("Locations")),
      S.listItem()
        .title("Articles")
        .icon(() => "📰")
        .schemaType("article")
        .child(S.documentTypeList("article").title("Articles")),
      S.divider(),

      // === Supporting Content ===
      S.listItem()
        .title("Authors")
        .icon(() => "👤")
        .schemaType("author")
        .child(S.documentTypeList("author").title("Authors")),
    ])

export default defineConfig({
  ...sanityConfig,
  name: "project-noda-cms",
  title: "Project Noda — CMS",
  basePath: "/studio",

  schema: {
    types: schemaTypes,
  },

  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    // Vision — allows testing GROQ queries directly in the Studio
    visionTool(),
    // Color picker for brand colors
    colorInput(),
    // Enhanced media library browser
    media(),
  ],
})
