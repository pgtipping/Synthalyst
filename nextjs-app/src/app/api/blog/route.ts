import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { Groq } from "groq-sdk";

const blogPostSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  style: z.string().min(1, "Style is required"),
  audience: z.string().min(1, "Target audience is required"),
});

export async function POST(request: Request) {
  try {
    const { topic, style, audience } = await validateRequest(
      request,
      blogPostSchema
    );

    logger.info("Generating blog post", { topic, style, audience });

    const prompt = `
    Write a comprehensive, engaging blog post about "${topic}".

    Guidelines:
    - Target audience: ${audience}
    - Writing style: ${style}
    - Structure:
      1. Compelling introduction that hooks the reader
      2. 3-4 main sections with clear headings
      3. Practical insights and actionable takeaways
      4. Conclusion that reinforces key messages

    Ensure the content is:
    - Informative and well-researched
    - Written in a conversational yet professional tone
    - Includes relevant examples or case studies
    - Approximately 800-1200 words long
    `;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content: "You are a professional blog content generator.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Failed to generate blog post content");
    }

    logger.info("Successfully generated blog post");

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error) {
    logger.error("Failed to generate blog post", error);
    return handleAPIError(error);
  }
}
