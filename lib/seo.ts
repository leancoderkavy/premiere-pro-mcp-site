import type { Metadata } from "next"

const image = "/marketing/premiere-pro-mcp-social-square-v1.png"

export function pageMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : metadata.title && "absolute" in metadata.title ? metadata.title.absolute : undefined
  const canonical = metadata.alternates?.canonical
  const canonicalUrl = canonical && typeof canonical === "object" && "url" in canonical ? canonical.url : canonical
  const socialTitle = metadata.openGraph?.title ?? title
  const socialDescription = metadata.openGraph?.description ?? metadata.description
  return {
    ...metadata,
    ...(title ? { title: { absolute: title } } : {}),
    openGraph: {
      ...metadata.openGraph,
      title: socialTitle,
      description: socialDescription ?? undefined,
      url: canonicalUrl ?? undefined,
      siteName: "MCP for Adobe Premiere Pro",
      locale: "en_US",
      images: metadata.openGraph?.images ?? [image],
    },
    twitter: {
      card: "summary_large_image",
      ...metadata.twitter,
      title: socialTitle,
      description: socialDescription ?? undefined,
      images: metadata.twitter?.images ?? metadata.openGraph?.images ?? [image],
    },
  }
}
