import { DocumentActionComponent, useClient } from "sanity"
import { v4 as uuid } from "uuid"

// Duplicate document action — creates a copy with new ID and slug
export const duplicateAction: DocumentActionComponent = (props) => {
  const { draft, published, type } = props
  const doc = draft || published
  const client = useClient({ apiVersion: "2024-01-01" })

  return {
    label: "Duplicate",
    icon: () => "📋",
    tone: "positive",
    onHandle: async () => {
      if (!doc) {
        alert("No document to duplicate")
        return
      }

      try {
        // Create a copy with new ID, removing system fields
        const { _id, _rev, _createdAt, _updatedAt, ...docWithoutMeta } = doc
        
        const newDoc = {
          ...docWithoutMeta,
          _id: `drafts.${uuid()}`,
          _type: type,
        }

        // Generate new slug if it exists
        if ((newDoc as any).slug && typeof (newDoc as any).slug === "object") {
          const originalSlug = (newDoc as any).slug.current
          const timestamp = new Date().getTime()
          ;(newDoc as any).slug = { 
            _type: "slug",
            current: `${originalSlug}-copy-${timestamp}` 
          }
        }

        // Add "Copy" to title if it exists
        if ((newDoc as any).title && typeof (newDoc as any).title === "string") {
          ;(newDoc as any).title = `${(newDoc as any).title} (Copy)`
        }

        // Create the new document
        await client.create(newDoc)

        alert(`Document duplicated successfully! Find it in the list with "(Copy)" in the title.`)
      } catch (error) {
        alert(`Error duplicating document: ${(error as Error).message}`)
      }
    },
  }
}
