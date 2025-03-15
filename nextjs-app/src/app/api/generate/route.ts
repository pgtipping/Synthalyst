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
      // Simple, clear prompt that's less likely to trigger content filters
      systemPrompt = `You are a helpful assistant. Provide accurate information about ${question}.`;

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please respond in ${language}.`;
      }
    } else if (type === "learning") {
      // Simple, clear prompt that's less likely to trigger content filters
      systemPrompt = `You are a helpful assistant. Create educational content about ${question}.`;

      // Add language instruction if not English
      if (language !== "English") {
        systemPrompt += ` Please create the content in ${language}.`;
      }
    }

    try {
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

      // Provide a more helpful error message to the client
      if (error instanceof Error) {
        if (error.message.includes("moderation")) {
          return NextResponse.json(
            {
              content:
                "I'm unable to provide a response to this question due to content moderation. Please try rephrasing your question in a different way.",
            },
            { status: 200 } // Return 200 with error message in content
          );
        } else if (error.message.includes("API key")) {
          // Don't expose API key errors to the client
          console.error("API key error:", error);
          return NextResponse.json(
            {
              content:
                "I'm sorry, I encountered an error while generating a response. Please try again later.",
            },
            { status: 200 } // Return 200 with generic error message
          );
        }
      }

      // For other errors, return a generic error
      return NextResponse.json(
        {
          content:
            "I'm sorry, I encountered an error while generating a response. Please try again with a different question.",
        },
        { status: 200 } // Return 200 with error message in content
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        content:
          "I'm sorry, I encountered an error while processing your request. Please try again later.",
      },
      { status: 200 } // Return 200 with error message in content
    );
  }
}
