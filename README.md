This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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
