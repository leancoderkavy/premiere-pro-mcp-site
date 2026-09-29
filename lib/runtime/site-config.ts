import type { NextConfig } from "next"
import {
  SITE_ORIGIN,
  STATIC_SECURITY_HEADERS,
  buildContentSecurityPolicy,
} from "./security-headers"

/** Extensions served from `public/` and metadata routes, outside proxy.ts. */
export const STATIC_ASSET_EXTENSIONS = [
  "png", "webp", "jpg", "jpeg", "gif", "avif", "svg", "ico",
  "mp4", "webm", "vtt",
  "txt", "json", "xml", "webmanifest",
  "js", "css", "woff", "woff2", "ttf",
  "zip", "pdf",
] as const

export const STATIC_ASSET_CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800"

type Header = Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>[number]
type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number]

const extensions = STATIC_ASSET_EXTENSIONS.join("|")
const staticAssetSource = `/:asset(.*\\.(?:${extensions}))`
// Excludes `/_next/`: hashed build files keep Next.js' immutable caching.
const publicAssetSource = `/:asset((?!_next/).*\\.(?:${extensions}))`

export function siteHeaders(): Header[] {
  return [
    { source: "/:path*", headers: [...STATIC_SECURITY_HEADERS] },
    {
      // Public files and metadata routes are not rendered by proxy.ts, so
      // they carry a nonce-less CSP (it still blocks script in served SVGs).
      source: publicAssetSource,
      headers: [
        { key: "Content-Security-Policy", value: buildContentSecurityPolicy() },
        { key: "Cache-Control", value: STATIC_ASSET_CACHE_CONTROL },
      ],
    },
    {
      source: "/api/:path*",
      headers: [{ key: "Content-Security-Policy", value: buildContentSecurityPolicy() }],
    },
  ]
}

/**
 * Page paths redirect in proxy.ts (one hop, trailing slash included). Only
 * public files requested on an alias host are left for config redirects.
 */
export function siteRedirects(): Redirect[] {
  return ["www.premiere-pro-mcp.com", "premiere-pro-mcp.fly.dev"].map((value) => ({
    source: staticAssetSource,
    has: [{ type: "host" as const, value }],
    destination: `${SITE_ORIGIN}/:asset`,
    statusCode: 308 as const,
  }))
}
