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
        rating,
        feedback: feedback || "",
        isPublic,
        llmQualityFeedback: llmQualityFeedback || "good",
        llmImprovementSuggestion: llmImprovementSuggestion || "",
        frameworkId,
        userId: session?.user?.id || null,
      },
    });

    // Update the framework's average rating and feedback count
    const allFeedback = await prisma.competencyFrameworkFeedback.findMany({
      where: {
        frameworkId,
      },
      select: {
        rating: true,
      },
    });

    const totalRating = allFeedback.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / allFeedback.length;
    const feedbackCount = allFeedback.length;

    await prisma.competencyFramework.update({
      where: {
        id: frameworkId,
      },
      data: {
        averageRating,
        feedbackCount,
      },
    });

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        feedback: newFeedback,
      },
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

// GET feedback for a competency framework
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const frameworkId = searchParams.get("frameworkId");

    // If frameworkId is provided, get feedback for that specific framework
    if (frameworkId) {
      // Get all feedback for the framework
      const feedbackItems = await prisma.competencyFrameworkFeedback.findMany({
        where: {
          frameworkId,
          isPublic: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          rating: true,
          feedback: true,
          createdAt: true,
          isPublic: true,
          llmQualityFeedback: true,
          userId: true,
        },
      });

      // Calculate statistics
      const totalFeedback = feedbackItems.length;
      let averageRating = 0;

      // Initialize rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: 0,
        percentage: 0,
      }));

      // Count quality feedback types
      const qualityFeedback = {
        good: 0,
        needsImprovement: 0,
      };

      if (totalFeedback > 0) {
        // Calculate total rating
        const totalRating = feedbackItems.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        averageRating = totalRating / totalFeedback;

        // Count ratings by value
        feedbackItems.forEach((item) => {
          const ratingIndex = item.rating - 1;
          ratingDistribution[ratingIndex].count += 1;

          // Count quality feedback
          if (item.llmQualityFeedback === "good") {
            qualityFeedback.good += 1;
          } else if (item.llmQualityFeedback === "needs_improvement") {
            qualityFeedback.needsImprovement += 1;
          }
        });

        // Calculate percentages
        ratingDistribution.forEach((item) => {
          item.percentage = parseFloat(
            ((item.count / totalFeedback) * 100).toFixed(1)
          );
        });
      }

      // Get recent feedback with comments
      const recentFeedback = feedbackItems
        .filter((item) => item.feedback.trim() !== "")
        .slice(0, 5)
        .map((item) => ({
          rating: item.rating,
          feedback: item.feedback,
          createdAt: item.createdAt.toISOString(),
        }));

      return NextResponse.json({
        averageRating,
        totalFeedback,
        ratingDistribution,
        qualityFeedback,
        recentFeedback,
      });
    }
    // If no frameworkId, return global statistics
    else {
      // Get all public feedback
      const allFeedback = await prisma.competencyFrameworkFeedback.findMany({
        where: {
          isPublic: true,
        },
        select: {
          rating: true,
          llmQualityFeedback: true,
          feedback: true,
          createdAt: true,
        },
      });

      const totalFeedback = allFeedback.length;
      let averageRating = 0;

      // Initialize rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        count: 0,
        percentage: 0,
      }));

      // Count quality feedback types
      const qualityFeedback = {
        good: 0,
        needsImprovement: 0,
      };

      if (totalFeedback > 0) {
        // Calculate total rating
        const totalRating = allFeedback.reduce(
          (sum, item) => sum + item.rating,
          0
        );
        averageRating = totalRating / totalFeedback;

        // Count ratings by value
        allFeedback.forEach((item) => {
          const ratingIndex = item.rating - 1;
          ratingDistribution[ratingIndex].count += 1;

          // Count quality feedback
          if (item.llmQualityFeedback === "good") {
            qualityFeedback.good += 1;
          } else if (item.llmQualityFeedback === "needs_improvement") {
            qualityFeedback.needsImprovement += 1;
          }
        });

        // Calculate percentages
        ratingDistribution.forEach((item) => {
          item.percentage = parseFloat(
            ((item.count / totalFeedback) * 100).toFixed(1)
          );
        });
      }

      // Get recent feedback with comments
      const recentFeedback = allFeedback
        .filter((item) => item.feedback.trim() !== "")
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10)
        .map((item) => ({
          rating: item.rating,
          feedback: item.feedback,
          createdAt: item.createdAt.toISOString(),
        }));

      return NextResponse.json({
        averageRating,
        totalFeedback,
        ratingDistribution,
        qualityFeedback,
        recentFeedback,
      });
    }
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
