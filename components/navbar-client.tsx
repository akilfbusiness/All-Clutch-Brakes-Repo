"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ChevronDown, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

interface NavItem {
  label: string
  href: string
  openInNewTab?: boolean
  children?: { label: string; href: string; openInNewTab?: boolean }[]
}

interface NavbarClientProps {
  businessName: string
  phone: string
  navItems?: NavItem[]
  ctaLabel?: string
  ctaLink?: string
}

const FALLBACK_NAV_LINKS: NavItem[] = [
  { href: "/services",  label: "Services"  },
  { href: "/locations", label: "Locations" },
  { href: "/blog",      label: "Blog"      },
  { href: "/about",     label: "About"     },
  { href: "/contact",   label: "Contact"   },
]

const ease = [0.22, 1, 0.36, 1] as const

export function NavbarClient({ businessName, phone, navItems = [], ctaLabel = "Get a Quote", ctaLink = "/contact" }: NavbarClientProps) {
  const [open,        setOpen]        = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)
  const [mounted,     setMounted]     = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const useHeroWhite = pathname === "/" && !scrolled && !open

  useEffect(() => { setMounted(true) }, [])

  const links = navItems.length > 0 ? navItems : FALLBACK_NAV_LINKS

  // Count total visible rows (parents + expanded children) to scale text/padding
  const totalItems = links.reduce((acc, l) => acc + 1 + (l.children?.length ?? 0), 0)

  const parentSize =
    totalItems <= 3  ? "text-5xl md:text-6xl lg:text-7xl" :
    totalItems <= 6  ? "text-4xl md:text-5xl lg:text-6xl" :
    totalItems <= 9  ? "text-3xl md:text-4xl lg:text-5xl" :
                       "text-2xl md:text-3xl lg:text-4xl"

  const parentPad =
    totalItems <= 3  ? "py-7 md:py-8" :
    totalItems <= 6  ? "py-5 md:py-6" :
    totalItems <= 9  ? "py-3 md:py-4" :
                       "py-2 md:py-3"

  const childSize =
    totalItems <= 3  ? "text-3xl md:text-4xl lg:text-4xl" :
    totalItems <= 6  ? "text-2xl md:text-3xl lg:text-3xl" :
    totalItems <= 9  ? "text-xl  md:text-2xl lg:text-2xl" :
                       "text-lg  md:text-xl  lg:text-xl"

  const childPad =
    totalItems <= 3  ? "py-4 md:py-5" :
    totalItems <= 6  ? "py-3 md:py-4" :
    totalItems <= 9  ? "py-2 md:py-3" :
                       "py-1.5 md:py-2"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll() // initialise on mount so white text shows immediately without needing to scroll
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    if (!open) setExpandedIdx(null)
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* ── Fixed navbar bar ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} className="relative z-50">
            <span
              className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${useHeroWhite ? "text-white" : "text-foreground"}`}
            >
              {businessName}
            </span>
          </Link>

          {/* Phone — desktop only */}
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={`hidden md:flex items-center gap-2 text-[11px] font-bold tracking-[0.08em] transition-colors duration-300 relative z-50 hover:text-accent ${useHeroWhite ? "text-white/80" : "text-foreground/60"}`}
          >
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            {phone}
          </a>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="relative z-50 hidden md:flex w-9 h-9 items-center justify-center transition-colors"
            >
              {theme === "dark"
                ? <Sun className={`h-4 w-4 ${useHeroWhite ? "text-white/70" : "text-foreground/60"}`} />
                : <Moon className={`h-4 w-4 ${useHeroWhite ? "text-white/70" : "text-foreground/60"}`} />
              }
            </button>
          )}

          {/* Hamburger button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex flex-col justify-center gap-[6px] w-10 h-10 cursor-pointer"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 9 : 0 }}
              transition={{ duration: 0.35, ease }}
              className={`block h-[2px] w-7 origin-center transition-colors duration-300 ${open ? "bg-foreground" : useHeroWhite ? "bg-white" : "bg-foreground"}`}
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              className={`block h-[2px] w-5 transition-colors duration-300 ${open ? "bg-foreground" : useHeroWhite ? "bg-white" : "bg-foreground"}`}
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -9 : 0 }}
              transition={{ duration: 0.35, ease }}
              className={`block h-[2px] w-7 origin-center transition-colors duration-300 ${open ? "bg-foreground" : useHeroWhite ? "bg-white" : "bg-foreground"}`}
            />
          </button>
        </div>
      </header>

      {/* ── Full-screen overlay menu ──────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease }}
            className="fixed inset-0 z-40 bg-background flex flex-col overflow-auto"
          >
            <div className="container flex-1 flex flex-col justify-center py-32 min-h-screen">

              {/* Nav links — Autovera style large list */}
              <nav className="border-t border-border">
                {links.map((link, i) => {
                  const hasChildren = link.children && link.children.length > 0
                  const isExpanded  = expandedIdx === i

                  return (
                    <motion.div
                      key={`${link.href}-${i}`}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease }}
                    >
                      {/* Parent row */}
                      <div className="border-b border-border">
                        <div className={`group flex items-center justify-between ${parentPad} hover:border-accent transition-all duration-300 cursor-pointer`}
                          onClick={() => {
                            if (hasChildren) {
                              setExpandedIdx(isExpanded ? null : i)
                            } else {
                              setOpen(false)
                            }
                          }}
                        >
                          {hasChildren ? (
                            <span className={`${parentSize} font-bold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight leading-none select-none`}>
                              {link.label}
                            </span>
                          ) : (
                            <Link
                              href={link.href || "#"}
                              target={link.openInNewTab ? "_blank" : undefined}
                              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                              onClick={() => setOpen(false)}
                              className={`${parentSize} font-bold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight leading-none`}
                            >
                              {link.label}
                            </Link>
                          )}
                          {hasChildren ? (
                            <motion.span
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                              className="text-accent"
                            >
                              <ChevronDown className="h-8 w-8 md:h-10 md:w-10" />
                            </motion.span>
                          ) : (
                            <motion.span
                              initial={{ opacity: 0, x: -8 }}
                              whileHover={{ opacity: 1, x: 0 }}
                              className="text-accent text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300"
                            >
                              →
                            </motion.span>
                          )}
                        </div>

                        {/* Children sub-list */}
                        <AnimatePresence>
                          {hasChildren && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease }}
                              className="overflow-hidden pl-4 md:pl-8"
                            >
                              {link.children!.map((child, j) => (
                                <motion.div
                                  key={`${child.href}-${j}`}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: j * 0.05, duration: 0.3, ease }}
                                >
                                  <Link
                                    href={child.href || "#"}
                                    target={child.openInNewTab ? "_blank" : undefined}
                                    rel={child.openInNewTab ? "noopener noreferrer" : undefined}
                                    onClick={() => { setOpen(false); setExpandedIdx(null) }}
                                    className={`group flex items-center justify-between border-t border-border/50 ${childPad} hover:text-accent transition-colors duration-300`}
                                  >
                                    <span className={`${childSize} font-bold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight`}>
                                      {child.label}
                                    </span>
                                    <span className="text-accent text-base font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                                  </Link>
                                </motion.div>
                              ))}
                              <div className="pb-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Bottom CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5, ease }}
                className="mt-12 flex flex-wrap items-center gap-6"
              >
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-accent text-sm font-bold hover:text-accent/80 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
                <Link
                  href={ctaLink}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4 transition-colors"
                >
                  {ctaLabel}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
