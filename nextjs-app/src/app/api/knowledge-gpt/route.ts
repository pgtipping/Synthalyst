import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { Groq } from "groq-sdk";

const requestSchema = z.object({
  question: z.string().min(1, "Question is required"),
  topics: z.array(z.string()).min(1, "At least one topic is required"),
});

export async function POST(request: Request) {
  try {
    const { question, topics } = await validateRequest(request, requestSchema);

    logger.info("Processing knowledge request", { question, topics });

    const prompt = `
    You are an expert teacher and knowledge curator. Please provide a detailed, accurate, and educational answer to the following question. Focus on the specified topics and provide practical examples where relevant.

    Question: ${question}
    Topics to focus on: ${topics.join(", ")}

    Please structure your response with:
    1. Direct answer to the question
    2. Detailed explanation
    3. Practical examples or applications
    4. Common misconceptions (if any)
    5. Additional resources or related topics to explore

    Make your explanation clear, engaging, and suitable for someone learning about these topics.
    Include code examples if the question is related to programming.
    Cite reliable sources or best practices where applicable.
    `;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system",
          content:
            "You are an expert teacher and knowledge curator, specializing in providing clear, accurate, and educational answers.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from LLM");
    }

    logger.info("Successfully generated knowledge response");

    return NextResponse.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    logger.error("Failed to process knowledge request", error);
    return handleAPIError(error);
  }
}
