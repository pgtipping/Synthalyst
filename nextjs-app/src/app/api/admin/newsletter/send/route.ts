import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscribers } from "@/lib/sendgrid";
import { z } from "zod";

// Newsletter schema
const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  filter: z.enum(["all", "confirmed", "recent"]).default("all"),
});

// POST /api/admin/newsletter/send - Send a newsletter
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate the request body
    const result = newsletterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { subject, content, filter } = result.data;

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Get subscribers based on filter
    let subscribers;
    if (filter === "all") {
      subscribers = await prismaAny.newsletter.findMany({
        where: {
          confirmed: true,
          active: true,
          unsubscribed: false,
        },
        select: {
          email: true,
        },
      });
    } else if (filter === "confirmed") {
      subscribers = await prismaAny.newsletter.findMany({
        where: {
          confirmed: true,
          unsubscribed: false,
        },
        select: {
          email: true,
        },
      });
    } else if (filter === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      subscribers = await prismaAny.newsletter.findMany({
        where: {
          confirmed: true,
          active: true,
          unsubscribed: false,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          email: true,
        },
      });
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found for the selected filter" },
        { status: 400 }
      );
    }

    // Send the newsletter
    const success = await sendNewsletterToSubscribers(subject, content);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to send newsletter" },
        { status: 500 }
      );
    }

    // Log the newsletter send
    await prismaAny.newsletterSend.create({
      data: {
        subject,
        recipientCount: subscribers.length,
        sentBy: session.user.email,
        filter,
      },
    });

    return NextResponse.json({
      message: `Newsletter sent successfully to ${subscribers.length} subscribers`,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
