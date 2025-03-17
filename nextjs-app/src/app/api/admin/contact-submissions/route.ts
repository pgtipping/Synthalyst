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
    let whereClause: {
      status?: string;
      inquiryType?: string;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        subject?: { contains: string; mode: "insensitive" };
        message?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

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

    // Get submissions
    const submissions = await prisma.contactSubmission.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        replies: {
          select: {
            id: true,
            createdAt: true,
          },
        },
      },
      skip: offset,
      take: limit,
    });

    // Transform the data to include reply count and last replied at
    const transformedSubmissions = submissions.map((submission) => {
      const replyCount = submission.replies.length;
      const lastRepliedAt =
        replyCount > 0
          ? submission.replies.reduce(
              (latest, reply) =>
                reply.createdAt > latest ? reply.createdAt : latest,
              submission.replies[0].createdAt
            )
          : null;

      // Create a new object without the replies property
      return {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        company: submission.company,
        phone: submission.phone,
        inquiryType: submission.inquiryType,
        message: submission.message,
        status: submission.status,
        notes: submission.notes,
        assignedTo: submission.assignedTo,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
        source: submission.source,
        replyCount,
        lastRepliedAt,
      };
    });

    // Get total count for pagination
    const totalCount = await prisma.contactSubmission.count({
      where: whereClause,
    });

    return NextResponse.json({
      data: transformedSubmissions,
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
