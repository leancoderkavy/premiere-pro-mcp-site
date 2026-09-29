import { after } from "next/server"
import { createHomepageExperiment } from "@/lib/runtime/homepage-experiment"

// Same-origin, bounded homepage experiment events. See lib/runtime/homepage-experiment.ts.
const experiment = createHomepageExperiment()

function handle(request: Request) {
  return experiment.handleEvent(request, (task) => after(() => task))
}

export const POST = handle
export const GET = handle
export const PUT = handle
export const PATCH = handle
export const DELETE = handle
