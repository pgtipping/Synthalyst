import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";

// Define a path for storing feedback data
const feedbackFilePath = path.join(process.cwd(), "feedback-data.json");

// Define the feedback item interface
interface FeedbackItem {
  id: string;
  appName: string;
  rating: number;
  feedback: string;
  userId: string | null;
  userEmail: string | null;
  createdAt: string;
}

// Helper function to read feedback data
const readFeedbackData = (): FeedbackItem[] => {
  try {
    if (fs.existsSync(feedbackFilePath)) {
      const data = fs.readFileSync(feedbackFilePath, "utf8");
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error reading feedback data:", error);
    return [];
  }
};

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const appName = searchParams.get("appName");

    // Build query
    const query: { appName?: string } = {};
    if (appName) {
      query.appName = appName;
    }

    // Try to use Prisma if available
    try {
      // Use type assertion to work around the type error
      const prismaAny = prisma as unknown;
      const prismaWithFeedback = prismaAny as {
        appFeedback: {
          findMany: (args: {
            where?: { appName?: string };
            orderBy?: { createdAt: "asc" | "desc" };
          }) => Promise<FeedbackItem[]>;
        };
      };

      if (prismaWithFeedback.appFeedback) {
        // Fetch feedback data
        const feedback = await prismaWithFeedback.appFeedback.findMany({
          where: query,
          orderBy: {
            createdAt: "desc",
          },
        });

        return NextResponse.json(feedback);
      }
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      // Fall through to file-based storage
    }

    // Fallback to file-based storage
    const feedbackData = readFeedbackData();

    // Filter by appName if provided
    const filteredFeedback = appName
      ? feedbackData.filter((item) => item.appName === appName)
      : feedbackData;

    // Sort by createdAt in descending order
    const sortedFeedback = filteredFeedback.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(sortedFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback data" },
      { status: 500 }
    );
  }
}
