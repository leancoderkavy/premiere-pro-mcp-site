import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"

/**
 * Homepage A/B experiment, ported from the former Fly server
 * (`src/homepage-experiment.ts` in the monorepo) to Web `Request`/`Response`
 * objects so it runs inside Next.js Proxy and Route Handlers.
 *
 * Privacy rules are unchanged: anonymous random identity per visitor, no
 * person profiles, GeoIP disabled, visitor IP never forwarded, DNT/GPC and
 * automated user agents excluded, and only allow-listed event parameters.
 */
export const HOMEPAGE_FLAG = "homepage-cinematic-2026"
export const HOMEPAGE_COOKIE = "premiere_homepage_v1"
export type HomepageVariant = "control" | "test"

const MAX_AGE = 60 * 60 * 24 * 30
export const MAX_EVENT_BODY_BYTES = 1024
const PARAMETER_VALUES: Record<string, readonly string[]> = {
  route: ["claude", "codex", "cursor", "vscode", "other", "cep_connector"],
  assistant: ["claude", "codex", "cursor", "vscode", "other"],
  location: ["hero", "navigation", "final_cta", "final-cta", "install", "demo"],
  destination: [
    "safe_connection_check",
    "workflow_starter_kit",
    "github",
    "claude",
    "codex",
    "cursor",
    "vscode",
    "other",
  ],
  demo: ["illustrated_workflow"],
}
const CONVERSION_EVENTS = new Set([
  "primary_cta_clicked",
  "onboarding_assistant_selected",
  "onboarding_download_started",
  "onboarding_safe_prompt_copied",
  "onboarding_advanced_opened",
  "onboarding_recovery_opened",
  "marketing_demo_played",
])
const ALLOWED_ORIGINS = [
  "https://premiere-pro-mcp.com",
  "https://www.premiere-pro-mcp.com",
  "https://premiere-pro-mcp.fly.dev",
]

type Assignment = {
  id: string
  variant: HomepageVariant
  issued: number
  exposed: boolean
  eligible: boolean
}
type Properties = Record<string, string | number | boolean>

export interface HomepageAnalytics {
  evaluate(id: string): Promise<unknown>
  /** Returns the delivery promise so callers can hand it to `waitUntil`/`after`. */
  capture(id: string, event: string, properties: Properties): Promise<void>
}

/** Keeps analytics delivery alive after the response (Proxy `waitUntil` / Next `after`). */
export type WaitUntil = (task: Promise<unknown>) => void
const detached: WaitUntil = (task) => {
  void task.catch(() => {})
}

export type AssignmentResult = {
  variant?: HomepageVariant
  setCookie?: string
}

export class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body too large")
    this.name = "RequestBodyTooLargeError"
  }
}

/** Reads at most `limit` bytes; rejects as soon as the stream exceeds it. */
export async function readBoundedBody(request: Request, limit: number): Promise<string> {
  const declared = Number(request.headers.get("content-length"))
  if (Number.isFinite(declared) && declared > limit) throw new RequestBodyTooLargeError()
  if (!request.body) return ""
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.byteLength
    if (received > limit) {
      await reader.cancel().catch(() => {})
      throw new RequestBodyTooLargeError()
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(received)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

export function homepageAnalyticsPermitted(headers: Headers): boolean {
  const dnt = headers.get("dnt")
  return (
    dnt !== "1" &&
    dnt !== "yes" &&
    headers.get("sec-gpc") !== "1" &&
    !/bot|crawl|spider|headless|preview|lighthouse/i.test(headers.get("user-agent") ?? "")
  )
}

/**
 * First-paint exposure, before React or WebGL, so the heavier treatment does
 * not drop enrolled visitors. Rendered with the request nonce by the layout.
 */
export function firstPaintExposureScript(variant: HomepageVariant): string {
  const payload = JSON.stringify({ event: "homepage_experiment_exposed", variant })
  return `(()=>{try{const n=navigator;if(document.visibilityState!=="visible")return;if(new URLSearchParams(location.search).has("design"))return;if(["1","yes"].includes(n.doNotTrack||"")||n.globalPrivacyControl)return;fetch("/api/landing-events",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"same-origin",keepalive:true,body:${JSON.stringify(payload)}})}catch{}})()`
}

export function isHomepageVariant(value: unknown): value is HomepageVariant {
  return value === "control" || value === "test"
}

/** Isolated from other telemetry: each visitor gets an anonymous identity. */
export class HomepageExperiment {
  private readonly decisions = new Map<string, { value: HomepageVariant | null; until: number }>()
  private readonly eventCounts = new Map<string, { count: number; until: number }>()
  private evaluations = 0

  constructor(
    private readonly client: HomepageAnalytics | undefined,
    private readonly secret: string,
    private readonly enabled: boolean,
  ) {}

  get active(): boolean {
    return this.enabled && this.secret.length >= 32 && Boolean(this.client)
  }

  private sign(payload: string): string {
    return createHmac("sha256", this.secret).update(payload).digest("base64url")
  }

  private capture(waitUntil: WaitUntil, id: string, event: string, properties: Properties) {
    waitUntil(this.client!.capture(id, event, properties).catch(() => {}))
  }

  /** Validates the signed assignment cookie from a `Cookie` header. */
  read(cookieHeader: string | null): Assignment | undefined {
    if (!this.active) return
    const token = String(cookieHeader ?? "")
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${HOMEPAGE_COOKIE}=`))
      ?.slice(HOMEPAGE_COOKIE.length + 1)
    if (!token || token.length > 220) return
    const [id, variant, issuedText, exposed, signature, extra] = token.split(".")
    if (
      extra ||
      !/^[0-9a-f-]{36}$/.test(id ?? "") ||
      !isHomepageVariant(variant) ||
      !/^[012]$/.test(exposed ?? "") ||
      !/^[A-Za-z0-9_-]{43}$/.test(signature ?? "")
    )
      return
    const issued = Number(issuedText)
    if (!Number.isSafeInteger(issued) || issued > Date.now() + 30_000 || Date.now() - issued > MAX_AGE * 1000)
      return
    const expected = Buffer.from(this.sign(`${id}.${variant}.${issuedText}.${exposed}`))
    const actual = Buffer.from(signature)
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return
    return { id, variant, issued, exposed: exposed === "1", eligible: exposed !== "2" }
  }

  private cookie(assignment: Assignment): string {
    const payload = `${assignment.id}.${assignment.variant}.${assignment.issued}.${assignment.eligible ? (assignment.exposed ? "1" : "0") : "2"}`
    // Secure is always set; browsers accept it on http://localhost for previews.
    return `${HOMEPAGE_COOKIE}=${payload}.${this.sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`
  }

  /** Variant for a homepage document request. Never throws or blocks longer than ~450 ms. */
  async assign(request: Pick<Request, "method" | "headers">, waitUntil: WaitUntil = detached): Promise<AssignmentResult> {
    if (!this.active || !homepageAnalyticsPermitted(request.headers) || request.method !== "GET") return {}
    const prior = this.read(request.headers.get("cookie"))
    // Preserve identity across a transient flag outage while revoking the
    // previous page's enrollment. A stale control cookie must not manufacture
    // exposure on an unassigned control fallback.
    const fallback = (): AssignmentResult =>
      prior ? { setCookie: this.cookie({ ...prior, eligible: false, issued: Date.now() }) } : {}
    const id = prior?.id ?? randomUUID()
    const cached = this.decisions.get(id)
    let variant: HomepageVariant | null = null
    if (cached && cached.until > Date.now()) variant = cached.value
    else {
      // The landing page must remain available during provider delays or bursts.
      if (this.evaluations >= 20) return fallback()
      this.evaluations++
      let timeout: ReturnType<typeof setTimeout> | undefined
      try {
        const result = await Promise.race([
          this.client!.evaluate(id),
          new Promise<undefined>((resolve) => {
            timeout = setTimeout(() => resolve(undefined), 450)
          }),
        ])
        if (isHomepageVariant(result)) variant = result
      } catch {
        /* Optional experimentation must never prevent a page response. */
      } finally {
        if (timeout) clearTimeout(timeout)
        this.evaluations--
      }
      if (this.decisions.size >= 5_000) this.decisions.delete(this.decisions.keys().next().value!)
      this.decisions.set(id, { value: variant, until: Date.now() + 60_000 })
    }
    if (!variant) return fallback()
    if (!prior) {
      this.capture(waitUntil, id, "homepage_experiment_assigned", {
        product: "premiere-pro-mcp",
        path: "/",
        variant,
        [`$feature/${HOMEPAGE_FLAG}`]: variant,
        $process_person_profile: false,
        $geoip_disable: true,
      })
    }
    return { variant, setCookie: this.cookie({ id, variant, issued: Date.now(), exposed: false, eligible: true }) }
  }

  /** `/api/landing-events` handler. Always answers without a body. */
  async handleEvent(request: Request, waitUntil: WaitUntil = detached): Promise<Response> {
    const end = (status: number, extra: Record<string, string> = {}) =>
      new Response(null, { status, headers: { "Cache-Control": "no-store", ...extra } })
    if (request.method !== "POST") return end(405, { Allow: "POST" })
    const assignment = this.read(request.headers.get("cookie"))
    if (!this.active || !assignment?.eligible || !homepageAnalyticsPermitted(request.headers)) return end(204)

    // Require browser same-origin JSON; no public cross-origin event collector.
    const origin = request.headers.get("origin")
    const allowedOrigins = new Set(ALLOWED_ORIGINS)
    const host = request.headers.get("host") ?? ""
    if (/^(localhost|127\.0\.0\.1)(:\d{1,5})?$/.test(host)) allowedOrigins.add(`http://${host}`)
    const fetchSite = request.headers.get("sec-fetch-site")
    if (!origin || !allowedOrigins.has(origin) || (fetchSite && fetchSite !== "same-origin")) return end(403)
    if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) return end(415)

    const existing = this.eventCounts.get(assignment.id)
    const rate = existing && existing.until > Date.now() ? existing : { count: 0, until: Date.now() + 60_000 }
    if (++rate.count > 40) return end(429)
    if (this.eventCounts.size >= 5_000 && !this.eventCounts.has(assignment.id))
      this.eventCounts.delete(this.eventCounts.keys().next().value!)
    this.eventCounts.set(assignment.id, rate)

    let body: unknown
    try {
      body = JSON.parse(await readBoundedBody(request, MAX_EVENT_BODY_BYTES))
    } catch (error) {
      return end(error instanceof RequestBodyTooLargeError ? 413 : 400)
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return end(400)
    const input = body as Record<string, unknown>
    if (input.variant !== assignment.variant || typeof input.event !== "string") return end(400)
    const props: Properties = {
      product: "premiere-pro-mcp",
      path: "/",
      variant: assignment.variant,
      [`$feature/${HOMEPAGE_FLAG}`]: assignment.variant,
      $process_person_profile: false,
      $geoip_disable: true,
    }
    if (input.event === "homepage_experiment_exposed") {
      // Emit only after the browser confirms visible rendering, never during assignment.
      if (!assignment.exposed)
        this.capture(waitUntil, assignment.id, "$experiment_exposure", {
          ...props,
          $feature_flag: HOMEPAGE_FLAG,
          $feature_flag_response: assignment.variant,
        })
      return end(204, { "Set-Cookie": this.cookie({ ...assignment, exposed: true }) })
    }
    if (!assignment.exposed) return end(409)
    if (!CONVERSION_EVENTS.has(input.event)) return end(400)
    const parameters = input.parameters
    if (parameters && typeof parameters === "object" && !Array.isArray(parameters)) {
      for (const key of Object.keys(PARAMETER_VALUES)) {
        const value = (parameters as Record<string, unknown>)[key]
        if (typeof value === "string" && PARAMETER_VALUES[key].includes(value)) props[key] = value
      }
    }
    this.capture(waitUntil, assignment.id, input.event, props)
    if (input.event === "onboarding_download_started" && ["claude", "cep_connector"].includes(String(props.route)))
      this.capture(waitUntil, assignment.id, "homepage_setup_downloaded", props)
    if (input.event === "onboarding_safe_prompt_copied")
      this.capture(waitUntil, assignment.id, "homepage_safe_prompt_copied", props)
    return end(204)
  }
}

type Env = Record<string, string | undefined>

/**
 * Minimal PostHog client over the public HTTP API (`/flags` and `/batch`).
 * Keeps the proxy bundle free of an SDK and never forwards visitor IPs or
 * headers: requests originate from the server with only the anonymous id.
 */
export function createPostHogHttpAnalytics(
  apiKey: string,
  host: string,
  fetchImpl: typeof fetch = fetch,
): HomepageAnalytics {
  const base = host.replace(/\/+$/, "")
  return {
    // Remote evaluation only; no `$feature_flag_called` event. Exposure is
    // acknowledged separately after visible rendering.
    evaluate: async (id) => {
      const response = await fetchImpl(`${base}/flags/?v=2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          distinct_id: id,
          flag_keys_to_evaluate: [HOMEPAGE_FLAG],
          person_properties: { product: "premiere-pro-mcp", surface: "homepage" },
          geoip_disable: true,
        }),
        signal: AbortSignal.timeout(400),
        cache: "no-store",
      })
      if (!response.ok) return undefined
      const result = (await response.json()) as {
        flags?: Record<string, { enabled?: boolean; variant?: string | null }>
        featureFlags?: Record<string, unknown>
      }
      const detailed = result.flags?.[HOMEPAGE_FLAG]
      if (detailed) return detailed.enabled ? (detailed.variant ?? true) : false
      return result.featureFlags?.[HOMEPAGE_FLAG]
    },
    capture: async (distinctId, event, properties) => {
      await fetchImpl(`${base}/batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: apiKey,
          batch: [
            {
              event,
              distinct_id: distinctId,
              uuid: randomUUID(),
              timestamp: new Date().toISOString(),
              properties: { ...properties, $lib: "premiere-pro-mcp-site", $geoip_disable: true },
            },
          ],
        }),
        signal: AbortSignal.timeout(3_000),
        cache: "no-store",
      })
    },
  }
}

export function createHomepageExperiment(env: Env = process.env): HomepageExperiment {
  let analytics: HomepageAnalytics | undefined
  if (
    env.HOMEPAGE_EXPERIMENT_ENABLED === "true" &&
    env.POSTHOG_API_KEY &&
    (env.HOMEPAGE_EXPERIMENT_SECRET?.length ?? 0) >= 32
  ) {
    analytics = createPostHogHttpAnalytics(env.POSTHOG_API_KEY, env.POSTHOG_HOST || "https://us.i.posthog.com")
  }
  return new HomepageExperiment(
    analytics,
    env.HOMEPAGE_EXPERIMENT_SECRET ?? "",
    env.HOMEPAGE_EXPERIMENT_ENABLED === "true",
  )
}
