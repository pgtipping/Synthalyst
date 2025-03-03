import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure API key is defined
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables");
}

export const geminiApi = new GoogleGenerativeAI(apiKey || "");

export const getGeminiModel = () => {
  return geminiApi.getGenerativeModel({ model: "gemini-2.0-flash" });
};
