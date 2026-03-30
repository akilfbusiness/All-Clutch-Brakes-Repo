// Sanity Studio configuration
// This powers the embedded Studio at /studio in the Next.js app

import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas/index"
import { sanityConfig } from "./config"

export default defineConfig({
  ...sanityConfig,
  name: "project-noda-cms",
  title: "Project Noda — CMS",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Site Settings — pinned at top for easy access
            S.listItem()
              .title("Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            // Main content types
            S.documentTypeListItem("article").title("Articles"),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("location").title("Locations"),
            S.divider(),
            // Supporting types
            S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    // Vision — allows testing GROQ queries directly in the Studio
    // Remove in production if not needed
    visionTool(),
  ],
})
