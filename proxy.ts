import { randomUUID } from "node:crypto"
import type { NextFetchEvent, NextRequest } from "next/server"
import { createHomepageExperiment } from "@/lib/runtime/homepage-experiment"
import { handleSiteRequest } from "@/lib/runtime/site-proxy"

// Node.js runtime (the Next.js 16 Proxy default): HMAC signing uses node:crypto.
// State such as the flag-decision cache is per instance and best effort.
const experiment = createHomepageExperiment()
const passToken = randomUUID()

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return handleSiteRequest(request, {
    experiment,
    passToken,
    waitUntil: (task) => event.waitUntil(task),
    development: process.env.NODE_ENV === "development",
  })
}

export const config = {
  matcher: [
    /*
     * Pages and hosted-MCP paths. Skip API routes, Next.js assets, and paths
     * ending in a file extension (public files, sitemap.xml, robots.txt,
     * llms.txt), which get static headers from next.config.ts. Legacy
     * static-export `index.html` URLs are matched so they consolidate.
     */
    "/((?!api/|_next/|.*\\.[A-Za-z0-9]+$).*)",
    "/index.html",
    "/:path*/index.html",
  ],
}
