import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(path, "utf8");

// The canonical claims registry (docs/claims-registry.*) and product-marketing context live in
// the premiere-pro-mcp product repository. This site keeps only the guards for its own surfaces.
describe("site claim guards", () => {
  it("rejects known stale or unsupported marketing phrases on governed site surfaces", () => {
    expect(read("lib/articles.ts")).not.toMatch(/49 (?:documented, )?capability-gated tools/i);
    expect(read("components/sections/hero.tsx")).not.toMatch(/editor approved/i);
  });

  it("keeps search landing pages free of universal privacy, undo and freshness promises", () => {
    for (const path of ["app/what-is-premiere-pro-mcp/page.tsx", "app/how-premiere-pro-mcp-works/page.tsx", "components/sections/faq.tsx"]) {
      const content = read(path);
      expect(content, path).not.toMatch(/never leave your computer|No project data or media is uploaded|Every (?:edit|action).*?(?:confirmation|undo)|All changes go through.*undo|new Date\(\)\.toISOString/);
    }
  });

  it("does not publish development-source counts next to published-package facts", () => {
    for (const path of ["lib/product.ts", "lib/articles.ts", "app/facts/page.tsx", "app/tools/page.tsx", "public/llms.txt", "public/llms-full.txt", "public/marketing-facts.json"]) {
      const content = read(path);
      expect(content, path).not.toMatch(/sourceCatalog|developmentSource|source_catalog_may_include_unreleased_work/);
      expect(content, path).not.toMatch(/development source/i);
    }
  });
});
