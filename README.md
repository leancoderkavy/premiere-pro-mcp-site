# premiere-pro-mcp.com

Marketing site for [MCP for Adobe Premiere Pro](https://github.com/leancoderkavy/premiere-pro-mcp),
built with Next.js 16. The product itself (the MCP server, CEP and UXP panels) lives in the
product repository; this repository only contains the website.

## Commands

Use Node.js 24 for local work (Node.js 20.19+ is the floor for the scripts).

| Task | Command |
| --- | --- |
| Install | `npm ci` |
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Unit and content tests | `npm test` |
| Production build (runs `prebuild` facts check) | `npm run build` |
| Sync facts from npm `latest` | `npm run facts:sync` |
| Sync facts for one version | `npm run facts:sync -- --version 1.2.3` |
| Check committed facts against npm `latest` | `npm run facts:check` |
| Check committed facts against their own npm version | `npm run facts:check:pinned` |
| Regenerate references from committed inputs | `npm run facts:generate` |
| Verify references match committed inputs (offline) | `npm run facts:verify` |

## How product facts flow

Every version, tool count, and compatibility fact on the site comes from the **published npm
package** `premiere-pro-mcp`. There are no development-source numbers.

1. `scripts/sync-package-facts.mjs` reads the npm registry, picks `dist-tags.latest` (or
   `--version`), downloads the tarball, and fails unless its sha512 matches `dist.integrity`.
2. From the verified tarball it reads `package/public-product-manifest.json` and
   `package/docs/supported-actions.md`, then writes:
   - `lib/published-release.json` (version, counts, compatibility, release date, provenance)
   - `data/supported-actions.md` (the published tool catalog, committed so builds are offline)
3. `scripts/generate-marketing-reference.mjs` turns those committed inputs plus
   `lib/workflow-kits.json` into `public/tool-catalog.json`, `public/marketing-facts.json`,
   `public/llms.txt`, and `public/llms-full.txt`. Do not hand-edit those outputs.
4. Pages read facts through `lib/product.ts` (`product.version`, `product.coreToolCount`, ...).
   Only the hand-written release history in `app/changelog/page.tsx` names versions literally;
   a test fails if the current version is hard-coded anywhere else.

`resources` is not in the package manifest; the sync carries the existing value forward.
`provenance.verifiedAt` only changes when the synced facts change. These facts describe the
package artifact; they are not a licensed Premiere host test.

## Automation

- `.github/workflows/ci.yml` (push and pull request to `main`): install, audit, lint, test,
  offline reference check, pinned npm facts check, build. A newer npm release does not fail CI.
- `.github/workflows/sync-facts.yml` (every 6 hours, manual dispatch, or `repository_dispatch`
  type `package-published` with optional `client_payload.version`): syncs facts; when files
  change it runs tests and the build, then commits `chore: sync published package facts to vX`
  to `main` as `github-actions[bot]`.

## Deployment

Production runs on Vercel at `https://premiere-pro-mcp.com` (apex canonical). The site is a
Next.js server build, not a static export: `proxy.ts` gives every page a per-request CSP
nonce and picks the homepage experiment variant, and `app/api/landing-events` records
experiment events. The hosted MCP server stays on `https://premiere-pro-mcp.fly.dev`; this
site never serves `/mcp`.

Vercel settings:

- Framework preset Next.js, default build command (`npm run build`), Node.js 24.
- Domains: `premiere-pro-mcp.com` as primary, `www.premiere-pro-mcp.com` redirecting to it.
  `proxy.ts` also redirects `www` to the apex (308) if the domain reaches the app.

Environment variables (server-only unless prefixed `NEXT_PUBLIC_`; see `.env.example`):

| Name | Purpose |
| --- | --- |
| `HOMEPAGE_EXPERIMENT_ENABLED` | `true` turns on the `homepage-cinematic-2026` experiment. Anything else serves the control and never contacts PostHog from the server. |
| `HOMEPAGE_EXPERIMENT_SECRET` | HMAC key (32+ characters) that signs the `premiere_homepage_v1` assignment cookie. Rotating it resets every assignment. |
| `POSTHOG_API_KEY` | PostHog project API key used server-side for flag evaluation (`/flags`) and experiment events (`/batch`). |
| `POSTHOG_HOST` | PostHog ingestion host. Default `https://us.i.posthog.com`. |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Optional overrides for the browser analytics loader (`public/analytics.js`). Build-time values. |

The experiment is active only when `HOMEPAGE_EXPERIMENT_ENABLED=true`, `POSTHOG_API_KEY` is
set, and the secret has at least 32 characters. Visitors sending DNT or GPC, and automated
user agents, are never assigned. Events carry an anonymous random id, no IP address, no
person profile (`$process_person_profile: false`), and GeoIP disabled.

Runtime behavior carried over from the former Fly server:

- 308 redirects in one hop: missing trailing slash, `/index.html`, `www` and `fly.dev`
  hosts to the apex, and `/mcp`, `/health`, `/.well-known/oauth-protected-resource[/mcp]`
  to the Fly server.
- CSP with a fresh script nonce per page response; security headers on every response.
- `Cache-Control`: hashed `/_next/static` files immutable (Next.js), public files one day
  with a week of `stale-while-revalidate`, every HTML page `no-store` (nonce'd documents
  must never be reused).
- `?design=test|control` and `/design-preview/` are `noindex` previews that never enroll.

Checks after `next build`: `npm run performance:check` (runs as part of `npm run build`) and
`npm run seo:check` start `next start` on a free port and inspect the rendered HTML.
