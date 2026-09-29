import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Starts the production Next.js server from an existing `next build` so
 * checks can read the HTML real visitors receive. Pages render per request
 * (CSP nonce), so there is no static `out/` directory to inspect.
 */
export const siteRoot = fileURLToPath(new URL("../../", import.meta.url));
export const buildDirectory = path.join(siteRoot, ".next");

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

export async function startSiteServer() {
  if (!existsSync(path.join(buildDirectory, "BUILD_ID"))) {
    throw new Error("Next.js build output is missing. Run next build first.");
  }
  const port = await freePort();
  const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
  const child = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: siteRoot,
    windowsHide: true,
    stdio: ["ignore", "ignore", "inherit"],
    // Checks inspect the control document; never contact analytics.
    env: { ...process.env, HOMEPAGE_EXPERIMENT_ENABLED: "false", POSTHOG_API_KEY: "" },
  });
  const origin = `http://127.0.0.1:${port}`;
  const close = () => new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", () => resolve());
    child.kill();
  });
  const deadline = Date.now() + 30_000;
  for (;;) {
    if (child.exitCode !== null) throw new Error(`next start exited with ${child.exitCode}`);
    try {
      const response = await fetch(`${origin}/robots.txt`);
      if (response.ok) break;
    } catch {
      /* not listening yet */
    }
    if (Date.now() > deadline) {
      await close();
      throw new Error("next start did not become ready within 30 seconds");
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return { origin, close };
}

/** Fetches a page and fails on anything other than 200 HTML. */
export async function fetchPage(origin, pathname) {
  const response = await fetch(new URL(pathname, origin), { redirect: "manual" });
  if (response.status !== 200) throw new Error(`${pathname}: expected 200, received ${response.status}`);
  return response.text();
}
