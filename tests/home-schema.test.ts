import { describe, expect, it } from "vitest"
import { homeStructuredData } from "../components/analytics/home-structured-data"
import { faqItems } from "../components/sections/faq"

describe("homepage entity and FAQ evidence", () => {
  it("uses the source-code type for codeRepository and links it to the application", () => {
    const graph = homeStructuredData["@graph"]
    const source = graph.find(node => node["@type"] === "SoftwareSourceCode")
    const app = graph.find(node => node["@type"] === "SoftwareApplication")
    expect(source).toMatchObject({ codeRepository: "https://github.com/leancoderkavy/premiere-pro-mcp", targetProduct: { "@id": app?.["@id"] } })
    expect(app).not.toHaveProperty("codeRepository")
  })
  it("has one FAQ entity whose answers match visible content", () => {
    const faqs = homeStructuredData["@graph"].filter(node => node["@type"] === "FAQPage")
    expect(faqs).toHaveLength(1)
    expect(faqs[0].mainEntity).toEqual(faqItems.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })))
  })
})
