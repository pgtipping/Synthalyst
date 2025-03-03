import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Schema for validating the request body
const saveSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to save a training plan" },
        { status: 401 }
      );
    }

    // Extract and validate the request body
    const body = await req.json();
    const validatedData = saveSchema.parse(body);

    // Save the training plan to the database
    const savedPlan = await prisma.trainingPlan.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        user: {
          connectOrCreate: {
            where: { email: session.user.email as string },
            create: { email: session.user.email as string },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: savedPlan.id,
        title: savedPlan.title,
      },
    });
  } catch (error) {
    console.error("Error saving training plan:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save training plan" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to view saved training plans" },
        { status: 401 }
      );
    }

    // Get all saved training plans for the user
    const savedPlans = await prisma.trainingPlan.findMany({
      where: {
        user: {
          email: session.user.email as string,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: savedPlans,
    });
  } catch (error) {
    console.error("Error fetching saved training plans:", error);

    return NextResponse.json(
      { error: "Failed to fetch saved training plans" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const plan = await prisma.trainingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Training plan not found" },
        { status: 404 }
      );
    }

    if (plan.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this plan" },
        { status: 403 }
      );
    }

    await prisma.trainingPlan.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting training plan:", error);
    return NextResponse.json(
      { error: "Failed to delete training plan" },
      { status: 500 }
    );
  }
}
