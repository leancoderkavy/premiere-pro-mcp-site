import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8")

describe("Premiere Pro MCP comparison page", () => {
  const page = read("app/compare/page.tsx")
  const sitemap = read("app/sitemap.ts")
  const navigation = read("lib/site-navigation.ts")

  it("keeps the comparison figures and project identities source-linked", () => {
    expect(page).toContain("441 core tools in v1.25.0; 96 additional tools")
    expect(page).toContain("283 tools")
    expect(page).toContain("170+ tools")
    expect(page).toContain("284 tools")
    expect(page).toContain("https://github.com/leancoderkavy/premiere-pro-mcp")
    expect(page).toContain("https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP#readme")
    expect(page).toContain("https://github.com/antipaster/Adobe-Premiere-Pro-MCP#readme")
    expect(page).toContain("https://github.com/compimprove/adobe-premiere-mcp#readme")
  })

  it("clarifies the separate premiere-mcp.com brand and exposes SEO/internal discovery", () => {
    expect(page).toContain("premiere-mcp.com")
    expect(page).toContain('type="application/ld+json"')
    expect(sitemap).toContain("${siteUrl}/compare/")
    expect(navigation).toContain('{ label: "Compare MCP servers", href: "/compare/"')
  })
})
