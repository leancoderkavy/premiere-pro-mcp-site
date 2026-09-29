import { createHash } from "node:crypto";

const surfaces = {
  "Default profile": "default",
  "Connected UXP": "uxp",
  "Requires `unsafe-script`": "restricted",
};

/**
 * Build the public tool reference from the supported-actions catalog shipped in
 * the published npm package. Consumes only the generated tool rows and fails
 * closed if their format drifts or the counts disagree with the published facts.
 */
export function buildToolReference(markdown, published) {
  const normalized = markdown.replaceAll("\r\n", "\n");
  const tools = normalized.split("\n").filter((line) => line.startsWith("| `")).map((line) => {
    const match = line.match(/^\| `([a-z0-9_]+)` \| (.*?) \| (.*?) \| (.*?) \|$/);
    if (!match || !Object.hasOwn(surfaces, match[2]) || !match[4]) {
      throw new Error("Unexpected supported-actions tool row; update the reference generator.");
    }
    const plain = (text) => text.replaceAll("\\|", "|").replaceAll("`", "");
    return { name: match[1], surface: surfaces[match[2]], modes: plain(match[3]), description: plain(match[4]) };
  });
  if (new Set(tools.map((tool) => tool.name)).size !== tools.length) throw new Error("Duplicate tool reference name");
  const counts = Object.fromEntries(Object.values(surfaces).map((surface) => [surface, tools.filter((tool) => tool.surface === surface).length]));
  if (counts.default !== published.defaultProfileTools || counts.uxp !== published.uxpAdditionalTools ||
      counts.default + counts.restricted !== published.coreTools ||
      counts.default + counts.uxp !== published.defaultProfileWithUxpTools || tools.length === 0) {
    throw new Error("Tool reference counts do not match published package facts");
  }
  return {
    schemaVersion: 1,
    evidenceScope: "published_npm_package",
    packageVersion: published.version,
    sourcePath: `docs/supported-actions.md in premiere-pro-mcp@${published.version}`,
    sourceSha256: createHash("sha256").update(normalized).digest("hex"),
    hostVerification: "not_established_by_catalogs",
    counts,
    tools: tools.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0),
  };
}
