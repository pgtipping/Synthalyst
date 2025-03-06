import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all competency categories
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const categories = await prisma.competencyCategory.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Competency category fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch competency categories" },
      { status: 500 }
    );
  }
}

// POST a new competency category
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin role for creating reference data
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const { name, description } = await request.json();

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existingCategory = await prisma.competencyCategory.findUnique({
      where: {
        name,
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      );
    }

    const category = await prisma.competencyCategory.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Competency category creation error:", error);
    return NextResponse.json(
      { error: "Failed to create competency category" },
      { status: 500 }
    );
  }
}

// PUT (update) a competency category
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin role for updating reference data
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const { id, name, description } = await request.json();

    if (!id || !name || !description) {
      return NextResponse.json(
        { error: "ID, name, and description are required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.competencyCategory.findUnique({
      where: {
        id,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if new name conflicts with another category
    if (name !== existingCategory.name) {
      const nameConflict = await prisma.competencyCategory.findUnique({
        where: {
          name,
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "Another category with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updatedCategory = await prisma.competencyCategory.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("Competency category update error:", error);
    return NextResponse.json(
      { error: "Failed to update competency category" },
      { status: 500 }
    );
  }
}

// DELETE a competency category
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin role for deleting reference data
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin privileges required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.competencyCategory.findUnique({
      where: {
        id,
      },
      include: {
        competencies: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category is in use
    if (existingCategory.competencies.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category that is in use by competencies",
          competencyCount: existingCategory.competencies.length,
        },
        { status: 409 }
      );
    }

    await prisma.competencyCategory.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Competency category deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete competency category" },
      { status: 500 }
    );
  }
}
