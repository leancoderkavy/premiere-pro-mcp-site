import { describe, expect, it } from "vitest"
import { indexNowPayload, indexNowOutcome } from "../scripts/lib/indexnow.mjs"

describe("IndexNow production submission boundary", () => {
  const key = "public-ownership-token"
  it("deduplicates canonical URLs and scopes proof to the root", () => {
    const xml = "<loc>https://premiere-pro-mcp.com/</loc><loc>https://premiere-pro-mcp.com/</loc>"
    expect(indexNowPayload(xml, key)).toMatchObject({ host: "premiere-pro-mcp.com", urlList: ["https://premiere-pro-mcp.com/"], keyLocation: "https://premiere-pro-mcp.com/indexnow-key.txt" })
  })
  it("rejects empty lists, foreign sites, preview parameters and invalid proof", () => {
    expect(() => indexNowPayload("", key)).toThrow()
    for (const url of ["http://premiere-pro-mcp.com/", "https://evil.example/", "https://premiere-pro-mcp.com/?design=test", "https://premiere-pro-mcp.com/tools", "https://premiere-pro-mcp.com/#faq"]) {
      expect(() => indexNowPayload(`<loc>${url}</loc>`, key)).toThrow()
    }
    expect(() => indexNowPayload("<loc>https://premiere-pro-mcp.com/</loc>", "bad")).toThrow()
  })
  it("distinguishes accepted notifications from indexing and rejects errors", () => {
    expect(indexNowOutcome(200)).toContain("indexing is not confirmed")
    expect(indexNowOutcome(202)).toContain("validation pending")
    for (const status of [400, 403, 422, 429, 500]) expect(() => indexNowOutcome(status)).toThrow()
  })
})
