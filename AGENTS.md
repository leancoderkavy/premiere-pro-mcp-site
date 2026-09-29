# premiere-pro-mcp.com site

Standalone Next.js 16 marketing site for MCP for Adobe Premiere Pro. The product (MCP server,
CEP and UXP panels, claims registry) lives in https://github.com/leancoderkavy/premiere-pro-mcp.
See README.md for commands.

## Product facts

- Every product fact comes from the published npm package `premiere-pro-mcp`. Do not add
  development-source counts or read the product repository at build time.
- Update facts with `npm run facts:sync` (verifies the npm tarball integrity). It writes
  `lib/published-release.json` and `data/supported-actions.md`, then regenerates
  `public/tool-catalog.json`, `public/marketing-facts.json`, `public/llms.txt`, and
  `public/llms-full.txt`. Never hand-edit those files.
- Read facts through `lib/product.ts`. Do not hard-code the current version; only the
  release history in `app/changelog/page.tsx` may name versions.
- Catalog counts are not proof of success in a licensed Premiere host. Keep that boundary in copy.

## Checks

Run `npm run lint`, `npm test`, and `npm run build` before calling work done.
`e2e/` Playwright specs need a local server harness and are not part of `npm test`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
