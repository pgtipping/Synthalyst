import { NextApiRequest, NextApiResponse } from "next";
import { createCompletion } from "llama";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { prompt } = req.body;
    if (typeof prompt !== "string") {
      throw new Error("Prompt must be a string");
    }
    const completion = await createCompletion({
      model: "llama-3.2-1B-preview",
      prompt,
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    });
    res.status(200).json({ completion });
  } catch (error) {
    console.error("Error generating completion:", error);
    res.status(500).json({ error: "Failed to generate completion" });
  }
}
