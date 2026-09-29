import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  extractTarEntries,
  nodeVersionFromRange,
  releaseFromManifest,
  verifyIntegrity,
} from "../scripts/sync-package-facts.mjs";
import published from "../lib/published-release.json";

function tarEntry(name: string, content: string, type = "0") {
  const data = Buffer.from(content);
  const header = Buffer.alloc(512);
  header.write(name, 0, 100);
  header.write("0000644\0", 100);
  header.write(`${data.length.toString(8).padStart(11, "0")}\0`, 124);
  header.write(type, 156);
  header.write("ustar\0", 257);
  header.write("00", 263);
  const padded = Buffer.alloc(Math.ceil(data.length / 512) * 512);
  data.copy(padded);
  return Buffer.concat([header, padded]);
}
const tar = (...entries: Buffer[]) => Buffer.concat([...entries, Buffer.alloc(1024)]);

const manifest = {
  product: { npmPackage: "premiere-pro-mcp", version: "9.9.9" },
  compatibility: { node: ">=20.19.0", premiere: "2020–2026", uxpMinimumVersion: "25.6.0" },
  capabilitySurface: {
    registeredCoreTools: 10, defaultProfileTools: 8, authenticatedUxpAdditions: 3,
    defaultProfileWithUxp: 11, toolModules: 4, guidedWorkflows: 2,
  },
};
const input = {
  manifest, version: "9.9.9", gitHead: "a".repeat(40),
  tarball: "https://registry.npmjs.org/premiere-pro-mcp/-/premiere-pro-mcp-9.9.9.tgz",
  integrity: "sha512-test", publishedAt: "2030-01-02T03:04:05.000Z", resources: 4, verifiedAt: "2030-01-03",
};

describe("npm package facts sync", () => {
  it("fails hard unless the tarball matches the registry sha512 integrity", () => {
    const bytes = Buffer.from("package bytes");
    const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
    expect(() => verifyIntegrity(bytes, integrity)).not.toThrow();
    expect(() => verifyIntegrity(bytes, `sha1-abc ${integrity}`)).not.toThrow();
    expect(() => verifyIntegrity(Buffer.from("tampered"), integrity)).toThrow("integrity mismatch");
    expect(() => verifyIntegrity(bytes, "sha1-abc")).toThrow("no sha512");
  });

  it("extracts only the requested regular files, including pax long paths", () => {
    const paxRecord = "30 path=package/docs/long.md\n";
    const archive = tar(
      tarEntry("package/public-product-manifest.json", "{}"),
      tarEntry("PaxHeader", paxRecord, "x"),
      tarEntry("package/docs/ignored-short-name", "long file"),
      tarEntry("package/other.txt", "other"),
    );
    const entries = extractTarEntries(archive, ["package/public-product-manifest.json", "package/docs/long.md"]);
    expect(entries.get("package/public-product-manifest.json")?.toString()).toBe("{}");
    expect(entries.get("package/docs/long.md")?.toString()).toBe("long file");
    expect(() => extractTarEntries(archive, ["package/missing.md"])).toThrow("missing");
  });

  it("derives the Node.js floor from the engine range", () => {
    expect(nodeVersionFromRange(">=20.19.0")).toBe("20.19");
    expect(nodeVersionFromRange(">=22.1.3")).toBe("22.1.3");
    expect(() => nodeVersionFromRange("^20")).toThrow("Unsupported");
  });

  it("maps the package manifest onto the published-release shape", () => {
    const release = releaseFromManifest(input);
    expect(Object.keys(release)).toEqual(Object.keys(published));
    expect(Object.keys(release.provenance)).toEqual(Object.keys(published.provenance));
    expect(release).toMatchObject({
      version: "9.9.9", coreTools: 10, defaultProfileTools: 8, uxpAdditionalTools: 3, defaultProfileWithUxpTools: 11,
      toolModules: 4, resources: 4, guidedWorkflows: 2, releaseDate: "2030-01-02", nodeVersion: "20.19",
      provenance: { tag: "v9.9.9", commit: "a".repeat(40), verifiedAt: "2030-01-03" },
    });
  });

  it("rejects manifests that break the capability relationship or describe another package", () => {
    const broken = { ...manifest, capabilitySurface: { ...manifest.capabilitySurface, defaultProfileWithUxp: 12 } };
    expect(() => releaseFromManifest({ ...input, manifest: broken })).toThrow("capability count relationship");
    expect(() => releaseFromManifest({ ...input, manifest: { ...manifest, product: { ...manifest.product, npmPackage: "other" } } })).toThrow("does not describe");
    expect(() => releaseFromManifest({ ...input, version: "9.9.8" })).toThrow("does not match");
    expect(() => releaseFromManifest({ ...input, gitHead: "main" })).toThrow("commit SHA");
  });
});

describe("version pins", () => {
  // Only hand-written release history may name a specific version; everything else reads product.version.
  const allowed = new Set(["app/changelog/page.tsx"]);
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name).replaceAll("\\", "/");
    return statSync(path).isDirectory() ? files(path) : /\.(tsx?|mjs|json)$/.test(name) ? [path] : [];
  });

  it("does not hard-code the current published version outside the synced facts", () => {
    const pattern = new RegExp(`\\b${published.version.replaceAll(".", "\\.")}\\b`);
    const offenders = ["app", "components", "lib", "e2e"].flatMap(files)
      .filter((path) => !allowed.has(path) && path !== "lib/published-release.json")
      .filter((path) => pattern.test(readFileSync(path, "utf8")));
    expect(offenders).toEqual([]);
  });
});
