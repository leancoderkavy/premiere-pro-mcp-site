import { pageMetadata } from "@/lib/seo"
import { PublicPage } from "@/components/site/public-page"
import type { Metadata } from "next"
import Link from "next/link"
import { HomeLink } from "@/components/ui/home-link"
import { product } from "@/lib/product"
import { Package, ShieldCheck, Zap, Code, CheckCircle2, ArrowRight } from "lucide-react"

export const metadata: Metadata = pageMetadata({
  title: "What Is Premiere Pro MCP? Setup, Uses & Limits",
  description: "Learn what the premiere-pro-mcp package does, how Claude, Cursor and Codex connect to Adobe Premiere Pro, and which workflow and privacy limits to check.",
  alternates: { canonical: "/what-is-premiere-pro-mcp/" },
  openGraph: {
    title: "What Is Premiere Pro MCP? Setup, Uses & Limits",
    description: "Learn what Premiere Pro MCP is, how it works, and why editors use it for AI-assisted video editing workflows.",
    url: "/what-is-premiere-pro-mcp/",
    type: "article",
  },
})

const keyFeatures = [
  {
    icon: Zap,
    title: "AI-Powered Automation",
    description: "Automate timeline edits, effects, color correction, audio mixing, and exports using natural language prompts with your AI assistant.",
  },
  {
    icon: ShieldCheck,
    title: "Local-First Privacy",
    description: "The recommended server and Premiere bridge run on your computer. Your AI client may send prompts and tool results to its provider; review its data settings.",
  },
  {
    icon: CheckCircle2,
    title: "Preview Before Apply",
    description: "Use preview and confirmation flows where the tool provides them. Check action modes and approval requirements before authorizing an edit.",
  },
  {
    icon: Package,
    title: "Free & Open Source",
    description: "The server and connector are free under the MIT license. Adobe Premiere Pro and your chosen AI client have separate requirements and costs.",
  },
]

const useCases = [
  "Batch edit multiple clips with consistent timing and effects",
  "Apply color grading and Lumetri adjustments across sequences",
  "Automate repetitive timeline tasks like splitting and trimming",
  "Generate captions and manage audio levels programmatically",
  "Export projects with specific Adobe Media Encoder presets",
  "Organize project bins and manage media metadata",
]

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": "https://premiere-pro-mcp.com/what-is-premiere-pro-mcp/#article",
      headline: "What is Premiere Pro MCP?",
      description:
        "MCP for Adobe Premiere Pro is an independent local MCP server, published as premiere-pro-mcp, for supported inspection, editing and export workflows.",
      url: "https://premiere-pro-mcp.com/what-is-premiere-pro-mcp/",
      dateModified: "2026-10-03",
      inLanguage: "en-US",
      author: { "@type": "Organization", name: "MCP for Adobe Premiere Pro contributors", url: product.links.repository },
      citation: [product.links.readme, "https://premiere-pro-mcp.com/facts/", "https://premiere-pro-mcp.com/tools/"],
      mainEntityOfPage: "https://premiere-pro-mcp.com/what-is-premiere-pro-mcp/",
      about: {
        "@type": "SoftwareApplication",
        name: "Premiere Pro MCP",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "macOS, Windows",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://premiere-pro-mcp.com/what-is-premiere-pro-mcp/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: product.name,
          item: "https://premiere-pro-mcp.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "What is Premiere Pro MCP",
          item: "https://premiere-pro-mcp.com/what-is-premiere-pro-mcp/",
        },
      ],
    },

  ],
}

export default function WhatIsPremiereProMcpPage() {
  return (
    <PublicPage>
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main id="main-content" className="min-h-screen bg-site-bg px-5 py-16 text-site-text">
          <article className="mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="text-sm text-site-muted">
              <HomeLink href="/" className="hover:text-site-accent">
                MCP for Adobe Premiere Pro
              </HomeLink>{" "}
              <span aria-hidden="true">/</span> What is Premiere Pro MCP
            </nav>

            <header className="border-b border-site-line pb-12 pt-12">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                What is Premiere Pro MCP?
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-site-muted">
                Premiere Pro MCP (Model Context Protocol for Adobe Premiere Pro) is a{" "}
                <strong className="text-site-text">free, open-source bridge</strong> that connects AI
                assistants like Claude, Cursor, and Codex to supported Adobe Premiere Pro workflows.
                This independent project is published as premiere-pro-mcp. The recommended bridge runs
                locally; your AI client has its own data handling settings.
              </p>
            </header>

            <section className="border-b border-site-line py-12" aria-labelledby="overview-heading">
              <h2 id="overview-heading" className="text-3xl font-semibold">
                The simple explanation
              </h2>
              <p className="mt-5 leading-8 text-site-muted">
                Instead of manually clicking through Adobe Premiere Pro to edit videos, you can describe
                what you want to your AI assistant in plain English. Premiere Pro MCP translates those
                requests into structured tool calls. Review the tool contract, request a preview where
                available, and approve the proposed changes before starting an editing workflow.
              </p>
              <div className="mt-8 rounded-xl border border-site-line bg-site-panel p-6">
                <p className="text-sm font-semibold text-site-accent">Example workflow:</p>
                <ol className="mt-4 space-y-2 text-sm leading-7 text-site-muted">
                  <li className="flex gap-3">
                    <span className="font-bold text-site-accent">1.</span>
                    <span>
                      You tell Claude: &quot;Split all clips at 5 seconds and add a cross dissolve between
                      them&quot;
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-site-accent">2.</span>
                    <span>
                      Ask the assistant to inspect clip positions and show a plan before calling editing tools
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-site-accent">3.</span>
                    <span>You review the preview and confirm the changes</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-site-accent">4.</span>
                    <span>The edits are applied to your Premiere Pro timeline</span>
                  </li>
                </ol>
              </div>
            </section>

            <section className="border-b border-site-line py-12" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-3xl font-semibold">
                Key features
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {keyFeatures.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-site-line bg-site-panel p-6"
                  >
                    <feature.icon className="h-6 w-6 text-site-accent" strokeWidth={1.5} />
                    <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 leading-7 text-site-muted">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-b border-site-line py-12" aria-labelledby="use-cases-heading">
              <h2 id="use-cases-heading" className="text-3xl font-semibold">
                What can you automate?
              </h2>
              <p className="mt-5 leading-8 text-site-muted">
                Premiere Pro MCP provides {product.coreToolCount} core tools that cover the most common
                editing workflows:
              </p>
              <ul className="mt-6 space-y-3">
                {useCases.map((useCase) => (
                  <li key={useCase} className="flex gap-3 leading-7 text-site-detail">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-8 text-site-muted">
                Tool availability, preview support, and undo behavior depend on the operation and host.
                Save a duplicate project, inspect returned outcome states, and confirm changes in Premiere.
              </p>
            </section>

            <section className="border-b border-site-line py-12" aria-labelledby="how-heading">
              <h2 id="how-heading" className="text-3xl font-semibold">
                How does it work?
              </h2>
              <p className="mt-5 leading-8 text-site-muted">
                Premiere Pro MCP consists of two components that work together:
              </p>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-site-line bg-site-panel p-5">
                  <div className="flex items-start gap-3">
                    <Code className="mt-1 h-5 w-5 text-site-accent" />
                    <div>
                      <h3 className="font-semibold text-site-text">The MCP Server</h3>
                      <p className="mt-2 text-sm leading-6 text-site-muted">
                        Runs on your computer and communicates with your AI assistant. It provides
                        structured tools that the AI can use to interact with Premiere Pro.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-site-line bg-site-panel p-5">
                  <div className="flex items-start gap-3">
                    <Package className="mt-1 h-5 w-5 text-site-accent" />
                    <div>
                      <h3 className="font-semibold text-site-text">The Premiere Connector</h3>
                      <p className="mt-2 text-sm leading-6 text-site-muted">
                        A CEP plugin that runs inside Premiere Pro. It receives commands from the MCP
                        server and executes them in Premiere Pro, then returns the results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 leading-8 text-site-muted">
                The production CEP bridge uses private temporary files on your machine. The optional UXP
                bridge uses an authenticated WebSocket. AI client prompts and tool results follow your
                chosen provider&apos;s privacy settings.
              </p>
              <Link
                href="/how-premiere-pro-mcp-works/"
                className="mt-6 inline-flex items-center gap-2 font-medium text-site-accent hover:text-site-text"
              >
                Learn more about how it works <ArrowRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="border-b border-site-line py-12" aria-labelledby="who-heading">
              <h2 id="who-heading" className="text-3xl font-semibold">
                Who is it for?
              </h2>
              <p className="mt-5 leading-8 text-site-muted">
                Premiere Pro MCP is designed for video editors, content creators, and post-production
                teams who:
              </p>
              <ul className="mt-6 space-y-3 text-site-detail">
                <li className="flex gap-3 leading-7">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
                  <span>
                    Handle repetitive editing tasks that could be automated (batch edits, consistent
                    effects, etc.)
                  </span>
                </li>
                <li className="flex gap-3 leading-7">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
                  <span>
                    Want to experiment with AI-assisted editing without losing control or privacy
                  </span>
                </li>
                <li className="flex gap-3 leading-7">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
                  <span>
                    Need to maintain local-first workflows with sensitive footage or client projects
                  </span>
                </li>
                <li className="flex gap-3 leading-7">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
                  <span>
                    Already use AI assistants like Claude or Cursor and want to extend them to video
                    editing
                  </span>
                </li>
              </ul>
              <p className="mt-6 leading-8 text-site-muted">
                No coding experience is required. Once installed, you interact with Premiere Pro through
                natural language with your AI assistant.
              </p>
            </section>

            <section className="border-b border-site-line py-12" aria-labelledby="getting-started-heading">
              <h2 id="getting-started-heading" className="text-3xl font-semibold">
                Getting started
              </h2>
              <p className="mt-5 leading-8 text-site-muted">
                Ready to try AI-assisted video editing? The setup takes about 5 minutes:
              </p>
              <ol className="mt-6 space-y-4">
                <li className="flex gap-4 leading-7 text-site-detail">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/10 font-bold text-site-accent">
                    1
                  </span>
                  <div>
                    <strong className="text-site-text">Choose your AI assistant</strong>
                    <p className="mt-1 text-site-muted">
                      Claude Desktop (recommended), Cursor, VS Code, or any MCP-compatible client
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 leading-7 text-site-detail">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/10 font-bold text-site-accent">
                    2
                  </span>
                  <div>
                    <strong className="text-site-text">Install the components</strong>
                    <p className="mt-1 text-site-muted">
                      The MCP server for your AI assistant and the Premiere Pro connector
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 leading-7 text-site-detail">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-accent/10 font-bold text-site-accent">
                    3
                  </span>
                  <div>
                    <strong className="text-site-text">Verify the connection</strong>
                    <p className="mt-1 text-site-muted">
                      Send a safe first prompt that checks the connection without making any edits
                    </p>
                  </div>
                </li>
              </ol>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-violet-200 px-6 text-sm font-semibold text-black transition-colors hover:bg-white"
                >
                  View installation guide <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-site-line bg-site-panel px-6 text-sm font-semibold text-site-text transition-colors hover:border-site-accent"
                >
                  Back to home
                </Link>
              </div>
            </section>

            <section className="py-12" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-3xl font-semibold">
                Common questions
              </h2>
              <div className="mt-8 space-y-6">
                <details className="group rounded-xl border border-site-line bg-site-panel p-5">
                  <summary className="cursor-pointer text-base font-semibold text-site-text marker:content-none">
                    What does MCP stand for?
                  </summary>
                  <p className="mt-3 leading-7 text-site-muted">
                    MCP stands for Model Context Protocol, an open standard created by Anthropic for
                    connecting AI assistants to external tools and data sources. Premiere Pro MCP
                    implements this protocol specifically for Adobe Premiere Pro.
                  </p>
                </details>
                <details className="group rounded-xl border border-site-line bg-site-panel p-5">
                  <summary className="cursor-pointer text-base font-semibold text-site-text marker:content-none">
                    Is Premiere Pro MCP official Adobe software?
                  </summary>
                  <p className="mt-3 leading-7 text-site-muted">
                    No, Premiere Pro MCP is an independent open-source project and is not affiliated with,
                    endorsed by, or supported by Adobe. It uses CEP/ExtendScript and documented UXP APIs. Some CEP tools use the
                    undocumented QE DOM and are marked experimental in the tool reference.
                  </p>
                </details>
                <details className="group rounded-xl border border-site-line bg-site-panel p-5">
                  <summary className="cursor-pointer text-base font-semibold text-site-text marker:content-none">
                    Do I need coding experience to use it?
                  </summary>
                  <p className="mt-3 leading-7 text-site-muted">
                    No. Once installed, you interact with Premiere Pro through natural language prompts
                    with your AI assistant. The AI handles translating your requests into technical
                    commands. You just describe what you want to edit in plain English.
                  </p>
                </details>
                <details className="group rounded-xl border border-site-line bg-site-panel p-5">
                  <summary className="cursor-pointer text-base font-semibold text-site-text marker:content-none">
                    Can I use it with my existing Premiere Pro projects?
                  </summary>
                  <p className="mt-3 leading-7 text-site-muted">
                    Use a duplicate project on a supported host ({product.premiereCompatibility}) and verify
                    the connection first. Individual operations and undo behavior depend on the host
                    and tool; filesystem writes and exports are not universally reversible.
                  </p>
                </details>
              </div>
            </section>
          </article>
        </main>
      </>
    </PublicPage>
  )
}
