"use client"

/**
 * PageSections
 *
 * Renders the `sections` array from the flexible page schema.
 * Each section type has a dedicated sub-component below.
 * Dynamic data sections (testimonials, services, team, promotions)
 * receive pre-fetched data from the RSC page component via props.
 */

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { PortableText } from "@portabletext/react"
import { Plus, Star, ArrowRight, Phone, Tag, Wrench, Users } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface CtaItem {
  label?: string
  href?: string
  style?: "primary" | "secondary"
}

export interface PageSectionsProps {
  sections: any[]
  businessName?: string
  phone?: string
  // Pre-fetched data for dynamic sections
  testimonials?: any[]
  services?: any[]
  staff?: any[]
  promotions?: any[]
}

// ─── CTA Button helper ─────────────────────────────────────────────────────────

function CtaButton({ cta, dark = false }: { cta: CtaItem; dark?: boolean }) {
  if (!cta?.label || !cta?.href) return null
  const isPrimary = cta.style !== "secondary"
  return (
    <Link
      href={cta.href}
      className={`inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 transition-all duration-300 hover:-translate-y-0.5 ${
        isPrimary
          ? "bg-accent hover:bg-accent/90 text-accent-foreground"
          : dark
          ? "border-2 border-white/40 text-white hover:bg-white hover:text-foreground"
          : "border-2 border-border text-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {cta.label} <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

// ─── Eyebrow helper ────────────────────────────────────────────────────────────

function Eyebrow({ text }: { text?: string }) {
  if (!text) return null
  return <p className="text-accent text-[10px] font-bold tracking-[0.45em] uppercase mb-4">{text}</p>
}

// ─── RICH TEXT ────────────────────────────────────────────────────────────────

function RichTextSection({ section }: { section: any }) {
  const widthMap: Record<string, string> = {
    narrow: "max-w-2xl",
    normal: "max-w-4xl",
    wide:   "max-w-6xl",
    full:   "max-w-none",
  }
  const width = widthMap[section.maxWidth ?? "normal"]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <article className={`prose prose-lg ${width} mx-auto text-foreground`}>
          <PortableText value={section.content} />
        </article>
      </div>
    </section>
  )
}

// ─── IMAGE + TEXT ─────────────────────────────────────────────────────────────

function ImageTextSection({ section }: { section: any }) {
  const imageRight = section.imagePosition !== "left"
  const hasImage = !!(section.imageUrl)

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center ${imageRight ? "" : "md:[&>*:first-child]:order-2"}`}>
          {/* Text */}
          <div>
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-foreground mb-6 text-balance">
                {section.heading}
              </h2>
            )}
            {section.body && (
              <p className="text-muted-foreground leading-relaxed text-base md:text-lg mb-8">
                {section.body}
              </p>
            )}
            {section.cta && <CtaButton cta={section.cta} />}
          </div>

          {/* Image */}
          {hasImage && (
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={section.imageUrl}
                alt={section.imageAlt ?? section.heading ?? ""}
                fill
                className="object-cover object-center"
                crossOrigin="anonymous"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── FULL-WIDTH BANNER ────────────────────────────────────────────────────────

function FullWidthBannerSection({ section }: { section: any }) {
  const overlayMap: Record<string, string> = {
    light:  "bg-black/30",
    medium: "bg-black/55",
    dark:   "bg-black/75",
  }
  const overlay = overlayMap[section.overlayOpacity ?? "medium"]
  const hasMedia = !!(section.backgroundImageUrl || section.backgroundVideoUrl)

  return (
    <section className={`relative py-24 md:py-36 overflow-hidden ${hasMedia ? "" : "bg-zinc-900"}`}>
      {/* Background media */}
      {hasMedia && (
        <>
          <div className="absolute inset-0 z-0 overflow-hidden">
            {section.backgroundVideoUrl ? (
              <video
                autoPlay muted loop playsInline aria-hidden="true"
                className="w-full h-full object-cover object-center"
              >
                <source src={section.backgroundVideoUrl} type="video/mp4" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={section.backgroundImageUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>
          <div className={`absolute inset-0 z-[1] ${overlay}`} aria-hidden="true" />
        </>
      )}

      <div className="container relative z-10 text-center max-w-4xl mx-auto">
        <Eyebrow text={section.eyebrow} />
        {section.heading && (
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 text-balance">
            {section.heading}
          </h2>
        )}
        {section.body && (
          <p className="text-white/75 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {section.body}
          </p>
        )}
        {section.cta && <CtaButton cta={section.cta} dark />}
      </div>
    </section>
  )
}

// ─── STATS ────────────────────────────────────────────────────────────────────

function StatsSection({ section }: { section: any }) {
  const stats: any[] = section.stats ?? []

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="text-center mb-14">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
                {section.heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat: any, i: number) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              {stat.subtitle && (
                <div className="text-xs text-white/70">{stat.subtitle}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

function GallerySection({ section }: { section: any }) {
  const images: any[] = section.images ?? []
  const colMap: Record<string, string> = {
    "2": "grid-cols-1 sm:grid-cols-2",
    "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-2 md:grid-cols-4",
  }
  const cols = colMap[section.columns ?? "3"]

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="mb-12">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                {section.heading}
              </h2>
            )}
          </div>
        )}
        <div className={`grid ${cols} gap-4`}>
          {images.map((img: any, i: number) => (
            <div key={i} className="relative aspect-square overflow-hidden bg-muted group">
              <Image
                src={img.url}
                alt={img.alt ?? img.caption ?? `Gallery image ${i + 1}`}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                crossOrigin="anonymous"
              />
              {img.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

function FaqSection({ section }: { section: any }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const items: any[] = section.items ?? []

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {(section.eyebrow || section.heading) && (
            <div className="mb-12 text-center">
              <Eyebrow text={section.eyebrow} />
              {section.heading && (
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
                  {section.heading}
                </h2>
              )}
              {section.subheading && (
                <p className="text-muted-foreground leading-relaxed">{section.subheading}</p>
              )}
            </div>
          )}
          <div className="divide-y divide-border">
            {items.map((item: any, i: number) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={openIdx === i}
                >
                  <span className="font-semibold text-foreground text-sm md:text-base pr-4">
                    {item.question}
                  </span>
                  <Plus
                    className={`h-5 w-5 flex-shrink-0 text-accent transition-transform duration-300 ${openIdx === i ? "rotate-45" : ""}`}
                    aria-hidden
                  />
                </button>
                {openIdx === i && (
                  <div className="pb-5 pr-10">
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function TestimonialsSection({ section, testimonials }: { section: any; testimonials?: any[] }) {
  const items: any[] =
    section.source === "manual"
      ? (section.manualItems ?? [])
      : (testimonials ?? [])

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="mb-12 text-center">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                {section.heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((t: any, i: number) => (
            <div key={i} className="bg-background border border-border p-6 flex flex-col gap-4">
              {/* Stars */}
              {(t.rating ?? t.starRating) && (
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating ?? t.starRating ?? 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-accent text-accent" aria-hidden />
                  ))}
                </div>
              )}
              <p className="text-foreground text-sm leading-relaxed flex-1">
                &ldquo;{t.testimonialText ?? t.quote}&rdquo;
              </p>
              <div>
                <p className="font-bold text-foreground text-sm">{t.customerName ?? t.name}</p>
                {(t.suburb) && (
                  <p className="text-muted-foreground text-xs">{t.suburb}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

function ServicesSection({ section, services }: { section: any; services?: any[] }) {
  const items: any[] =
    section.source === "selected" && section.selectedServices?.length
      ? section.selectedServices
      : (services ?? [])

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="mb-12">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
                {section.heading}
              </h2>
            )}
            {section.subheading && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl">{section.subheading}</p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((svc: any, i: number) => (
            <Link
              key={i}
              href={`/services/${svc.slug ?? svc.slug?.current ?? "#"}`}
              className="group border border-border p-6 hover:border-accent transition-colors duration-300"
            >
              <Wrench className="h-6 w-6 text-accent mb-4" aria-hidden />
              <h3 className="font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                {svc.title}
              </h3>
              {svc.answerCapsule && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {svc.answerCapsule}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TEAM ────────────────────────────────────────────────────────────────────

function TeamSection({ section, staff }: { section: any; staff?: any[] }) {
  const members: any[] =
    section.source === "selected" && section.selectedStaff?.length
      ? section.selectedStaff
      : (staff ?? [])

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="mb-12">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
                {section.heading}
              </h2>
            )}
            {section.subheading && (
              <p className="text-muted-foreground leading-relaxed max-w-2xl">{section.subheading}</p>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member: any, i: number) => (
            <div key={i} className="border border-border p-6 flex gap-4 items-start">
              {member.photo && (
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-muted">
                  <Image
                    src={member.photo}
                    alt={member.name ?? "Staff member"}
                    fill
                    className="object-cover object-center"
                    crossOrigin="anonymous"
                  />
                </div>
              )}
              {!member.photo && (
                <div className="w-16 h-16 flex-shrink-0 bg-muted flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" aria-hidden />
                </div>
              )}
              <div>
                <h3 className="font-bold text-foreground">{member.name}</h3>
                {member.role && <p className="text-accent text-sm font-medium">{member.role}</p>}
                {member.bio && <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{member.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROMOTIONS ───────────────────────────────────────────────────────────────

function PromotionsSection({ section, promotions }: { section: any; promotions?: any[] }) {
  const items: any[] = promotions ?? []

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
      <div className="container">
        {(section.eyebrow || section.heading) && (
          <div className="mb-12">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                {section.heading}
              </h2>
            )}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((promo: any, i: number) => (
            <div key={i} className="bg-background border border-accent/30 p-6 flex flex-col gap-4">
              <Tag className="h-6 w-6 text-accent" aria-hidden />
              <div>
                <h3 className="font-bold text-foreground mb-1">{promo.title}</h3>
                {promo.discountValue && (
                  <p className="text-accent font-black text-2xl">{promo.discountValue}</p>
                )}
              </div>
              {promo.description && (
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{promo.description}</p>
              )}
              {promo.ctaLabel && promo.ctaLink && (
                <Link
                  href={promo.ctaLink}
                  className="inline-flex items-center gap-2 text-accent font-bold text-sm hover:underline"
                >
                  {promo.ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactFormSection({ section, businessName, phone }: { section: any; businessName?: string; phone?: string }) {
  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container max-w-2xl">
        {(section.eyebrow || section.heading) && (
          <div className="mb-10">
            <Eyebrow text={section.eyebrow} />
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4 text-balance">
                {section.heading}
              </h2>
            )}
            {section.subheading && (
              <p className="text-muted-foreground leading-relaxed">{section.subheading}</p>
            )}
          </div>
        )}
        <div className="p-8 border border-border bg-muted/20 text-center">
          <p className="text-muted-foreground mb-6">For enquiries, please use our contact page or call us directly.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-all duration-300"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border-2 border-border text-foreground font-bold text-sm px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Contact Page <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── EMBED ────────────────────────────────────────────────────────────────────

function EmbedSection({ section }: { section: any }) {
  const height = section.height ?? 450

  return (
    <section className="py-16 md:py-24 bg-background border-b border-border/50">
      <div className="container">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-10 text-balance">
            {section.heading}
          </h2>
        )}
        <div className="w-full overflow-hidden border border-border" style={{ height }}>
          <iframe
            src={section.embedUrl}
            title={section.title ?? section.heading ?? "Embedded content"}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0"
          />
        </div>
      </div>
    </section>
  )
}

// ─── CTA STRIP ────────────────────────────────────────────────────────────────

function CtaBannerSection({ section }: { section: any }) {
  const styleMap: Record<string, string> = {
    accent: "bg-accent text-accent-foreground",
    dark:   "bg-foreground text-background",
    light:  "bg-muted text-foreground",
  }
  const bg = styleMap[section.style ?? "accent"]
  const isDark = section.style !== "light"

  return (
    <section className={`${bg} py-16 md:py-20 overflow-hidden`}>
      <div className="container">
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-10">
          <div>
            {section.heading && (
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3 text-balance">
                {section.heading}
              </h2>
            )}
            {section.body && (
              <p className={`text-sm md:text-base max-w-lg leading-relaxed ${isDark ? "opacity-70" : "text-muted-foreground"}`}>
                {section.body}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            {section.primaryCta?.label && section.primaryCta?.href && (
              <Link
                href={section.primaryCta.href}
                className={`inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  section.style === "accent"
                    ? "bg-background text-foreground hover:bg-background/90"
                    : section.style === "dark"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {section.primaryCta.label}
              </Link>
            )}
            {section.secondaryCta?.label && section.secondaryCta?.href && (
              <Link
                href={section.secondaryCta.href}
                className={`inline-flex items-center justify-center gap-2 border-2 font-bold text-sm px-8 py-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark ? "border-current opacity-60 hover:opacity-100" : "border-border hover:bg-foreground/10"
                }`}
              >
                {section.secondaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MAIN RENDERER ────────────────────────────────────────────────────────────

export function PageSections({
  sections,
  businessName,
  phone,
  testimonials,
  services,
  staff,
  promotions,
}: PageSectionsProps) {
  if (!sections?.length) return null

  return (
    <>
      {sections.map((section: any, i: number) => {
        switch (section._type) {
          case "richTextSection":
            return <RichTextSection key={i} section={section} />
          case "imageTextSection":
            return <ImageTextSection key={i} section={section} />
          case "fullWidthBannerSection":
            return <FullWidthBannerSection key={i} section={section} />
          case "statsSection":
            return <StatsSection key={i} section={section} />
          case "gallerySection":
            return <GallerySection key={i} section={section} />
          case "faqSection":
            return <FaqSection key={i} section={section} />
          case "testimonialsSection":
            return <TestimonialsSection key={i} section={section} testimonials={testimonials} />
          case "servicesSection":
            return <ServicesSection key={i} section={section} services={services} />
          case "teamSection":
            return <TeamSection key={i} section={section} staff={staff} />
          case "promotionsSection":
            return <PromotionsSection key={i} section={section} promotions={promotions} />
          case "contactFormSection":
            return <ContactFormSection key={i} section={section} businessName={businessName} phone={phone} />
          case "embedSection":
            return <EmbedSection key={i} section={section} />
          case "ctaBannerSection":
            return <CtaBannerSection key={i} section={section} />
          default:
            return null
        }
      })}
    </>
  )
}
