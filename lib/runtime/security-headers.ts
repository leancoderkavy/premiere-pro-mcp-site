import { randomBytes } from "node:crypto"

/**
 * Security headers ported from the former Fly server (`src/http-security.ts`).
 * The CSP stays nonce-based: no `'unsafe-inline'` for scripts, and the same
 * third-party analytics origins as before.
 */
export const SITE_ORIGIN = "https://premiere-pro-mcp.com"
export const HOSTED_MCP_ORIGIN = "https://premiere-pro-mcp.fly.dev"

/** Request headers owned by proxy.ts. Client-supplied copies are always replaced or dropped. */
export const NONCE_HEADER = "x-nonce"
export const EXPOSURE_HEADER = "x-homepage-exposure"

export function createScriptNonce(): string {
  return randomBytes(18).toString("base64")
}

export function buildContentSecurityPolicy(
  options: { scriptNonce?: string; development?: boolean } = {},
): string {
  const scriptSource = [
    "'self'",
    ...(options.scriptNonce ? [`'nonce-${options.scriptNonce}'`] : []),
    // React uses eval only in development to rebuild server error stacks.
    ...(options.development ? ["'unsafe-eval'"] : []),
    "https://www.googletagmanager.com",
    "https://us-assets.i.posthog.com",
    "https://eu-assets.i.posthog.com",
  ].join(" ")

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self' data: https:",
    "media-src 'self'",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSource}`,
    "connect-src 'self' https://www.google.com https://www.google-analytics.com https://www.googletagmanager.com https://us.i.posthog.com https://eu.i.posthog.com https://*.posthog.com",
    ...(options.development ? [] : ["upgrade-insecure-requests"]),
  ].join("; ")
}

/** Static headers applied to every response through `next.config.ts`. */
export const STATIC_SECURITY_HEADERS: ReadonlyArray<{ key: string; value: string }> = Object.freeze([
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
])
