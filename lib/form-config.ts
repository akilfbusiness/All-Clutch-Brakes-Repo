// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL FORM MODE TOGGLE
// Change the value below to switch ALL forms across the entire site at once:
//   "static"  → standard single-page enquiry form
//   "dynamic" → multi-step AI lead qualification form
// ─────────────────────────────────────────────────────────────────────────────
export const FORM_MODE: "static" | "dynamic" = "static"

// ─────────────────────────────────────────────────────────────────────────────
// N8N WEBHOOK URLS
// Shared across all form instances
// ─────────────────────────────────────────────────────────────────────────────
export const WEBHOOK_STATIC   = "https://hook.eu1.make.com/8x1rc2kotqrzphiy2vgoxqaawp9rvmod"
export const WEBHOOK_PARTIAL  = "https://n8n-customer-automations.onrender.com/webhook/5384017c-e44f-4844-9965-6e8b78f5be0c"
export const WEBHOOK_STEP1    = "https://n8n-customer-automations.onrender.com/webhook/1a390a21-4ada-4ffe-a366-0e7fc6afc302"
export const WEBHOOK_STEP2    = "https://n8n-customer-automations.onrender.com/webhook/242b5f86-aaef-49a5-aa19-2137188f62c6"
export const WEBHOOK_CALL     = "https://n8n-customer-automations.onrender.com/webhook/66efcdcc-49af-4630-a088-a0d5fc2174e7"

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SERVICE OPTIONS
// Used on pages that don't derive services from Sanity data
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_SERVICES = [
  "Clutch Repairs & Replacement",
  "Brake Services & Repairs",
  "Transmission Repairs",
  "Flywheel Machining",
  "Brake Caliper & Hydraulic Repairs",
  "Differential Services",
  "Product Enquiry",
  "General Enquiry",
]
