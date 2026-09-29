// Generates the public machine-readable references from committed, local inputs only:
//   lib/published-release.json  (written by scripts/sync-package-facts.mjs from npm)
//   data/supported-actions.md   (extracted from the same verified npm tarball)
//   lib/workflow-kits.json      (hand-maintained evaluation recipes)
// Run with --check to fail when a committed output no longer matches its inputs.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { buildToolReference } from "./tool-reference-data.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = async (name) => JSON.parse(await readFile(resolve(root, name), "utf8"));

export function assertCapabilityRelationship(published) {
  if (published.defaultProfileTools + published.uxpAdditionalTools !== published.defaultProfileWithUxpTools) {
    throw new Error("Invalid capability count relationship: defaultProfileTools + uxpAdditionalTools must equal defaultProfileWithUxpTools");
  }
}

export async function marketingReferenceFiles() {
  const [published, kits, catalogMarkdown] = await Promise.all([
    readJson("lib/published-release.json"),
    readJson("lib/workflow-kits.json"),
    readFile(resolve(root, "data/supported-actions.md"), "utf8"),
  ]);
  assertCapabilityRelationship(published);
  const toolReference = buildToolReference(catalogMarkdown, published);
  const origin = "https://premiere-pro-mcp.com";
  const facts = {
    schemaVersion: 1,
    name: "MCP for Adobe Premiere Pro",
    canonicalUrl: `${origin}/facts/`,
    publishedRelease: published,
    hostVerification: "not_established_by_catalogs",
  };
  const short = `# MCP for Adobe Premiere Pro

Free, MIT-licensed, local-first Model Context Protocol server for supported Adobe Premiere Pro workflows. Independent of Adobe. Premiere and the selected AI client have their own requirements and costs.

Preferred product name: **MCP for Adobe Premiere Pro**. Common shorthand: Premiere Pro MCP. npm package: premiere-pro-mcp.

## Published package

Current project release: ${published.version}.
Published v${published.version}: ${published.coreTools} core tools, ${published.defaultProfileTools} default-profile tools, and ${published.uxpAdditionalTools} authenticated capability-gated UXP additions (${published.defaultProfileWithUxpTools} connected tools).
These counts come from the downloaded npm artifact, whose integrity was verified against the registry. They do not prove a successful operation in a licensed Premiere host.
Release: https://github.com/leancoderkavy/premiere-pro-mcp/releases/tag/v${published.version}

## Start a workflow

Use ${origin}/workflows/ for three downloadable evaluation recipes and synthetic media. The kit is not a recorded live demo or a host-verified project. Project check is read-only; review frames write approved image files; product-spot starter ends at preview.

Install the Claude Desktop bundle and the separate Premiere connector through ${origin}/#install. Other clients use the documented local stdio route. Keep the assistant, server, connector, and Premiere on the same computer for the recommended setup.
First prompt: Safely check my Premiere connection with verify_premiere_connection. Make no changes.
The hosted endpoint does not automatically pair a visitor to their local Premiere. AI client data handling still applies; local-first is not a universal no-upload guarantee.

## References

- Recorded workflow, transcript, and verification receipt: ${origin}/demo/
- Source-linked Premiere MCP comparison: ${origin}/compare/
- Canonical facts: ${origin}/facts/
- Versioned evidence data: ${origin}/marketing-facts.json
- Workflow starter kit: ${origin}/workflows/
- Searchable tool reference for the published package: ${origin}/tools/
- Tool reference JSON: ${origin}/tool-catalog.json
- Setup and recovery: ${origin}/docs/troubleshooting/
- Claude setup: ${origin}/blog/claude-desktop-premiere-pro-mcp-setup/
- Codex setup: ${origin}/blog/codex-premiere-pro-mcp-setup/
- Cursor setup: ${origin}/blog/cursor-premiere-pro-mcp-setup/
- Claude Fable 5.1: ${origin}/blog/claude-fable-5-1-premiere-pro-mcp/
- MCP setup: ${origin}/blog/how-to-set-up-premiere-pro-mcp/
- Package comparison: ${origin}/blog/premiere-pro-mcp-vs-adobe-premiere-pro-mcp/
- AI in Premiere: ${origin}/blog/set-up-ai-in-premiere-pro/
- ChatGPT connection options: ${origin}/blog/chatgpt-premiere-pro-mcp/
- Workflow automation: ${origin}/blog/premiere-pro-workflow-automation/
- Project Intake: ${origin}/project-intake/
- Guides: ${origin}/blog/
- Documentation: ${origin}/docs/
- Source: https://github.com/leancoderkavy/premiere-pro-mcp
- npm: https://www.npmjs.com/package/premiere-pro-mcp
- Complete reference: ${origin}/llms-full.txt
- Legacy reference alias: ${origin}/llm.txt
`;
  const full = `${short}
## Compatibility and limitations

Current release: ${published.version}. Targets Premiere Pro ${published.premiereVersions} through CEP on Windows and macOS; UXP needs compatible ${published.uxpMinimumVersion}+ hosts and advertised capabilities. Node.js ${published.nodeVersion}+ is required for npm setup; the Claude bundle contains its server runtime.
Editorial context and planning tools do not themselves transcribe media, invoke an LLM, or apply edits. A preview is not an applied operation. A ready connection is not a completed edit. Playback and rendered output require separate inspection.

## Evaluation recipes

${kits.map((kit) => `### ${kit.title}

${kit.summary}
Output: ${kit.output}
${kit.boundary}
Availability: ${kit.availability}
Tools: ${kit.tools.join(", ")}
Prompt: ${kit.prompt}
Recipe: ${origin}/workflows/#${kit.id}
Guide: ${origin}${kit.guide}
`).join("\n")}
## Privacy and reporting

The kit uses synthetic media. Do not submit client projects, paths, prompts, transcripts, or tokens in public reports. Optional browser campaign events and local runtime events have no shared editor identifier. Downloads do not establish activation.
Privacy: ${origin}/privacy/
Security: https://github.com/leancoderkavy/premiere-pro-mcp/blob/main/SECURITY.md
`;
  return {
    "public/tool-catalog.json": `${JSON.stringify(toolReference, null, 2)}\n`,
    "public/marketing-facts.json": `${JSON.stringify(facts, null, 2)}\n`,
    "public/llms.txt": short,
    "public/llms-full.txt": full,
  };
}

/** Returns the relative paths whose committed content differs from the generated content. */
export async function staleReferenceFiles() {
  const stale = [];
  for (const [name, expected] of Object.entries(await marketingReferenceFiles())) {
    const current = await readFile(resolve(root, name), "utf8").catch(() => "");
    if (current.replace(/\r\n/g, "\n") !== expected) stale.push(name);
  }
  return stale;
}

export async function writeReferenceFiles() {
  for (const [name, content] of Object.entries(await marketingReferenceFiles())) {
    const target = resolve(root, name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
}

async function main() {
  if (process.argv.slice(2).some((arg) => arg !== "--check")) throw new Error("Only --check is supported");
  if (process.argv.includes("--check")) {
    const stale = await staleReferenceFiles();
    if (stale.length) throw new Error(`${stale.join(", ")} ${stale.length === 1 ? "is" : "are"} stale; run npm run facts:generate`);
    console.log("Marketing references match the committed package facts.");
  } else {
    await writeReferenceFiles();
    console.log("Generated marketing references.");
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
