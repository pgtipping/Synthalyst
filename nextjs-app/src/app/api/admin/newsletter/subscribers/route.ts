import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Email validation schema
const subscriberSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional().nullable(),
  source: z.string().optional(),
});

// GET /api/admin/newsletter/subscribers - Get all subscribers
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Get all subscribers
    const subscribers = await prismaAny.newsletter.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get subscriber stats
    const stats = {
      total: subscribers.length,
      confirmed: subscribers.filter((s: any) => s.confirmed).length,
      active: subscribers.filter((s: any) => s.active).length,
      unsubscribed: subscribers.filter((s: any) => s.unsubscribed).length,
    };

    return NextResponse.json({ subscribers, stats });
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}

// POST /api/admin/newsletter/subscribers - Add a new subscriber
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate the request body
    const result = subscriberSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, name, source } = result.data;

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Check if the email is already subscribed
    const existingSubscriber = await prismaAny.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Email is already subscribed" },
        { status: 400 }
      );
    }

    // Create a new subscriber
    const subscriber = await prismaAny.newsletter.create({
      data: {
        email,
        name,
        source: source || "admin",
        confirmed: true, // Auto-confirm when added by admin
        active: true,
        tags: source ? [source] : ["admin"],
      },
    });

    return NextResponse.json(
      { message: "Subscriber added successfully", subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding subscriber:", error);
    return NextResponse.json(
      { error: "Failed to add subscriber" },
      { status: 500 }
    );
  }
}
