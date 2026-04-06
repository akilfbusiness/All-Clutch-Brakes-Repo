"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, ChevronDown } from "lucide-react"

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

const FALLBACK_NAV_LINKS = [
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

  const links = navItems.length > 0 ? navItems : FALLBACK_NAV_LINKS

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
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
              className={`text-xs font-black tracking-[0.2em] uppercase transition-colors duration-300 ${
                open ? "text-white" : "text-foreground"
              }`}
            >
              {businessName}
            </span>
          </Link>

          {/* Hamburger button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 flex flex-col justify-center gap-[6px] w-10 h-10 cursor-pointer"
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 9 : 0 }}
              transition={{ duration: 0.35, ease }}
              className={`block h-[2px] w-7 origin-center transition-colors duration-300 ${open ? "bg-white" : "bg-foreground"}`}
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
              transition={{ duration: 0.25 }}
              className={`block h-[2px] w-5 transition-colors duration-300 ${open ? "bg-white" : "bg-foreground"}`}
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -9 : 0 }}
              transition={{ duration: 0.35, ease }}
              className={`block h-[2px] w-7 origin-center transition-colors duration-300 ${open ? "bg-white" : "bg-foreground"}`}
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
                        <div className="group flex items-center justify-between py-7 md:py-8 hover:border-accent transition-all duration-300 cursor-pointer"
                          onClick={() => {
                            if (hasChildren) {
                              setExpandedIdx(isExpanded ? null : i)
                            } else {
                              setOpen(false)
                            }
                          }}
                        >
                          {hasChildren ? (
                            <span className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight leading-none select-none">
                              {link.label}
                            </span>
                          ) : (
                            <Link
                              href={link.href || "#"}
                              target={link.openInNewTab ? "_blank" : undefined}
                              rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                              onClick={() => setOpen(false)}
                              className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight leading-none"
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
                                    className="group flex items-center justify-between border-t border-border/50 py-4 md:py-5 hover:text-accent transition-colors duration-300"
                                  >
                                    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight">
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
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-colors"
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
