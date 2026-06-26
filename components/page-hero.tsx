import Link from "next/link"
import { ChevronRight, Phone, ArrowRight } from "lucide-react"

interface PageHeroProps {
  title: string
  heading?: string
  subheading?: string
  eyebrow?: string
  heroImage?: string | null
  heroVideo?: string | null
  primaryCta?: { label?: string; href?: string }
  secondaryCta?: { label?: string; href?: string }
  breadcrumb?: { label: string; href: string }[]
  category?: string
}

export function PageHero({
  title,
  heading,
  subheading,
  eyebrow,
  heroImage,
  heroVideo,
  primaryCta,
  secondaryCta,
  breadcrumb,
  category,
}: PageHeroProps) {
  const displayHeading = heading || title
  const hasMedia = !!(heroImage || heroVideo)

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-border bg-background">
      {/* Background media */}
      {hasMedia && (
        <>
          <div className="absolute inset-0 z-0 overflow-hidden">
            {heroVideo ? (
              <video
                key={heroVideo}
                autoPlay muted loop playsInline aria-hidden="true"
                className="w-full h-full object-cover object-[center_35%] md:object-center"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
            ) : heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover object-center"
                aria-hidden="true"
              />
            ) : null}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 md:from-black/85 md:via-black/45 md:to-black/15 z-[1]" aria-hidden="true" />
        </>
      )}

      {/* Watermark */}
      <span
        aria-hidden
        className="absolute bottom-0 right-0 text-[80px] md:text-[160px] font-bold leading-none text-foreground/[0.06] select-none pointer-events-none whitespace-nowrap z-[1]"
      >
        {title.split(" ")[0]}
      </span>

      {/* Content */}
      <div className="container relative z-10">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className={`flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase ${hasMedia ? "text-white/60" : "text-muted-foreground/50"}`}>
              {breadcrumb.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx < breadcrumb.length - 1 ? (
                    <>
                      <Link href={item.href} className="hover:text-accent transition-colors">
                        {item.label}
                      </Link>
                      <ChevronRight className="h-3 w-3" aria-hidden />
                    </>
                  ) : (
                    <span className="text-accent">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="max-w-4xl">
          {/* Eyebrow / Category */}
          {(eyebrow || category) && (
            <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-5">
              {eyebrow || category}
            </p>
          )}

          {/* Heading */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-8 text-balance ${hasMedia ? "text-white" : "text-foreground"}`}>
            {displayHeading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p className={`text-base md:text-lg leading-relaxed max-w-2xl mb-10 ${hasMedia ? "text-white/75" : "text-muted-foreground"}`}>
              {subheading}
            </p>
          )}

          {/* CTAs */}
          {(primaryCta?.label || secondaryCta?.label) && (
            <div className="flex flex-wrap items-center gap-4">
              {primaryCta?.label && primaryCta.href && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {primaryCta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {secondaryCta?.label && secondaryCta.href && (
                <Link
                  href={secondaryCta.href}
                  className={`inline-flex items-center gap-2 font-bold text-sm px-8 py-4 border-2 transition-all duration-300 hover:-translate-y-0.5 ${hasMedia ? "border-white/40 text-white hover:bg-white hover:text-foreground" : "border-border text-foreground hover:bg-foreground hover:text-background"}`}
                >
                  {secondaryCta.label} <Phone className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
