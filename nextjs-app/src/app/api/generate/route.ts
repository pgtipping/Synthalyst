import { NextRequest, NextResponse } from "next/server";
import { generateContentV2 } from "@/lib/ai/model-router";

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      language = "English",
      type = "knowledge",
    } = await req.json();

    console.log(
      `API Request - Type: ${type}, Language: ${language}, Question: ${question}`
    );

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Create a system prompt based on the type and language
    let systemPrompt = "";

    if (type === "knowledge") {
      systemPrompt = `You are a knowledgeable assistant that provides accurate, detailed, and helpful information on any topic. Answer the following question with comprehensive information, examples, and explanations where appropriate.`;

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please respond in ${language}.`;
      }
    } else if (type === "learning") {
      systemPrompt = `You are an educational content creator specialized in creating comprehensive learning materials. Create detailed, well-structured educational content on the requested topic. Include key concepts, examples, and explanations.`;

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please create the content in ${language}.`;
      }
    }

    // Generate content using the appropriate model based on type
    const content = await generateContentV2({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      type,
      language,
    });

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
