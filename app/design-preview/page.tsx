import type { Metadata } from "next"
import { StudioHome } from "@/components/studio/studio-home"
import { LandingExperiment } from "@/components/analytics/landing-experiment"
import { HomeStructuredData } from "@/components/analytics/home-structured-data"

export const metadata: Metadata = {
  title: { absolute: "Adobe Premiere Pro MCP | Free, Independent & Local" },
  description:
    "Connect Claude, Cursor and Codex to supported Adobe Premiere Pro workflows with the free, independent premiere-pro-mcp server and local connector.",
  // Both assignments hydrate this document. Preview exclusion belongs in the
  // Node server's X-Robots-Tag header, so hydration cannot noindex a live root.
  alternates: { canonical: "https://premiere-pro-mcp.com/" }
}

export default function DesignPreview() {
  return (
    <>
      <HomeStructuredData />
      <LandingExperiment variant="test" />
      <StudioHome />
    </>
  )
}
