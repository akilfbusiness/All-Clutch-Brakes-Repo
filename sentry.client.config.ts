// sentry.client.config.ts — browser-side Sentry initialisation
// Captures unhandled JS errors, React render errors, and performance traces
// in the user's browser. DSN is loaded from SENTRY_DSN environment variable.

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Tracing — captures performance data (page loads, API calls, etc.)
  // Set to 0.1 in production to sample 10% of transactions; increase for debugging.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Session Replay — records anonymised replays of error sessions
  // 10% of all sessions in production, 100% of sessions where an error occurred
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Only enable Replay in production to avoid capturing dev noise
  integrations: [
    Sentry.replayIntegration({
      // Mask all text content and block all media by default — privacy first
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Suppress Sentry from running during development unless SENTRY_DEBUG=true
  enabled: process.env.NODE_ENV === "production" || process.env.SENTRY_DEBUG === "true",

  // Environment tag — useful for filtering errors in the Sentry dashboard
  environment: process.env.NODE_ENV ?? "development",
})
