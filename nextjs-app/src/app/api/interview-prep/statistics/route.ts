import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get mock interview statistics
    const mockInterviewStats = await prisma.interviewSession.aggregate({
      where: {
        userId: user.id,
        status: "completed",
      },
      _count: { id: true },
    });

    // Get questions practiced statistics
    const questionsPracticedStats = await prisma.interviewResponse.aggregate({
      where: {
        session: {
          userId: user.id,
        },
      },
      _count: { id: true },
    });

    // Get saved questions statistics
    const savedQuestionsStats = await prisma.userSavedQuestion.aggregate({
      where: {
        userId: user.id,
      },
      _count: { id: true },
    });

    // Get average score from all completed interviews
    const averageScoreResult = await prisma.interviewResponse.aggregate({
      where: {
        session: {
          userId: user.id,
          status: "completed",
        },
      },
      _avg: { score: true },
    });

    // Format the average score to one decimal place or return null if no scores
    const averageScore = averageScoreResult._avg.score
      ? parseFloat(averageScoreResult._avg.score.toFixed(1))
      : null;

    // Return the statistics
    return NextResponse.json({
      mockInterviews: mockInterviewStats._count.id,
      questionsPracticed: questionsPracticedStats._count.id,
      savedQuestions: savedQuestionsStats._count.id,
      averageScore,
    });
  } catch (error) {
    console.error("Error fetching interview prep statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview prep statistics" },
      { status: 500 }
    );
  }
}
