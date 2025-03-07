import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Framework ID is required" },
      { status: 400 }
    );
  }

  try {
    const framework = await prisma.competencyFramework.findUnique({
      where: {
        id,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        competencies: {
          include: {
            levels: true,
          },
        },
        feedback: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!framework) {
      return NextResponse.json(
        { error: "Framework not found or not publicly shared" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = framework.feedback.map((f) => f.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : null;

    // Transform the data to include calculated fields
    const transformedFramework = {
      ...framework,
      feedback: undefined, // Remove raw feedback data
      averageRating,
      feedbackCount: ratings.length,
      competencies: framework.competencies.map((competency) => ({
        ...competency,
        levels: competency.levels.map((level) => ({
          ...level,
          behavioralIndicators: level.behavioralIndicators || [],
          developmentSuggestions: level.developmentSuggestions || [],
        })),
      })),
    };

    return NextResponse.json(transformedFramework);
  } catch (error) {
    console.error("Error fetching framework:", error);
    return NextResponse.json(
      { error: "Failed to fetch framework" },
      { status: 500 }
    );
  }
}
