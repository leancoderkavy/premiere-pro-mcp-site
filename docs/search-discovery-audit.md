# Search and AI discovery audit — October 3, 2026

Scope: product README and premiere-pro-mcp.com. Target intents: Premiere Pro MCP,
Adobe Premiere Pro MCP server, client setup, supported actions, and server comparison.

## Observed baseline

A public web search returned this site's docs and setup article, competing servers,
forks, and a third-party listing with an older tool count. This is a discovery sample,
not a Google position report. No authenticated Search Console performance export or
Bing Webmaster report was available for this audit, so no ranking uplift is claimed.
The site's committed facts match the integrity-verified premiere-pro-mcp@1.19.0 artifact.

## Changes

- README identifies the package/repository and links definition, setup, comparison,
  tools, and released evidence. FAQs explain client privacy and host outcome limits.
- Search landing pages qualify privacy, preview, undo, cost, and verification claims.
  Article JSON-LD uses real content dates and source citations, not a runtime timestamp.
  Removed an FAQ schema block whose questions did not match visible FAQs.
- Child routes explicitly complete Open Graph and Twitter metadata. Next.js shallow
  metadata merging previously dropped social artwork or inherited homepage Twitter text.
  Titles no longer receive a redundant site suffix when already complete.
- Generated AI references include package identity, definition and architecture links.
  Release-driven sitemap dates refresh product pages when published facts change.
- Comparison adds Higgsfield's published 0.1.3 README with dated attribution and separates
  package identities. Earlier pinned competitor sources keep their original review date.
- CI now runs the rendered SEO gate: all sitemap routes, canonicals, indexability,
  unique titles/descriptions, H1s, JSON-LD syntax, social cards, internal links, anchors,
  full server-rendered tool catalog, and generated AI references.

## Validation and limits

Local Node 24 validation: lint, 96 unit/content tests, production build, performance
budgets, pinned package integrity, and rendered SEO gate. The gate covers 33 canonical
pages and 2,104 internal links/anchors. It is also runnable against production:

```sh
SEO_ORIGIN=https://premiere-pro-mcp.com npm run seo:check
```

The existing npm audit gate reports a high-severity braces advisory
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), propagated through
dev tooling. At audit time npm reports no patched braces release (latest 3.0.3).
Do not downgrade Next.js tooling or disable the audit to hide this finding. CI runs
the failing audit as a separate job so functional checks still execute; audit failure
remains a failure of the overall workflow.

No new Premiere runtime claims, package release, fabricated reviews, keyword doorway
pages, or ranking guarantee. The site already provides robots.txt, sitemap.xml,
server-rendered content and primary-source release facts; retain those foundations.

## Measure outcomes

Use Search Console to compare the same query/page/device/country groups over complete
28-day windows: impressions, clicks, CTR and average position. Separate branded queries
from generic Premiere MCP queries. Track indexed canonical pages and selected canonical
URLs; record AI citations and referral visits as observations, not inferred rankings.
Do not change dates merely to imply freshness. Update comparisons when their actual
primary-source review changes.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features)
connects AI visibility to existing SEO foundations and states that eligibility does not
guarantee crawling, indexing, or appearance. llms.txt is a useful reference for consumers
that read it; its presence is not proof of a search or AI ranking benefit.
