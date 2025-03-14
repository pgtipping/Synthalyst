import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the update notes request
const updateNotesSchema = z.object({
  notes: z.string().optional(),
});

// API route for fetching a specific question
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true },
    });

    const hasPremiumAccess = user?.subscriptions.some(
      (sub) => sub.status === "active" && sub.plan.includes("premium")
    );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Fetch the question with user's saved status
    const question = await prisma.questionLibrary.findUnique({
      where: { id },
      include: {
        userSaves: {
          where: { userId: user.id },
          select: { id: true, notes: true },
        },
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Transform the result to include isSaved flag
    const transformedQuestion = {
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
    };

    return NextResponse.json(transformedQuestion);
  } catch (error) {
    console.error("Error fetching question:", error);
    return NextResponse.json(
      { error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}

// API route for updating user notes on a saved question
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true },
    });

    const hasPremiumAccess = user?.subscriptions.some(
      (sub) => sub.status === "active" && sub.plan.includes("premium")
    );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = updateNotesSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { notes } = validationResult.data;

    // Check if the question exists
    const question = await prisma.questionLibrary.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if the question is saved by the user
    const savedQuestion = await prisma.userSavedQuestion.findFirst({
      where: {
        userId: user.id,
        questionId: id,
      },
    });

    if (!savedQuestion) {
      return NextResponse.json(
        { error: "Question not saved by user" },
        { status: 404 }
      );
    }

    // Update the notes
    const updatedSave = await prisma.userSavedQuestion.update({
      where: { id: savedQuestion.id },
      data: { notes },
    });

    return NextResponse.json({
      message: "Notes updated successfully",
      savedQuestion: updatedSave,
    });
  } catch (error) {
    console.error("Error updating notes:", error);
    return NextResponse.json(
      { error: "Failed to update notes" },
      { status: 500 }
    );
  }
}

// API route for removing a question from saved questions
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true },
    });

    const hasPremiumAccess = user?.subscriptions.some(
      (sub) => sub.status === "active" && sub.plan.includes("premium")
    );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    const { id } = params;

    // Check if the question exists
    const question = await prisma.questionLibrary.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check if the question is saved by the user
    const savedQuestion = await prisma.userSavedQuestion.findFirst({
      where: {
        userId: user.id,
        questionId: id,
      },
    });

    if (!savedQuestion) {
      return NextResponse.json(
        { error: "Question not saved by user" },
        { status: 404 }
      );
    }

    // Delete the saved question
    await prisma.userSavedQuestion.delete({
      where: { id: savedQuestion.id },
    });

    return NextResponse.json({
      message: "Question removed from saved questions",
    });
  } catch (error) {
    console.error("Error removing saved question:", error);
    return NextResponse.json(
      { error: "Failed to remove saved question" },
      { status: 500 }
    );
  }
}
