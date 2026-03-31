import { DocumentActionComponent } from "sanity"

// Live preview action — opens draft in a preview window
export const livePreviewAction: DocumentActionComponent = (props) => {
  const { draft, published, type } = props
  const doc = draft || published

  return {
    label: "Preview",
    icon: () => "👁",
    tone: "primary",
    onHandle: () => {
      if (!doc) {
        alert("No document to preview")
        return
      }

      // Determine the preview URL based on document type and slug
      let previewUrl = ""
      const slug = (doc as any).slug?.current || "preview"

      switch (type) {
        case "article":
          previewUrl = `/articles/${slug}`
          break
        case "service":
          previewUrl = `/services/${slug}`
          break
        case "location":
          previewUrl = `/locations/${slug}`
          break
        case "page":
          previewUrl = `/${slug}`
          break
        default:
          previewUrl = "/"
      }

      // Open in new window
      const baseUrl = typeof window !== "undefined" 
        ? window.location.origin.replace("/studio", "") 
        : "http://localhost:3000"
      const fullUrl = `${baseUrl}${previewUrl}`

      window.open(fullUrl, "_blank")
    },
  }
}
