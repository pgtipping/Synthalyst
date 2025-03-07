import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST a new feedback for a competency framework
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const {
      frameworkId,
      rating,
      feedback,
      isPublic = true,
      llmQualityFeedback,
      llmImprovementSuggestion,
    } = await request.json();

    // Validate required fields
    if (!frameworkId || !rating) {
      return NextResponse.json(
        { error: "Framework ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if the framework exists
    const framework = await prisma.competencyFramework.findUnique({
      where: {
        id: frameworkId,
      },
    });

    if (!framework) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    // Create the feedback
    const newFeedback = await prisma.competencyFrameworkFeedback.create({
      data: {
        frameworkId,
        rating,
        feedback: feedback || "",
        userId: session?.user?.id || null,
        isPublic: isPublic,
        llmQualityFeedback: llmQualityFeedback || null,
        llmImprovementSuggestion: llmImprovementSuggestion || "",
      },
    });

    // Update the framework's average rating
    const allFeedback = await prisma.competencyFrameworkFeedback.findMany({
      where: {
        frameworkId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = allFeedback.reduce(
      (sum: number, item: { rating: number }) => sum + item.rating,
      0
    );
    const averageRating = totalRating / allFeedback.length;

    await prisma.competencyFramework.update({
      where: {
        id: frameworkId,
      },
      data: {
        averageRating: averageRating,
        feedbackCount: allFeedback.length,
      },
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully", feedback: newFeedback },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

// GET all feedback for a competency framework
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkId = searchParams.get("frameworkId");

    if (!frameworkId) {
      return NextResponse.json(
        { error: "Framework ID is required" },
        { status: 400 }
      );
    }

    // Check if the framework exists
    const framework = await prisma.competencyFramework.findUnique({
      where: {
        id: frameworkId,
      },
    });

    if (!framework) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    // Get all feedback for the framework
    const feedback = await prisma.competencyFrameworkFeedback.findMany({
      where: {
        frameworkId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate statistics
    const totalFeedback = feedback.length;
    const totalRating = feedback.reduce(
      (sum: number, item: { rating: number }) => sum + item.rating,
      0
    );
    const averageRating = totalFeedback > 0 ? totalRating / totalFeedback : 0;

    // Count ratings by value
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    feedback.forEach((item) => {
      ratingCounts[item.rating as 1 | 2 | 3 | 4 | 5]++;
    });

    // Get LLM improvement data (for internal use)
    const llmFeedback = feedback
      .filter((item) => item.llmQualityFeedback)
      .map((item) => ({
        qualityFeedback: item.llmQualityFeedback,
        improvementSuggestion: item.llmImprovementSuggestion,
        rating: item.rating,
        createdAt: item.createdAt,
      }));

    return NextResponse.json({
      feedback,
      statistics: {
        totalFeedback,
        averageRating,
        ratingCounts,
      },
      llmFeedback,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
