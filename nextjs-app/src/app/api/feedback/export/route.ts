import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const appName = searchParams.get("appName");

    // If no appName is provided, return an error
    if (!appName) {
      return NextResponse.json(
        { error: "App name is required" },
        { status: 400 }
      );
    }

    // Get all feedback for the app
    const feedbackItems = await prisma.appFeedback.findMany({
      where: {
        appName,
      },
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

    // Generate CSV content
    const headers = ["ID", "Rating", "Feedback", "User Email", "Created At"];
    const rows = feedbackItems.map((item) => [
      item.id,
      item.rating.toString(),
      item.feedback || "",
      item.user?.email || "Anonymous",
      item.createdAt.toISOString(),
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map(
            (cell) =>
              // Escape commas and quotes in the cell content
              `"${cell.replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    // Return CSV as a downloadable file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${appName}-feedback.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting feedback:", error);
    return NextResponse.json(
      { error: "Failed to export feedback" },
      { status: 500 }
    );
  }
}
