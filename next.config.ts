import type { NextConfig } from "next";
import { siteHeaders, siteRedirects } from "./lib/runtime/site-config";

// Server output (Vercel) rather than a static export: proxy.ts issues a
// per-request CSP nonce and selects the homepage variant, and
// app/api/landing-events handles experiment events.
const nextConfig: NextConfig = {
  trailingSlash: true,
  // proxy.ts adds the trailing slash itself so alias, index.html, and
  // hosted-MCP redirects each take a single hop.
  skipTrailingSlashRedirect: true,
  reactCompiler: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: process.cwd(),
  },
  headers: async () => siteHeaders(),
  redirects: async () => siteRedirects(),
};

export default nextConfig;
