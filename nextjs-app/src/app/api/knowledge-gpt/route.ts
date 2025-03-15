import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";
import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";
import {
  MODELS,
  TaskType,
  detectTaskComplexity,
  selectModel,
  generateContent,
  createMultilingualSystemPrompt,
} from "@/lib/ai/model-router";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    const { question, language = "English" } = await req.json();

    if (!question || typeof question !== "string" || question.trim() === "") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    // Detect task complexity
    const complexity = detectTaskComplexity(question);

    // Select the appropriate model
    const model = selectModel({
      taskType: TaskType.KNOWLEDGE_GPT,
      complexity,
      language,
    });

    // Extract potential topics from the question
    const topicExtractSystemPrompt =
      "You are a topic classifier for educational questions.";
    const topicExtractUserPrompt = `
      Analyze the following educational question and extract the main topic or subject area it belongs to.
      Return only a single word or short phrase (2-3 words maximum) that best categorizes this question.
      
      Question: ${question}
    `;

    const topic = await generateContent(
      model,
      createMultilingualSystemPrompt(topicExtractSystemPrompt, language),
      topicExtractUserPrompt,
      0.3,
      20
    );

    // Generate tags for the question
    const tagsSystemPrompt = "You are a tag generator for educational content.";
    const tagsUserPrompt = `
      Generate 3-5 relevant tags for the following educational question.
      Return only the tags as a comma-separated list, with no additional text.
      
      Question: ${question}
    `;

    const tagsText = await generateContent(
      model,
      createMultilingualSystemPrompt(tagsSystemPrompt, language),
      tagsUserPrompt,
      0.3,
      50
    );

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    // Main educational answer generation
    const answerSystemPrompt =
      "You are an expert educational tutor specializing in providing detailed, accurate answers to academic questions.";
    const answerUserPrompt = `
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

    const answer = await generateContent(
      model,
      createMultilingualSystemPrompt(answerSystemPrompt, language),
      answerUserPrompt,
      0.7,
      1500
    );

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
        language,
        modelUsed: model,
      },
    });

    return NextResponse.json({
      id: questionId,
      answer,
      topic,
      tags,
      modelUsed: model,
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
    const language = searchParams.get("language");

    type WhereClause = {
      userId: string;
      tags?: { has: string };
      topics?: { has: string };
      OR?: Array<
        | { question: { contains: string; mode: string } }
        | { answer: { contains: string; mode: string } }
      >;
      language?: string;
    };

    const whereClause: WhereClause = { userId };

    if (tag) {
      whereClause.tags = { has: tag };
    } else if (topic) {
      whereClause.topics = { has: topic };
    } else if (query) {
      whereClause.OR = [
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
      ];
    }

    if (language) {
      whereClause.language = language;
    }

    const entries = await prisma.knowledgeEntry.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Failed to retrieve knowledge entries", error);
    return NextResponse.json(
      { error: "Failed to retrieve knowledge entries" },
      { status: 500 }
    );
  }
}
