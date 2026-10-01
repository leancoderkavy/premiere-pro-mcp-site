import published from "./published-release.json"

const latestRelease = "https://github.com/leancoderkavy/premiere-pro-mcp/releases/latest"

// Every product fact describes the published npm package. scripts/sync-package-facts.mjs
// downloads and verifies that package, then writes lib/published-release.json.
export const product = {
  name: "MCP for Adobe Premiere Pro",
  version: published.version,
  releaseDate: published.releaseDate,
  coreToolCount: published.coreTools,
  defaultProfileToolCount: published.defaultProfileTools,
  connectedUxpToolCount: published.defaultProfileWithUxpTools,
  uxpAdditionalToolCount: published.uxpAdditionalTools,
  nodeVersion: published.nodeVersion,
  premiereCompatibility: published.premiereVersions,
  uxpMinimumVersion: published.uxpMinimumVersion,
  downloads: {
    // Send installers to GitHub so package-facts sync delays cannot pin old downloads.
    claudeBundle: latestRelease,
    signedCepConnector: latestRelease,
    releaseNotes: `https://github.com/leancoderkavy/premiere-pro-mcp/releases/tag/v${published.version}`,
  },
  links: {
    repository: "https://github.com/leancoderkavy/premiere-pro-mcp",
    latestRelease,
    npm: "https://www.npmjs.com/package/premiere-pro-mcp",
    issues: "https://github.com/leancoderkavy/premiere-pro-mcp/issues",
    readme: "https://github.com/leancoderkavy/premiere-pro-mcp#readme",
  },
} as const

export const safeFirstPrompt =
  "Safely check my Premiere connection with verify_premiere_connection. Make no changes."

export const projectIntakePreviewPrompt =
  "Evaluate this open Premiere project against our approved intake template. Return the path-redacted report and proposed organization actions. Do not change Premiere or persist the template."
