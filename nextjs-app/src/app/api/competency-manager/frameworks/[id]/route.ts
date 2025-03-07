import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET a specific framework
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const framework = await prisma.competencyFramework.findUnique({
      where: {
        id,
      },
      include: {
        competencies: {
          include: {
            levels: true,
          },
        },
      },
    });

    if (!framework) {
      return NextResponse.json(
        { error: "Framework not found" },
        { status: 404 }
      );
    }

    // Check if the user is the owner of the framework
    if (framework.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to access this framework" },
        { status: 403 }
      );
    }

    return NextResponse.json(framework);
  } catch (error) {
    console.error("Error fetching framework:", error);
    return NextResponse.json(
      { error: "Failed to fetch framework" },
      { status: 500 }
    );
  }
}

// PATCH (update) a framework
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { name, description } = await request.json();

    // Check if the framework exists
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

    // Check if the user is the owner of the framework
    if (framework.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this framework" },
        { status: 403 }
      );
    }

    // Update the framework
    const updatedFramework = await prisma.competencyFramework.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
      include: {
        competencies: {
          include: {
            levels: true,
          },
        },
      },
    });

    return NextResponse.json({ framework: updatedFramework });
  } catch (error) {
    console.error("Error updating framework:", error);
    return NextResponse.json(
      { error: "Failed to update framework" },
      { status: 500 }
    );
  }
}
