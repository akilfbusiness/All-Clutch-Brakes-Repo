import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { urlFor } from "@/sanity/image"

interface PageHeroProps {
  title: string
  heading?: string
  subheading?: string
  heroImage?: any
  breadcrumb?: { label: string; href: string }[]
  category?: string
}

export function PageHero({
  title,
  heading,
  subheading,
  heroImage,
  breadcrumb,
  category,
}: PageHeroProps) {
  const displayHeading = heading || title

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden border-b border-border">
      {/* Hero Image Background */}
      {heroImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={urlFor(heroImage).width(1920).quality(85).url()}
              alt={title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 z-[1]" />
        </>
      )}

      {/* Watermark Text */}
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
            <ol className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-muted-foreground/50">
              {breadcrumb.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx < breadcrumb.length - 1 ? (
                    <>
                      <Link
                        href={item.href}
                        className={`hover:text-accent transition-colors ${
                          heroImage ? "text-white/70 hover:text-accent" : ""
                        }`}
                      >
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
          {/* Category */}
          {category && (
            <p
              className={`text-[10px] font-bold tracking-[0.45em] uppercase mb-5 ${
                heroImage ? "text-accent" : "text-accent"
              }`}
            >
              {category}
            </p>
          )}

          {/* Heading */}
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] mb-8 ${
              heroImage ? "text-white" : "text-foreground"
            }`}
          >
            {displayHeading}
          </h1>

          {/* Subheading */}
          {subheading && (
            <p
              className={`text-base md:text-lg leading-relaxed max-w-2xl ${
                heroImage ? "text-white/70" : "text-muted-foreground"
              }`}
            >
              {subheading}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
