import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
// Extracted by scripts/sync-package-facts.mjs from the integrity-verified npm tarball.
import { validateFacilityIntakeTemplate } from "../data/project-intake-validator.js"

type StarterTemplateFile = {
  templates: Array<{
    key: string
    label: string
    description: string
    checks: string[]
    template: unknown
  }>
}

const starters = JSON.parse(
  readFileSync(join(process.cwd(), "lib", "project-intake-starter-templates.json"), "utf8"),
) as StarterTemplateFile

describe("Project Intake starter templates", () => {
  it("keeps every public starter template valid for the published preview tool", () => {
    expect(starters.templates.map((starter) => starter.key)).toEqual([
      "editorial_handoff",
      "proxy_ready",
      "delivery_preflight",
    ])

    for (const starter of starters.templates) {
      expect(starter.label).not.toHaveLength(0)
      expect(starter.description).not.toHaveLength(0)
      expect(starter.checks.length).toBeGreaterThan(0)
      const template = validateFacilityIntakeTemplate(starter.template)
      expect(template.approvedPathPrefixes).toEqual([])
      expect(JSON.stringify(template)).not.toMatch(/[A-Za-z]:[\/]|\\/)
    }
  })
})
