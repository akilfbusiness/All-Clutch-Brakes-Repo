// Schema index — exports all schemas to the Sanity Studio
// Add new schemas here as the content model grows

import { postSchema } from "./post"
import { authorSchema } from "./author"
import { locationSchema } from "./location"
import { navigationSchema } from "./navigation"
import { pageSchema } from "./page"
import { serviceSchema } from "./service"
import { siteSettingsSchema } from "./siteSettings"
import { staffSchema } from "./staff"
import { whatWeDoSchema } from "./whatWeDo"
import { projectSchema } from "./project"
import { featuredItemSchema } from "./featuredItem"
import { brandSchema } from "./brand"
import { productPageSchema } from "./productPage"

export const schemaTypes = [
  // Content types
  postSchema,
  pageSchema,
  serviceSchema,
  locationSchema,
  staffSchema,
  projectSchema,
  featuredItemSchema,
  brandSchema,
  productPageSchema,
  // Supporting types
  authorSchema,
  // Global settings (singletons)
  siteSettingsSchema,
  navigationSchema,
  whatWeDoSchema,
]
