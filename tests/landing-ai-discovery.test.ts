import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

describe("landing AI and search discovery", () => {
  it("keeps machine-readable references discoverable and unambiguous", () => {
    const layout = read("app/layout.tsx");
    const home = read("app/page.tsx");
    const homeSchema = read("components/analytics/home-structured-data.tsx");
    const hero = read("components/sections/hero.tsx");
    const llms = read("public/llms.txt");
    const llmsFull = read("public/llms-full.txt");
    const llmAlias = read("public/llm.txt");

    expect(layout).toContain('href="/llms.txt"');
    expect(layout).toContain('href="/llms-full.txt"');
    expect(layout).toContain("Adobe Premiere Pro MCP | Free, Independent & Local");
    expect(home).toContain("<HomeStructuredData />");
    expect(read("app/design-preview/page.tsx")).toContain("<HomeStructuredData />");
    expect(homeSchema).toContain('alternateName: ["Premiere Pro MCP", "premiere-pro-mcp"]');
    expect(hero).toContain("Adobe Premiere Pro MCP:");
    expect(llms).toContain("Preferred product name: **MCP for Adobe Premiere Pro**");
    expect(llms).toContain("https://premiere-pro-mcp.com/facts/");
    expect(llmsFull).toContain("https://premiere-pro-mcp.com/llm.txt");
    expect(llmAlias).toContain("https://premiere-pro-mcp.com/llms.txt");
  });

  it("allows representative AI crawlers and refreshes release-backed product pages", () => {
    const robots = read("app/robots.ts");
    const sitemap = read("app/sitemap.ts");
    const facts = read("app/facts/page.tsx");
    const docs = read("app/docs/page.tsx");

    for (const userAgent of ["OAI-SearchBot", "GPTBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"]) {
      expect(robots).toContain(`"${userAgent}"`);
    }
    expect(sitemap).toContain("productContentDate");
    expect(facts).toContain("Premiere Pro MCP the same product");
    expect(facts).toContain("For accurate AI and search answers");
    expect(docs).toContain('dateModified: "2026-09-18"');
  });
});
