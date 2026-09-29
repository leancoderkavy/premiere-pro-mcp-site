import { describe, expect, it, vi } from "vitest"
import { readPackument } from "../scripts/sync-package-facts.mjs"

const packument = (versions: string[], latest = versions[versions.length - 1]) => ({
  "dist-tags": { latest },
  versions: Object.fromEntries(versions.map((version) => [version, { dist: {} }])),
})

describe("readPackument registry wait", () => {
  it("waits for a requested version that the registry does not serve yet", async () => {
    const fetchJson = vi.fn()
      .mockResolvedValueOnce(packument(["1.18.5"]))
      .mockResolvedValueOnce(packument(["1.18.5"]))
      .mockResolvedValueOnce(packument(["1.18.5", "1.18.6"]))
    const sleep = vi.fn(async () => undefined)
    const result = await readPackument("1.18.6", 600, { fetchJson, sleep })
    expect(result.version).toBe("1.18.6")
    expect(fetchJson).toHaveBeenCalledTimes(3)
    expect(sleep).toHaveBeenCalledTimes(2)
  })

  it("gives up after the wait runs out", async () => {
    const fetchJson = vi.fn(async () => packument(["1.18.5"]))
    const sleep = vi.fn(async () => undefined)
    await expect(readPackument("9.9.9", 60, { fetchJson, sleep })).rejects.toThrow(/9\.9\.9 is not on the npm registry after waiting 60s/)
    expect(fetchJson).toHaveBeenCalledTimes(4)
  })

  it("never waits when following latest", async () => {
    const fetchJson = vi.fn(async () => packument(["1.18.5", "1.18.6"]))
    const sleep = vi.fn()
    await expect(readPackument(undefined, 600, { fetchJson, sleep })).resolves.toMatchObject({ version: "1.18.6" })
    expect(sleep).not.toHaveBeenCalled()
  })
})
