# Search discovery follow-up — October 4, 2026

The previous README and site discovery changes remain merged. This follow-up targets
remaining source-backed gaps rather than repeating those edits.

## Measurements and limits

Ahrefs' latest completed crawl is September 29, before the latest deployment: health
score 98, 63 internal URLs, one URL with errors, 25 with warnings and 35 with notices.
Its issue list includes an oversized workflow PNG, schema notices on the homepage,
long titles/descriptions and changed pages not submitted to IndexNow. The crawl is a
historical baseline, not a fresh production score.

The verified project has no Rank Tracker keywords. Search Console queries for September
4–October 1 return "No GSC data available for the requested date range". Ahrefs' US
organic-keyword query for October 4 returns an empty result. This does not prove zero
search visibility, zero traffic, or a particular rank. Public search results include
this site, competitors, forks and older cached package facts. No ranking uplift or
competitor superiority is established by these measurements.

## Corrections

- Homepage FAQ text now identifies the exact package and qualifies approval, client
  privacy and separate Adobe/AI client costs. One FAQ graph uses the visible answers.
- `codeRepository` is on SoftwareSourceCode, linked to the application through
  `targetProduct`; it is no longer an invalid SoftwareApplication property. See
  [Schema.org](https://schema.org/codeRepository). Real review/rating evidence is not
  available: no fabricated ratings or guaranteed Google software rich-result eligibility.
- Blog pages use complete absolute SEO titles and route-specific social cards. Shortened
  the longest descriptions while keeping their task and verification limits.
- Existing automation article links exact published tool contracts and provides one
  read-only first prompt. Navigation, generated AI references and README point to it.
- Architecture page serves a 34,720-byte WebP delivery derivative instead of the
  1,191,398-byte workflow PNG (about 97% fewer bytes). Original artwork remains intact.
  A build-time budget protects the derivative.
- IndexNow ownership proof comes from production environment configuration, not Git.
  Submission validates live sitemap pages, canonicals and indexability before sending
  URLs to the participating engines. See [IndexNow protocol](https://www.indexnow.org/documentation).
  200 means received; 202 means ownership verification pending. Neither proves indexing.

## Verification

Node 24 product gate: 261 test files, 4,738 tests passed, one skipped. Website lint,
unit/content tests, production build, performance budgets and rendered SEO gate pass.
The rendered gate covers 33 canonical pages, social metadata, links, generated references,
one homepage FAQ entity and the source-code schema relationship.

The pre-existing unpatched braces advisory still causes the separate dependency audit
job to fail. Functional CI and deployment are reported independently; the advisory is
not suppressed or fixed by these changes. No new Premiere runtime or published-package
compatibility claim is made. Re-run the live SEO gate and IndexNow submission only once
production is ready, and distinguish notification receipt from search results.
