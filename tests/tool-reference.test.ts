import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildToolReference } from "../scripts/tool-reference-data.mjs";
import { filterTools } from "../lib/tool-reference";
import published from "../lib/published-release.json";
import kits from "../lib/workflow-kits.json";
import { safeFirstPrompt } from "../lib/product";

const markdown = readFileSync("data/supported-actions.md", "utf8");
const catalog = buildToolReference(markdown, published);

describe("published tool reference", () => {
  it("ships the full generated catalog with separate authority surfaces and provenance", () => {
    expect(JSON.parse(readFileSync("public/tool-catalog.json", "utf8"))).toEqual(catalog);
    expect(catalog.evidenceScope).toBe("published_npm_package");
    expect(catalog.packageVersion).toBe(published.version);
    expect(catalog.sourcePath).toBe(`docs/supported-actions.md in premiere-pro-mcp@${published.version}`);
    expect(catalog.hostVerification).toBe("not_established_by_catalogs");
    expect(catalog.tools.find((tool: { name: string }) => tool.name === "execute_extendscript")?.surface).toBe("restricted");
    expect(catalog.tools.find((tool: { name: string }) => tool.name === "verify_premiere_connection")?.surface).toBe("default");
    expect(buildToolReference(markdown.replaceAll("\r\n", "\n").replaceAll("\n", "\r\n"), published)).toEqual(catalog);
  });

  it("rejects duplicate, missing, or malformed tool rows rather than publishing an incomplete reference", () => {
    const row = markdown.split(/\r?\n/).find((line) => line.startsWith("| `"))!;
    expect(() => buildToolReference(`${markdown}\n${row}`, published)).toThrow("Duplicate");
    expect(() => buildToolReference(markdown.replace(row, ""), published)).toThrow("counts");
    expect(() => buildToolReference(markdown.replace(row, "| `broken-name` | Default profile | Single operation | Description |"), published)).toThrow("Unexpected");
    expect(() => buildToolReference(markdown.replace(row, row.replace("Default profile", "Unknown profile")), published)).toThrow("Unexpected");
  });

  it("preserves escaped table content and action modes", () => {
    const fixture = "| `inspect_test` | Default profile | `action`: `inspect`, `preview` | Inspect A \\| B. |";
    const result = buildToolReference(fixture, { version: "test", defaultProfileTools: 1, coreTools: 1, uxpAdditionalTools: 0, defaultProfileWithUxpTools: 1 });
    expect(result.tools[0]).toEqual({ name: "inspect_test", surface: "default", modes: "action: inspect, preview", description: "Inspect A | B." });
  });
});

describe("tool search", () => {
  const tools = [
    { name: "get_project_info", surface: "default", description: "Inspect project state", modes: "Single operation" },
    { name: "uxp_test", surface: "uxp", description: "Inspect project clips", modes: "action: audit, preview" },
    { name: "execute_extendscript", surface: "restricted", description: "Run a script", modes: "Single operation" },
  ];
  it("matches all words across names, descriptions, and modes without changing catalog order", () => {
    expect(filterTools(tools, "  PROJECT info ", "all")).toEqual([tools[0]]);
    expect(filterTools(tools, "get_project_info", "all")).toEqual([tools[0]]);
    expect(filterTools(tools, "project preview", "all")).toEqual([tools[1]]);
    expect(filterTools(tools, "", "all")).toEqual(tools);
  });
  it("intersects the query with availability and handles empty results and literal punctuation", () => {
    expect(filterTools(tools, "project", "default")).toEqual([tools[0]]);
    expect(filterTools(tools, "", "restricted")).toEqual([tools[2]]);
    expect(filterTools(tools, "project", "restricted")).toEqual([]);
    expect(filterTools(tools, "[.*", "all")).toEqual([]);
    expect(filterTools(tools, "", "unknown")).toEqual([]);
  });
});

describe("advertised first prompt", () => {
  // Replaces the monorepo e2e/repository.spec.ts live-server check: this site cannot start the
  // MCP server, so it checks the published package catalog instead.
  it("names a default-profile tool that exists in the published package", () => {
    const tool = catalog.tools.find((entry: { name: string }) => safeFirstPrompt.includes(entry.name));
    expect(tool?.name).toBe("verify_premiere_connection");
    expect(tool?.surface).toBe("default");
    for (const kit of kits) for (const name of kit.tools) {
      expect(catalog.tools.some((entry: { name: string }) => entry.name === name), `${kit.id}: ${name}`).toBe(true);
    }
  });
});
