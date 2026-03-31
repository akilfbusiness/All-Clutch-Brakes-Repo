import Link from "next/link"
import { Button } from "./ui/button"
import { Phone } from "lucide-react"
import type { SiteSettings } from "@/sanity/queries"

export async function Header({ settings }: { settings: SiteSettings }) {
  const businessName = settings.businessName || "All Clutch & Brake Service"
  const phone = settings.phone?.[0] || "(08) 8277 8122"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Business Name */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight">{businessName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/services" className="transition-colors hover:text-foreground/80">
            Services
          </Link>
          <Link href="/locations" className="transition-colors hover:text-foreground/80">
            Locations
          </Link>
          <Link href="/blog" className="transition-colors hover:text-foreground/80">
            Blog
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground/80">
            Contact
          </Link>
        </nav>

        {/* Call to Action */}
        <div className="flex items-center gap-4">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="hidden sm:flex items-center gap-2 text-sm font-semibold"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <Button asChild size="sm">
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
