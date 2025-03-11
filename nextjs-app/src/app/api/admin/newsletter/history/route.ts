import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/admin/newsletter/history - Get newsletter send history
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get newsletter send history with pagination
    const [history, total] = await Promise.all([
      prisma.newsletterSend.findMany({
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
        select: {
          id: true,
          subject: true,
          recipientCount: true,
          sentBy: true,
          filter: true,
          status: true,
          opens: true,
          clicks: true,
          bounces: true,
          unsubscribes: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      prisma.newsletterSend.count(),
    ]);

    // Transform the data to include reply counts in a cleaner format
    const formattedHistory = history.map((item) => ({
      ...item,
      replyCount: item._count.replies,
      _count: undefined, // Remove the _count object from the response
    }));

    return NextResponse.json({
      history: formattedHistory,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching newsletter history:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter history" },
      { status: 500 }
    );
  }
}
