import { HOSTED_MCP_ORIGIN, SITE_ORIGIN } from "./security-headers"

/** Paths that belong to the hosted MCP server on Fly, not the marketing site. */
export const HOSTED_MCP_PATHS = [
  "/mcp",
  "/health",
  "/.well-known/oauth-protected-resource",
  "/.well-known/oauth-protected-resource/mcp",
] as const

const PUBLIC_ALIASES = new Set(["www.premiere-pro-mcp.com", "premiere-pro-mcp.fly.dev"])

export type RedirectDecision = { location: string; cacheControl?: string }

function isFilePath(pathname: string): boolean {
  return /\.[A-Za-z0-9]+$/.test(pathname.slice(pathname.lastIndexOf("/") + 1))
}

/**
 * One-hop canonical redirects, all 308 so methods and bodies survive:
 * - hosted MCP endpoints (old client configs) go to the Fly server;
 * - known public aliases go to the HTTPS apex;
 * - `/index.html` and extensionless page paths gain their trailing slash.
 * Never derives an origin from Host or forwarded headers beyond the exact
 * known aliases; other hosts keep relative redirects.
 */
export function canonicalRedirect(url: URL, hostHeader: string | null): RedirectDecision | undefined {
  const { pathname, search } = url
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
  if ((HOSTED_MCP_PATHS as readonly string[]).includes(trimmed)) {
    return { location: `${HOSTED_MCP_ORIGIN}${trimmed}${search}` }
  }
  // `/api/*` route handlers keep their exact path; they are never pages.
  if (pathname.startsWith("/api/")) return
  const alias = PUBLIC_ALIASES.has((hostHeader ?? "").toLowerCase())
  // Collapse leading slashes so `//host/...` can never become a
  // protocol-relative Location (open redirect).
  let canonical = pathname.replace(/^\/{2,}/, "/")
  if (/(?:^|\/)index\.html$/.test(canonical)) canonical = canonical.slice(0, -"index.html".length)
  // Matches Next.js' own trailing-slash rule, which leaves `/.well-known/*` alone.
  else if (!canonical.endsWith("/") && !isFilePath(canonical) && !canonical.startsWith("/.well-known/"))
    canonical = `${canonical}/`
  if (!alias && canonical === pathname) return
  return {
    location: `${alias ? SITE_ORIGIN : ""}${canonical}${search}`,
    cacheControl: "public, max-age=3600",
  }
}
