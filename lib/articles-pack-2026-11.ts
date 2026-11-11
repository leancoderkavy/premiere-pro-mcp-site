import type { Article } from "./article-types"
import { product, safeFirstPrompt } from "./product"
import { connectorSetup, localMcpConfig } from "./client-setup"

/**
 * Draft SEO guides for the Nov 16 – Dec 15, 2026 marketing pack.
 * Claims stay within tools documented in data/supported-actions.md for the
 * published npm package. Catalog counts are not licensed-host proof.
 */
export const novDec2026MarketingArticles: Article[] = [
  {
    slug: "automate-premiere-pro-with-ai",
    title: "Automate Premiere Pro with AI: A Local MCP Workflow That Stays Reviewable",
    seoTitle: "Automate Premiere Pro with AI (Local MCP)",
    description:
      "Automate Adobe Premiere Pro with an AI assistant through a local MCP server. Discover tools, preview edits, and verify results without giving up editorial control.",
    eyebrow: "Automate Premiere Pro with AI",
    publishedAt: "2026-11-16",
    modifiedAt: "2026-11-16",
    readingTime: "8 min read",
    workflowKit: "project-check",
    keywords: [
      "automate Premiere Pro with AI",
      "Premiere Pro AI automation",
      "AI assistant Premiere Pro",
      "Premiere Pro MCP automation",
      "local AI video editing",
    ],
    sections: [
      {
        heading: "What automation means here",
        paragraphs: [
          "Automating Premiere Pro with AI does not mean handing the timeline to a black box. With MCP for Adobe Premiere Pro, a compatible assistant (Claude Desktop, Cursor, Codex, Windsurf, and similar MCP clients) calls named tools on a local server. That server talks to your open Premiere session through a separate CEP connector, and optionally through an authenticated UXP panel when the host advertises those capabilities.",
          `Published v${product.version} registers ${product.coreToolCount} core tools. The default profile exposes ${product.defaultProfileToolCount} of them. A compatible UXP connection can advertise ${product.uxpAdditionalToolCount} additional tools. Those counts describe the published npm package; they are not proof that every operation succeeds in a licensed Premiere host.`,
        ],
        links: [
          { label: "Canonical product facts", href: "/facts/" },
          { label: "Searchable tool reference", href: "/tools/" },
        ],
      },
      {
        heading: "Start with a no-change connection check",
        paragraphs: [
          "Install the published package, the CEP connector, and your AI client on the same computer as Premiere. Open a disposable project with an active sequence. Ask the assistant for a read-only check before any edit.",
          "A successful check proves that the MCP server, the selected bridge, an open project, and an active sequence are reachable. It does not prove that a later edit, export, or UXP-only tool will succeed.",
        ],
        codeBlocks: [
          { label: "Safe first prompt", code: safeFirstPrompt },
          { label: "Install and diagnose the connector", code: connectorSetup },
        ],
        links: [
          { label: "How to set up Premiere Pro MCP", href: "/blog/how-to-set-up-premiere-pro-mcp/" },
          { label: "Troubleshooting checklist", href: "/docs/troubleshooting/" },
        ],
      },
      {
        heading: "Discover the tools for the job you actually have",
        paragraphs: [
          "Ask the assistant to call get_capabilities with a task keyword such as silence, captions, transcript, review frames, or export. Results report registration, backend support, authority requirements, and verification boundaries. Exact names rank first; this is lexical search, not semantic search.",
          "A listed tool is an advertisement for the current session. Host APIs, authority packs, and live preflight still apply. Prefer inspect and plan tools before mutating ones.",
        ],
        codeBlocks: [
          {
            label: "Compact discovery request",
            code: 'Call get_capabilities with {"tool_query":"silence","tool_limit":10}. Summarize registered tools, backends, and anything still unverified. Make no Premiere changes.',
          },
        ],
      },
      {
        heading: "Automate repeatable work, keep judgment with the editor",
        paragraphs: [
          "Strong first automations are bounded: sequence health reports, silence review plans, caption artifact builds, rough-cut scaffolds, beat-montage plans, export preflight, and review-frame packs. Creative pacing, performance selection, music taste, and brand decisions stay with the editor.",
          "Where a tool supports preview or a confirmation token, review the exact targets before apply. After a write, re-inspect timeline state. Exported frames support still-image review only; they are not playback, audio, or delivery proof.",
        ],
        bullets: [
          "Name the sequence, tracks, clips, time range, and no-change boundary in every mutating request.",
          "Use duplicate sequences or disposable projects for new recipes.",
          "Stop on failed or committed_unverified receipts instead of retrying blindly.",
          "Keep client media, paths, and tokens out of public reports.",
        ],
        links: [
          { label: "AI workflow checklist", href: "/blog/premiere-pro-ai-workflow-checklist/" },
          { label: "Evaluation recipes with synthetic media", href: "/workflows/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does AI automation upload my Premiere project?",
        answer:
          "The recommended setup keeps the MCP server, connector, and Premiere on one computer. Tool arguments and results still travel through the AI client to its model provider. Local-first is not a universal no-upload guarantee; review your client’s data settings.",
      },
      {
        question: "Can one prompt fully edit a video end to end?",
        answer:
          "Treat automation as a chain of inspect, plan, preview, apply, and verify steps. Broad creative rewrites are a poor first target. Bounded recipes with named targets and review gates are the supported path.",
      },
      {
        question: "Is this the same as Adobe’s built-in AI features?",
        answer:
          "No. MCP for Adobe Premiere Pro is an independent, MIT-licensed local bridge for compatible AI clients. Adobe’s native features remain separate products with their own requirements.",
      },
    ],
    resources: [
      { label: "What is Premiere Pro MCP?", href: "/what-is-premiere-pro-mcp/" },
      { label: "How Premiere Pro MCP works", href: "/how-premiere-pro-mcp-works/" },
      { label: "Install path on the homepage", href: "/#install" },
      { label: "Source repository", href: product.links.repository },
    ],
    relatedSlugs: [
      "how-to-set-up-premiere-pro-mcp",
      "premiere-pro-ai-workflow-checklist",
      "premiere-pro-workflow-automation",
    ],
  },
  {
    slug: "premiere-pro-mcp-setup-claude-cursor",
    title: "Premiere Pro MCP Setup with Claude or Cursor",
    seoTitle: "Premiere Pro MCP Setup: Claude Desktop & Cursor",
    description:
      "Set up Premiere Pro MCP with Claude Desktop or Cursor: install the published npm package, connect the CEP panel, and verify the local bridge before editing.",
    eyebrow: "Claude and Cursor setup",
    publishedAt: "2026-11-18",
    modifiedAt: "2026-11-18",
    readingTime: "7 min read",
    keywords: [
      "Premiere Pro MCP setup",
      "Premiere Pro MCP Claude",
      "Premiere Pro MCP Cursor",
      "Claude Desktop Premiere Pro",
      "Cursor Premiere Pro MCP",
    ],
    sections: [
      {
        heading: "Pick one local client and one Premiere machine",
        paragraphs: [
          "Claude Desktop and Cursor both speak MCP. For Premiere Pro MCP, run the client, the local server process, the CEP connector, and Adobe Premiere Pro on the same computer. A cloud agent or remote IDE session does not automatically reach the Premiere project on your desktop.",
          "Use a disposable project or duplicate sequence for the first session. The goal of day one is a verified connection, not a production cut.",
        ],
        links: [
          { label: "Claude Desktop dedicated guide", href: "/blog/claude-desktop-premiere-pro-mcp-setup/" },
          { label: "Cursor dedicated guide", href: "/blog/cursor-premiere-pro-mcp-setup/" },
        ],
      },
      {
        heading: "Install the published package and CEP connector",
        paragraphs: [
          `Install Node.js ${product.nodeVersion}+. Fully quit Premiere, then install the CEP connector from the published package. Confirm package identity before trusting the tool list: only npm package premiere-pro-mcp from this project is the product described here.`,
          "Restart Premiere, open Window > Extensions > MCP for Adobe Premiere Pro, and open your test project with an active sequence.",
        ],
        codeBlocks: [
          { label: "Connector install and doctor", code: connectorSetup },
          {
            label: "Shared local MCP entry shape",
            code: localMcpConfig,
          },
        ],
        links: [
          { label: "Install premiere-pro-mcp from npm", href: "/blog/install-premiere-pro-mcp-npm/" },
          { label: "Package comparison page", href: "/compare/" },
        ],
      },
      {
        heading: "Wire Claude Desktop or Cursor",
        paragraphs: [
          "In Claude Desktop, add the local stdio server entry to the MCP configuration and restart Claude so it loads the new server. In Cursor, add the same local entry under MCP settings for the project or global config your team uses, then start a new Agent conversation.",
          "If another Premiere-related MCP entry already exists, disable it while evaluating this package so the assistant does not see two overlapping tool surfaces.",
        ],
        steps: [
          "Add the premiere-pro-leancoderkavy local stdio entry from the shared config shape above.",
          "Restart the client (Claude Desktop) or open a fresh Agent chat (Cursor).",
          "Confirm the MCP server starts without Node or npx path errors.",
          "Open Premiere with the CEP panel visible and a test sequence active.",
        ],
      },
      {
        heading: "Verify, then inspect, before editing",
        paragraphs: [
          "Ask either client for the safe connection check. When it succeeds, inspect the active sequence or call get_capabilities for the workflow you want next. Only then request a preview or a bounded edit.",
          "UXP-only tools appear when a compatible authenticated UXP panel is connected. Absence of a UXP tool on a CEP-only session is expected, not a client failure.",
        ],
        codeBlocks: [{ label: "First prompt in Claude or Cursor", code: safeFirstPrompt }],
        links: [
          { label: "Troubleshooting and recovery", href: "/docs/troubleshooting/" },
          { label: "Workflow starter kits", href: "/workflows/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Should I set up Claude and Cursor at the same time?",
        answer:
          "You can install both clients, but evaluate one connection path first. Shared Premiere state means two assistants editing the same sequence without coordination is a risk.",
      },
      {
        question: "Does Cursor Privacy Mode change the Premiere bridge?",
        answer:
          "Privacy Mode is a Cursor policy about model providers. It does not replace the local MCP server or CEP connector, and it does not by itself prove that tool payloads stay off the network.",
      },
      {
        question: "Can ChatGPT use this same local config?",
        answer:
          "ChatGPT’s custom MCP-app route uses remote MCP servers; it does not directly attach to a local stdio server running beside Premiere. See the ChatGPT guide for the supported options and limits.",
      },
    ],
    resources: [
      { label: "Claude Desktop setup", href: "/blog/claude-desktop-premiere-pro-mcp-setup/" },
      { label: "Cursor setup", href: "/blog/cursor-premiere-pro-mcp-setup/" },
      { label: "ChatGPT connection options", href: "/blog/chatgpt-premiere-pro-mcp/" },
      { label: "General MCP setup", href: "/blog/how-to-set-up-premiere-pro-mcp/" },
    ],
    relatedSlugs: [
      "claude-desktop-premiere-pro-mcp-setup",
      "cursor-premiere-pro-mcp-setup",
      "how-to-set-up-premiere-pro-mcp",
      "chatgpt-premiere-pro-mcp",
    ],
  },
  {
    slug: "cut-silence-in-premiere-pro-with-ai",
    title: "Cut Silence in Premiere Pro with AI: Detect, Review, Then Apply",
    seoTitle: "Cut Silence in Premiere Pro with AI (MCP)",
    description:
      "Use Premiere Pro MCP to detect silent ranges with FFmpeg, plan review markers or a silence stringout, preview ripple removals, and verify the timeline before delivery.",
    eyebrow: "Silence cutting workflow",
    publishedAt: "2026-11-21",
    modifiedAt: "2026-11-21",
    readingTime: "8 min read",
    keywords: [
      "cut silence Premiere Pro",
      "auto cut silence Premiere Pro AI",
      "Premiere Pro silence detection",
      "remove silence Premiere MCP",
      "AI dialogue edit Premiere",
    ],
    sections: [
      {
        heading: "Silence cutting is a review chain, not one magic click",
        paragraphs: [
          "Premiere’s scripting API does not expose waveform levels, so silence measurement in this package uses FFmpeg on a local media file. detect_silence returns silent ranges and the complementary keep segments. It analyzes only; it does not modify the project or timeline.",
          "Editors still choose which silences to keep for pacing. The supported automation pattern is detect → plan or review → preview → apply → inspect.",
        ],
        links: [{ label: "Tool reference", href: "/tools/" }],
      },
      {
        heading: "Detect silences and optional dialogue candidates",
        paragraphs: [
          "After verify_premiere_connection succeeds, ask the assistant to run detect_silence on a named local media file that ffmpeg can read. Review the returned silence and keep ranges against the Source Monitor yourself.",
          "For dialogue work with a caller-supplied transcript and optional silence ranges, analyze_dialogue_edit_candidates and review_dialogue_candidates produce deterministic keep/reject decisions without calling a model or changing Premiere. They never persist transcript text inside the tool itself.",
        ],
        codeBlocks: [
          {
            label: "Read-only silence pass",
            code: "Run verify_premiere_connection and stop if it is not ready. Call detect_silence on my approved local interview file. Summarize silence and keep ranges. Do not add markers or change the timeline.",
          },
        ],
      },
      {
        heading: "Plan markers or a new silence-cut stringout",
        paragraphs: [
          "plan_silence_review_markers maps FFmpeg-detected source silences onto one known 1x timeline placement and returns a non-mutating review plan. It never adds markers by itself. When you want markers on the sequence after review, use add_marker or add_markers_batch with the ranges you approved.",
          "On a compatible authenticated UXP host, create_silence_cut_source_stringout_uxp can create a new single-source rough-cut stringout from reviewed silence ranges using hard-bounded linked A/V subclips. It does not preserve or rewrite an existing edited timeline; it builds a new stringout.",
        ],
        bullets: [
          "Duplicate the sequence or work on a disposable copy before structural cuts.",
          "Confirm source in/out and 1x placement before trusting mapped silence times.",
          "Treat UXP stringout creation as a new assembly to review, not an in-place polish.",
        ],
      },
      {
        heading: "Preview ripple removal before applying cuts",
        paragraphs: [
          "ripple_remove_timeline_ranges can preview or apply a single-pass ripple removal for up to 50 sorted, non-overlapping timeline ranges on unlocked, sync-locked tracks. Apply requires a preview confirmation token. Integer frame rates only. Large edits need allow_large_ripple: true.",
          "The tool refuses attached transitions or unreadable transition collections before structural edits. After apply, re-inspect the sequence. If captions already exist, Premiere caption tracks do not automatically follow ripple removals; retime_caption_file can adjust a local SRT/VTT, then re-import with create_caption_track.",
        ],
        codeBlocks: [
          {
            label: "Preview-first ripple request",
            code: "On my duplicate sequence, preview ripple_remove_timeline_ranges for the silence ranges I approved. Show per-track counts and planned clip samples. Do not apply until I confirm the exact token.",
          },
        ],
        links: [
          { label: "AI workflow checklist", href: "/blog/premiere-pro-ai-workflow-checklist/" },
          { label: "Troubleshooting", href: "/docs/troubleshooting/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does detect_silence cut the timeline?",
        answer:
          "No. It only analyzes a local media file with FFmpeg and returns ranges. Cutting requires a separate reviewed plan, preview, and apply path.",
      },
      {
        question: "Why do I need FFmpeg on PATH?",
        answer:
          "Premiere’s scripting bridge does not expose audio-level data for silence measurement. The package uses FFmpeg for that analysis step.",
      },
      {
        question: "Will this remove intentional pauses?",
        answer:
          "It can if you apply every detected range. Review keep/reject decisions and preview ripple effects before applying, especially on interview and narrative work.",
      },
    ],
    resources: [
      { label: "Automate Premiere Pro with AI", href: "/blog/automate-premiere-pro-with-ai/" },
      { label: "Captions workflow", href: "/blog/premiere-pro-ai-captions-workflow/" },
      { label: "Rough cut workflow", href: "/blog/premiere-pro-ai-rough-cut-workflow/" },
      { label: "Published facts", href: "/facts/" },
    ],
    relatedSlugs: [
      "automate-premiere-pro-with-ai",
      "premiere-pro-ai-captions-workflow",
      "premiere-pro-ai-rough-cut-workflow",
    ],
  },
  {
    slug: "premiere-pro-ai-captions-workflow",
    title: "Premiere Pro AI Captions Workflow: Build, Import, Style, Verify",
    seoTitle: "Premiere Pro AI Captions Workflow (MCP)",
    description:
      "Build SRT or VTT caption artifacts from a word timeline, import a caption track into Premiere, apply manual style guidance, and verify render evidence with MCP tools.",
    eyebrow: "Captions workflow",
    publishedAt: "2026-11-25",
    modifiedAt: "2026-11-25",
    readingTime: "8 min read",
    keywords: [
      "Premiere Pro AI captions",
      "Premiere Pro captions MCP",
      "auto captions Premiere Pro",
      "SRT VTT Premiere Pro AI",
      "caption safe zone Premiere",
    ],
    sections: [
      {
        heading: "Know what the caption tools do and do not do",
        paragraphs: [
          "build_caption_artifact builds a CapCut/Submagic-style SRT or VTT file from a caller-supplied word timeline. It balances word groups, applies sentence-aware breaks, supports style presets (clean, bold_pop, karaoke, podcast, lecture), and can write karaoke word timestamps in VTT. It is local-only and never changes Premiere by itself.",
          "add_text_overlay cannot create caption clips from raw text through Premiere’s scripting API. For on-screen titles use add_title. For captions, import an reviewed .srt/.vtt with create_caption_track.",
        ],
      },
      {
        heading: "Build the artifact, then import one caption track",
        paragraphs: [
          "Supply a reviewed word timeline from your transcription source. Ask the assistant to call build_caption_artifact with the format and style preset you want. Inspect the cues before import.",
          "create_caption_track import rejects unsupported formats before host dispatch and reports structural success only when readback shows exactly one new caption track. Unreadable results stay committed_unverified. Captions import with Premiere’s default style.",
        ],
        codeBlocks: [
          {
            label: "Build then import (after your review)",
            code: "Build an SRT caption artifact from my approved word timeline with style_preset podcast. Show the cue list for review. After I approve the file, import it with create_caption_track on the active sequence. Do not style or export yet.",
          },
        ],
        steps: [
          "Verify the Premiere connection read-only.",
          "Build the SRT/VTT artifact from the approved word timeline.",
          "Spot-check cues for timing, speaker breaks, and wording.",
          "Import with create_caption_track and confirm one new caption track.",
        ],
      },
      {
        heading: "Style in Premiere; use guidance tools for the clicks",
        paragraphs: [
          "Premiere has no caption style, per-word colour, or Upgrade Caption to Graphic API in this bridge. get_caption_style_guidance turns a preset or custom style into Properties-panel Track Style steps, keyword highlight steps, and manual upgrade steps. Follow those steps in the Premiere UI.",
          "check_caption_safe_zone compares caller-supplied normalized rectangles against approximate platform UI overlays (TikTok, Reels, Shorts, feed, YouTube, LinkedIn, X). It is local geometry only; it never reads or changes Premiere.",
        ],
        links: [{ label: "Platform cutdown planning", href: "/blog/premiere-pro-vertical-cutdowns-with-mcp/" }],
      },
      {
        heading: "Retime after ripple edits and verify renders",
        paragraphs: [
          "If you ripple-remove timeline ranges after captions exist, Premiere captions do not follow those ripples automatically. retime_caption_file shifts or ripples a local SRT/VTT; then re-import and reapply styling.",
          "verify_caption_render_evidence checks caller-measured caption/title bounds, missing glyphs, and safe-zone review against a rendered-artifact checksum. It does not perform OCR or certify unsampled frames. plan_reaction_captions can plan stacked speaker-colored reaction captions from a word timeline without mutating Premiere.",
        ],
        bullets: [
          "Caption tracks render in export_sequence by default; CEP cannot remove or hide them.",
          "inspect_caption_tracks_uxp inventories mute state and item counts on compatible UXP hosts; it does not read cue text.",
          "Treat still-frame review and full playback as separate verification steps.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does Premiere Pro MCP transcribe audio automatically?",
        answer:
          "build_caption_artifact expects a caller-supplied word timeline. Guarded speech-to-text start routes may exist in the published package for supported hosts; a start request is not a completed transcript. Confirm the live tool list with get_capabilities.",
      },
      {
        question: "Can the assistant style captions through the API?",
        answer:
          "No. Styling, per-word colour, and Upgrade Caption to Graphic remain manual in Premiere. Use get_caption_style_guidance for the click path.",
      },
      {
        question: "What formats can I import?",
        answer:
          "create_caption_track import rejects unsupported formats before dispatch. Build SRT or VTT with build_caption_artifact, review the file, then import.",
      },
    ],
    resources: [
      { label: "Silence cutting workflow", href: "/blog/cut-silence-in-premiere-pro-with-ai/" },
      { label: "Delivery QC checklist", href: "/blog/premiere-pro-delivery-qc-and-loudness-checklist/" },
      { label: "Tool catalog", href: "/tools/" },
    ],
    relatedSlugs: [
      "cut-silence-in-premiere-pro-with-ai",
      "premiere-pro-ai-rough-cut-workflow",
      "premiere-pro-delivery-qc-and-loudness-checklist",
    ],
  },
  {
    slug: "premiere-pro-ai-rough-cut-workflow",
    title: "Premiere Pro AI Rough Cut Workflow: Plan from Context, Preview, Apply",
    seoTitle: "Premiere Pro AI Rough Cut Workflow (MCP)",
    description:
      "Build evidence-backed rough-cut and stringout plans with Premiere Pro MCP, preview compound edits, and apply only after you review targets on a duplicate sequence.",
    eyebrow: "Rough cut workflow",
    publishedAt: "2026-11-28",
    modifiedAt: "2026-11-28",
    readingTime: "8 min read",
    keywords: [
      "Premiere Pro AI rough cut",
      "AI rough cut Premiere Pro",
      "Premiere Pro stringout automation",
      "transcript rough cut Premiere",
      "Premiere Pro MCP edit plan",
    ],
    sections: [
      {
        heading: "Rough cuts start as plans, not silent mutations",
        paragraphs: [
          "create_editorial_plan builds a local, evidence-backed editorial workflow plan from captured project context for organize, stringout, rough_cut, caption_review, or platform_cutdown. It never calls an LLM, uploads media, or changes Premiere.",
          "create_context_edit_plan builds a non-mutating edit-plan scaffold with strategies rough_cut, select_ranges, or review. It returns ranked source/time candidates and stale-state guards. The model must review them and use preview_edit_plan before any mutation.",
        ],
      },
      {
        heading: "Capture context, then ask for a bounded plan",
        paragraphs: [
          "Inspect the active sequence and project first. create_editorial_context_pack can turn already captured local transcript, shot, audio, note, source, or timeline context into a compact Markdown reading view with stable evidence IDs. It does not call an AI provider or Premiere.",
          "Name the deliverable: a first assembly from selects, a dialogue rough cut, or a review pass. Keep music beds, graphics, and finishing outside the first plan.",
        ],
        codeBlocks: [
          {
            label: "Plan-only rough cut request",
            code: "After verify_premiere_connection, inspect my active duplicate sequence. Create an editorial plan with workflow rough_cut from the captured context. Show ranked candidates and guards. Make no timeline changes.",
          },
        ],
      },
      {
        heading: "Preview compound edits; apply once",
        paragraphs: [
          "preview_edit_plan inspects sequence, project item, clip, and track targets without changing Premiere. It returns a single-use confirmation token bound to stable identities; the token expires after 30 minutes and is required by apply_edit_plan.",
          "apply_edit_plan revalidates identities before activation or mutation. Changed targets require a fresh preview. Ripple plans require the reviewed sequence to be active for the read-only QE sync-lock preflight. apply_extended_edit_plan can invoke a reviewed compound CEP token’s typed tools with same-command guards and stops at the first failed or unverified receipt without rollback.",
        ],
        bullets: [
          "Work on a duplicate sequence or create_sequence_checkpoint before risky edits.",
          "Serialize mutating calls; Premiere has one live project state.",
          "Re-query after every mutation when using transcript-based UXP plans.",
        ],
      },
      {
        heading: "Transcript rough cuts on compatible UXP hosts",
        paragraphs: [
          "plan_transcript_rough_cut_uxp builds a revision-locked, non-mutating rough-cut plan from Premiere’s native transcript and verified 1x sequence placements. It orders cuts from the end of the timeline, requires a duplicate sequence, and requires re-query after every mutation.",
          "Pair dialogue candidate review (analyze_dialogue_edit_candidates, review_dialogue_candidates, detect_repeated_takes) with your own listening pass. Token similarity and silence padding are aids; performance choice stays with the editor.",
        ],
        links: [
          { label: "Silence cutting recipe", href: "/blog/cut-silence-in-premiere-pro-with-ai/" },
          { label: "Review frames guide", href: "/blog/premiere-pro-review-frames-and-scene-detection/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does create_editorial_plan edit my timeline?",
        answer:
          "No. It only returns a local plan from captured context. Mutations require a separate preview and apply path you approve.",
      },
      {
        question: "What happens if apply fails halfway?",
        answer:
          "apply_extended_edit_plan stops at the first failed or unverified receipt, reports completed and unknown steps, and does not retry or roll back partial work. Inspect before continuing.",
      },
      {
        question: "Do I need UXP for every rough cut?",
        answer:
          "No. Core planning and preview/apply edit-plan tools are in the default profile. plan_transcript_rough_cut_uxp and some stringout helpers need a compatible authenticated UXP panel.",
      },
    ],
    resources: [
      { label: "Workflow automation guide", href: "/blog/premiere-pro-workflow-automation/" },
      { label: "Project intake", href: "/project-intake/" },
      { label: "Evaluation kits", href: "/workflows/" },
    ],
    relatedSlugs: [
      "premiere-pro-workflow-automation",
      "cut-silence-in-premiere-pro-with-ai",
      "automate-premiere-pro-with-ai",
    ],
  },
  {
    slug: "premiere-pro-beat-montage-with-mcp",
    title: "Build a Beat-Synced Montage Plan in Premiere Pro with MCP",
    seoTitle: "Beat-Synced Montage in Premiere Pro (MCP)",
    description:
      "Detect a local beat grid with FFmpeg, plan a beat-synced montage with Premiere Pro MCP, then place clips in reviewed batches without guessing the rhythm.",
    eyebrow: "Beat montage workflow",
    publishedAt: "2026-12-03",
    modifiedAt: "2026-12-03",
    readingTime: "7 min read",
    keywords: [
      "beat synced montage Premiere Pro",
      "Premiere Pro beat detection AI",
      "AI montage Premiere Pro",
      "plan beat montage MCP",
      "auto edit to music Premiere",
    ],
    sections: [
      {
        heading: "Detect beats locally before touching the timeline",
        paragraphs: [
          "detect_beats estimates a steady beat grid from a local audio or video file without changing Premiere. FFmpeg decodes at most 30 minutes to a bounded mono analysis stream. Local onset autocorrelation returns BPM, phase-aligned beat times, confidence, and half/double-time alternatives.",
          "This is an editorial candidate grid, not a claim of musical beat-grid perfection for every genre. Listen to the grid against the track before planning cuts.",
        ],
        codeBlocks: [
          {
            label: "Beat detection only",
            code: "Run verify_premiere_connection. Call detect_beats on my approved local music bed. Report BPM, confidence, and alternate half/double grids. Do not edit the sequence.",
          },
        ],
      },
      {
        heading: "Plan the montage deterministically",
        paragraphs: [
          "plan_beat_montage carves a detect_beats grid into shots every N beats (merging short and splitting long spans), assigns clips in order (as_given, priority, or round_robin), and emits add_to_timeline_batch chunks, trim ranges, and cut markers. It is local-only and deterministic; it never changes Premiere.",
          "Review the planned shot lengths and clip order. Replace weak selects before you ask for placement. Marker plans can later use add_markers_batch for beat grids after you approve times.",
        ],
      },
      {
        heading: "Place clips in verified batches",
        paragraphs: [
          "add_to_timeline_batch inserts up to 32 project items with insert-edit semantics in one validated CEP request. Experimental QE sync-lock handling may ripple or split earlier placements. The tool preflights items and tracks, then verifies placements; changed placements return committed_unverified.",
          "For single placements, add_to_timeline inserts at a timeline position with optional sync_locked or target_tracks scope. Prefer empty target tracks on a duplicate sequence for the first montage test.",
        ],
        bullets: [
          "Keep picture and music on named tracks you can mute independently for review.",
          "Inspect after each batch; do not queue overlapping mutating calls.",
          "Export review frames or a short in-to-out render for visual timing checks; stills do not prove sync.",
        ],
        links: [
          { label: "Review frames guide", href: "/blog/premiere-pro-review-frames-and-scene-detection/" },
          { label: "Workflow kits", href: "/workflows/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does detect_beats write markers automatically?",
        answer:
          "No. It returns a grid. Marker creation is a separate reviewed step such as add_markers_batch.",
      },
      {
        question: "Can I auto-edit to music in one tool call?",
        answer:
          "plan_beat_montage plans only. Placement uses timeline tools you preview and verify. Musical taste and shot selection stay with the editor.",
      },
      {
        question: "How long can the analyzed music bed be?",
        answer:
          "detect_beats decodes at most 30 minutes for analysis. Longer beds need an approved shorter analysis range or a separate pass.",
      },
    ],
    resources: [
      { label: "Automate Premiere Pro with AI", href: "/blog/automate-premiere-pro-with-ai/" },
      { label: "Rough cut workflow", href: "/blog/premiere-pro-ai-rough-cut-workflow/" },
      { label: "Tool reference", href: "/tools/" },
    ],
    relatedSlugs: [
      "automate-premiere-pro-with-ai",
      "premiere-pro-ai-rough-cut-workflow",
      "premiere-pro-vertical-cutdowns-with-mcp",
    ],
  },
  {
    slug: "premiere-pro-vertical-cutdowns-with-mcp",
    title: "Vertical Cutdowns in Premiere Pro with MCP: Reframe, Safe Zones, Deliver",
    seoTitle: "Vertical Cutdowns in Premiere Pro with MCP",
    description:
      "Plan multi-ratio Premiere deliveries, auto-reframe sequences, check caption safe zones, and preflight exports for Shorts, Reels, TikTok, and YouTube with MCP tools.",
    eyebrow: "Platform cutdowns",
    publishedAt: "2026-12-08",
    modifiedAt: "2026-12-08",
    readingTime: "8 min read",
    keywords: [
      "Premiere Pro vertical cutdown",
      "Premiere Pro auto reframe AI",
      "TikTok Reels Shorts Premiere MCP",
      "caption safe zone Premiere",
      "multi ratio delivery Premiere Pro",
    ],
    sections: [
      {
        heading: "Plan the delivery matrix before reframing",
        paragraphs: [
          "plan_platform_delivery_matrix plans multi-ratio delivery of one source sequence to TikTok, Reels, Shorts, YouTube, LinkedIn, X, and Facebook from a local spec table. Strategies include auto_reframe, pad_blur, center_crop, and letterbox. It reports sequence settings, reframe scale math, duration and file-size fit, caption safe zones, and ordered apply routes. Local-only; it never changes Premiere.",
          "create_editorial_plan with workflow platform_cutdown can also produce an evidence-backed plan from captured context without mutating the host.",
        ],
        codeBlocks: [
          {
            label: "Plan-only platform matrix",
            code: "Plan a platform delivery matrix from my approved horizontal master for Shorts, Reels, and TikTok using strategy auto_reframe. Show safe-zone and duration fit notes. Do not reframe or export yet.",
          },
        ],
      },
      {
        heading: "Auto-reframe into a new sequence",
        paragraphs: [
          "auto_reframe_sequence creates a new sequence at target_width x target_height with motion presets slower, default, or faster. Premiere derives an intermediate size from the source height; the tool then sets the requested frame size and verifies it so the Auto Reframe effect refits to the new size.",
          "Review the reframed sequence in the Program Monitor. Motion tracking quality is host-dependent; still exports help spot framing issues but do not prove continuous motion.",
        ],
      },
      {
        heading: "Check overlays and captions for platform UI",
        paragraphs: [
          "check_caption_safe_zone tests caption, title, logo, and graphic rectangles against approximate platform UI overlay zones and suggests the nearest clear position. Supply normalized rects; the tool never reads Premiere state.",
          "If you import captions on the vertical sequence, follow the captions workflow: build or retime the artifact, import with create_caption_track, then style manually using get_caption_style_guidance.",
        ],
        links: [{ label: "Captions workflow", href: "/blog/premiere-pro-ai-captions-workflow/" }],
      },
      {
        heading: "Preflight and export with evidence",
        paragraphs: [
          "validate_project_for_export runs a non-mutating export preflight for offline media, empty timelines, preset/output paths, duration, and optional gaps. readyForExport means those checks passed; it does not prove the encoder will finish.",
          "export_sequence renders with an Adobe Media Encoder preset and verifies a non-empty file plus duration within one sequence frame when ffprobe is available. Follow with verify_delivery_file and, when you have an explicit contract, verify_delivery_conformance. analyze_loudness measures LUFS on a local file without normalizing audio.",
        ],
        bullets: [
          "Refuse existing output paths unless you intentionally overwrite.",
          "Match the output extension to the .epr preset’s real container.",
          "Keep platform duration and file-size limits in the plan you reviewed.",
        ],
        links: [
          { label: "Delivery QC checklist", href: "/blog/premiere-pro-delivery-qc-and-loudness-checklist/" },
          { label: "Demo and verification receipt", href: "/demo/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Does plan_platform_delivery_matrix create the vertical sequences?",
        answer:
          "No. It plans routes and fit checks. Creating reframed sequences and exports are separate reviewed steps.",
      },
      {
        question: "Is auto-reframe available on every Premiere install?",
        answer:
          "The tool is in the default profile catalog, but host Auto Reframe behavior and quality remain Premiere-version and media dependent. Verify the new sequence size and framing yourself.",
      },
      {
        question: "Can MCP guarantee TikTok safe zones?",
        answer:
          "check_caption_safe_zone uses approximate overlay geometry you supply. Platform UI changes; always spot-check on-device when the delivery matters.",
      },
    ],
    resources: [
      { label: "Beat montage workflow", href: "/blog/premiere-pro-beat-montage-with-mcp/" },
      { label: "Export and loudness checklist", href: "/blog/premiere-pro-delivery-qc-and-loudness-checklist/" },
      { label: "Facts and compatibility", href: "/facts/" },
    ],
    relatedSlugs: [
      "premiere-pro-ai-captions-workflow",
      "premiere-pro-delivery-qc-and-loudness-checklist",
      "premiere-pro-beat-montage-with-mcp",
    ],
  },
  {
    slug: "premiere-pro-mcp-for-agencies-and-youtube-teams",
    title: "Premiere Pro MCP for Agencies and YouTube Teams",
    seoTitle: "Premiere Pro MCP for Agencies & YouTube Teams",
    description:
      "Use Premiere Pro MCP for agency and YouTube team handoffs: project intake preview, backups, sequence review reports, review frames, and bounded edit recipes editors can audit.",
    eyebrow: "Agencies and YouTube teams",
    publishedAt: "2026-12-12",
    modifiedAt: "2026-12-12",
    readingTime: "8 min read",
    keywords: [
      "Premiere Pro MCP for agencies",
      "YouTube team Premiere automation",
      "Premiere Pro project intake AI",
      "AI assistant for video editors",
      "Premiere Pro collaboration workflow MCP",
    ],
    sections: [
      {
        heading: "Why teams adopt a reviewable bridge",
        paragraphs: [
          "Agencies and YouTube teams already use AI assistants for scripts, briefs, and research. Premiere Pro MCP extends that assistant into the NLE with named tools, authority boundaries, and receipts. Founder Kavy Rattana built MCP for Adobe Premiere Pro as an independent, MIT-licensed local server—not an Adobe product—so teams can keep client choice (Claude, Cursor, Codex, and other MCP clients) without pretending every edit is host-proven.",
          "The operating rule for shared projects: inspect and plan on the live job; mutate on duplicates until the recipe is trusted.",
        ],
        links: [
          { label: "Collaboration workflow page", href: "/premiere-pro-collaboration-workflow/" },
          { label: "Project intake", href: "/project-intake/" },
        ],
      },
      {
        heading: "Intake and backup before assistants touch media",
        paragraphs: [
          "preview_project_intake inspects a bounded Premiere project against an explicit facility intake template and returns a path-redacted report plus a non-mutating organization proposal. It never changes Premiere or persists the template.",
          "create_project_backup makes a collision-safe, byte-verified backup beside an existing .prproj without opening or modifying the source. Use it before first mutating automation on a client project.",
        ],
        codeBlocks: [
          {
            label: "Intake preview prompt",
            code: "Evaluate this open Premiere project against our approved intake template. Return the path-redacted report and proposed organization actions. Do not change Premiere or persist the template.",
          },
        ],
      },
      {
        heading: "Handoff reports and visual review packs",
        paragraphs: [
          "inspect_sequence_review_report builds a read-only handoff report with timeline structure, primary-track gaps, disabled clips, muted tracks, marker timing, and offline-source evidence. Media paths are never returned; marker comments require opt-in. It does not prove pixels, audio quality, captions, rights, or editorial approval.",
          "export_sequence_review_frames exports 2–24 evenly spaced, file-verified frames from a bounded range for visual review. Still capture does not verify temporal animation, playback, or audio. Pair with the team’s human review checklist.",
        ],
        links: [
          { label: "Review frames and scene detection", href: "/blog/premiere-pro-review-frames-and-scene-detection/" },
          { label: "Backup checklist", href: "/blog/premiere-pro-project-backup-checklist/" },
        ],
      },
      {
        heading: "Standardize recipes, not vibes",
        paragraphs: [
          "Publish internal runbooks that name the MCP tools, required authority, duplicate-sequence rule, and definition of done. Good team recipes from this pack: silence review, captions import, rough-cut plans, beat montages, and vertical cutdowns.",
          "audit_timeline_health scores flash frames, gaps, overlaps, and related issues locally without changing Premiere. Use it as a gate before client review, not as creative approval.",
        ],
        bullets: [
          "One assistant owner per mutating session on a shared project.",
          "Keep prompts, tokens, and client paths out of public tickets.",
          "Record failed or unverified receipts instead of silent retries.",
          "Re-run verify_premiere_connection after Premiere restarts.",
        ],
        links: [
          { label: "AI workflow checklist", href: "/blog/premiere-pro-ai-workflow-checklist/" },
          { label: "Automate Premiere Pro with AI", href: "/blog/automate-premiere-pro-with-ai/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Can multiple editors’ assistants edit one project at once?",
        answer:
          "Premiere still has one live project state. Serialize mutating sessions. Prefer duplicate sequences for experiments and clear ownership for applies.",
      },
      {
        question: "Does project intake reorganize bins automatically?",
        answer:
          "preview_project_intake only reports and proposes. Organization changes require separate approved tools and verification.",
      },
      {
        question: "Is this suitable for client-facing demos?",
        answer:
          "Use synthetic or licensed demo media. The public workflow kits use synthetic clips. Do not upload client footage into public reports or third-party forms.",
      },
    ],
    resources: [
      { label: "Project intake product page", href: "/project-intake/" },
      { label: "Intake checklist guide", href: "/blog/premiere-pro-project-intake-checklist/" },
      { label: "Install and try a safe connection check", href: "/#install" },
      { label: "GitHub repository", href: product.links.repository },
    ],
    relatedSlugs: [
      "premiere-pro-project-intake-checklist",
      "premiere-pro-ai-workflow-checklist",
      "automate-premiere-pro-with-ai",
      "premiere-pro-mcp-setup-claude-cursor",
    ],
  },
]
