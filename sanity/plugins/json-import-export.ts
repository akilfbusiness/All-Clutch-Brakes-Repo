import { DocumentActionsContext, SanityClient } from "sanity"

// Export document as JSON with all fields
export const jsonExportAction =
  (client: SanityClient) =>
  async (context: DocumentActionsContext) => {
    return {
      label: "Download JSON",
      onHandle: async () => {
        const { draft, published } = context
        const doc = draft || published

        if (!doc) {
          alert("No document to export")
          return
        }

        // Remove Sanity metadata for cleaner export
        const { _id, _type, _createdAt, _updatedAt, _rev, ...cleanDoc } = doc

        const json = JSON.stringify(cleanDoc, null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${_type}-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      },
    }
  }

// Import JSON with smart merge (only overwrites populated fields)
export const jsonImportAction =
  (client: SanityClient) =>
  async (context: DocumentActionsContext) => {
    return {
      label: "Upload JSON",
      onHandle: async () => {
        const { draft, published } = context
        const currentDoc = draft || published

        if (!currentDoc) {
          alert("Cannot import to a new document. Create it first.")
          return
        }

        const input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"

        input.onchange = async (e: any) => {
          try {
            const file = e.target.files?.[0]
            if (!file) return

            const text = await file.text()
            const importedData = JSON.parse(text)

            // Smart merge: only overwrite fields that have values in the imported JSON
            const merged = { ...currentDoc }

            Object.keys(importedData).forEach((key) => {
              if (importedData[key] !== null && importedData[key] !== undefined && importedData[key] !== "") {
                merged[key] = importedData[key]
              }
            })

            // Update the document
            await client.patch(currentDoc._id).set(merged).commit()

            alert("JSON imported successfully! Fields with values were updated.")
          } catch (error) {
            alert(`Error importing JSON: ${(error as Error).message}`)
          }
        }

        input.click()
      },
    }
  }

// Helper to create document actions
export function createJsonActions(client: SanityClient) {
  return [jsonExportAction(client), jsonImportAction(client)]
}
