import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      (session.user.role !== "ADMIN" &&
        session.user.email !== "pgtipping1@gmail.com")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const inquiryType = searchParams.get("inquiryType");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the query
    let whereClause = {};

    if (status) {
      whereClause = { ...whereClause, status };
    }

    if (inquiryType) {
      whereClause = { ...whereClause, inquiryType };
    }

    if (search) {
      whereClause = {
        ...whereClause,
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { subject: { contains: search, mode: "insensitive" } },
          { message: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    // Get submissions with reply count and last replied at
    const submissions = await prisma.$queryRaw`
      SELECT cs.*, 
        (SELECT COUNT(*) FROM "ContactSubmissionReply" csr WHERE csr."contactSubmissionId" = cs.id) as "replyCount",
        (SELECT MAX(csr."createdAt") FROM "ContactSubmissionReply" csr WHERE csr."contactSubmissionId" = cs.id) as "lastRepliedAt"
      FROM "ContactSubmission" cs 
      ORDER BY cs."createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // Get total count for pagination
    const totalCount = await prisma.contactSubmission.count({
      where: whereClause,
    });

    return NextResponse.json({
      data: submissions,
      meta: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact submissions" },
      { status: 500 }
    );
  }
}
