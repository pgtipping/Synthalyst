import { NextApiRequest, NextApiResponse } from "next";
import { Groq } from "groq-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { prompt } = req.body;
    if (typeof prompt !== "string") {
      throw new Error("Prompt must be a string");
    }

    const groq = new Groq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
    });

    res
      .status(200)
      .json({ completion: completion.choices[0]?.message?.content || "" });
  } catch (error) {
    console.error("Error generating completion:", error);
    res.status(500).json({ error: "Failed to generate completion" });
  }
}
