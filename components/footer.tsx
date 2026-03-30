import Link from "next/link"
import type { SiteSettings } from "@/sanity/queries"

export async function Footer({ settings }: { settings: SiteSettings }) {
  const businessName = settings.businessName || "All Clutch & Brake Service"
  const address = settings.address
  const phone = settings.phone?.[0] || "(08) 8277 8122"
  const email = settings.email || "info@allclutchandbrake.com.au"
  const businessHours = settings.businessHours || []
  const footerLinks = settings.footerLinks || []
  const footerTagline = settings.footerTagline || "Expert clutch and brake service in Adelaide"
  const footerCopyright =
    settings.footerCopyrightText || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Business Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{businessName}</h3>
            <p className="text-sm text-muted-foreground">{footerTagline}</p>
            {address && (
              <address className="text-sm not-italic text-muted-foreground">
                {address.street}
                <br />
                {address.suburb}, {address.state} {address.postcode}
              </address>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                  {phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="hover:text-foreground">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          {businessHours.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Hours</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {businessHours.map((item, i) => (
                  <li key={i}>
                    {item.days}: {item.hours}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Links */}
          {footerLinks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {footerLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>{footerCopyright}</p>
        </div>
      </div>
    </footer>
  )
}
