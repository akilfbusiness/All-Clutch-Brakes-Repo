"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Phone } from "lucide-react"

interface NavbarClientProps {
  businessName: string
  phone: string
}

const NAV_LINKS = [
  { href: "/services",  label: "Services"  },
  { href: "/locations", label: "Locations" },
  { href: "/blog",      label: "Blog"      },
  { href: "/about",     label: "About"     },
  { href: "/contact",   label: "Contact"   },
]

const ease = [0.22, 1, 0.36, 1] as const

export function NavbarClient({ businessName, phone }: NavbarClientProps) {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
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
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.5, ease }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-b border-border py-7 md:py-8 hover:border-accent transition-all duration-300"
                    >
                      <span className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground group-hover:text-accent transition-colors duration-300 tracking-tight leading-none">
                        {link.label}
                      </span>
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="text-accent text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                ))}
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
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-black font-bold text-sm px-8 py-4 transition-colors"
                >
                  Get a Free Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
