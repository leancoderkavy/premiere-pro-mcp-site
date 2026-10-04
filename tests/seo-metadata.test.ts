import { describe, expect, it } from "vitest"
import { pageMetadata } from "../lib/seo"

describe("route-specific search and social metadata", () => {
  it("completes nested fields lost by Next's shallow metadata merge", () => {
    const result = pageMetadata({ title: "Compare servers", description: "Choose a bridge", alternates: { canonical: "/compare/" }, openGraph: { type: "article" } })
    expect(result.title).toEqual({ absolute: "Compare servers" })
    expect(result.openGraph).toMatchObject({ title: "Compare servers", description: "Choose a bridge", url: "/compare/", images: ["/marketing/premiere-pro-mcp-social-square-v1.png"] })
    expect(result.twitter).toMatchObject({ title: "Compare servers", description: "Choose a bridge", card: "summary_large_image" })
  })
  it("preserves custom artwork and resolves canonical descriptors", () => {
    const result = pageMetadata({ title: { absolute: "Demo" }, alternates: { canonical: { url: "/demo/" } }, openGraph: { title: "Recorded demo", images: ["/demo.webp"] } })
    expect(result.openGraph?.url).toBe("/demo/")
    expect(result.twitter).toMatchObject({ title: "Recorded demo", images: ["/demo.webp"] })
  })
})
