import { describe, expect, it, vi } from "vitest"
import { readPackument, readTarball } from "../scripts/sync-package-facts.mjs"

const packument = (versions: string[], latest = versions[versions.length - 1]) => ({
  "dist-tags": { latest },
  versions: Object.fromEntries(versions.map((version) => [version, { dist: {} }])),
})

describe("tarball propagation wait", () => {
  it("waits for tarball visibility after metadata is available", async () => {
    const cancel = vi.fn(async () => undefined)
    const success = { ok: true, status: 200 }
    const fetchResponse = vi.fn().mockResolvedValueOnce({ ok: false, status: 404, body: { cancel } }).mockResolvedValueOnce(success)
    const sleep = vi.fn(async () => undefined)
    await expect(readTarball("https://registry.npmjs.org/package.tgz", 20, { fetchResponse, sleep })).resolves.toBe(success)
    expect(cancel).toHaveBeenCalledOnce()
    expect(sleep).toHaveBeenCalledWith(20_000)
  })

  it.each([0, 20])("stops after the remaining %s-second wait budget", async (seconds) => {
    const fetchResponse = vi.fn(async () => ({ ok: false, status: 404 }))
    const sleep = vi.fn(async () => undefined)
    await expect(readTarball("https://registry.npmjs.org/package.tgz", seconds, { fetchResponse, sleep })).rejects.toThrow("HTTP 404")
    expect(fetchResponse).toHaveBeenCalledTimes(seconds / 20 + 1)
    expect(sleep).toHaveBeenCalledTimes(seconds / 20)
  })

  it("fails immediately for a response other than HTTP 404", async () => {
    const fetchResponse = vi.fn(async () => ({ ok: false, status: 403 }))
    const sleep = vi.fn()
    await expect(readTarball("https://registry.npmjs.org/package.tgz", 600, { fetchResponse, sleep })).rejects.toThrow("HTTP 403")
    expect(fetchResponse).toHaveBeenCalledOnce()
    expect(sleep).not.toHaveBeenCalled()
  })
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
