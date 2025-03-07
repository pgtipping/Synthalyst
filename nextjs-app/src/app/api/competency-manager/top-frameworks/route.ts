import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET top-rated public frameworks
export async function GET() {
  try {
    // Fetch top-rated public frameworks
    const frameworks = await prisma.competencyFramework.findMany({
      where: {
        isPublic: true,
        feedbackCount: {
          gt: 0, // Only include frameworks with at least one rating
        },
      },
      orderBy: [
        {
          averageRating: "desc", // Sort by highest rating first
        },
        {
          feedbackCount: "desc", // Then by number of ratings
        },
      ],
      take: 10, // Limit to top 10
      include: {
        competencies: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    // Add AI-generated badge and clean up user information
    const formattedFrameworks = frameworks.map((framework) => ({
      ...framework,
      userId: undefined, // Remove user ID for privacy
      user: undefined, // Remove user object
      isAIGenerated: true, // All frameworks are AI-generated
    }));

    return NextResponse.json({
      frameworks: formattedFrameworks,
    });
  } catch (error) {
    console.error("Error fetching top frameworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch top frameworks" },
      { status: 500 }
    );
  }
}
