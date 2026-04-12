# Claude Code — Project Instructions

## Output Style
- Be concise. No preamble, no trailing summaries.
- Don't restate what was just done — the diff speaks for itself.
- Prefer short sentences. Skip filler phrases ("certainly", "of course", "great question").
- Only explain reasoning when it's non-obvious or the user asks.

## Code Style
- No speculative abstractions. Solve the actual problem, not a hypothetical future one.
- No docstrings or comments unless logic is genuinely non-obvious.
- No backwards-compat shims for removed code. Delete cleanly.
- No error handling for impossible cases. Trust framework guarantees.
- Don't add features beyond what was asked.

## This Project
- Next.js 16 App Router — server components for data, `"use client"` for interactivity only.
- Tailwind CSS v4 — config via `@theme inline` in `app/globals.css`, no `tailwind.config.ts`.
- All colors via CSS custom properties (`--background`, `--foreground`, `--accent`, etc.) in oklch.
- `next-themes` with `attribute="class"`, `defaultTheme="light"`.
- Sanity CMS — use `getSiteSettings()` and page-specific queries from `sanity/queries.ts`.
- Font: Plus Jakarta Sans via `--font-sans`. No Syne, no Geist Sans.

## Framework Docs
- Append **"use context7"** to any prompt involving Next.js, Tailwind, Sanity, or React APIs.
