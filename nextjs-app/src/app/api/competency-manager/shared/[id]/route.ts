import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;

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

    // Check if the framework is public
    if (!framework.isPublic) {
      return NextResponse.json(
        { error: "This framework is not publicly shared" },
        { status: 403 }
      );
    }

    return NextResponse.json(framework);
  } catch (error) {
    console.error("Error fetching shared framework:", error);
    return NextResponse.json(
      { error: "Failed to fetch framework" },
      { status: 500 }
    );
  }
}
