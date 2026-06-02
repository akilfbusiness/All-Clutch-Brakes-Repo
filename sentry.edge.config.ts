// sentry.edge.config.ts — edge runtime Sentry initialisation
// Captures errors in Middleware and Edge Route Handlers.
// Note: Session Replay and some integrations are not available in the edge runtime.

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  enabled: process.env.NODE_ENV === "production" || process.env.SENTRY_DEBUG === "true",

  environment: process.env.NODE_ENV ?? "development",
})
