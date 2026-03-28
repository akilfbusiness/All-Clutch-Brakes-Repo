// Sanity image URL builder
// Used across all components that render images from Sanity
// Wraps @sanity/image-url with the project config so you only import
// one function: urlFor(source).width(800).url()

import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { sanityConfig } from "./config"

const builder = imageUrlBuilder(sanityConfig)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
