import type { SiteSettings } from "@/sanity/queries"
import { getSiteNavigation } from "@/sanity/queries"
import { NavbarClient } from "./navbar-client"

export async function Header({ settings }: { settings: SiteSettings }) {
  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone        = settings.phone?.[0]   || "(08) 8277 8122"

  let nav: Awaited<ReturnType<typeof getSiteNavigation>> = {}
  try {
    nav = await getSiteNavigation()
  } catch {
    nav = {}
  }

  return (
    <NavbarClient
      businessName={businessName}
      phone={phone}
      navItems={nav.headerItems ?? []}
      ctaLabel={nav.headerCtaLabel ?? "Get a Quote"}
      ctaLink={nav.headerCtaLink   ?? "/contact"}
    />
  )
}
