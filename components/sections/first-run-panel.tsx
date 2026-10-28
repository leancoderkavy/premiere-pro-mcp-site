"use client"

import { useEffect, useRef } from "react"
import { ArrowUpRight, CheckCircle, Copy, Play } from "lucide-react"
import { trackOnboardingEvent } from "@/lib/onboarding-events"
import { safeFirstPrompt } from "@/lib/product"
import { useState } from "react"
import Link from "next/link"

export function FirstRunPanel() {
  const panelRef = useRef<HTMLDivElement>(null)
  const [promptCopied, setPromptCopied] = useState(false)

  useEffect(() => {
    if (panelRef.current) {
      trackOnboardingEvent("onboarding_first_run_panel_viewed")
    }
  }, [])

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(safeFirstPrompt)
      setPromptCopied(true)
      trackOnboardingEvent("onboarding_safe_prompt_copied")
      window.setTimeout(() => setPromptCopied(false), 2000)
    } catch {
      trackOnboardingEvent("onboarding_copy_failed", { action: "first_run_panel" })
    }
  }

  return (
    <div
      ref={panelRef}
      className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-500/[0.06] p-5 sm:p-6"
      role="region"
      aria-labelledby="first-run-heading"
    >
      <div className="flex items-start gap-3">
        <Play className="mt-1 h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
        <div className="flex-1">
          <h3 id="first-run-heading" className="text-base font-semibold text-emerald-100">
            Next: First run in 3 steps
          </h3>
          <ol className="mt-4 space-y-3 text-sm leading-6">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 font-mono text-xs font-semibold text-emerald-300">
                1
              </span>
              <div className="flex-1">
                <p className="font-medium text-zinc-100">
                  Install and enable the CEP panel in Premiere
                </p>
                <p className="mt-1 text-zinc-400">
                  Open <span className="text-zinc-200">Window → Extensions → MCP for Adobe Premiere Pro</span>. Keep the panel open.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 font-mono text-xs font-semibold text-emerald-300">
                2
              </span>
              <div className="flex-1">
                <p className="font-medium text-zinc-100">
                  Fully quit and reopen both apps
                </p>
                <p className="mt-1 text-zinc-400">
                  Restart Premiere and your assistant, then open a project and select a sequence.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 font-mono text-xs font-semibold text-emerald-300">
                3
              </span>
              <div className="flex-1">
                <p className="font-medium text-zinc-100">
                  Run the safe first prompt (one-click copy)
                </p>
                <div className="mt-2 flex flex-col gap-3 rounded-lg border border-zinc-700/50 bg-black/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <code className="flex-1 font-mono text-xs leading-6 text-zinc-200">
                    {safeFirstPrompt}
                  </code>
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f0a]"
                  >
                    {promptCopied ? (
                      <>
                        <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        Copy prompt
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  This prompt checks your connection and makes no changes.
                </p>
              </div>
            </li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-4 border-t border-emerald-400/20 pt-4">
            <Link
              href="/docs/troubleshooting"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-200 transition-colors hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              Need setup help?
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
