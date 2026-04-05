import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { colorInput } from "@sanity/color-input"
import { media } from "sanity-plugin-media"
import { schemaTypes } from "./schemas/index"
import { sanityConfig } from "./config"
import { CustomDashboard } from "./plugins/custom-dashboard"

// Import action plugins
import { jsonExportAction, jsonImportAction } from "./plugins/json-import-export"
import { livePreviewAction } from "./plugins/live-preview"
import { duplicateAction } from "./plugins/duplicate-document"

// Custom desk structure with enhanced organisation
const deskStructure = (S: any) =>
  S.list()
    .title("Content Management")
    .items([
      // === Dashboard (Home) ===
      S.listItem()
        .title("Dashboard")
        .id("dashboard")
        .icon(() => "🏠")
        .child(S.component(CustomDashboard).id("dashboard").title("Dashboard")),
      S.divider(),

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
              // Blog
              S.listItem()
                .title("Blog Posts")
                .schemaType("post")
                .child(
                  S.documentTypeList("post")
                    .title("Blog Posts")
                    .filter('_type == "post"')
                ),
              S.divider(),
              // Combined view of ALL pages
              S.listItem()
                .title("View All (Combined)")
                .icon(() => "📚")
                .child(
                  S.documentList()
                    .title("All Pages (Combined)")
                    .filter('_type in ["page", "service", "location", "post"]')
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
        .title("Blog")
        .icon(() => "📰")
        .schemaType("post")
        .child(S.documentTypeList("post").title("Blog")),
      S.divider(),

      // === About Section (nested pages) ===
      S.listItem()
        .title("About")
        .icon(() => "ℹ️")
        .child(
          S.list()
            .title("About")
            .items([
              S.listItem()
                .title("What We Do")
                .icon(() => "📋")
                .child(
                  S.document()
                    .schemaType("whatWeDo")
                    .documentId("whatWeDo")
                    .title("What We Do Page")
                ),
              S.listItem()
                .title("Projects")
                .icon(() => "🚗")
                .schemaType("project")
                .child(S.documentTypeList("project").title("Projects")),
              S.listItem()
                .title("Meet Our Staff")
                .icon(() => "👥")
                .schemaType("staff")
                .child(S.documentTypeList("staff").title("Meet Our Staff")),
            ])
        ),
      S.divider(),

      // === Products Section ===
      S.listItem()
        .title("Products")
        .icon(() => "🛠️")
        .child(
          S.list()
            .title("Products")
            .items([
              S.listItem()
                .title("Featured Items & News")
                .icon(() => "⭐")
                .schemaType("featuredItem")
                .child(S.documentTypeList("featuredItem").title("Featured Items & News")),
              S.listItem()
                .title("Brands")
                .icon(() => "🏷️")
                .schemaType("brand")
                .child(S.documentTypeList("brand").title("Brands")),
              S.listItem()
                .title("Product Pages")
                .icon(() => "📦")
                .schemaType("productPage")
                .child(S.documentTypeList("productPage").title("Product Pages")),
            ])
        ),
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

  // Document actions — custom actions for content types
  document: {
    actions: (prev, context) => {
      // Add custom actions only for content document types
      if (["post", "service", "location", "page"].includes(context.schemaType)) {
        return [
          ...prev,
          jsonExportAction,
          jsonImportAction,
          livePreviewAction,
          duplicateAction,
        ]
      }
      return prev
    },
  },
})
