import http from "node:http";
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { gunzipSync } from "node:zlib";

// Runs the production Next.js server (`next build` output) against a local
// PostHog HTTP fixture. Never contacts production analytics.
const site = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.LANDING_E2E_PORT || 3160);
const fixturePort = Number(process.env.LANDING_E2E_POSTHOG_PORT || 3161);
await stat(path.join(site, ".next/BUILD_ID"));
let variant = "test";
let events = [];
let evaluations = [];

// A real HTTP fixture for the site's PostHog HTTP client, never production data.
const fixture = http.createServer(async (req, res) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const bytes = Buffer.concat(chunks);
  const raw = req.headers["content-encoding"] === "gzip" ? gunzipSync(bytes) : bytes;
  const body = JSON.parse(raw.toString() || "{}");
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/__state") {
    if (req.method === "POST") {
      variant = body.variant ?? "test";
      events = [];
      evaluations = [];
    }
    res.end(JSON.stringify({ variant, events, evaluations }));
  } else if (req.url?.startsWith("/flags") || req.url?.startsWith("/decide")) {
    evaluations.push(body);
    if (variant === "unavailable") {
      res.writeHead(503);
      res.end("{}");
    } else {
      res.end(JSON.stringify({ featureFlags: { "homepage-cinematic-2026": variant }, featureFlagPayloads: {} }));
    }
  } else {
    events.push(...(body.batch ?? (body.event ? [body] : [])));
    res.end(JSON.stringify({ status: 1 }));
  }
});
await new Promise((resolve, reject) => {
  fixture.once("error", reject);
  fixture.listen(fixturePort, "127.0.0.1", resolve);
});

const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: site,
  windowsHide: true,
  stdio: ["ignore", "inherit", "inherit"],
  env: {
    ...process.env,
    POSTHOG_API_KEY: "phc_local_homepage_e2e_only",
    POSTHOG_HOST: `http://127.0.0.1:${fixturePort}`,
    HOMEPAGE_EXPERIMENT_ENABLED: "true",
    HOMEPAGE_EXPERIMENT_SECRET: "local-homepage-e2e-signing-secret-only-32",
  },
});
server.on("exit", (code) => { fixture.close(); process.exitCode = code ?? 0; });
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => { server.kill("SIGTERM"); fixture.close(); });
}
