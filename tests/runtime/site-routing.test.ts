import { describe, expect, it } from "vitest"
import { canonicalRedirect } from "@/lib/runtime/site-routing"
import { siteHeaders, siteRedirects, STATIC_ASSET_CACHE_CONTROL } from "@/lib/runtime/site-config"
import { buildContentSecurityPolicy, STATIC_SECURITY_HEADERS } from "@/lib/runtime/security-headers"

const redirect = (path: string, host = "premiere-pro-mcp.com") =>
  canonicalRedirect(new URL(`http://localhost:3000${path}`), host)?.location

describe("canonical redirects (ported from the Fly server)", () => {
  it.each([
    ["/docs", "localhost:3000", "/docs/"],
    ["/changelog?ref=x", "localhost:3000", "/changelog/?ref=x"],
    ["/index.html", "localhost:3000", "/"],
    ["/docs/index.html?utm_source=github&x=%2F", "localhost:3000", "/docs/?utm_source=github&x=%2F"],
    ["/docs/index.html?utm_source=github", "www.premiere-pro-mcp.com", "https://premiere-pro-mcp.com/docs/?utm_source=github"],
    ["/docs/", "premiere-pro-mcp.fly.dev", "https://premiere-pro-mcp.com/docs/"],
    ["/docs", "www.premiere-pro-mcp.com", "https://premiere-pro-mcp.com/docs/"],
    ["/", "WWW.PREMIERE-PRO-MCP.COM", "https://premiere-pro-mcp.com/"],
  ])("%s on %s redirects in one hop to %s", (path, host, expected) => {
    expect(redirect(path, host)).toBe(expected)
  })

  it("never produces a protocol-relative Location", () => {
    expect(redirect("//untrusted.example/index.html", "localhost:3000")).toBe("/untrusted.example/")
    expect(redirect("//untrusted.example/docs", "localhost:3000")).toBe("/untrusted.example/docs/")
    expect(redirect("//untrusted.example", "localhost:3000")).toBe("/untrusted.example")
  })

  it("does not redirect canonical pages, files, API routes, or untrusted hosts", () => {
    for (const host of ["premiere-pro-mcp.com", "localhost:3000", "self-hosted.example", "www.premiere-pro-mcp.com.attacker.example"]) {
      expect(redirect("/docs/?ref=readme", host)).toBeUndefined()
    }
    expect(redirect("/robots.txt")).toBeUndefined()
    expect(redirect("/marketing/sequence-v2.webp")).toBeUndefined()
    expect(redirect("/api/landing-events")).toBeUndefined()
    expect(redirect("/.well-known/security.txt")).toBeUndefined()
  })

  it.each([
    ["/mcp", "https://premiere-pro-mcp.fly.dev/mcp"],
    ["/mcp/", "https://premiere-pro-mcp.fly.dev/mcp"],
    ["/mcp?session=1", "https://premiere-pro-mcp.fly.dev/mcp?session=1"],
    ["/health", "https://premiere-pro-mcp.fly.dev/health"],
    ["/.well-known/oauth-protected-resource", "https://premiere-pro-mcp.fly.dev/.well-known/oauth-protected-resource"],
    ["/.well-known/oauth-protected-resource/mcp", "https://premiere-pro-mcp.fly.dev/.well-known/oauth-protected-resource/mcp"],
  ])("sends hosted MCP path %s to the Fly server", (path, expected) => {
    expect(redirect(path)).toBe(expected)
    expect(redirect(path, "www.premiere-pro-mcp.com")).toBe(expected)
  })
})

describe("static headers and cache rules", () => {
  const headers = siteHeaders()
  const matches = (source: string, path: string) => {
    // next.config sources here are `/:asset(<regex>)` or `/:path*`.
    const custom = source.match(/^\/:asset\((.*)\)$/)
    if (custom) return new RegExp(`^/${custom[1]}$`).test(path)
    if (source === "/:path*") return true
    if (source.endsWith("/:path*")) return path.startsWith(source.slice(0, -"/:path*".length))
    return source === path
  }
  const headersFor = (path: string) =>
    Object.fromEntries(headers.filter((rule) => matches(rule.source, path)).flatMap((rule) => rule.headers.map(({ key, value }) => [key, value])))

  it("applies the Fly server's security headers everywhere", () => {
    for (const path of ["/", "/docs/", "/robots.txt", "/_next/static/chunks/app.js", "/api/landing-events"]) {
      for (const { key, value } of STATIC_SECURITY_HEADERS) expect(headersFor(path)[key]).toBe(value)
    }
  })

  it("caches public files for a day but leaves hashed Next.js assets immutable", () => {
    for (const path of ["/robots.txt", "/sitemap.xml", "/llms.txt", "/marketing/sequence-v2.webp", "/premiere-pro-mcp-demo.mp4", "/analytics.js", "/downloads/x.zip"]) {
      expect(headersFor(path)["Cache-Control"]).toBe(STATIC_ASSET_CACHE_CONTROL)
      expect(headersFor(path)["Content-Security-Policy"]).toBe(buildContentSecurityPolicy())
    }
    // Next.js sets `public, max-age=31536000, immutable` itself.
    expect(headersFor("/_next/static/chunks/app.js")["Cache-Control"]).toBeUndefined()
    // Pages get their nonce CSP and no-store caching from proxy.ts.
    expect(headersFor("/docs/")["Cache-Control"]).toBeUndefined()
    expect(headersFor("/docs/")["Content-Security-Policy"]).toBeUndefined()
  })

  it("redirects alias-host public files to the apex with 308", () => {
    const rules = siteRedirects()
    expect(rules.map((rule) => rule.has?.[0]?.value).sort()).toEqual(["premiere-pro-mcp.fly.dev", "www.premiere-pro-mcp.com"])
    for (const rule of rules) {
      expect(rule).toMatchObject({ statusCode: 308, destination: "https://premiere-pro-mcp.com/:asset" })
    }
  })
})

describe("content security policy", () => {
  it("allows scripts only from self, the nonce, and the analytics origins", () => {
    const policy = buildContentSecurityPolicy({ scriptNonce: "abc123" })
    const scriptSource = policy.split("; ").find((directive) => directive.startsWith("script-src "))
    expect(scriptSource).toBe(
      "script-src 'self' 'nonce-abc123' https://www.googletagmanager.com https://us-assets.i.posthog.com https://eu-assets.i.posthog.com",
    )
    expect(policy).not.toContain("'unsafe-eval'")
    expect(policy).toContain("frame-ancestors 'none'")
    expect(policy).toContain("upgrade-insecure-requests")
    expect(buildContentSecurityPolicy({ scriptNonce: "abc123", development: true })).toContain("'unsafe-eval'")
  })
})
