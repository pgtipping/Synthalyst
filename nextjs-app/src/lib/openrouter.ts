import { OpenAI } from "openai";

export const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL, // Required for OpenRouter
    "X-Title": "Synthalyst Training Plan Creator", // Optional
  },
});
