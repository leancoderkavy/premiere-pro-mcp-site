import { NextRequest } from "next/server"
import { describe, expect, it, vi } from "vitest"
import { HomepageExperiment } from "@/lib/runtime/homepage-experiment"
import { PROXY_PASS_HEADER, handleSiteRequest } from "@/lib/runtime/site-proxy"

const passToken = "per-process-secret"

function setup(variant: unknown = "test", enabled = true) {
  const evaluate = vi.fn(async () => variant)
  const capture = vi.fn(async () => {})
  const experiment = new HomepageExperiment({ evaluate, capture }, "test-secret-for-homepage-experiments-only", enabled)
  let counter = 0
  const run = (path: string, headers: Record<string, string> = {}, method = "GET") =>
    handleSiteRequest(
      new NextRequest(new URL(path, "http://localhost:3000"), {
        method,
        headers: { host: "localhost:3000", "user-agent": "Mozilla/5.0 Chrome/140", ...headers },
      }),
      { experiment, passToken, waitUntil: () => {}, nonce: () => `nonce${++counter}` },
    )
  return { run, evaluate, capture }
}

// NextResponse.next({ request: { headers } }) forwards request headers to
// rendering through these internal response headers.
const forwarded = (response: Response, name: string) => response.headers.get(`x-middleware-request-${name}`)
const rewrite = (response: Response) => response.headers.get("x-middleware-rewrite")

describe("site proxy", () => {
  it("issues a fresh nonce per request in the CSP header and forwards it to rendering", async () => {
    const { run } = setup("control", false)
    const first = await run("/docs/")
    const second = await run("/docs/")
    expect(first.headers.get("content-security-policy")).toContain("script-src 'self' 'nonce-nonce1'")
    expect(second.headers.get("content-security-policy")).toContain("'nonce-nonce2'")
    expect(forwarded(first, "x-nonce")).toBe("nonce1")
    expect(forwarded(first, "content-security-policy")).toBe(first.headers.get("content-security-policy"))
    expect(first.headers.get("x-robots-tag")).toBeNull()
    expect(first.headers.get("set-cookie")).toBeNull()
  })

  it("rewrites the root to the treatment without a redirect and enrolls the visitor", async () => {
    const { run, evaluate } = setup("test")
    const response = await run("/", { "sec-fetch-dest": "document" })
    expect(response.status).toBe(200)
    expect(new URL(rewrite(response)!).pathname).toBe("/design-preview/")
    expect(response.headers.get("set-cookie")).toMatch(/^premiere_homepage_v1=[0-9a-f-]{36}\.test\./)
    expect(response.headers.get("cache-control")).toBe("private, no-store")
    expect(response.headers.get("x-robots-tag")).toBeNull()
    expect(forwarded(response, "x-homepage-exposure")).toBe("test")
    expect(forwarded(response, PROXY_PASS_HEADER)).toBe(passToken)
    expect(evaluate).toHaveBeenCalledOnce()
  })

  it("serves the control in place and still records exposure for enrolled control visitors", async () => {
    const { run } = setup("control")
    const response = await run("/")
    expect(rewrite(response)).toBeNull()
    expect(response.headers.get("set-cookie")).toContain(".control.")
    expect(forwarded(response, "x-homepage-exposure")).toBe("control")
  })

  it("treats ?design as a noindex preview that never enrolls", async () => {
    const { run, evaluate } = setup("control")
    const test = await run("/?design=test")
    expect(new URL(rewrite(test)!).pathname).toBe("/design-preview/")
    expect(test.headers.get("x-robots-tag")).toBe("noindex, follow")
    expect(test.headers.get("cache-control")).toBe("private, no-store")
    expect(test.headers.get("set-cookie")).toBeNull()
    expect(forwarded(test, "x-homepage-exposure")).toBeNull()
    const control = await run("/?design=anything")
    expect(rewrite(control)).toBeNull()
    expect(control.headers.get("x-robots-tag")).toBe("noindex, follow")
    const direct = await run("/design-preview/")
    expect(direct.headers.get("x-robots-tag")).toBe("noindex, follow")
    expect(direct.headers.get("cache-control")).toBe("private, no-store")
    expect(evaluate).not.toHaveBeenCalled()
  })

  it("does not enroll opted-out visitors, HEAD requests, or client navigations", async () => {
    const { run, evaluate } = setup("test")
    for (const response of [
      await run("/", { dnt: "1" }),
      await run("/", { "sec-gpc": "1" }),
      await run("/", {}, "HEAD"),
      await run("/", { "sec-fetch-dest": "empty" }),
    ]) {
      expect(rewrite(response)).toBeNull()
      expect(response.headers.get("set-cookie")).toBeNull()
      expect(forwarded(response, "x-homepage-exposure")).toBeNull()
    }
    expect(evaluate).not.toHaveBeenCalled()
  })

  it("keeps an enrolled visitor's variant for client navigations without re-enrolling", async () => {
    const { run, evaluate } = setup("test")
    const cookie = (await run("/")).headers.get("set-cookie")!.split(";")[0]
    const navigation = await run("/", { cookie, "sec-fetch-dest": "empty" })
    expect(new URL(rewrite(navigation)!).pathname).toBe("/design-preview/")
    expect(navigation.headers.get("set-cookie")).toBeNull()
    expect(forwarded(navigation, "x-homepage-exposure")).toBeNull()
    expect(evaluate).toHaveBeenCalledOnce()
  })

  it("drops client-supplied exposure headers and cannot be bypassed without the process secret", async () => {
    const { run } = setup("test", false)
    const spoofed = await run("/docs/", {
      "x-homepage-exposure": "test",
      "x-nonce": "attacker",
      [PROXY_PASS_HEADER]: "guess",
    })
    expect(forwarded(spoofed, "x-homepage-exposure")).toBeNull()
    expect(forwarded(spoofed, "x-nonce")).toBe("nonce1")
    expect(spoofed.headers.get("content-security-policy")).toContain("'nonce-nonce1'")
    const secondPass = await run("/design-preview/", { [PROXY_PASS_HEADER]: passToken })
    expect(secondPass.headers.get("content-security-policy")).toBeNull()
    expect(secondPass.headers.get("x-middleware-override-headers")).toBeNull()
  })

  it("redirects with 308 before any page work", async () => {
    const { run, evaluate } = setup("test")
    const cases: Array<[string, Record<string, string>, string]> = [
      ["/docs", {}, "http://localhost:3000/docs/"],
      ["/docs/index.html?utm_source=x", {}, "http://localhost:3000/docs/?utm_source=x"],
      ["/", { host: "www.premiere-pro-mcp.com" }, "https://premiere-pro-mcp.com/"],
      ["/mcp", {}, "https://premiere-pro-mcp.fly.dev/mcp"],
    ]
    for (const [path, headers, location] of cases) {
      const response = await run(path, headers)
      expect(response.status).toBe(308)
      expect(response.headers.get("location")).toBe(location)
      expect(response.headers.get("set-cookie")).toBeNull()
    }
    const post = await run("/mcp", {}, "POST")
    expect(post.status).toBe(308)
    expect(evaluate).not.toHaveBeenCalled()
  })
})
