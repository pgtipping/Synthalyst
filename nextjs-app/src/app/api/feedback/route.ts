import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limiter";

// Define the feedback schema
const feedbackSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

// Rate limiter for feedback submissions
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10, // Max 10 users per second
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";

    // Apply rate limiting - 5 requests per minute per IP
    try {
      await limiter.check(5, ip);
    } catch {
      logger.warn("Rate limit exceeded for feedback submission", { ip });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate the request body
    const validationResult = feedbackSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn("Invalid feedback submission", {
        errors: validationResult.error.errors,
      });
      return NextResponse.json(
        {
          error: "Invalid feedback data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { appName, rating, feedback } = validationResult.data;

    // Get user session if available
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    // Create feedback in database
    const feedbackEntry = await prisma.appFeedback.create({
      data: {
        appName,
        rating,
        feedback: feedback || "",
        ...(userId ? { user: { connect: { id: userId } } } : {}),
      },
    });

    logger.info("Feedback submitted successfully", {
      id: feedbackEntry.id,
      appName,
      rating,
      userEmail: userEmail || "anonymous",
    });

    // Send notification email for low ratings (1-2)
    if (rating <= 2) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "support@synthalyst.com",
        subject: `Low Rating Alert: ${appName} (${rating}/5)`,
        text: `
          A user has submitted a low rating for ${appName}.
          
          Rating: ${rating}/5
          Feedback: ${feedback || "No feedback provided"}
          User: ${userEmail || "Anonymous"}
          
          You may want to follow up on this feedback.
        `,
        category: "feedback_alert",
      });
    }

    return NextResponse.json(
      { success: true, id: feedbackEntry.id },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error processing feedback", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const appName = searchParams.get("appName");

    // Only allow authenticated admin users to access feedback data
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }

    // Query parameters for filtering
    const whereClause = appName ? { appName } : {};

    // Get feedback data
    const feedback = await prisma.appFeedback.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Get average ratings
    const averageRatings = await prisma.appFeedback.groupBy({
      by: ["appName"],
      _avg: {
        rating: true,
      },
      where: whereClause,
    });

    return NextResponse.json({
      feedback,
      averageRatings,
    });
  } catch (error) {
    logger.error("Error retrieving feedback", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
}

export async function GET_STATS(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const appName = searchParams.get("appName");

  // Only allow admins to access feedback stats
  if (
    !session?.user?.email ||
    !session.user.email.endsWith("@synthalyst.com")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Try to get feedback stats from Prisma
  try {
    const prismaWithFeedback = prisma as PrismaWithAppFeedback;

    if (prismaWithFeedback.appFeedback) {
      const avgRatings = await prismaWithFeedback.appFeedback.groupBy({
        by: ["appName"],
        _avg: {
          rating: true,
        },
        ...(appName ? { where: { appName } } : {}),
      });

      if (avgRatings.length > 0) {
        return NextResponse.json({ stats: avgRatings });
      }
    }
  } catch (prismaError) {
    console.error("Prisma error:", prismaError);
    // Fall through to file-based storage
  }

  // Fallback to file-based storage
  try {
    let feedbackData = readFeedbackData();

    if (appName) {
      feedbackData = feedbackData.filter(
        (item: FeedbackItem) => item.appName === appName
      );
    }

    // Calculate average ratings by app
    const appRatings: Record<string, number[]> = {};
    feedbackData.forEach((item: FeedbackItem) => {
      if (!appRatings[item.appName]) {
        appRatings[item.appName] = [];
      }
      appRatings[item.appName].push(item.rating);
    });

    const stats = Object.entries(appRatings).map(([appName, ratings]) => {
      const sum = ratings.reduce(
        (sum: number, rating: number) => sum + rating,
        0
      );
      const avg = ratings.length > 0 ? sum / ratings.length : 0;
      return {
        appName,
        _avg: {
          rating: avg,
        },
      };
    });

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error retrieving feedback stats:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback stats" },
      { status: 500 }
    );
  }
}
