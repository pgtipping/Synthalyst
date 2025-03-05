import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

export default async function handler(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;
    if (typeof prompt !== "string") {
      throw new Error("Prompt must be a string");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
    });

    return NextResponse.json({
      completion: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    console.error("Error generating completion:", error);
    return NextResponse.json(
      { error: "Failed to generate completion" },
      { status: 500 }
    );
  }
}
