import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// GET /api/admin/newsletter/history - Get newsletter send history
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get newsletter send history with pagination
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      (prisma as PrismaClient).newsletterSend.findMany({
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
          createdAt: true,
          opens: true,
          clicks: true,
          bounces: true,
          unsubscribes: true,
        },
      }),
      (prisma as PrismaClient).newsletterSend.count(),
    ]);

    // Calculate metrics for each newsletter
    const historyWithMetrics = history.map((newsletter) => ({
      ...newsletter,
      metrics: {
        openRate:
          newsletter.recipientCount > 0
            ? (newsletter.opens / newsletter.recipientCount) * 100
            : 0,
        clickRate:
          newsletter.recipientCount > 0
            ? (newsletter.clicks / newsletter.recipientCount) * 100
            : 0,
        bounceRate:
          newsletter.recipientCount > 0
            ? (newsletter.bounces / newsletter.recipientCount) * 100
            : 0,
        unsubscribeRate:
          newsletter.recipientCount > 0
            ? (newsletter.unsubscribes / newsletter.recipientCount) * 100
            : 0,
      },
    }));

    return NextResponse.json({
      history: historyWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching newsletter history:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter history" },
      { status: 500 }
    );
  }
}
