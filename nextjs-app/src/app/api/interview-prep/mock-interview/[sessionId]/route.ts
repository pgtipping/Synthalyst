import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// API route for retrieving session details
export async function GET(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    // Retrieve the session with questions and responses
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        questions: {
          orderBy: { questionOrder: "asc" },
          include: {
            response: true,
          },
        },
      },
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user
    if (interviewSession.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized access to this session" },
        { status: 403 }
      );
    }

    // Return the session details
    return NextResponse.json({
      session: {
        id: interviewSession.id,
        jobTitle: interviewSession.jobTitle,
        company: interviewSession.company,
        industry: interviewSession.industry,
        status: interviewSession.status,
        startedAt: interviewSession.startedAt,
        endedAt: interviewSession.endedAt,
      },
      questions: interviewSession.questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        questionOrder: question.questionOrder,
        questionType: question.questionType,
        response: question.response
          ? {
              id: question.response.id,
              responseText: question.response.responseText,
              feedback: question.response.feedback,
              score: question.response.score,
              strengths: question.response.strengths,
              improvements: question.response.improvements,
              submittedAt: question.response.submittedAt,
            }
          : null,
      })),
      progress: {
        totalQuestions: interviewSession.questions.length,
        answeredQuestions: interviewSession.questions.filter(
          (q) => q.response !== null
        ).length,
      },
    });
  } catch (error) {
    console.error("Error retrieving interview session:", error);
    return NextResponse.json(
      { error: "Failed to retrieve interview session" },
      { status: 500 }
    );
  }
}

// API route for ending a session and generating summary
export async function DELETE(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { sessionId } = params;

    // Retrieve the session with questions and responses
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        questions: {
          orderBy: { questionOrder: "asc" },
          include: {
            response: true,
          },
        },
      },
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 }
      );
    }

    // Verify the session belongs to the user
    if (interviewSession.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized access to this session" },
        { status: 403 }
      );
    }

    // Generate a summary of the session
    // This would typically call an LLM to analyze all responses and provide a comprehensive summary
    // For now, we'll use a placeholder summary
    const answeredQuestions = interviewSession.questions.filter(
      (q) => q.response !== null
    );
    const totalScore =
      answeredQuestions.reduce((sum, q) => sum + (q.response?.score || 0), 0) /
      (answeredQuestions.length || 1);

    const summary = {
      overallScore: Math.round(totalScore),
      questionCount: interviewSession.questions.length,
      answeredCount: answeredQuestions.length,
      strengths: ["Clear communication", "Good structure"],
      improvements: ["Add more specific examples", "Quantify achievements"],
      overallFeedback:
        "You demonstrated good communication skills and structured your answers well. To improve, focus on providing more specific examples and quantifying your achievements where possible.",
    };

    // Update the session with the summary and mark it as completed
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        endedAt: new Date(),
        summary: summary as any,
      },
    });

    // Return the summary
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error ending interview session:", error);
    return NextResponse.json(
      { error: "Failed to end interview session" },
      { status: 500 }
    );
  }
}
