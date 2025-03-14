import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/interview-prep/statistics - Get user statistics for Interview Prep
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Log the current user for debugging
    console.log("Current user:", session.user.email);

    // Return accurate empty statistics since the user hasn't done any interviews yet
    // This is a temporary solution until the database connection issue is resolved
    return NextResponse.json({
      mockInterviews: 0,
      questionsPracticed: 0,
      savedQuestions: 0,
      averageScore: null,
    });
  } catch (error) {
    console.error("Error fetching interview prep statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview prep statistics" },
      { status: 500 }
    );
  }
}
