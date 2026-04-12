# Design System — All Clutch & Brake

## Colour Palette

### Light Mode (default)
| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.99 0 0)` | Page background (near-white) |
| `--foreground` | `oklch(0.13 0.02 245)` | Body text (dark navy) |
| `--accent` | `oklch(0.52 0.20 245)` | Brand blue — CTAs, highlights |
| `--accent-foreground` | `oklch(0.99 0 0)` | Text ON accent (white) |
| `--border` | `oklch(0.88 0.01 240)` | Dividers, card borders |
| `--muted` | `oklch(0.95 0.005 240)` | Subtle backgrounds |
| `--muted-foreground` | `oklch(0.48 0.01 240)` | Secondary text |
| `--card` | `oklch(0.97 0.004 240)` | Card backgrounds |

### Dark Mode (toggled via Moon/Sun button)
| Token | Value | Usage |
|---|---|---|
| `--background` | `oklch(0.09 0 0)` | Near-black |
| `--foreground` | `oklch(0.94 0 0)` | Off-white text |
| `--accent` | `oklch(0.70 0.19 55)` | Orange/amber — CTAs, highlights |
| `--accent-foreground` | `oklch(0.09 0 0)` | Text ON accent (near-black) |
| `--border` | `oklch(0.21 0.003 260)` | Subtle dark borders |

## Typography
- **Font family:** Plus Jakarta Sans (variable, 400–800 weight)
- **Variable:** `--font-sans` → applied via `font-sans` Tailwind utility
- **Mono:** Geist Mono (`--font-mono`)
- **Headings:** `font-bold tracking-tight` (NOT font-black, NOT uppercase on h1/h2)
- **Eyebrow labels:** `text-[10px] font-bold tracking-[0.45em] uppercase text-accent`
- **Breadcrumbs:** `text-[11px] font-bold tracking-[0.2em] uppercase`

## Spacing & Scale
- Hero h1: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl`
- Section h2: `text-3xl md:text-4xl` (CTA strips) / `text-4xl md:text-5xl lg:text-6xl` (feature sections)
- Container: Tailwind `container` class with default padding
- Section vertical padding: `py-16 md:py-20` (standard) / `py-24 md:py-32` (hero)

## Design Patterns

### Navbar
- Transparent at top of page, `bg-background/95 backdrop-blur-md` when scrolled
- White text/icons when transparent AND on dark-hero pages (`/`, `/services/[slug]`, `/blog/[slug]`)
- Theme toggle: Sun/Moon icon, no border box
- Logo: `text-xs font-bold tracking-[0.2em] uppercase`

### Hero Sections (full-bleed image)
- Always `min-h-screen` or `min-h-[60vh]`
- Dark overlay: `bg-gradient-to-t from-black via-black/70 to-black/30`
- No-image fallback: `bg-zinc-900` + `bg-gradient-to-br from-black/60 via-transparent to-accent/10`
- Watermark text: `text-foreground/[0.06]` large tracking-tighter (decorative)

### Light-Background Hero (pages without full-bleed image)
- `bg-background pt-40 pb-24 md:pt-48 md:pb-32`
- Heading: `text-foreground`, body: `text-muted-foreground`

### CTA Strips (full-width accent band)
- Background: `bg-accent`
- ALL text: `text-accent-foreground` (white in light, near-black in dark)
- Primary button: `bg-background text-foreground`
- Secondary button: `border-2 border-accent-foreground/40 text-accent-foreground`

### Cards (border-grid style)
- Border: `border border-border`
- Hover: `hover:border-accent` or accent top-line
- No rounded corners — sharp edges throughout the site

### Buttons
- Primary: `bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-sm px-8 py-4`
- Outlined: `border border-border hover:border-accent text-foreground hover:text-accent font-bold text-sm px-8 py-4`
- No rounded corners (`rounded-none` or default sharp)

## Page Structure Rhythm
Light sections and dark sections alternate for visual contrast:
- Hero (dark image) → Stats (light) → **Services (dark navy)** → About (light) → CTA (accent blue) → etc.

## Dark Mode Behaviour
- `ThemeProvider` attribute="class", defaultTheme="light", enableSystem=false
- `.dark` class on `<html>` element
- All colour changes flow from CSS token layer — no per-component theme logic needed
- `suppressHydrationWarning` on `<html>`
