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
    const averageRating =
      framework.feedback.length > 0
        ? framework.feedback.reduce((sum, item) => sum + item.rating, 0) /
          framework.feedback.length
        : null;

    return NextResponse.json({
      ...framework,
      averageRating,
      feedbackCount: framework.feedback.length,
      feedback: undefined, // Don't expose individual feedback
    });
  } catch (error) {
    console.error("Error fetching public framework:", error);
    return NextResponse.json(
      { error: "Failed to fetch framework" },
      { status: 500 }
    );
  }
}
