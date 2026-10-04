import { afterEach, describe, expect, it, vi } from "vitest"
import { GET } from "../app/indexnow-key.txt/route"

afterEach(() => vi.unstubAllEnvs())
describe("public IndexNow ownership proof", () => {
  it("fails closed when configuration is absent or invalid", () => {
    for (const key of ["", "bad", "invalid key with spaces"]) {
      vi.stubEnv("INDEXNOW_KEY", key)
      expect(GET().status).toBe(503)
    }
  })
  it("serves only configured proof with noindex and a bounded cache", async () => {
    vi.stubEnv("INDEXNOW_KEY", "public-test-ownership-token")
    const result = GET()
    expect(await result.text()).toBe("public-test-ownership-token")
    expect(result.headers.get("X-Robots-Tag")).toBe("noindex")
    expect(result.headers.get("Cache-Control")).toBe("public, max-age=300")
  })
})
