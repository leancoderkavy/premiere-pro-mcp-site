// Syncs every product fact from the PUBLISHED npm package `premiere-pro-mcp`.
//
//   node scripts/sync-package-facts.mjs                 write facts for npm `latest`
//   node scripts/sync-package-facts.mjs --version 1.2.3 write facts for a specific version
//   node scripts/sync-package-facts.mjs --check         verify committed facts match npm `latest`
//   node scripts/sync-package-facts.mjs --check --pinned
//        verify committed facts match the committed version on npm (ignores newer releases)
//
// The tarball is downloaded, its sha512 is checked against the registry's
// `dist.integrity`, and only then are `package/public-product-manifest.json` and
// `package/docs/supported-actions.md` read. Outputs:
//   lib/published-release.json, data/supported-actions.md, and the generated
//   references written by scripts/generate-marketing-reference.mjs.
// Node 20+; no dependencies beyond the standard library.
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { assertCapabilityRelationship, staleReferenceFiles, writeReferenceFiles } from "./generate-marketing-reference.mjs";

const PACKAGE = "premiere-pro-mcp";
const REGISTRY = "https://registry.npmjs.org";
const MANIFEST_ENTRY = "package/public-product-manifest.json";
const CATALOG_ENTRY = "package/docs/supported-actions.md";
const MAX_TARBALL_BYTES = 100 * 1024 * 1024;
const EVIDENCE = "Downloaded npm tarball public-product-manifest and supported-actions catalog, integrity verified; not a licensed-host test.";

const root = fileURLToPath(new URL("../", import.meta.url));
const releasePath = resolve(root, "lib/published-release.json");
const catalogPath = resolve(root, "data/supported-actions.md");

function parseArgs(argv) {
  const options = { check: false, pinned: false, version: undefined };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--check") options.check = true;
    else if (arg === "--pinned") options.pinned = true;
    else if (arg === "--version") options.version = argv[++index];
    else if (arg.startsWith("--version=")) options.version = arg.slice("--version=".length);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.version !== undefined && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(options.version)) {
    throw new Error("--version needs an exact semver version such as 1.18.5");
  }
  if (options.pinned && options.version !== undefined) throw new Error("Use either --pinned or --version, not both");
  return options;
}

async function fetchOk(url, accept) {
  const response = await fetch(url, { headers: { accept, "user-agent": "premiere-pro-mcp-site facts sync" } });
  if (!response.ok) throw new Error(`GET ${url} failed with HTTP ${response.status}`);
  return response;
}

/** Verify a Subresource-Integrity string (npm `dist.integrity`) against the downloaded bytes. */
export function verifyIntegrity(bytes, integrity) {
  const expected = String(integrity ?? "").split(/\s+/).find((entry) => entry.startsWith("sha512-"));
  if (!expected) throw new Error("Registry metadata has no sha512 integrity for the tarball");
  const actual = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  if (actual !== expected) throw new Error(`Tarball integrity mismatch: expected ${expected}, got ${actual}`);
}

/** Minimal ustar/pax reader: returns the requested regular-file entries as Buffers. */
export function extractTarEntries(tar, wanted) {
  const found = new Map();
  const text = (start, length) => {
    const field = tar.subarray(start, start + length);
    const end = field.indexOf(0);
    return field.subarray(0, end === -1 ? field.length : end).toString("utf8");
  };
  let offset = 0;
  let paxPath;
  let longName;
  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    const sizeField = text(offset + 124, 12).trim();
    if (!/^[0-7]*$/.test(sizeField)) throw new Error("Unsupported tar size field");
    const size = sizeField ? parseInt(sizeField, 8) : 0;
    const type = String.fromCharCode(header[156] || 48);
    const prefix = text(offset + 257, 6).startsWith("ustar") ? text(offset + 345, 155) : "";
    const headerName = prefix ? `${prefix}/${text(offset, 100)}` : text(offset, 100);
    const dataStart = offset + 512;
    if (dataStart + size > tar.length) throw new Error("Truncated tar entry");
    const data = tar.subarray(dataStart, dataStart + size);
    if (type === "x") {
      for (const record of data.toString("utf8").split("\n")) {
        const match = record.match(/^\d+ path=(.*)$/);
        if (match) paxPath = match[1];
      }
    } else if (type === "L") {
      longName = data.toString("utf8").replace(/\0+$/, "");
    } else if (type !== "g") {
      const name = paxPath ?? longName ?? headerName;
      if ((type === "0" || type === "\0") && wanted.includes(name)) {
        if (found.has(name)) throw new Error(`Duplicate tar entry ${name}`);
        found.set(name, Buffer.from(data));
      }
      paxPath = undefined;
      longName = undefined;
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  for (const name of wanted) if (!found.has(name)) throw new Error(`Tarball is missing ${name}`);
  return found;
}

/** ">=20.19.0" -> "20.19"; ">=22.1.3" -> "22.1.3". */
export function nodeVersionFromRange(range) {
  const match = String(range ?? "").trim().match(/^>=\s*v?(\d+)\.(\d+)(?:\.(\d+))?$/);
  if (!match) throw new Error(`Unsupported Node.js engine range: ${range}`);
  return match[3] && match[3] !== "0" ? `${match[1]}.${match[2]}.${match[3]}` : `${match[1]}.${match[2]}`;
}

const requireCount = (value, label) => {
  if (!Number.isInteger(value) || value < 0) throw new Error(`Manifest ${label} is not a non-negative integer`);
  return value;
};
const requireText = (value, label) => {
  if (typeof value !== "string" || !value.trim()) throw new Error(`Manifest ${label} is missing`);
  return value;
};

/** Map the verified package manifest onto the site's published-release.json shape. */
export function releaseFromManifest({ manifest, version, gitHead, tarball, integrity, publishedAt, resources, verifiedAt }) {
  if (manifest?.product?.npmPackage !== PACKAGE) throw new Error(`Manifest does not describe ${PACKAGE}`);
  if (manifest.product.version !== version) throw new Error(`Manifest version ${manifest.product.version} does not match ${version}`);
  if (!/^[a-f0-9]{40}$/.test(String(gitHead))) throw new Error(`Registry gitHead for ${version} is not a full commit SHA`);
  if (!/^\d{4}-\d{2}-\d{2}T/.test(String(publishedAt))) throw new Error(`Registry has no publish time for ${version}`);
  const surface = manifest.capabilitySurface ?? {};
  const compatibility = manifest.compatibility ?? {};
  const release = {
    version,
    coreTools: requireCount(surface.registeredCoreTools, "capabilitySurface.registeredCoreTools"),
    defaultProfileTools: requireCount(surface.defaultProfileTools, "capabilitySurface.defaultProfileTools"),
    uxpAdditionalTools: requireCount(surface.authenticatedUxpAdditions, "capabilitySurface.authenticatedUxpAdditions"),
    defaultProfileWithUxpTools: requireCount(surface.defaultProfileWithUxp, "capabilitySurface.defaultProfileWithUxp"),
    toolModules: requireCount(surface.toolModules, "capabilitySurface.toolModules"),
    resources: requireCount(resources, "resources (carried forward from lib/published-release.json)"),
    guidedWorkflows: requireCount(surface.guidedWorkflows, "capabilitySurface.guidedWorkflows"),
    premiereVersions: requireText(compatibility.premiere, "compatibility.premiere"),
    uxpMinimumVersion: requireText(compatibility.uxpMinimumVersion, "compatibility.uxpMinimumVersion"),
    releaseDate: publishedAt.slice(0, 10),
    nodeVersion: nodeVersionFromRange(compatibility.node),
    provenance: {
      tag: `v${version}`,
      commit: gitHead,
      tarball,
      integrity,
      verifiedAt,
      evidence: EVIDENCE,
    },
  };
  assertCapabilityRelationship(release);
  return release;
}

const withoutVerifiedAt = (release) => JSON.stringify({ ...release, provenance: { ...release.provenance, verifiedAt: undefined } });

async function readCurrentRelease() {
  return JSON.parse(await readFile(releasePath, "utf8"));
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const current = await readCurrentRelease();
  if (options.pinned) options.version = current.version;
  const packument = await (await fetchOk(`${REGISTRY}/${PACKAGE}`, "application/json")).json();
  const latest = packument["dist-tags"]?.latest;
  const version = options.version ?? latest;
  const metadata = packument.versions?.[version];
  if (!metadata) throw new Error(`${PACKAGE}@${version} is not on the npm registry`);
  const { tarball, integrity } = metadata.dist ?? {};
  if (!String(tarball).startsWith(`${REGISTRY}/`)) throw new Error(`Unexpected tarball URL: ${tarball}`);

  const tarballResponse = await fetchOk(tarball, "application/octet-stream");
  const bytes = Buffer.from(await tarballResponse.arrayBuffer());
  if (bytes.length > MAX_TARBALL_BYTES) throw new Error("Tarball is larger than expected");
  verifyIntegrity(bytes, integrity);
  const entries = extractTarEntries(gunzipSync(bytes, { maxOutputLength: 4 * MAX_TARBALL_BYTES }), [MANIFEST_ENTRY, CATALOG_ENTRY]);
  const manifest = JSON.parse(entries.get(MANIFEST_ENTRY).toString("utf8"));
  const catalog = entries.get(CATALOG_ENTRY).toString("utf8").replaceAll("\r\n", "\n");

  const today = new Date().toISOString().slice(0, 10);
  const release = releaseFromManifest({
    manifest, version, gitHead: metadata.gitHead, tarball, integrity,
    publishedAt: packument.time?.[version], resources: current.resources, verifiedAt: today,
  });
  // Re-verifying unchanged facts keeps the committed date so scheduled syncs do not churn.
  const factsChanged = withoutVerifiedAt(release) !== withoutVerifiedAt(current);
  if (!factsChanged) release.provenance.verifiedAt = current.provenance?.verifiedAt ?? today;
  const releaseText = `${JSON.stringify(release, null, 2)}\n`;
  const currentCatalog = await readFile(catalogPath, "utf8").then((text) => text.replaceAll("\r\n", "\n"), () => "");

  if (options.check) {
    const problems = [];
    if (current.version !== version) problems.push(`lib/published-release.json is v${current.version}; npm ${options.version ? "requested" : "latest"} is v${version}`);
    else if (factsChanged) problems.push("lib/published-release.json does not match the verified npm package");
    if (currentCatalog !== catalog) problems.push("data/supported-actions.md does not match the verified npm package");
    const stale = await staleReferenceFiles().catch((error) => [`cannot regenerate (${error.message})`]);
    if (stale.length) problems.push(`generated references are stale: ${stale.join(", ")}`);
    if (problems.length) {
      for (const problem of problems) console.error(`- ${problem}`);
      console.error("Run npm run facts:sync to update.");
      process.exitCode = 1;
      return;
    }
    console.log(`Package facts match ${PACKAGE}@${version} (integrity verified).`);
    return;
  }

  await mkdir(dirname(catalogPath), { recursive: true });
  await writeFile(catalogPath, catalog);
  await writeFile(releasePath, releaseText);
  await writeReferenceFiles();
  console.log(`${factsChanged ? "Synced" : "Re-verified"} package facts from ${PACKAGE}@${version} (integrity verified).`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
