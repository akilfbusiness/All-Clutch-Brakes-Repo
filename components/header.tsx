import type { SiteSettings } from "@/sanity/queries"
import { NavbarClient } from "./navbar-client"

export async function Header({ settings }: { settings: SiteSettings }) {
  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone        = settings.phone?.[0]   || "(08) 8277 8122"

  return <NavbarClient businessName={businessName} phone={phone} />
}
