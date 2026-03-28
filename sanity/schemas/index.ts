// Schema index — exports all schemas to the Sanity Studio
// Add new schemas here as the content model grows

import { articleSchema } from "./schemas/article"
import { authorSchema } from "./schemas/author"
import { locationSchema } from "./schemas/location"
import { serviceSchema } from "./schemas/service"
import { siteSettingsSchema } from "./schemas/siteSettings"

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
