import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    const { question } = await req.json();

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Extract potential topics from the question
    const topicExtractPrompt = `
      Analyze the following educational question and extract the main topic or subject area it belongs to.
      Return only a single word or short phrase (2-3 words maximum) that best categorizes this question.
      
      Question: ${question}
    `;

    const topicResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a topic classifier for educational questions.",
        },
        { role: "user", content: topicExtractPrompt },
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    const topic =
      topicResponse.choices[0]?.message?.content?.trim() || "General";

    // Generate tags for the question
    const tagsPrompt = `
      Generate 3-5 relevant tags for the following educational question.
      Return only the tags as a comma-separated list, with no additional text.
      
      Question: ${question}
    `;

    const tagsResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a tag generator for educational content.",
        },
        { role: "user", content: tagsPrompt },
      ],
      temperature: 0.3,
      max_tokens: 50,
    });

    const tagsText = tagsResponse.choices[0]?.message?.content?.trim() || "";
    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Main educational answer generation
    const prompt = `
      You are an expert educational tutor. Your task is to provide a detailed, accurate, and educational answer to the following question.
      
      Question: ${question}
      
      Instructions:
      1. Start with a clear, direct answer to the question
      2. Provide a detailed explanation with relevant examples
      3. Include key concepts and definitions
      4. Use a step-by-step approach when explaining processes or complex ideas
      5. Conclude with a brief summary
      
      Important:
      - Do NOT use markdown formatting
      - Use plain text only
      - Organize your answer with clear paragraph breaks
      - Use simple formatting like numbered lists (1., 2., etc.) or bullet points (-, *) if needed
      - Keep your answer educational, accurate, and helpful
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational tutor specializing in providing detailed, accurate answers to academic questions.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const answer =
      response.choices[0]?.message?.content?.trim() ||
      "I couldn't generate an answer. Please try again.";

    // Save the question and answer to the database
    const questionId = uuidv4();

    await prisma.knowledgeEntry.create({
      data: {
        id: questionId,
        question,
        answer,
        topics: [topic],
        tags,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      id: questionId,
      answer,
      topic,
      tags,
    });
  } catch (error) {
    console.error("Error in Knowledge GPT API:", error);
    return NextResponse.json(
      { error: "Failed to generate answer" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const tag = searchParams.get("tag");
    const topic = searchParams.get("topic");
    const query = searchParams.get("query");

    let entries;

    if (tag) {
      entries = await prisma.knowledgeEntry.findMany({
        where: {
          userId,
          tags: {
            has: tag,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (topic) {
      entries = await prisma.knowledgeEntry.findMany({
        where: {
          userId,
          topics: {
            has: topic,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else if (query) {
      entries = await prisma.knowledgeEntry.findMany({
        where: {
          userId,
          OR: [
            {
              question: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              answer: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      entries = await prisma.knowledgeEntry.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
      });
    }

    return NextResponse.json({ entries });
  } catch (error) {
    logger.error("Failed to retrieve knowledge entries", error);
    return handleAPIError(error);
  }
}
