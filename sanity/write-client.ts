// Sanity WRITE client — server-only. Never import this from a Client Component.
//
// Used exclusively by the custom /cms admin panel's Server Actions to
// create, update, delete, and upload assets in Sanity. The write token
// (SANITY_API_WRITE_TOKEN) never leaves the server.

import { createClient } from "@sanity/client"
import { sanityConfig } from "./config"

export const sanityWriteClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
