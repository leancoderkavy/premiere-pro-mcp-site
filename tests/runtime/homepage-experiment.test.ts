import { afterEach, describe, expect, it, vi } from "vitest"
import {
  HOMEPAGE_FLAG,
  HomepageExperiment,
  createHomepageExperiment,
  createPostHogHttpAnalytics,
  firstPaintExposureScript,
  type HomepageAnalytics,
} from "@/lib/runtime/homepage-experiment"

// Ported from the monorepo's tests/homepage-experiment.test.ts, driving Web
// Request objects instead of a Node HTTP server.
afterEach(() => vi.restoreAllMocks())

const origin = "http://127.0.0.1:3160"
const baseHeaders = {
  "User-Agent": "Mozilla/5.0 Chrome/140",
  "Content-Type": "application/json",
  Origin: origin,
  "Sec-Fetch-Site": "same-origin",
  Host: "127.0.0.1:3160",
}

function fixture(evaluate: HomepageAnalytics["evaluate"] = async () => "test", enabled = true) {
  const capture = vi.fn<HomepageAnalytics["capture"]>(async () => {})
  const evaluator = vi.fn<HomepageAnalytics["evaluate"]>(evaluate)
  const experiment = new HomepageExperiment(
    { evaluate: evaluator, capture },
    "test-secret-for-homepage-experiments-only",
    enabled,
  )
  const get = async (extra: Record<string, string> = {}) => {
    const result = await experiment.assign(new Request(`${origin}/`, { headers: { ...baseHeaders, ...extra } }))
    return { text: result.variant ?? "fallback", setCookie: result.setCookie }
  }
  const post = (cookie: string, body: unknown, extra: Record<string, string> = {}) =>
    experiment.handleEvent(
      new Request(`${origin}/api/landing-events`, {
        method: "POST",
        headers: { ...baseHeaders, Cookie: cookie, ...extra },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    )
  const cookie = (value: { setCookie?: string } | Response) =>
    ("setCookie" in value ? value.setCookie : (value as Response).headers.get("set-cookie"))?.split(";")[0] ?? ""
  return { experiment, get, post, capture, evaluator, cookie }
}

describe("homepage experiment assignment and exposure", () => {
  it("revokes stale enrollment on a flag outage while preserving visitor identity", async () => {
    let now = Date.now()
    vi.spyOn(Date, "now").mockImplementation(() => now)
    const f = fixture(async () => "control")
    const assigned = f.cookie(await f.get())
    f.evaluator.mockResolvedValueOnce(false)
    now += 61_000
    const fallback = await f.get({ Cookie: assigned })
    expect(fallback.text).toBe("fallback")
    const inactive = f.cookie(fallback)
    await f.post(inactive, { event: "homepage_experiment_exposed", variant: "control" })
    await f.post(inactive, { event: "onboarding_safe_prompt_copied", variant: "control" })
    expect(f.capture.mock.calls.map((call) => call[1])).toEqual(["homepage_experiment_assigned"])
    now += 61_000
    expect((await f.get({ Cookie: inactive })).text).toBe("control")
    expect(new Set(f.evaluator.mock.calls.map(([id]) => id)).size).toBe(1)
  })

  it("keeps the anonymous assignment stable and records a diagnostic assignment without exposure", async () => {
    const f = fixture()
    const first = await f.get()
    expect(first.text).toBe("test")
    expect(first.setCookie).toContain("HttpOnly; Secure; SameSite=Lax")
    expect(first.setCookie).toContain("Max-Age=2592000")
    const second = await f.get({ Cookie: f.cookie(first) })
    expect(second.text).toBe("test")
    expect(f.evaluator).toHaveBeenCalledTimes(1)
    expect(f.capture).toHaveBeenCalledTimes(1)
    expect(f.capture.mock.calls[0][1]).toBe("homepage_experiment_assigned")
    expect(f.capture.mock.calls[0][2]).toMatchObject({ product: "premiere-pro-mcp", variant: "test" })
    expect(f.capture.mock.calls[0][2]).not.toHaveProperty("$feature_flag")
  })

  it("builds a first-paint exposure script that honors preview, DNT and GPC", () => {
    const script = firstPaintExposureScript("test")
    expect(script).toContain('\\"variant\\":\\"test\\"')
    expect(script).toContain("homepage_experiment_exposed")
    expect(script).toContain('has("design")')
    expect(script).toContain("globalPrivacyControl")
    expect(script).not.toMatch(/<\/?script/i)
  })

  it.each<Record<string, string>>([{ DNT: "1" }, { DNT: "yes" }, { "Sec-GPC": "1" }, { "User-Agent": "Googlebot" }, { "User-Agent": "HeadlessChrome" }])(
    "does not assign or identify opted-out or automated traffic: %j",
    async (headers) => {
      const f = fixture()
      const response = await f.get(headers)
      expect(response.text).toBe("fallback")
      expect(response.setCookie).toBeUndefined()
      expect(f.evaluator).not.toHaveBeenCalled()
    },
  )

  it.each([false, undefined, "unexpected"])("falls back without enrollment for an inactive or unknown flag: %s", async (value) => {
    const f = fixture(async () => value)
    const response = await f.get()
    expect(response.text).toBe("fallback")
    expect(response.setCookie).toBeUndefined()
  })

  it("bounds provider delays and tolerates errors", async () => {
    const f = fixture(() => new Promise(() => {}))
    const started = performance.now()
    expect((await f.get()).text).toBe("fallback")
    expect(performance.now() - started).toBeLessThan(1000)
    const broken = fixture(async () => {
      throw new Error("offline")
    })
    expect((await broken.get()).text).toBe("fallback")
  })

  it("records the rendered variant, then a download conversion under the same visitor", async () => {
    const f = fixture()
    const assigned = f.cookie(await f.get())
    const early = await f.post(assigned, {
      event: "onboarding_download_started",
      variant: "test",
      parameters: { route: "claude" },
    })
    expect(early.status).toBe(409)
    const exposure = await f.post(assigned, { event: "homepage_experiment_exposed", variant: "test" })
    expect(exposure.status).toBe(204)
    expect(exposure.headers.get("cache-control")).toBe("no-store")
    const enrolled = f.cookie(exposure)
    const conversion = await f.post(enrolled, {
      event: "onboarding_download_started",
      variant: "test",
      parameters: { route: "claude", prompt: "private footage", project: "secret" },
    })
    expect(conversion.status).toBe(204)
    const calls = f.capture.mock.calls
    expect(calls.map((call) => call[1])).toEqual([
      "homepage_experiment_assigned",
      "$experiment_exposure",
      "onboarding_download_started",
      "homepage_setup_downloaded",
    ])
    expect(new Set(calls.map((call) => call[0])).size).toBe(1)
    expect(calls[0][2]).not.toHaveProperty("$feature_flag")
    expect(calls[1][2]).toMatchObject({
      $feature_flag: HOMEPAGE_FLAG,
      $feature_flag_response: "test",
      $process_person_profile: false,
      $geoip_disable: true,
    })
    expect(JSON.stringify(calls)).not.toMatch(/private footage|secret|prompt|project/)
    await f.post(enrolled, { event: "homepage_experiment_exposed", variant: "test" })
    expect(f.capture).toHaveBeenCalledTimes(4)
  })

  it("does not mistake guided setup links for downloads", async () => {
    const f = fixture(async () => "control")
    const first = f.cookie(await f.get())
    const enrolled = f.cookie(await f.post(first, { event: "homepage_experiment_exposed", variant: "control" }))
    await f.post(enrolled, { event: "onboarding_download_started", variant: "control", parameters: { route: "cursor" } })
    expect(f.capture.mock.calls.map((call) => call[1])).not.toContain("homepage_setup_downloaded")
    await f.post(enrolled, { event: "onboarding_safe_prompt_copied", variant: "control" })
    expect(f.capture.mock.calls.map((call) => call[1])).toContain("homepage_safe_prompt_copied")
  })

  it("rejects wrong variants, tampering, cross-origin requests, and oversized bodies", async () => {
    const f = fixture()
    const assigned = f.cookie(await f.get())
    const body = { event: "homepage_experiment_exposed", variant: "test" }
    expect((await f.post(assigned, { ...body, variant: "control" })).status).toBe(400)
    expect((await f.post(assigned, body, { Origin: "https://elsewhere.example" })).status).toBe(403)
    expect((await f.post(assigned, body, { "Sec-Fetch-Site": "cross-site" })).status).toBe(403)
    expect((await f.post(assigned.replace(".test.", ".control."), body)).status).toBe(204)
    expect((await f.post(assigned, { ...body, junk: "x".repeat(2000) })).status).toBe(413)
    expect((await f.post(assigned, "not json")).status).toBe(400)
    expect((await f.post(assigned, [body])).status).toBe(400)
    expect((await f.post(assigned, body, { "Content-Type": "text/plain" })).status).toBe(415)
    expect((await f.post(assigned, body, { "Sec-GPC": "1" })).status).toBe(204)
    expect(f.capture.mock.calls.map((call) => call[1])).toEqual(["homepage_experiment_assigned"])
  })

  it("rejects an oversized body even without a Content-Length header", async () => {
    const f = fixture()
    const assigned = f.cookie(await f.get())
    const chunk = new TextEncoder().encode("x".repeat(600))
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(chunk)
        controller.enqueue(chunk)
        controller.close()
      },
    })
    const response = await f.experiment.handleEvent(
      new Request(`${origin}/api/landing-events`, {
        method: "POST",
        headers: { ...baseHeaders, Cookie: assigned },
        body: stream,
        duplex: "half",
      } as RequestInit),
    )
    expect(response.status).toBe(413)
  })

  it("allows only POST and rate-limits a visitor", async () => {
    const f = fixture()
    const get = await f.experiment.handleEvent(new Request(`${origin}/api/landing-events`))
    expect(get.status).toBe(405)
    expect(get.headers.get("allow")).toBe("POST")
    const assigned = f.cookie(await f.get())
    const statuses: number[] = []
    for (let index = 0; index < 41; index++) {
      statuses.push((await f.post(assigned, { event: "homepage_experiment_exposed", variant: "test" })).status)
    }
    expect(statuses.slice(0, 40).every((status) => status === 204)).toBe(true)
    expect(statuses[40]).toBe(429)
  })

  it("does not contact PostHog when disabled or misconfigured", async () => {
    const f = fixture(async () => "test", false)
    expect((await f.get()).text).toBe("fallback")
    expect(f.evaluator).not.toHaveBeenCalled()
    expect(createHomepageExperiment({ HOMEPAGE_EXPERIMENT_ENABLED: "true", POSTHOG_API_KEY: "phc_x", HOMEPAGE_EXPERIMENT_SECRET: "short" }).active).toBe(false)
    expect(createHomepageExperiment({ HOMEPAGE_EXPERIMENT_ENABLED: "true", HOMEPAGE_EXPERIMENT_SECRET: "x".repeat(32) }).active).toBe(false)
    expect(createHomepageExperiment({ POSTHOG_API_KEY: "phc_x", HOMEPAGE_EXPERIMENT_SECRET: "x".repeat(32) }).active).toBe(false)
    expect(
      createHomepageExperiment({ HOMEPAGE_EXPERIMENT_ENABLED: "true", POSTHOG_API_KEY: "phc_x", HOMEPAGE_EXPERIMENT_SECRET: "x".repeat(32) }).active,
    ).toBe(true)
  })
})

describe("PostHog HTTP client", () => {
  it("evaluates only the homepage flag without GeoIP and reads v2 and legacy responses", async () => {
    const fetchImpl = vi.fn(async () =>
      Response.json({ flags: { [HOMEPAGE_FLAG]: { enabled: true, variant: "test" } } }),
    )
    const analytics = createPostHogHttpAnalytics("phc_key", "https://us.i.posthog.com/", fetchImpl as typeof fetch)
    expect(await analytics.evaluate("visitor")).toBe("test")
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe("https://us.i.posthog.com/flags/?v=2")
    expect(JSON.parse(String(init.body))).toEqual({
      api_key: "phc_key",
      distinct_id: "visitor",
      flag_keys_to_evaluate: [HOMEPAGE_FLAG],
      person_properties: { product: "premiere-pro-mcp", surface: "homepage" },
      geoip_disable: true,
    })
    fetchImpl.mockResolvedValueOnce(Response.json({ featureFlags: { [HOMEPAGE_FLAG]: "control" } }))
    expect(await analytics.evaluate("visitor")).toBe("control")
    fetchImpl.mockResolvedValueOnce(Response.json({ flags: { [HOMEPAGE_FLAG]: { enabled: false, variant: null } } }))
    expect(await analytics.evaluate("visitor")).toBe(false)
    fetchImpl.mockResolvedValueOnce(new Response("{}", { status: 503 }))
    expect(await analytics.evaluate("visitor")).toBeUndefined()
  })

  it("captures one anonymous event without visitor headers or person profiles", async () => {
    const fetchImpl = vi.fn(async () => Response.json({ status: 1 }))
    const analytics = createPostHogHttpAnalytics("phc_key", "https://eu.i.posthog.com", fetchImpl as typeof fetch)
    await analytics.capture("visitor", "primary_cta_clicked", { variant: "test", $process_person_profile: false })
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe("https://eu.i.posthog.com/batch/")
    expect(init.headers).toEqual({ "Content-Type": "application/json" })
    const body = JSON.parse(String(init.body))
    expect(body.api_key).toBe("phc_key")
    expect(body.batch).toHaveLength(1)
    expect(body.batch[0]).toMatchObject({
      event: "primary_cta_clicked",
      distinct_id: "visitor",
      properties: { variant: "test", $process_person_profile: false, $geoip_disable: true },
    })
    expect(JSON.stringify(body)).not.toMatch(/\$ip|x-forwarded|user-agent/i)
  })
})
