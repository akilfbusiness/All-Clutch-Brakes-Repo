import { DocumentActionComponent } from "sanity"

// Export document as JSON with all fields
export const jsonExportAction: DocumentActionComponent = (props) => {
  const { draft, published } = props

  return {
    label: "Download JSON",
    icon: () => "📥",
    onHandle: () => {
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
export const jsonImportAction: DocumentActionComponent = (props) => {
  const { draft, published, id, type } = props
  const currentDoc = draft || published

  return {
    label: "Upload JSON",
    icon: () => "📤",
    onHandle: () => {
      if (!currentDoc) {
        alert("Cannot import to a new document. Save it first.")
        return
      }

      const input = document.createElement("input")
      input.type = "file"
      input.accept = ".json"

      input.onchange = async (e: Event) => {
        try {
          const target = e.target as HTMLInputElement
          const file = target.files?.[0]
          if (!file) return

          const text = await file.text()
          const importedData = JSON.parse(text)

          // Smart merge: only overwrite fields that have values in the imported JSON
          const merged: Record<string, unknown> = {}

          Object.keys(importedData).forEach((key) => {
            const value = importedData[key]
            if (value !== null && value !== undefined && value !== "") {
              merged[key] = value
            }
          })

          // Use the Sanity client from the window context
          const sanityClient = (window as any).__sanity_client__
          if (sanityClient) {
            await sanityClient.patch(id).set(merged).commit()
            alert("JSON imported successfully! Fields with values were updated. Refresh to see changes.")
          } else {
            alert("Could not access Sanity client. Please refresh and try again.")
          }
        } catch (error) {
          alert(`Error importing JSON: ${(error as Error).message}`)
        }
      }

      input.click()
    },
  }
}
