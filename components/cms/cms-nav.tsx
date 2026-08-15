"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Settings,
  Compass,
  Files,
  FileText,
  Wrench,
  MapPin,
  Newspaper,
  MessageSquareQuote,
  PartyPopper,
  Award,
  ImageIcon,
  Info,
  Package,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/cms", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/cms/site-settings", label: "Site Settings", icon: Settings, exact: false },
  { href: "/cms/navigation", label: "Navigation", icon: Compass, exact: false },
  { href: "/cms/all-pages", label: "All Pages", icon: Files, exact: false },
  { href: "/cms/pages", label: "Pages", icon: FileText, exact: false },
  { href: "/cms/services", label: "Services", icon: Wrench, exact: false },
  { href: "/cms/locations", label: "Locations", icon: MapPin, exact: false },
  { href: "/cms/blog", label: "Blog", icon: Newspaper, exact: false },
  { href: "/cms/testimonials", label: "Testimonials", icon: MessageSquareQuote, exact: false },
  { href: "/cms/promotions", label: "Promotions & Specials", icon: PartyPopper, exact: false },
  { href: "/cms/certifications", label: "Certifications & Affiliations", icon: Award, exact: false },
  { href: "/cms/gallery", label: "Gallery", icon: ImageIcon, exact: false },
  { href: "/cms/about", label: "About", icon: Info, exact: false },
  { href: "/cms/products", label: "Products", icon: Package, exact: false },
  { href: "/cms/authors", label: "Authors", icon: Users, exact: false },
]

export function CmsNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 overflow-y-auto border-b bg-background px-4 py-2 sm:w-56 sm:shrink-0 sm:border-b-0 sm:border-r sm:px-2 sm:py-4">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
