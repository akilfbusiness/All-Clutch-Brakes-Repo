/**
 * PageHeroMedia
 *
 * Drop-in background media for any page hero section.
 * Renders a looping muted video when `videoUrl` is provided,
 * falling back to a static image when only `imageUrl` is given.
 * When neither is provided, renders nothing (plain background).
 *
 * Uses Next.js <Image fill> for static images so Next.js automatically
 * serves a correctly-sized version per device (mobile gets ~750px, not 1920px),
 * which is the primary LCP fix for mobile PageSpeed.
 *
 * Usage:
 *   <section className="relative ...">
 *     <PageHeroMedia imageUrl={heroImage} videoUrl={heroVideo} alt="..." />
 *     <div className="absolute inset-0 bg-black/55 z-[1]" />   ← overlay
 *     <div className="container relative z-10"> ... </div>
 *   </section>
 */

import Image from "next/image"

interface PageHeroMediaProps {
  imageUrl?: string | null
  videoUrl?: string | null
  alt?: string
  /** Pass priority={true} for above-the-fold heroes (LCP element). Defaults true. */
  priority?: boolean
}

export function PageHeroMedia({ imageUrl, videoUrl, alt = "", priority = true }: PageHeroMediaProps) {
  if (!imageUrl && !videoUrl) return null

  return (
    <>
      {/* Background media — absolute, behind everything */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoUrl ? (
          /* preload="none" prevents the browser from downloading the video during
             initial page load. The poster (heroImage) is shown instantly instead,
             fixing the LCP issue. Video starts buffering once the page is idle. */
          <video
            key={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={imageUrl ?? undefined}
            aria-hidden="true"
            className="w-full h-full object-cover object-[center_35%] md:object-center"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          /* Next.js <Image fill> — automatically generates srcset and serves
             the correct size per device. On mobile (375-430px wide) the browser
             requests a ~750px image instead of the full 1920px original, cutting
             the image payload by ~80% and directly improving LCP on mobile. */
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority={priority}
            sizes="100vw"
            quality={80}
            className="object-cover object-center"
          />
        ) : null}
      </div>

      {/* Dark overlay — ensures text readability over any media */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 z-[1]" aria-hidden="true" />
    </>
  )
}
