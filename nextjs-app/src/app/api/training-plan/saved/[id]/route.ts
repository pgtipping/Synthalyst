import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Training plan ID is required" },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to delete a training plan" },
        { status: 401 }
      );
    }

    // Find the training plan
    const trainingPlan = await prisma.trainingPlan.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!trainingPlan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Check if the user owns the training plan
    if (trainingPlan.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "You do not have permission to delete this training plan" },
        { status: 403 }
      );
    }

    // Delete the training plan
    await prisma.trainingPlan.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Training plan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting training plan:", error);

    return NextResponse.json(
      { error: "Failed to delete training plan" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Training plan ID is required" },
        { status: 400 }
      );
    }

    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view a training plan" },
        { status: 401 }
      );
    }

    // Find the training plan
    const trainingPlan = await prisma.trainingPlan.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!trainingPlan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    // Check if the user owns the training plan
    if (trainingPlan.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "You do not have permission to view this training plan" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: trainingPlan.id,
        title: trainingPlan.title,
        content: trainingPlan.content,
        createdAt: trainingPlan.createdAt,
        updatedAt: trainingPlan.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching training plan:", error);

    return NextResponse.json(
      { error: "Failed to fetch training plan" },
      { status: 500 }
    );
  }
}
