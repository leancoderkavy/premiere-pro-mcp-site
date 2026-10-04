import assert from "node:assert/strict";
import { indexNowPayload, indexNowOutcome } from "./lib/indexnow.mjs";

const origin = "https://premiere-pro-mcp.com";
const read = async (path) => {
  const response = await fetch(`${origin}${path}`, { redirect: "error", signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `Production ${path} must return 200`);
  return response.text();
};
const [sitemap, key] = await Promise.all([read("/sitemap.xml"), read("/indexnow-key.txt")]);
const payload = indexNowPayload(sitemap, key.trim());
// Ensure submissions describe live indexable pages, never previews or redirects.
for (const url of payload.urlList) {
  const response = await fetch(url, { redirect: "error", signal: AbortSignal.timeout(30_000) });
  assert.equal(response.status, 200, `Page must return 200: ${url}`);
  assert(!/noindex/i.test(response.headers.get("x-robots-tag") ?? ""), `Noindex header: ${url}`);
  const html = await response.text();
  assert(!/<meta[^>]+name="(?:robots|googlebot)"[^>]+content="[^"]*noindex/i.test(html), `Noindex metadata: ${url}`);
  assert(html.includes(`<link rel="canonical" href="${url}"`), `Canonical mismatch: ${url}`);
}
if (process.argv.includes("--dry-run")) {
  console.log(`IndexNow preview: ${payload.urlList.length} validated production URLs; nothing submitted.`);
} else {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(30_000),
  });
  console.log(`IndexNow: ${payload.urlList.length} URLs, HTTP ${response.status}, ${indexNowOutcome(response.status)}.`);
}
