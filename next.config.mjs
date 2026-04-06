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
  // Redirect root-level product slugs (e.g. /braided-hoses → /products/braided-hoses)
  // Handles nav links in Sanity set before the /products/ prefix was established
  async redirects() {
    const knownRoutes = [
      "studio", "api", "_next", "contact", "about", "blog", "projects",
      "meet-our", "brands", "featured-product", "miscellaneous",
      "locations", "services", "products",
    ]
    const exclusion = knownRoutes.join("|")
    return [
      {
        source: `/:slug((?!${exclusion})[^/]+)`,
        destination: "/products/:slug",
        permanent: false,
      },
    ]
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

export default nextConfig
