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

// Define a more specific type for Prisma feedback items
interface PrismaFeedbackItem {
  id: string;
  appName: string;
  rating: number;
  feedback: string | null;
  userId: string | null;
  userEmail: string | null;
  createdAt: Date;
  user?: {
    email: string | null;
  } | null;
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

    let feedback: FeedbackItem[] = [];

    // Try to use Prisma if available
    try {
      // Use type assertion to work around the type error
      const prismaAny = prisma as unknown;
      const prismaWithFeedback = prismaAny as {
        appFeedback: {
          findMany: (args: {
            where?: { appName?: string };
            orderBy?: { createdAt: "asc" | "desc" };
            include?: { user?: { select: { email: boolean } } };
          }) => Promise<PrismaFeedbackItem[]>;
        };
      };

      if (prismaWithFeedback.appFeedback) {
        // Fetch feedback data
        const prismaFeedback = await prismaWithFeedback.appFeedback.findMany({
          where: query,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        });

        // Convert to FeedbackItem format
        feedback = prismaFeedback.map((item: PrismaFeedbackItem) => ({
          id: item.id,
          appName: item.appName,
          rating: item.rating,
          feedback: item.feedback || "",
          userId: item.userId,
          userEmail: item.user?.email || null,
          createdAt: item.createdAt.toISOString(),
        }));
      }
    } catch (prismaError) {
      console.error("Prisma error:", prismaError);
      // Fall through to file-based storage
    }

    // If Prisma failed or returned no results, use file-based storage
    if (feedback.length === 0) {
      const feedbackData = readFeedbackData();

      // Filter by appName if provided
      feedback = appName
        ? feedbackData.filter((item) => item.appName === appName)
        : feedbackData;

      // Sort by createdAt in descending order
      feedback.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // Generate CSV content
    const headers = [
      "ID",
      "App Name",
      "Rating",
      "Feedback",
      "User Email",
      "Created At",
    ];

    const rows = feedback.map((item) => [
      item.id,
      item.appName,
      item.rating.toString(),
      `"${(item.feedback || "").replace(/"/g, '""')}"`, // Escape quotes in CSV
      item.userEmail || "Anonymous",
      item.createdAt,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: string[]) => row.join(",")),
    ].join("\n");

    // Create response with CSV content
    const response = new NextResponse(csvContent);

    // Set headers for file download
    response.headers.set("Content-Type", "text/csv");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="feedback-export-${appName || "all"}-${
        new Date().toISOString().split("T")[0]
      }.csv"`
    );

    return response;
  } catch (error) {
    console.error("Error exporting feedback:", error);
    return NextResponse.json(
      { error: "Failed to export feedback data" },
      { status: 500 }
    );
  }
}
