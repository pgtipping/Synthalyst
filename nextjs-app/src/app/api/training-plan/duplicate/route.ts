import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Training plan ID is required" },
        { status: 400 }
      );
    }

    const originalPlan = await prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!originalPlan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Create a duplicate with updated metadata
    const existingContent = originalPlan.content as unknown as Record<
      string,
      unknown
    >;
    const content = {
      ...existingContent,
      metadata: {
        ...(existingContent.metadata as Record<string, unknown>),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.email,
      },
    };

    // Create the duplicate
    const duplicatePlan = await prisma.trainingPlan.create({
      data: {
        title: `${originalPlan.title} (Copy)`,
        description: originalPlan.description,
        objectives: originalPlan.objectives,
        content: content as any, // Prisma will handle the JSON serialization
        userId: session.user.id,
      },
    });

    // Transform the plan to include parsed content
    const transformedPlan = {
      ...duplicatePlan,
      content: duplicatePlan.content as unknown as Record<string, unknown>, // Safe cast since we know the content structure
    };

    return NextResponse.json({ plan: transformedPlan }, { status: 201 });
  } catch (error) {
    console.error("Error duplicating training plan:", error);
    return NextResponse.json(
      { error: "Failed to duplicate training plan" },
      { status: 500 }
    );
  }
}
