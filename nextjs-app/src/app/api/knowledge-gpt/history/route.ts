import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to use this feature" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");

    // Fetch questions based on topic filter or get all
    const questions = await prisma.knowledgeEntry.findMany({
      where: {
        userId: session.user.id,
        ...(topic && topic !== "all" ? { topics: { has: topic } } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to most recent 50 questions
    });

    // Transform the data to match the expected format in the frontend
    const transformedQuestions = questions.map((q) => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      topic: q.topics[0] || "General",
      tags: q.tags,
      timestamp: q.createdAt.toISOString(),
    }));

    return NextResponse.json({ questions: transformedQuestions });
  } catch (error) {
    console.error("Error fetching question history:", error);
    return NextResponse.json(
      { error: "Failed to fetch question history" },
      { status: 500 }
    );
  }
}
