import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";

// GET /api/admin/newsletter/tags - Get all tags with counts
export async function GET() {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique tags and their counts
    const subscribers = await (prisma as PrismaClient).subscriber.findMany({
      select: {
        tags: true,
      },
    });

    const tagCounts: Record<string, number> = {};
    subscribers.forEach((subscriber) => {
      subscriber.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/admin/newsletter/tags - Add tags to subscribers
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subscriberIds, tags } = body;

    if (!subscriberIds?.length || !tags?.length) {
      return NextResponse.json(
        { error: "Subscriber IDs and tags are required" },
        { status: 400 }
      );
    }

    // Update subscribers with new tags
    await Promise.all(
      subscriberIds.map(async (id: string) => {
        const subscriber = await (prisma as PrismaClient).subscriber.findUnique(
          {
            where: { id },
            select: { tags: true },
          }
        );

        if (subscriber) {
          const updatedTags = Array.from(
            new Set([...subscriber.tags, ...tags])
          );
          await (prisma as PrismaClient).subscriber.update({
            where: { id },
            data: { tags: updatedTags },
          });
        }
      })
    );

    return NextResponse.json({ message: "Tags added successfully" });
  } catch (error) {
    console.error("Error adding tags:", error);
    return NextResponse.json({ error: "Failed to add tags" }, { status: 500 });
  }
}

// DELETE /api/admin/newsletter/tags - Remove tags from subscribers
export async function DELETE(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subscriberIds, tags } = body;

    if (!subscriberIds?.length || !tags?.length) {
      return NextResponse.json(
        { error: "Subscriber IDs and tags are required" },
        { status: 400 }
      );
    }

    // Remove specified tags from subscribers
    await Promise.all(
      subscriberIds.map(async (id: string) => {
        const subscriber = await (prisma as PrismaClient).subscriber.findUnique(
          {
            where: { id },
            select: { tags: true },
          }
        );

        if (subscriber) {
          const updatedTags = subscriber.tags.filter(
            (tag) => !tags.includes(tag)
          );
          await (prisma as PrismaClient).subscriber.update({
            where: { id },
            data: { tags: updatedTags },
          });
        }
      })
    );

    return NextResponse.json({ message: "Tags removed successfully" });
  } catch (error) {
    console.error("Error removing tags:", error);
    return NextResponse.json(
      { error: "Failed to remove tags" },
      { status: 500 }
    );
  }
}
