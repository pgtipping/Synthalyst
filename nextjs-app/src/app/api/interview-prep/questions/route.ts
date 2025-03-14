import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the save question request
const saveQuestionSchema = z.object({
  questionId: z.string().min(1, "Question ID is required"),
  notes: z.string().optional(),
});

// Define interfaces for our models
interface QuestionLibraryItem {
  id: string;
  question: string;
  answer: string;
  jobType: string;
  industry: string;
  difficulty: string;
  category: string;
  tags: string[];
  userSaves: Array<{ id: string; notes: string | null }>;
  createdAt: Date;
  updatedAt: Date;
}

// API route for fetching questions with filters
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has premium access
    // For testing purposes, all authenticated users are treated as premium
    const hasPremiumAccess = true; // Temporary override for testing

    // We still need to get the user for the database operations
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Original premium check (commented out for testing)
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email as string },
    //   include: { subscriptions: true },
    // });
    // const hasPremiumAccess = user?.subscriptions.some(
    //   (sub) => sub.status === "active" && sub.plan.includes("premium")
    // );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const jobType = url.searchParams.get("jobType");
    const industry = url.searchParams.get("industry");
    const difficulty = url.searchParams.get("difficulty");
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Build the query
    const where: {
      jobType?: string;
      industry?: string;
      difficulty?: string;
      category?: string;
    } = {};
    if (jobType) where.jobType = jobType;
    if (industry) where.industry = industry;
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    try {
      // Fetch questions with filters
      const [questions, totalCount] = await Promise.all([
        prisma.QuestionLibrary.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            userSaves: {
              where: { userId: user.id },
              select: { id: true, notes: true },
            },
          },
        }),
        prisma.QuestionLibrary.count({ where }),
      ]);

      // Transform the results to include isSaved flag
      const transformedQuestions = questions.map(
        (question: QuestionLibraryItem) => ({
          id: question.id,
          question: question.question,
          answer: question.answer,
          jobType: question.jobType,
          industry: question.industry,
          difficulty: question.difficulty,
          category: question.category,
          tags: question.tags,
          isSaved: question.userSaves.length > 0,
          savedNotes: question.userSaves[0]?.notes || null,
          savedId: question.userSaves[0]?.id || null,
        })
      );

      // Return the questions with pagination info
      return NextResponse.json({
        questions: transformedQuestions,
        pagination: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      console.error("Error accessing question library:", error);
      // If the table doesn't exist yet, return empty results
      return NextResponse.json({
        questions: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// API route for saving a user question
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has premium access
    // For testing purposes, all authenticated users are treated as premium
    const hasPremiumAccess = true; // Temporary override for testing

    // We still need to get the user for the database operations
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Original premium check (commented out for testing)
    // const user = await prisma.user.findUnique({
    //   where: { email: session.user.email as string },
    //   include: { subscriptions: true },
    // });
    // const hasPremiumAccess = user?.subscriptions.some(
    //   (sub) => sub.status === "active" && sub.plan.includes("premium")
    // );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = saveQuestionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { questionId, notes } = validationResult.data;

    // Check if the question exists
    const question = await prisma.QuestionLibrary.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if the question is already saved by the user
    const existingSave = await prisma.UserSavedQuestion.findFirst({
      where: {
        userId: user.id,
        questionId,
      },
    });

    if (existingSave) {
      // Update existing save with new notes
      const updatedSave = await prisma.UserSavedQuestion.update({
        where: { id: existingSave.id },
        data: { notes },
      });

      return NextResponse.json({
        message: "Question updated successfully",
        savedQuestion: updatedSave,
      });
    } else {
      // Create new save
      const savedQuestion = await prisma.UserSavedQuestion.create({
        data: {
          userId: user.id,
          questionId,
          notes,
        },
      });

      return NextResponse.json({
        message: "Question saved successfully",
        savedQuestion,
      });
    }
  } catch (error) {
    console.error("Error saving question:", error);
    return NextResponse.json(
      { error: "Failed to save question" },
      { status: 500 }
    );
  }
}
