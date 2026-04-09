import Link from "next/link"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import type { SiteSettings } from "@/sanity/queries"
import { getAllCertifications } from "@/sanity/queries"
import { CertificationsDisplay } from "./certifications-display"

export async function Footer({ settings }: { settings: SiteSettings }) {
  const certifications = await getAllCertifications().catch(() => [])
  const businessName  = settings.businessName  || "All Clutch & Brake Service"
  const address       = settings.address
  const phone         = settings.phone?.[0]    || "(08) 8277 8122"
  const email         = settings.email         || "info@allclutchandbrake.com.au"
  const businessHours = settings.businessHours || []
  const footerLinks   = settings.footerLinks   || []
  const copyright     = settings.footerCopyrightText || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`
  const footerBrandLabel = settings.footerBrandLabel || "Adelaide Specialists"
  const footerTagline    = settings.footerTagline    || "Expert clutch, brake and transmission repairs for all makes and models. Trusted by Adelaide drivers for over 30 years."

  const navLinks = footerLinks.length > 0 ? footerLinks : [
    { href: "/services",  label: "Our Services" },
    { href: "/locations", label: "Locations"     },
    { href: "/about",     label: "About Us"      },
    { href: "/blog",      label: "Blog"          },
    { href: "/contact",   label: "Contact"       },
  ]

  return (
    <footer className="relative bg-background border-t border-border overflow-hidden">

      {/* Watermark — massive business name behind content */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none"
      >
        <span className="block text-[80px] md:text-[140px] lg:text-[180px] font-bold text-foreground/[0.03] leading-none whitespace-nowrap tracking-tight -mb-4 pl-2">
          {businessName}
        </span>
      </div>

      {/* Main grid */}
      <div className="relative z-10 container py-20 md:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-accent mb-3">
                {footerBrandLabel}
              </p>
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {businessName}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              {footerTagline}
            </p>
            <div className="w-10 h-[2px] bg-accent" />
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60">
              Contact
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  <Phone className="h-3.5 w-3.5 text-accent flex-shrink-0" />{phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-accent transition-colors duration-300">
                  <Mail className="h-3.5 w-3.5 text-accent flex-shrink-0" />{email}
                </a>
              </li>
              {address && (
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                  <span>{address.street}<br />{address.suburb}, {address.state} {address.postcode}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Links */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link href={link.href || "#"}
                    className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:pl-1 inline-block">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + CTA */}
          <div className="space-y-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted-foreground/60">
              Opening Hours
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {(businessHours.length > 0 ? businessHours : [
                { days: "Monday – Friday", hours: "8:00 AM – 5:00 PM" },
                { days: "Saturday – Sunday", hours: "Closed"           },
              ]).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Clock className="h-3.5 w-3.5 text-accent flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="block text-foreground/80 font-medium">{item.days}</span>
                    {item.hours}
                  </span>
                </li>
              ))}
            </ul>
            <a href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold text-xs px-6 py-3 mt-2 transition-colors duration-300">
              <Phone className="h-3.5 w-3.5" /> Call Now
            </a>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="relative z-10 border-t border-border/50">
          <div className="container py-8">
            <CertificationsDisplay certifications={certifications} variant="footer" />
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-border/50">
        <div className="container flex flex-wrap justify-between items-center gap-4 py-5">
          <p className="text-xs text-muted-foreground/50">{copyright}</p>
          <Link href="/privacy-policy"
            className="text-xs text-muted-foreground/50 hover:text-accent transition-colors duration-300">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
