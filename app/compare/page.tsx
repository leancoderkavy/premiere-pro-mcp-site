import { pageMetadata } from "@/lib/seo"
import type { Metadata } from "next"
import { PublicPage } from "@/components/site/public-page"
import { HomeLink } from "@/components/ui/home-link"
import Link from "next/link"

export const metadata: Metadata = pageMetadata({
  title: "Best Premiere Pro MCP Servers: Compare Tools & Bridges",
  description: "Compare the leading Premiere Pro MCP servers by published tool count, bridge, platform, and project identity. Read the GitHub README evidence before you install.",
  alternates: { canonical: "/compare/" },
  openGraph: { title: "Best Premiere Pro MCP Servers: Compare Tools & Bridges", description: "A fair, source-linked comparison of Premiere Pro MCP servers, including tool counts, bridge requirements, and platform limits.", url: "/compare/", type: "article" },
})

const projects = [
  {
    name: "MCP for Adobe Premiere Pro",
    repository: "https://github.com/leancoderkavy/premiere-pro-mcp",
    toolCount: "441 core tools in v1.25.0; 96 additional tools with a compatible UXP connection",
    bridge: "CEP production bridge; authenticated UXP preview/additional surface",
    platform: "Windows and macOS; Premiere Pro 2020–2026 in the project README",
    fit: "A local-first project with a searchable catalog, capability-gated tools, and active maintenance.",
    note: "These are the v1.25.0 README figures, not a licensed-host success guarantee. Verify your own Premiere version, connector, and requested action.",
    sourceLabel: "Project README",
  },
  {
    name: "hetpatel-11 / Adobe_Premiere_Pro_MCP",
    repository: "https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP#readme",
    toolCount: "283 tools",
    bridge: "CEP is the supported production bridge; UXP is experimental",
    platform: "The README documents a local bridge for Premiere Pro and a Node.js install path",
    fit: "A smaller always-on MCP surface with search_tools/invoke_tool routing, context resources, and guided prompts.",
    note: "The tool count is the repository's published catalog claim. Its website is premiere-mcp.com, which is a different project and brand from this site.",
    sourceLabel: "GitHub README",
  },
  {
    name: "antipaster / Adobe-Premiere-Pro-MCP",
    repository: "https://github.com/antipaster/Adobe-Premiere-Pro-MCP#readme",
    toolCount: "170+ tools",
    bridge: "Node.js server over WebSocket to a CEP panel",
    platform: "Windows only; Premiere Pro 2023+ and Node.js 18+ in the README",
    fit: "A Windows-focused option with editing, effects, captions, export, and a batch installer.",
    note: "The README says 170+ rather than an exact count. Optional integrations and the exact host behavior should be tested on the user's machine.",
    sourceLabel: "GitHub README",
  },
  {
    name: "compimprove / adobe-premiere-mcp",
    repository: "https://github.com/compimprove/adobe-premiere-mcp#readme",
    toolCount: "284 tools",
    bridge: "CEP editing bridge; optional UXP helper for transcript reads",
    platform: "macOS and Windows validation described in the README; Premiere Pro 2020+",
    fit: "A fork-derived project with a broad catalog spanning editing, effects, captions, exports, and higher-level workflows.",
    note: "The README describes 284 exposed tools and identifies this repository separately. Treat its live-validation statements as that project's claims, not an independent benchmark.",
    sourceLabel: "GitHub README",
  },
] as const

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://premiere-pro-mcp.com/compare/#article",
      headline: "Best Premiere Pro MCP Servers: Compare Tools & Bridges",
      description: "A source-linked comparison of Premiere Pro MCP servers by published tool count, bridge, platform, and project identity.",
      url: "https://premiere-pro-mcp.com/compare/",
      dateModified: "2026-10-29",
      inLanguage: "en-US",
      citation: projects.map((project) => project.repository),
      mainEntityOfPage: "https://premiere-pro-mcp.com/compare/",
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://premiere-pro-mcp.com/compare/#breadcrumb",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "MCP for Adobe Premiere Pro", item: "https://premiere-pro-mcp.com/" },
        { "@type": "ListItem", position: 2, name: "Compare Premiere Pro MCP servers", item: "https://premiere-pro-mcp.com/compare/" },
      ],
    },
  ],
}

export default function ComparePage() {
  return (
    <PublicPage>
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <main id="main-content" className="min-h-screen bg-site-bg px-5 py-16 text-site-text sm:py-24">
          <article className="mx-auto max-w-5xl space-y-12">
            <nav aria-label="Breadcrumb" className="text-sm text-site-muted">
              <HomeLink href="/" className="hover:text-site-accent">MCP for Adobe Premiere Pro</HomeLink>{" "}
              <span aria-hidden="true">/</span> Compare
            </nav>
            <header className="border-b border-site-line pb-12">
              <p className="font-mono text-sm uppercase tracking-wide text-site-accent">README comparison · Updated October 29, 2026</p>
              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-6xl">Best Premiere Pro MCP servers, compared fairly.</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-site-muted">Tool count is a useful starting point, not proof that a licensed Premiere host will complete an operation. Compare the bridge, platform, project identity, and verification boundary before choosing a server.</p>
            </header>

            <section className="space-y-5" aria-labelledby="snapshot-heading">
              <h2 id="snapshot-heading" className="text-3xl font-semibold">The short answer</h2>
              <p className="leading-8 text-site-muted">For the broadest published catalog in this snapshot, start with <strong className="text-site-text">MCP for Adobe Premiere Pro</strong>: its v1.25.0 README lists 441 core tools and 96 additional tools when a compatible UXP connection is enabled. It is actively maintained and supports Windows and macOS. That does not make every tool equally available in every profile or Premiere build, so use the <a className="text-site-accent underline" href="/facts/">published release facts</a> and <a className="text-site-accent underline" href="/tools/">tool reference</a> for the current package before installing.</p>
              <p className="rounded-xl border border-site-line bg-site-panel p-5 leading-8 text-site-muted"><strong className="text-site-text">Important brand clarification:</strong> <code>premiere-mcp.com</code> belongs to the separate <a className="text-site-accent underline" href="https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP#readme">hetpatel-11 project</a>. This site is for <code>premiere-pro-mcp</code>, maintained at <a className="text-site-accent underline" href="https://github.com/leancoderkavy/premiere-pro-mcp">leancoderkavy/premiere-pro-mcp</a>. Check the repository and npm package name before copying a setup command.</p>
            </section>

            <section className="space-y-6" aria-labelledby="comparison-heading">
              <h2 id="comparison-heading" className="text-3xl font-semibold">Published project comparison</h2>
              <p className="text-site-muted">Counts and platform details below are transcribed from each linked GitHub README. They are not an independent benchmark, and the projects may change after this page is updated.</p>
              <div className="grid gap-6 lg:grid-cols-2">
                {projects.map((project, index) => (
                  <section key={project.name} className={`space-y-4 rounded-xl border p-6 ${index === 0 ? "border-site-accent bg-site-panel" : "border-site-line"}`}>
                    <div className="flex items-start justify-between gap-4"><h3 className="break-words text-2xl font-semibold">{project.name}</h3>{index === 0 ? <span className="shrink-0 rounded-full border border-site-accent px-2 py-1 text-xs font-semibold text-site-accent">This project</span> : null}</div>
                    <dl className="space-y-3 leading-7">
                      <div><dt className="font-semibold">Published tools</dt><dd className="text-site-muted">{project.toolCount}</dd></div>
                      <div><dt className="font-semibold">Bridge</dt><dd className="text-site-muted">{project.bridge}</dd></div>
                      <div><dt className="font-semibold">Platform</dt><dd className="text-site-muted">{project.platform}</dd></div>
                      <div><dt className="font-semibold">Good fit to evaluate</dt><dd className="text-site-muted">{project.fit}</dd></div>
                    </dl>
                    <p className="border-t border-site-line pt-4 text-sm leading-6 text-site-muted">{project.note}</p>
                    <a className="text-site-accent underline" href={project.repository}>Read the {project.sourceLabel}</a>
                  </section>
                ))}
              </div>
            </section>

            <section className="space-y-5" aria-labelledby="test-heading">
              <h2 id="test-heading" className="text-3xl font-semibold">How to choose without trusting a number</h2>
              <ol className="list-decimal space-y-3 pl-6 leading-8 text-site-muted"><li>Match the repository and package name to your client configuration.</li><li>Confirm your operating system, Premiere version, and CEP or UXP bridge requirements.</li><li>Start with a read-only connection check on a disposable project.</li><li>Run the exact workflow you need, then inspect Premiere and the saved project for readback evidence.</li></ol>
            </section>

            <section className="space-y-5" aria-labelledby="setup-heading">
              <h2 id="setup-heading" className="text-3xl font-semibold">Setup guides by AI client</h2>
              <p className="leading-8 text-site-muted">Once you&apos;ve chosen a server, follow the setup guide for your AI assistant. Each guide covers the MCP configuration, connector installation, and connection verification for that specific client.</p>
              <ul className="grid gap-3 sm:grid-cols-2">
                <li><Link className="block rounded-lg border border-site-line bg-site-panel p-4 text-site-accent transition-colors hover:border-site-accent" href="/blog/claude-desktop-premiere-pro-mcp-setup/"><span className="font-semibold">Claude Desktop</span> <span className="text-site-muted">→</span></Link></li>
                <li><Link className="block rounded-lg border border-site-line bg-site-panel p-4 text-site-accent transition-colors hover:border-site-accent" href="/blog/windsurf-premiere-pro-mcp-setup/"><span className="font-semibold">Windsurf IDE</span> <span className="text-site-muted">→</span></Link></li>
                <li><Link className="block rounded-lg border border-site-line bg-site-panel p-4 text-site-accent transition-colors hover:border-site-accent" href="/blog/cursor-premiere-pro-mcp-setup/"><span className="font-semibold">Cursor</span> <span className="text-site-muted">→</span></Link></li>
                <li><Link className="block rounded-lg border border-site-line bg-site-panel p-4 text-site-accent transition-colors hover:border-site-accent" href="/blog/codex-premiere-pro-mcp-setup/"><span className="font-semibold">Codex</span> <span className="text-site-muted">→</span></Link></li>
              </ul>
              <p className="leading-8 text-site-muted">Ready to evaluate this project? <a className="text-site-accent underline" href="/demo/">Watch the bounded workflow demo</a>, read the <a className="text-site-accent underline" href="/docs/">installation guide</a>, or search the <a className="text-site-accent underline" href="/tools/">tool catalog</a>.</p>
            </section>
          </article>
        </main>
      </>
    </PublicPage>
  )
}
