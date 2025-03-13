import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// GET /api/admin/newsletter/history/[id] - Get specific newsletter details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Get newsletter details with analytics
    const newsletter = await (prisma as PrismaClient).newsletterSend.findUnique(
      {
        where: { id },
        select: {
          id: true,
          subject: true,
          content: true,
          recipientCount: true,
          sentBy: true,
          filter: true,
          createdAt: true,
          opens: true,
          clicks: true,
          bounces: true,
          unsubscribes: true,
          // @ts-expect-error - analytics field exists at runtime but not in type definition
          analytics: {
            select: {
              id: true,
              opens: true,
              clicks: true,
              bounces: true,
              complaints: true,
              deliveries: true,
              sendId: true,
            },
          },
        },
      }
    );

    if (!newsletter) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      );
    }

    // Calculate engagement metrics
    const metrics = {
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
    };

    return NextResponse.json({ ...newsletter, metrics });
  } catch (error) {
    console.error("Error fetching newsletter details:", error);
    return NextResponse.json(
      { error: "Failed to fetch newsletter details" },
      { status: 500 }
    );
  }
}
