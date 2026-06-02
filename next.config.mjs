// next.config.mjs — wraps Next.js config with Sentry webpack plugin
// The withSentryConfig wrapper enables source-map uploads and tree-shaking
// of Sentry code not used in the browser bundle.
import { withSentryConfig } from "@sentry/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js image optimisation — critical for Core Web Vitals
    unoptimized: false,
    remotePatterns: [
      {
        // Sanity CDN — all images stored in Sanity served via their CDN
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
    ],
  },
  // Sanity Studio requires these headers for the embedded /studio route
  async headers() {
    return [
      {
        source: "/studio/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry organisation and project (from the wizard command you provided)
  org: "project-noda",
  project: "allclutchandbrake",

  // Silent Sentry CLI output during builds to keep logs clean
  silent: !process.env.CI,

  // Upload source maps to Sentry for readable stack traces in the dashboard
  // Source maps are deleted from the production bundle after upload
  widenClientFileUpload: true,
  hideSourceMaps: true,

  // Disable the Sentry SDK logger in production to reduce bundle size
  disableLogger: true,

  // Automatically instrument Vercel Cron Monitors
  automaticVercelMonitors: true,
})
