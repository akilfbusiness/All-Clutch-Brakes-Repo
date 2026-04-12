/**
 * PageHeroMedia
 *
 * Drop-in background media for any page hero section.
 * Renders a looping muted video when `videoUrl` is provided,
 * falling back to a static image when only `imageUrl` is given.
 * When neither is provided, renders nothing (plain background).
 *
 * Usage:
 *   <section className="relative ...">
 *     <PageHeroMedia imageUrl={heroImage} videoUrl={heroVideo} alt="..." />
 *     <div className="absolute inset-0 bg-black/55 z-[1]" />   ← overlay
 *     <div className="container relative z-10"> ... </div>
 *   </section>
 */

interface PageHeroMediaProps {
  imageUrl?: string | null
  videoUrl?: string | null
  alt?: string
}

export function PageHeroMedia({ imageUrl, videoUrl, alt = "" }: PageHeroMediaProps) {
  if (!imageUrl && !videoUrl) return null

  return (
    <>
      {/* Background media — absolute, behind everything */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {videoUrl ? (
          <video
            key={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={alt}
            className="w-full h-full object-cover object-center"
            aria-hidden={!alt}
          />
        ) : null}
      </div>

      {/* Dark overlay — ensures text readability over any media */}
      <div className="absolute inset-0 bg-black/55 z-[1]" aria-hidden="true" />
    </>
  )
}
