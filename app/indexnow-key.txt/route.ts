// IndexNow requires a publicly readable ownership token. Keep configuration out
// of source control; this token grants URL notification, not application access.
export const dynamic = "force-dynamic"

export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key || !/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
    return new Response("IndexNow is not configured", { status: 503 })
  }
  return new Response(key, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300", "X-Robots-Tag": "noindex" },
  })
}
