// sentry.server.config.ts — server-side Sentry initialisation
// Captures errors in Next.js Route Handlers, Server Actions, and SSR.
// Runs in the Node.js runtime (not edge).

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Sample 10% of server-side performance traces in production
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  enabled: process.env.NODE_ENV === "production" || process.env.SENTRY_DEBUG === "true",

  environment: process.env.NODE_ENV ?? "development",
})
