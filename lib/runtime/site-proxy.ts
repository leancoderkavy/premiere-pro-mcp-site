import { NextResponse, type NextRequest } from "next/server"
import {
  type HomepageExperiment,
  type HomepageVariant,
  type WaitUntil,
} from "./homepage-experiment"
import {
  EXPOSURE_HEADER,
  NONCE_HEADER,
  buildContentSecurityPolicy,
  createScriptNonce,
} from "./security-headers"
import { canonicalRedirect } from "./site-routing"

/** Marks a request this proxy already handled; the value is a per-process secret. */
export const PROXY_PASS_HEADER = "x-site-proxy-pass"

export type SiteProxyOptions = {
  experiment: HomepageExperiment
  /** Random per process. `next start` re-runs Proxy for a rewritten path. */
  passToken: string
  waitUntil: WaitUntil
  development?: boolean
  nonce?: () => string
}

/** Document navigations only; RSC fetches and prefetches send `Sec-Fetch-Dest: empty`. */
function isDocumentRequest(request: NextRequest): boolean {
  if (request.nextUrl.searchParams.has("_rsc")) return false
  const destination = request.headers.get("sec-fetch-dest")
  return !destination || destination === "document"
}

/**
 * Port of the former Fly server's page handling: one-hop canonical redirects
 * (see site-routing.ts), per-request CSP nonce, homepage variant selection
 * without a redirect, preview `noindex`, and root/preview no-store caching.
 */
export async function handleSiteRequest(request: NextRequest, options: SiteProxyOptions): Promise<NextResponse> {
  // Second pass for our own rewrite: keep the first pass's nonce, variant,
  // and headers. A client cannot forge this without the process secret.
  if (request.headers.get(PROXY_PASS_HEADER) === options.passToken) return NextResponse.next()
  const url = request.nextUrl
  const pathname = url.pathname
  const redirect = canonicalRedirect(url, request.headers.get("host"))
  if (redirect) {
    // Proxy needs an absolute Location. Relative decisions resolve against
    // the request URL, which Next.js already normalized.
    const response = NextResponse.redirect(new URL(redirect.location, request.url), 308)
    if (redirect.cacheControl) response.headers.set("Cache-Control", redirect.cacheControl)
    return response
  }

  const nonce = (options.nonce ?? createScriptNonce)()
  const csp = buildContentSecurityPolicy({ scriptNonce: nonce, development: options.development })
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete(EXPOSURE_HEADER)
  requestHeaders.set(PROXY_PASS_HEADER, options.passToken)
  requestHeaders.set(NONCE_HEADER, nonce)
  // Next.js reads the nonce from this request header and applies it to its
  // own bootstrap scripts during dynamic rendering.
  requestHeaders.set("Content-Security-Policy", csp)

  const root = pathname === "/"
  const designParameter = url.searchParams.has("design")
  const preview = designParameter || pathname.startsWith("/design-preview")
  let variant: HomepageVariant | undefined
  let setCookie: string | undefined
  if (root && (request.method === "GET" || request.method === "HEAD")) {
    if (designParameter) variant = url.searchParams.get("design") === "test" ? "test" : "control"
    else if (isDocumentRequest(request)) {
      const assignment = await options.experiment.assign(request, options.waitUntil)
      variant = assignment.variant
      setCookie = assignment.setCookie
      // Exposure is acknowledged by a nonce'd first-paint script, never here.
      if (variant) requestHeaders.set(EXPOSURE_HEADER, variant)
    } else {
      // Client navigations reuse the signed assignment; they never enroll.
      const assignment = options.experiment.read(request.headers.get("cookie"))
      if (assignment?.eligible) variant = assignment.variant
    }
  }

  // Both variants are complete documents. Rewrite (never redirect) before
  // rendering so the control cannot flash, shift layout, or hydrate over the
  // treatment, and each variant keeps its own initial JavaScript.
  const response =
    root && variant === "test"
      ? NextResponse.rewrite(new URL("/design-preview/", request.url), { request: { headers: requestHeaders } })
      : NextResponse.next({ request: { headers: requestHeaders } })

  response.headers.set("Content-Security-Policy", csp)
  if (setCookie) response.headers.append("Set-Cookie", setCookie)
  if (preview) response.headers.set("X-Robots-Tag", "noindex, follow")
  // Every page carries a per-request nonce, so Next.js already marks HTML
  // `private, no-cache, no-store`; rewritten responses keep that value. The
  // root and previews state `private, no-store` explicitly as the former
  // server did: no cache may store a variant or a nonce.
  if (root || preview) response.headers.set("Cache-Control", "private, no-store")
  return response
}
