import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all industries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const industries = await prisma.industry.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ industries });
  } catch (error) {
    console.error("Industry fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch industries" },
      { status: 500 }
    );
  }
}

// POST a new industry
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

    if (!name) {
      return NextResponse.json(
        { error: "Industry name is required" },
        { status: 400 }
      );
    }

    // Check if industry already exists
    const existingIndustry = await prisma.industry.findUnique({
      where: {
        name,
      },
    });

    if (existingIndustry) {
      return NextResponse.json(
        { error: "Industry with this name already exists" },
        { status: 409 }
      );
    }

    const industry = await prisma.industry.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ industry }, { status: 201 });
  } catch (error) {
    console.error("Industry creation error:", error);
    return NextResponse.json(
      { error: "Failed to create industry" },
      { status: 500 }
    );
  }
}

// PUT (update) an industry
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

    if (!id || !name) {
      return NextResponse.json(
        { error: "Industry ID and name are required" },
        { status: 400 }
      );
    }

    // Check if industry exists
    const existingIndustry = await prisma.industry.findUnique({
      where: {
        id,
      },
    });

    if (!existingIndustry) {
      return NextResponse.json(
        { error: "Industry not found" },
        { status: 404 }
      );
    }

    // Check if new name conflicts with another industry
    if (name !== existingIndustry.name) {
      const nameConflict = await prisma.industry.findUnique({
        where: {
          name,
        },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: "Another industry with this name already exists" },
          { status: 409 }
        );
      }
    }

    const updatedIndustry = await prisma.industry.update({
      where: {
        id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json({ industry: updatedIndustry });
  } catch (error) {
    console.error("Industry update error:", error);
    return NextResponse.json(
      { error: "Failed to update industry" },
      { status: 500 }
    );
  }
}

// DELETE an industry
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
        { error: "Industry ID is required" },
        { status: 400 }
      );
    }

    // Check if industry exists
    const existingIndustry = await prisma.industry.findUnique({
      where: {
        id,
      },
      include: {
        competencies: {
          select: {
            id: true,
          },
        },
        competencyFrameworks: {
          select: {
            id: true,
          },
        },
        competencyMatrices: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingIndustry) {
      return NextResponse.json(
        { error: "Industry not found" },
        { status: 404 }
      );
    }

    // Check if industry is in use
    const inUseCount =
      existingIndustry.competencies.length +
      existingIndustry.competencyFrameworks.length +
      existingIndustry.competencyMatrices.length;

    if (inUseCount > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete industry that is in use",
          inUseCount,
        },
        { status: 409 }
      );
    }

    await prisma.industry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: "Industry deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Industry deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete industry" },
      { status: 500 }
    );
  }
}
