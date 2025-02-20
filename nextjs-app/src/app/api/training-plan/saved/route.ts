import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const savedPlans = await prisma.trainingPlan.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter and transform the plans to include parsed content
    const transformedPlans = savedPlans
      .map((plan) => ({
        ...plan,
        content: plan.content as unknown as Record<string, unknown>,
      }))
      .filter((plan) => {
        const content = plan.content as Record<string, unknown>;
        const metadata = content.metadata as Record<string, unknown>;
        return metadata?.isTemplate !== true;
      });

    return NextResponse.json({ plans: transformedPlans });
  } catch (error) {
    console.error("Error fetching saved plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved plans" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const plan = await prisma.trainingPlan.findUnique({
      where: { id: params.id },
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
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting training plan:", error);
    return NextResponse.json(
      { error: "Failed to delete training plan" },
      { status: 500 }
    );
  }
}
