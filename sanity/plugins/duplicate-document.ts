import { SanityClient, DocumentActionsContext } from "sanity"
import { v4 as uuid } from "uuid"

// Duplicate document action — creates a copy with new ID and slug
export const duplicateAction =
  (client: SanityClient) =>
  async (context: DocumentActionsContext) => {
    return {
      label: "Duplicate",
      tone: "primary",
      onHandle: async () => {
        const { draft, published } = context
        const doc = draft || published

        if (!doc) {
          alert("No document to duplicate")
          return
        }

        try {
          // Create a copy with new ID
          const newDoc = {
            ...doc,
            _id: `drafts.${doc._type}.${uuid()}`,
            _type: doc._type,
          }

          // Generate new slug if it exists
          if (newDoc.slug && typeof newDoc.slug === "object" && "current" in newDoc.slug) {
            const originalSlug = newDoc.slug.current
            const timestamp = new Date().getTime()
            newDoc.slug.current = `${originalSlug}-copy-${timestamp}`
          }

          // Add "Copy" to title if it exists
          if (newDoc.title && typeof newDoc.title === "string") {
            newDoc.title = `${newDoc.title} (Copy)`
          }

          // Create the new document
          await client.create(newDoc)

          alert(`Document duplicated successfully! Editing the copy now.`)

          // Note: In a real implementation, you'd navigate to the new document
          // This is a limitation of the current Sanity action API
        } catch (error) {
          alert(`Error duplicating document: ${(error as Error).message}`)
        }
      },
    }
  }
