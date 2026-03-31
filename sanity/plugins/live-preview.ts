import { SanityClient, DocumentActionsContext } from "sanity"

// Live preview action — opens draft in a preview window
export const livePreviewAction =
  (client: SanityClient) =>
  async (context: DocumentActionsContext) => {
    return {
      label: "Preview",
      tone: "primary",
      onHandle: async () => {
        const { draft, published } = context
        const doc = draft || published

        if (!doc) {
          alert("No document to preview")
          return
        }

        // Determine the preview URL based on document type and slug
        let previewUrl = ""

        switch (doc._type) {
          case "article":
            previewUrl = `/articles/${doc.slug?.current || "preview"}`
            break
          case "service":
            previewUrl = `/services/${doc.slug?.current || "preview"}`
            break
          case "location":
            previewUrl = `/locations/${doc.slug?.current || "preview"}`
            break
          case "page":
            previewUrl = `/${doc.slug?.current || "preview"}`
            break
          default:
            previewUrl = "/"
        }

        // Open in new window with draft mode token
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        const fullUrl = `${baseUrl}${previewUrl}`

        window.open(fullUrl, "_blank")
      },
    }
  }
