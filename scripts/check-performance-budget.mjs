import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { buildDirectory, fetchPage, siteRoot, startSiteServer } from "./lib/site-server.mjs";

// Public images ship unchanged from public/. Documents come from the
// production server because every page renders per request (CSP nonce).
const publicDirectory = path.join(siteRoot, "public");
const staticDirectory = path.join(buildDirectory, "static");

for (const [asset, budget] of [
  ["marketing/premiere-pro-mcp-workflow-1280.webp", 200_000],
  ["marketing/premiere-pro-mcp-mark-96.webp", 6_000],
  ["premiere-pro-mcp-demo-poster-640.webp", 16_000],
  ["premiere-pro-mcp-demo-poster-1280.webp", 35_000],
  ["premiere-pro-mcp-demo-live-v2-poster-640.webp", 16_000],
  ["premiere-pro-mcp-demo-live-v2-poster-1280.webp", 35_000],
  ["premiere-pro-mcp-ad-v3-poster-640.webp", 16_000],
  ["premiere-pro-mcp-ad-v3-poster-1280.webp", 35_000],
  ["marketing/sequence-v2.webp", 180_000],
  ["marketing/sequence-v2-mobile.webp", 45_000],
  ["marketing/cinema-coast-atlas.webp", 200_000],
  ["marketing/cinema-coast-atlas-mobile.webp", 50_000],
  ["marketing/collection-v2.webp", 180_000],
  ["marketing/collection-v2-mobile.webp", 45_000],
  ["marketing/finish-v2.webp", 220_000],
  ["marketing/finish-v2-mobile.webp", 50_000],
]) {
  const bytes = fs.statSync(path.join(publicDirectory, asset)).size;
  if (bytes > budget) throw new Error(`Image budget exceeded: ${asset}: ${bytes} > ${budget}`);
  console.log(`[landing-image] ${asset}: ${bytes} / ${budget} bytes`);
}

const server = await startSiteServer();
try {
  // The root serves the control here (experiment disabled); the treatment is
  // the same document as /design-preview/.
  for (const page of ["/", "/design-preview/"]) {
    const initialJavaScriptGzipBudget = 240_000;
    const homeDocumentGzipBudget = 75_000;

    const document = await fetchPage(server.origin, page);
    const scriptSources = [...document.matchAll(/<script[^>]+src="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((source) => source.startsWith("/_next/"));
    const uniqueSources = [...new Set(scriptSources)];

    let initialJavaScriptGzipBytes = 0;
    for (const source of uniqueSources) {
      const relative = source.split("?")[0].replace(/^\/_next\/static\//, "");
      const assetPath = path.resolve(staticDirectory, relative);
      if (
        !source.startsWith("/_next/static/") ||
        !assetPath.startsWith(`${staticDirectory}${path.sep}`) ||
        !fs.existsSync(assetPath)
      ) {
        throw new Error(`Referenced initial JavaScript asset is missing: ${source}`);
      }
      initialJavaScriptGzipBytes += gzipSync(fs.readFileSync(assetPath)).byteLength;
    }

    const homeDocumentGzipBytes = gzipSync(document).byteLength;
    const report = {
      page,
      initialJavaScriptGzipBytes,
      initialJavaScriptGzipBudget,
      homeDocumentGzipBytes,
      homeDocumentGzipBudget,
      initialScriptCount: uniqueSources.length,
    };

    console.log(`[landing-performance] ${JSON.stringify(report)}`);

    if (uniqueSources.length === 0) {
      throw new Error(`No initial JavaScript found for ${page}; the check would be meaningless.`);
    }
    if (initialJavaScriptGzipBytes > initialJavaScriptGzipBudget) {
      throw new Error(
        `Initial JavaScript gzip budget exceeded: ${initialJavaScriptGzipBytes} > ${initialJavaScriptGzipBudget}`,
      );
    }
    if (homeDocumentGzipBytes > homeDocumentGzipBudget) {
      throw new Error(
        `Home document gzip budget exceeded: ${homeDocumentGzipBytes} > ${homeDocumentGzipBudget}`,
      );
    }
  }
} finally {
  await server.close();
}
