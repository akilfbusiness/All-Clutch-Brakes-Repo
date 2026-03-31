// Schema index — exports all schemas to the Sanity Studio
// Add new schemas here as the content model grows

import { articleSchema } from "./article"
import { authorSchema } from "./author"
import { locationSchema } from "./location"
import { navigationSchema } from "./navigation"
import { pageSchema } from "./page"
import { serviceSchema } from "./service"
import { siteSettingsSchema } from "./siteSettings"

export const schemaTypes = [
  // Content types
  articleSchema,
  pageSchema,
  serviceSchema,
  locationSchema,
  // Supporting types
  authorSchema,
  // Global settings (singletons)
  siteSettingsSchema,
  navigationSchema,
]
