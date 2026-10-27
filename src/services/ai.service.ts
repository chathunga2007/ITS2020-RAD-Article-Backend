import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables")
}

const ai = new GoogleGenAI({ apiKey })

export const genrateArticleDescription = async (promtText: string) => {
  const res = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `What is ${promtText}`,
    config: {
      maxOutputTokens: 500
    }
  })
  const description = res.text
  return description
}