import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get time range from query params
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";
    const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;

    // Calculate date range
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, days - 1));

    // Get daily views, comments, and likes
    const dailyStats = await prisma.post.groupBy({
      by: ["createdAt"],
      _sum: {
        views: true,
        likes: true,
      },
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format data for response
    const dates: string[] = [];
    const views: number[] = [];
    const comments: number[] = [];
    const likes: number[] = [];

    // Fill in data for each day in the range
    for (let i = 0; i < days; i++) {
      const date = subDays(endDate, days - 1 - i);
      const dateStr = date.toISOString().split("T")[0];
      dates.push(dateStr);

      const stat = dailyStats.find(
        (s) => s.createdAt.toISOString().split("T")[0] === dateStr
      );

      views.push(stat?._sum.views || 0);
      comments.push(stat?._count.id || 0);
      likes.push(stat?._sum.likes || 0);
    }

    return NextResponse.json({
      dates,
      views,
      comments,
      likes,
    });
  } catch (error) {
    console.error("Error fetching blog analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog analytics" },
      { status: 500 }
    );
  }
}
