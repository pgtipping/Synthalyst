import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const processed = searchParams.get("processed");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the query
    let whereClause = {};

    if (processed !== null) {
      whereClause = { ...whereClause, processed: processed === "true" };
    }

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { fromEmail: { contains: search, mode: "insensitive" } },
          { fromFull: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
          { textContent: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Get inbound emails
    const emails = await prisma.inboundEmail.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.inboundEmail.count({
      where: whereClause,
    });

    return NextResponse.json({
      data: emails,
      meta: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching inbound emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch inbound emails" },
      { status: 500 }
    );
  }
}
