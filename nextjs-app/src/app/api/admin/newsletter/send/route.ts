import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscribers } from "@/lib/sendgrid";
import { rateLimit } from "@/middleware/rateLimit";
import { z } from "zod";
import { emailValidationSchema } from "@/lib/emailValidator";

// Newsletter schema
const newsletterSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  filter: z.enum(["all", "confirmed", "recent", "tags"]).default("all"),
  tags: z.array(z.string()).optional(),
  testMode: z.boolean().optional().default(false),
  testEmails: z.array(emailValidationSchema).optional(),
});

// Type for filter description that can be used in the database
type FilterDescription = "all" | "confirmed" | "recent" | "tags";

// POST /api/admin/newsletter/send - Send a newsletter
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting - now using prefixed keys
    const rateLimitResult = await rateLimit(req, {
      max: 5, // 5 requests per minute
      windowInSeconds: 60,
    });

    if (rateLimitResult) {
      return rateLimitResult;
    }

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

    const { subject, content, filter, tags, testMode, testEmails } =
      result.data;

    // Get subscribers based on filter
    let subscribers;
    let filterDescription: FilterDescription | string = filter;

    if (testMode && testEmails && testEmails.length > 0) {
      // In test mode, use the provided test emails
      subscribers = testEmails.map((email) => ({ email }));
      filterDescription = "tags"; // Use a valid filter type for test emails
    } else {
      // Normal mode, get subscribers from database
      if (filter === "all") {
        subscribers = await prisma.newsletterSubscriber.findMany({
          where: {
            status: "confirmed",
            unsubscribed: false,
          },
          select: {
            id: true,
            email: true,
          },
        });
      } else if (filter === "confirmed") {
        subscribers = await prisma.newsletterSubscriber.findMany({
          where: {
            status: "confirmed",
            unsubscribed: false,
          },
          select: {
            id: true,
            email: true,
          },
        });
      } else if (filter === "recent") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        subscribers = await prisma.newsletterSubscriber.findMany({
          where: {
            status: "confirmed",
            unsubscribed: false,
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            id: true,
            email: true,
          },
        });
      } else if (filter === "tags" && tags && tags.length > 0) {
        subscribers = await prisma.newsletterSubscriber.findMany({
          where: {
            tags: {
              hasSome: tags,
            },
            confirmed: true,
          },
        });
        filterDescription = "tags"; // Use a valid filter type for tags
      }
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "No subscribers found for the selected filter" },
        { status: 400 }
      );
    }

    // Create the newsletter record first
    const newsletter = await prisma.newsletterSend.create({
      data: {
        subject,
        content,
        recipientCount: subscribers.length,
        sentBy: session.user.email || "admin",
        filter: filterDescription,
        status: testMode ? "test" : "sending",
      },
    });

    // Send the newsletter
    const success = await sendNewsletterToSubscribers(
      newsletter.id,
      subject,
      content,
      subscribers.map((s) => s.email)
    );

    if (!success) {
      // Update status to failed
      await prisma.newsletterSend.update({
        where: { id: newsletter.id },
        data: {
          status: "failed",
        },
      });

      return NextResponse.json(
        { error: "Failed to send newsletter" },
        { status: 500 }
      );
    }

    // Update status to sent
    await prisma.newsletterSend.update({
      where: { id: newsletter.id },
      data: {
        status: testMode ? "test-sent" : "sent",
      },
    });

    return NextResponse.json({
      message: `Newsletter ${testMode ? "test " : ""}sent successfully to ${
        subscribers.length
      } subscribers`,
      newsletterId: newsletter.id,
    });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
}
