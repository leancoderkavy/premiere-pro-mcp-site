export type ArticleSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  steps?: string[]
  codeBlocks?: Array<{ label: string; code: string }>
  links?: Array<{ label: string; href: string }>
}

export type ArticleFaq = {
  question: string
  answer: string
}

export type Article = {
  slug: string
  title: string
  seoTitle?: string
  description: string
  eyebrow: string
  publishedAt: string
  modifiedAt: string
  readingTime: string
  keywords: string[]
  sections: ArticleSection[]
  faqs: ArticleFaq[]
  resources: Array<{ label: string; href: string }>
  relatedSlugs?: string[]
  workflowKit?: string
}
