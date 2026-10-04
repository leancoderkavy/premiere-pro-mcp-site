const origin = "https://premiere-pro-mcp.com";

export function indexNowPayload(sitemap, key) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) throw new Error("Invalid IndexNow key");
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) => new URL(match[1]));
  if (urls.length === 0 || urls.length > 10_000) throw new Error("Expected 1-10,000 sitemap URLs");
  for (const url of urls) {
    if (url.origin !== origin || url.username || url.password || url.search || url.hash || !url.pathname.endsWith("/")) {
      throw new Error(`Only canonical production page URLs may be submitted: ${url}`);
    }
  }
  return { host: new URL(origin).host, key, keyLocation: `${origin}/indexnow-key.txt`, urlList: [...new Set(urls.map(String))] };
}

export function indexNowOutcome(status) {
  if (status === 200) return "received; indexing is not confirmed";
  if (status === 202) return "received; ownership validation pending; indexing is not confirmed";
  throw new Error(`IndexNow rejected submission (HTTP ${status})`);
}
