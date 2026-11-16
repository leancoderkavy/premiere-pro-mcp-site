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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
    title: "How to Auto Generate Captions in Premiere Pro (Native + MCP Workflow)",
    seoTitle: "How to Auto Generate Captions in Premiere Pro (+ MCP)",
    description:
      "Yes, Premiere Pro has auto captions: transcribe in the Text panel, then Create captions. Plus an MCP workflow to build, import, retime and check SRTs.",
    eyebrow: "Captions workflow",
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-16",
    readingTime: "8 min read",
    keywords: [
      "how to auto generate captions in Premiere Pro",
      "Premiere Pro auto captions",
      "does Premiere Pro have auto captions",
      "Premiere Pro speech to text captions",
      "Premiere Pro AI captions",
      "Premiere Pro captions MCP",
      "SRT captions Premiere Pro",
      "caption safe zone Premiere",
    ],
    sections: [
      {
        heading: "Does Premiere Pro have auto captions?",
        paragraphs: [
          "Yes. Premiere Pro has built-in Speech to Text. It transcribes the dialogue in a sequence, and the Create captions command turns that transcript into a caption track aligned to the speech. You do not need a plugin or a separate service for the basic workflow.",
          "Premiere Pro MCP is optional automation around that native path. It can help you request a transcript, turn an approved word timeline into an SRT file, import it as a caption track, retime it after edits, and check placement. It does not replace Adobe's Speech to Text, and it does not style captions for you. The native steps come first below; the MCP section follows.",
        ],
        links: [
          {
            label: "Adobe: Auto-transcribe video using Speech to Text",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/auto-transcribe-video-using-speech-to-text.html",
          },
          {
            label: "Adobe: Create captions",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/create-captions.html",
          },
        ],
      },
      {
        heading: "How to auto generate captions in Premiere Pro",
        paragraphs: [
          "These steps follow Adobe's current help pages (Speech to Text updated June 2, 2026; Create captions updated January 7, 2026). Menu names can move between Premiere versions, so check the linked pages if a label differs on your install.",
          "Caption the final edited sequence where you can. Captions are timed against the timeline, so heavy edits after captioning mean retiming work later.",
        ],
        steps: [
          "Open the sequence you want to caption and choose Window > Text to open the Text panel.",
          "In the Transcript tab, choose Generate static transcript. Pick the language (Premiere offers a language pack download if one is missing), decide on speaker labeling, and choose what to analyze: dialogue-tagged clips or a specific audio track. You can limit transcription to the In and Out points or merge the result with an existing transcription.",
          "Select Transcribe and wait for the transcript to appear in the Text panel.",
          "Read the transcript and fix names, jargon, and misheard words before you make captions. Corrections here carry into the captions you create from it.",
          "Switch to Window > Workspaces > Captions and Graphics, then choose Captions > Create captions from transcript.",
          "In the dialog, pick a caption preset (Subtitle is the default), format, stream, and style, then set caption length, duration, gap between captions, and single or double lines.",
          "Select Create captions. Premiere adds a caption track aligned to the dialogue. Play it back and correct any cues that break awkwardly.",
        ],
        bullets: [
          "Tip: if you select Automatic Transcription when importing media, Premiere transcribes the clips on import, so the transcript is ready before you create captions.",
          "Review is not optional. Speech recognition varies with audio quality, accents, crosstalk, and vocabulary, so treat the first pass as a draft.",
        ],
      },
      {
        heading: "Languages, language packs and transcription settings",
        paragraphs: [
          "Adobe's supported-languages page (updated August 22, 2025) lists 18 Speech to Text languages: Danish, Dutch (Netherlands), English, English (UK), French, German, Hindi, Italian, Japanese, Korean, Norwegian, Portuguese (European), Russian, Simplified Chinese (Mandarin), Spanish, Swedish, Traditional Cantonese, and Traditional Chinese (Mandarin). Check that page for the current list before you plan a multilingual job.",
          "Additional language packs install from the Creative Cloud desktop app: Apps > All apps, open the three-dots menu next to Premiere, and choose Get add-ons.",
          "The Media Analysis & Transcription preferences control the defaults: automatically transcribe all imported clips or only clips in a sequence, speaker labeling, language auto-detection, a default language, and where the transcript cache lives (sidecar files, the Media Cache, or the project only).",
        ],
        links: [
          {
            label: "Adobe: Languages supported by Speech to Text",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/languages-supported-by-speech-to-text.html",
          },
          {
            label: "Adobe: Download language packs",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/download-language-packs-from-creative-cloud.html",
          },
          {
            label: "Adobe: Transcription preferences",
            href: "https://helpx.adobe.com/premiere/desktop/get-started/preferences-and-settings/transcription-preferences.html",
          },
        ],
      },
      {
        heading: "Already have an SRT? Import captions from another tool",
        paragraphs: [
          "If a transcription service or another editor already produced captions, you can skip Speech to Text. Import the SRT file like any other media, then drag it from the Project panel into the sequence. Premiere creates a new caption track from it.",
          "Adobe's supported sidecar caption formats are SCC, MCC, XML, STL, SRT, and DFXP, with XML covering W3C TTML (DFXP), SMPTE-TT, and EBU-TT. WebVTT is not on that list, so use SRT when the destination is a Premiere timeline. Keep VTT for web players that ask for it.",
        ],
        links: [
          {
            label: "Adobe: Import a caption file from a third-party service",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/import-caption-file-from-third-party-service.html",
          },
          {
            label: "Adobe: Supported file formats for captions",
            href: "https://helpx.adobe.com/premiere/desktop/add-text-images/insert-captions/supported-file-formats-for-captions.html",
          },
        ],
      },
      {
        heading: "Where Premiere Pro MCP fits",
        paragraphs: [
          `Premiere Pro MCP does not transcribe audio by itself in published v${product.version}. On a compatible Premiere 26.3 or later UXP connection, transcribe_clip_uxp and prepare_transcript_workflow can ask Premiere to start Adobe's own Speech to Text for one exact source clip. Both need explicit confirmation and an operation id. A start request is reported as accepted or pending, never as a finished transcript, and transcription may use Adobe cloud services according to your host preferences.`,
          "Once the native transcript exists, get_clip_transcript_uxp exports it as JSON with a revision hash. It is read-only and does not run Speech to Text.",
          "build_caption_artifact then turns a word timeline you have reviewed into an SRT (or VTT) file. It balances word groups, applies sentence-aware breaks, enforces minimum and maximum cue durations, and supports the clean, bold_pop, karaoke, podcast, and lecture presets. It is local-only and never changes Premiere by itself.",
          "add_text_overlay cannot create caption clips from raw text through Premiere's scripting API. For on-screen titles use add_title. For captions, import a reviewed SRT and create the caption track as described next.",
        ],
        links: [
          { label: "Set up Premiere Pro MCP", href: "/blog/how-to-set-up-premiere-pro-mcp/" },
          { label: "Adobe AI Assistant vs MCP", href: "/blog/adobe-premiere-ai-assistant-vs-mcp/" },
          { label: "Published package facts", href: "/facts/" },
        ],
      },
      {
        heading: "Build the SRT, then import one caption track",
        paragraphs: [
          "Supply a reviewed word timeline, either the native transcript you exported or one from your own transcription source. Ask the assistant to call build_caption_artifact with SRT output and the style preset you want. Inspect the cues before import.",
          "Import the reviewed SRT into the project so it becomes a project item, then call create_caption_track with that item's id. create_caption_track rejects unsupported caption formats before host dispatch and reports verified only when readback shows exactly one new caption track. Unreadable results stay committed_unverified. Captions import with Premiere's default style.",
        ],
        codeBlocks: [
          {
            label: "Build then import (after your review)",
            code: "Build an SRT caption artifact from my approved word timeline with style_preset podcast. Show the cue list for review. After I approve the file and it is in the project, import it with create_caption_track on the active sequence. Do not style or export yet.",
          },
        ],
        steps: [
          "Verify the Premiere connection read-only.",
          "Build the SRT artifact from the approved word timeline.",
          "Spot-check cues for timing, speaker breaks, and wording.",
          "Import the SRT as a project item, then run create_caption_track with its item id and confirm one new caption track.",
        ],
        links: [{ label: "Rough cut workflow", href: "/blog/premiere-pro-ai-rough-cut-workflow/" }],
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
          "The simplest way to avoid retiming is to caption the final edited sequence. If you ripple-remove timeline ranges after captions exist, Premiere captions do not follow those ripples automatically. retime_caption_file shifts or ripples a local SRT/VTT; then re-import and reapply styling.",
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
        question: "Does Premiere Pro have auto captions?",
        answer:
          "Yes. Premiere Pro's built-in Speech to Text transcribes dialogue in the Text panel, and Captions > Create captions from transcript turns that transcript into a caption track aligned to the speech.",
      },
      {
        question: "Which languages does Speech to Text support?",
        answer:
          "Adobe's supported-languages page, updated August 22, 2025, lists 18 languages, including English, English (UK), Spanish, French, German, Japanese, Korean, Hindi, and three Chinese variants. Extra language packs install through the Creative Cloud app's Get add-ons option.",
      },
      {
        question: "Can I import SRT captions from another tool?",
        answer:
          "Yes. Import the SRT like any media file and drag it from the Project panel into the sequence. Premiere creates a new caption track from it.",
      },
      {
        question: "Should I use SRT or VTT?",
        answer:
          "Use SRT for Premiere. Adobe's supported caption formats list SRT but not WebVTT. build_caption_artifact can write VTT for web players, but import SRT into Premiere.",
      },
      {
        question: "Does Premiere Pro MCP transcribe audio automatically?",
        answer: `No. In published v${product.version} it can request that Adobe's own Speech to Text start on compatible Premiere 26.3 or later UXP hosts and read the native transcript; a start request is not a completed transcript. Caption files are built from a word timeline you approve. Confirm the live tool list with get_capabilities.`,
      },
      {
        question: "Can the assistant style captions through the API?",
        answer:
          "No. Styling, per-word colour, and Upgrade Caption to Graphic remain manual in Premiere. Use get_caption_style_guidance for the click path.",
      },
    ],
    resources: [
      { label: "Silence cutting workflow", href: "/blog/cut-silence-in-premiere-pro-with-ai/" },
      { label: "Rough cut workflow", href: "/blog/premiere-pro-ai-rough-cut-workflow/" },
      { label: "Set up Premiere Pro MCP", href: "/blog/how-to-set-up-premiere-pro-mcp/" },
      { label: "Adobe AI Assistant vs MCP", href: "/blog/adobe-premiere-ai-assistant-vs-mcp/" },
      { label: "Delivery QC checklist", href: "/blog/premiere-pro-delivery-qc-and-loudness-checklist/" },
      { label: "Tool catalog", href: "/tools/" },
      { label: "Published package facts", href: "/facts/" },
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
      { label: "Scene Edit Detection in Premiere Pro", href: "/blog/premiere-pro-review-frames-and-scene-detection/" },
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
    publishedAt: "2026-11-11",
    modifiedAt: "2026-11-11",
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
  {
    slug: "premiere-pro-scripting-extendscript-uxp",
    title: "Premiere Pro Scripting: ExtendScript vs. UXP vs. MCP",
    seoTitle: "Premiere Pro Scripting: ExtendScript vs UXP vs MCP",
    description:
      "Compare the ways to script Adobe Premiere Pro: legacy ExtendScript, UXP plugins, and an MCP server on top of both. Adobe's CEP timeline, trade-offs, and when to use each.",
    eyebrow: "Premiere Pro scripting for developers",
    publishedAt: "2026-11-16",
    modifiedAt: "2026-11-16",
    readingTime: "9 min read",
    keywords: [
      "Premiere Pro scripting",
      "Premiere Pro ExtendScript",
      "Premiere Pro UXP plugin",
      "Premiere Pro API",
      "ExtendScript vs UXP",
    ],
    sections: [
      {
        heading: "Three layers, not three competitors",
        paragraphs: [
          "If you want code to drive Adobe Premiere Pro, you will run into three names: ExtendScript, UXP, and, more recently, MCP. They are often compared as if you must pick one. In practice they sit at different layers. ExtendScript and UXP are Adobe’s host scripting environments: they run inside Premiere and touch its project, sequences, and clips. An MCP server is a protocol layer outside Premiere that exposes named, typed tools to an AI client and calls one of those host environments to do the actual work.",
          "This guide explains what each layer is, what Adobe has said about the transition from CEP to UXP, and how to decide where your own scripts should live. It is written for developers and technical editors. If you want to know which editing tasks are worth automating, read the workflow automation guide instead.",
        ],
        links: [
          { label: "Which Premiere tasks to automate first", href: "/blog/premiere-pro-workflow-automation/" },
          { label: "How Premiere Pro MCP works", href: "/how-premiere-pro-mcp-works/" },
        ],
      },
      {
        heading: "ExtendScript: the long-standing Premiere DOM",
        paragraphs: [
          "ExtendScript is Adobe’s ES3-era JavaScript dialect. In Premiere it exposes the app object and a document model of projects, bins, sequences, tracks, and track items. Scripts run inside the host, so they can read and change project state directly. Many existing Premiere panels are CEP extensions: an HTML and JavaScript panel that sends ExtendScript to the host and reads the result back.",
          "The trade-offs are familiar to anyone who has shipped a CEP panel. The language lacks let, const, arrow functions, and modern modules. Adobe’s UXP reference notes that ExtendScript calls to Premiere were synchronous and blocked the Premiere UI while they ran. Some common operations also have no documented ExtendScript setter, which pushes scripts toward the undocumented QE DOM, whose behavior can vary between Premiere builds.",
        ],
        codeBlocks: [
          {
            label: "A one-line ExtendScript read",
            code: "app.project.activeSequence.name",
          },
        ],
      },
      {
        heading: "UXP: Adobe’s current extensibility platform",
        paragraphs: [
          "UXP (Unified Extensibility Platform) is the plugin runtime Adobe describes as the current extensibility standard for Creative Cloud applications, and its documentation lists Premiere 25.6 among the supported hosts. Plugins use modern JavaScript and load the Premiere API with require(\"premierepro\"). According to Adobe’s Premiere UXP reference, method calls are asynchronous and do not block the UI thread, while property getters and setters were designed to stay synchronous to ease the move from the ExtendScript DOM.",
          "Adobe also announced UXP hybrid plugins for Premiere 26.2. A hybrid plugin can load native C++ libraries at runtime for work that JavaScript alone handles poorly, such as heavy media processing. The Premiere UXP API is still growing, so check the reference for the specific objects and methods your script needs before committing to it.",
        ],
        codeBlocks: [
          {
            label: "Loading the Premiere API in a UXP plugin",
            code: 'const ppro = require("premierepro")\n// Methods return promises; await them inside an async function.',
          },
        ],
        links: [
          { label: "Adobe Premiere UXP API reference", href: "https://developer.adobe.com/premiere-pro/uxp/ppro-reference/" },
          {
            label: "Adobe: UXP hybrid plugins for Premiere",
            href: "https://blog.developer.adobe.com/en/publish/2026/04/uxp-hybrid-plugins-now-available-for-premiere",
          },
        ],
      },
      {
        heading: "What Adobe has said about the CEP timeline",
        paragraphs: [
          "In September 2026, Adobe published its plan for moving its flagship applications from CEP to UXP. The dates below come from that announcement. Plan against them, and recheck the Adobe post before a release decision, because published schedules can change.",
          "One point is easy to misread. Adobe states that ExtendScripts are not affected by this transition. The retirement applies to CEP, the HTML panel framework, not to ExtendScript itself. A CEP panel that relies on ExtendScript is still affected, because the panel host is what goes away.",
        ],
        bullets: [
          "December 2027: Premiere stops accepting new CEP submissions.",
          "December 2028: CEP becomes disabled by default in Premiere.",
          "December 2029: Adobe says CEP will no longer be included in its flagship applications, and CEP is retired at the end of 2029.",
          "Today: Adobe lists Premiere as having generally available UXP plugins and hybrid plugins.",
        ],
        links: [
          {
            label: "Adobe: UXP comes to our flagship applications",
            href: "https://blog.developer.adobe.com/en/publish/2026/09/investing-in-the-future-of-creative-cloud-extensibility-uxp-comes-to-our-flagship-applications",
          },
        ],
      },
      {
        heading: "When to use ExtendScript, UXP, or MCP",
        paragraphs: [
          "Choose by who triggers the work and which Premiere versions you must support, not by which technology sounds newest.",
        ],
        bullets: [
          "Write a UXP plugin when you are building a new panel or product for current Premiere releases, need a non-blocking UI, or want native code through a hybrid plugin.",
          "Keep ExtendScript when you maintain scripts for older Premiere hosts, rely on an operation the UXP API does not yet cover, or need a quick one-off utility. Plan any CEP-hosted panel around Adobe’s dates.",
          "Use an MCP server when the caller is an AI assistant or agent rather than a person clicking a panel. You get named tools with schemas, preflight checks, and structured results instead of generating raw script text for every request.",
          "Combine them when you need to. An MCP server still runs ExtendScript or UXP underneath, so improvements to either host API benefit the tools above it.",
        ],
      },
      {
        heading: "How an MCP server sits on top of both",
        paragraphs: [
          `MCP for Adobe Premiere Pro is an independent, MIT-licensed local server that uses Adobe’s documented UXP and CEP/ExtendScript APIs. Its CEP connector is the production and compatibility bridge for Premiere ${product.premiereCompatibility}. On Premiere ${product.uxpMinimumVersion} and later, a compatible, authenticated UXP panel can advertise ${product.uxpAdditionalToolCount} additional capability-gated tools without replacing the CEP bridge. Tools without a documented UXP route keep using CEP.`,
          `Published v${product.version} registers ${product.coreToolCount} core tools. The default authority profile lists ${product.defaultProfileToolCount} of them and withholds execute_extendscript and evaluate_expression, which run raw ExtendScript and require explicit unsafe-script authority. Leave that capability disabled unless you need it: most scripting tasks are better served by a named tool that validates targets and reads results back than by free-form code. These counts describe the published npm package; they are not proof that every operation succeeds in a licensed Premiere host.`,
        ],
        links: [
          { label: "Searchable tool reference", href: "/tools/" },
          { label: "Canonical product facts", href: "/facts/" },
        ],
      },
      {
        heading: "A minimal example: the same read, three ways",
        paragraphs: [
          "Suppose you want the active sequence name. In ExtendScript it is the one-line expression shown above. In a UXP plugin you load the premierepro module and await the project and sequence calls documented in Adobe’s reference. Through MCP, the assistant calls a read-only tool and returns a structured result, so neither you nor the model writes host script text.",
          "Start with a no-change check like the request below. It confirms that the server, the selected bridge, an open project, and an active sequence are reachable. It does not prove that a later edit, export, or UXP-only tool will succeed.",
        ],
        codeBlocks: [
          {
            label: "Read-only MCP request",
            code: "Run verify_premiere_connection. If ready, call get_active_sequence and report its name and the active bridge. Do not change Premiere or write files.",
          },
        ],
        links: [
          { label: "Install and run a safe first check", href: "/docs/" },
          { label: "What is an MCP server for Premiere Pro?", href: "/blog/what-is-a-premiere-pro-mcp-server/" },
        ],
      },
    ],
    faqs: [
      {
        question: "Is ExtendScript deprecated in Premiere Pro?",
        answer:
          "Adobe’s September 2026 CEP-to-UXP announcement states that ExtendScripts are not affected by the transition; the retirement schedule applies to CEP. Check Adobe’s developer documentation before relying on ExtendScript for a long-lived product, and prefer UXP for new panels.",
      },
      {
        question: "When will CEP panels stop working in Premiere Pro?",
        answer:
          "Adobe says Premiere stops accepting new CEP submissions in December 2027 and disables CEP by default in December 2028. Starting December 2029, CEP will no longer be included in Adobe’s flagship applications.",
      },
      {
        question: "Which Premiere version supports UXP plugins?",
        answer: `Adobe’s UXP documentation lists Premiere 25.6 as a supported host, and hybrid plugins with native C++ libraries arrived in Premiere 26.2. The MCP server’s UXP bridge targets Premiere ${product.uxpMinimumVersion} and later.`,
      },
      {
        question: "Can an MCP server run my own ExtendScript?",
        answer:
          "Yes, through execute_extendscript and evaluate_expression, but only when you explicitly enable the unsafe-script authority. The default profile hides both. Named tools are the safer route for routine reads and edits.",
      },
    ],
    resources: [
      { label: "How Premiere Pro MCP works", href: "/how-premiere-pro-mcp-works/" },
      { label: "Premiere Pro MCP docs", href: "/docs/" },
      { label: "Premiere Pro workflow automation", href: "/blog/premiere-pro-workflow-automation/" },
      { label: "Source repository", href: product.links.repository },
    ],
    relatedSlugs: [
      "what-is-a-premiere-pro-mcp-server",
      "premiere-pro-workflow-automation",
      "how-to-set-up-premiere-pro-mcp",
    ],
  },
]
