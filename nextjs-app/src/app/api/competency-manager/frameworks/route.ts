import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all saved frameworks for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const frameworks = await prisma.competencyFramework.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        competencies: {
          include: {
            levels: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ frameworks });
  } catch (error) {
    console.error("Error fetching frameworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch frameworks" },
      { status: 500 }
    );
  }
}

// DELETE a framework
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Framework ID is required" },
        { status: 400 }
      );
    }

    // Check if the framework exists and belongs to the user
    const framework = await prisma.competencyFramework.findUnique({
      where: {
        id,
      },
    });

    if (!framework) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    if (framework.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this framework" },
        { status: 403 }
      );
    }

    // Delete the framework (cascade delete will handle competencies and levels)
    await prisma.competencyFramework.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Framework deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting framework:", error);
    return NextResponse.json(
      { error: "Failed to delete framework" },
      { status: 500 }
    );
  }
}
