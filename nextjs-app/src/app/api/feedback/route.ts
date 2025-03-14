import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

// Define the path for storing feedback data
// Ensure the file is always stored in the nextjs-app directory
const feedbackFilePath = path.resolve(
  process.cwd().includes("nextjs-app")
    ? process.cwd()
    : path.join(process.cwd(), "nextjs-app"),
  "feedback-data.json"
);

console.log(`Feedback file path: ${feedbackFilePath}`);
console.log(`Current working directory: ${process.cwd()}`);

// Define the feedback item interface
interface FeedbackItem {
  id: string;
  appName: string;
  rating: number;
  feedback?: string;
  userId?: string | null;
  userEmail?: string | null;
  createdAt: string;
}

// Define a type for Prisma with AppFeedback
type PrismaWithAppFeedback = typeof prisma & {
  appFeedback: {
    create: (args: {
      data: {
        appName: string;
        rating: number;
        feedback: string;
        user?: {
          connect: {
            id: string;
          };
        };
      };
    }) => Promise<{ id: string }>;
    findMany: (args?: {
      where?: { appName?: string };
      orderBy?: { createdAt: "asc" | "desc" };
    }) => Promise<
      Array<{
        id: string;
        appName: string;
        rating: number;
        feedback: string;
        createdAt: Date;
        user?: { id: string; email: string } | null;
      }>
    >;
    groupBy: (args: {
      by: string[];
      _avg?: { rating: true };
      where?: { appName?: string };
    }) => Promise<
      Array<{
        appName: string;
        _avg: { rating: number } | null;
      }>
    >;
  };
};

// Helper function to read feedback data from file
function readFeedbackData(): FeedbackItem[] {
  try {
    console.log(`Reading feedback data from ${feedbackFilePath}`);
    console.log(`File exists: ${fs.existsSync(feedbackFilePath)}`);

    if (fs.existsSync(feedbackFilePath)) {
      const data = fs.readFileSync(feedbackFilePath, "utf8");
      console.log(`Read data length: ${data.length}`);
      console.log(`Raw data: "${data}"`);

      if (!data || data.trim() === "") {
        console.log("File exists but is empty, returning empty array");
        return [];
      }

      try {
        const parsed = JSON.parse(data);
        console.log(`Parsed data: ${JSON.stringify(parsed)}`);
        return parsed;
      } catch (parseError) {
        console.error(`Error parsing JSON: ${parseError}`);
        return [];
      }
    }

    console.log(`File does not exist, creating empty file`);
    fs.writeFileSync(feedbackFilePath, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error(`Error reading feedback data: ${error}`);
    console.error(`Error stack: ${(error as Error).stack}`);
  }
  return [];
}

// Helper function to write feedback data to file
function writeFeedbackData(data: FeedbackItem[]) {
  try {
    console.log(`Writing feedback data to ${feedbackFilePath}`);
    console.log(`Data to write: ${JSON.stringify(data, null, 2)}`);

    // Create directory if it doesn't exist
    const dir = path.dirname(feedbackFilePath);
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write data to file
    fs.writeFileSync(feedbackFilePath, JSON.stringify(data, null, 2));

    // Verify the file was written correctly
    const fileExists = fs.existsSync(feedbackFilePath);
    console.log(`File exists after write: ${fileExists}`);

    if (fileExists) {
      const writtenData = fs.readFileSync(feedbackFilePath, "utf8");
      console.log(`Written data length: ${writtenData.length}`);
      console.log(`Written data: "${writtenData}"`);
    }

    console.log(`Successfully wrote feedback data to ${feedbackFilePath}`);
    return true;
  } catch (error) {
    console.error(`Error writing feedback data: ${error}`);
    console.error(`Error stack: ${(error as Error).stack}`);
    return false;
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { appName, rating, feedback } = await request.json();

  if (!appName || !rating) {
    return NextResponse.json(
      { error: "App name and rating are required" },
      { status: 400 }
    );
  }

  // Try to use Prisma if available
  try {
    const prismaWithFeedback = prisma as PrismaWithAppFeedback;

    if (prismaWithFeedback.appFeedback) {
      const feedbackEntry = await prismaWithFeedback.appFeedback.create({
        data: {
          appName,
          rating,
          feedback: feedback || "",
          // Connect to user if session exists, otherwise leave as null
          ...(session?.user?.id
            ? {
                user: {
                  connect: {
                    id: session.user.id,
                  },
                },
              }
            : {}),
        },
      });

      return NextResponse.json(
        { message: "Feedback submitted successfully", id: feedbackEntry.id },
        { status: 201 }
      );
    }
  } catch (prismaError) {
    console.error("Prisma error:", prismaError);
    // Fall through to file-based storage
  }

  // Fallback to file-based storage
  try {
    console.log("Falling back to file-based storage");
    const feedbackData = readFeedbackData();
    console.log(`Current feedback data: ${JSON.stringify(feedbackData)}`);

    // Generate a more unique ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const feedbackId = `feedback_${timestamp}_${randomStr}`;

    const newFeedback: FeedbackItem = {
      id: feedbackId,
      appName,
      rating,
      feedback,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
      createdAt: new Date().toISOString(),
    };
    console.log(`New feedback: ${JSON.stringify(newFeedback)}`);
    feedbackData.push(newFeedback);
    const success = writeFeedbackData(feedbackData);

    if (success) {
      return NextResponse.json(
        {
          message: "Feedback submitted successfully (file storage)",
          id: newFeedback.id,
          fallback: true,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to save feedback to file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error saving feedback: ${error}`);
    console.error(`Error stack: ${(error as Error).stack}`);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const appName = searchParams.get("appName");

  // Only allow admins to access feedback data
  if (
    !session?.user?.email ||
    !session.user.email.endsWith("@synthalyst.com")
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Try to get feedback data from Prisma
  try {
    const prismaWithFeedback = prisma as PrismaWithAppFeedback;

    if (prismaWithFeedback.appFeedback) {
      const feedbackItems = await prismaWithFeedback.appFeedback.findMany(
        appName
          ? {
              where: { appName },
              orderBy: { createdAt: "desc" },
            }
          : { orderBy: { createdAt: "desc" } }
      );

      if (feedbackItems.length > 0) {
        return NextResponse.json({ feedback: feedbackItems });
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

    // Sort by createdAt in descending order
    feedbackData.sort(
      (a: FeedbackItem, b: FeedbackItem) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ feedback: feedbackData });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
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
