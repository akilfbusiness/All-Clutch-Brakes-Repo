// Schema index — exports all schemas to the Sanity Studio
// Add new schemas here as the content model grows

import { articleSchema } from "./article"
import { authorSchema } from "./author"
import { locationSchema } from "./location"
import { serviceSchema } from "./service"
import { siteSettingsSchema } from "./siteSettings"

export const schemaTypes = [
  // Content types
  articleSchema,
  serviceSchema,
  locationSchema,
  // Supporting types
  authorSchema,
  // Global settings (singleton)
  siteSettingsSchema,
]
