import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the request body
const evaluateResponseSchema = z.object({
  responseText: z.string().min(1, "Response is required"),
  audioUrl: z.string().optional(),
  questionId: z.string().min(1, "Question ID is required"),
  sessionId: z.string().min(1, "Session ID is required"),
  context: z.object({
    jobTitle: z.string(),
    jobLevel: z.string().optional(),
    industry: z.string().optional(),
    requiredSkills: z.array(z.string()).optional(),
    questionType: z.string(),
    questionText: z.string(),
  }),
});

// API route for evaluating interview responses
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has premium access
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: { subscriptions: true },
    });

    const hasPremiumAccess = user?.subscriptions.some(
      (sub) => sub.status === "active" && sub.plan.includes("premium")
    );

    if (!hasPremiumAccess) {
      return NextResponse.json(
        { error: "Premium subscription required for this feature" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = evaluateResponseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { responseText, audioUrl, questionId, sessionId, context } =
      validationResult.data;

    // Verify the session belongs to the user
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: "Interview session not found" },
        { status: 404 }
      );
    }

    if (interviewSession.user.email !== session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized access to this session" },
        { status: 403 }
      );
    }

    // Verify the question belongs to the session
    const question = await prisma.interviewQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question || question.sessionId !== sessionId) {
      return NextResponse.json(
        { error: "Question not found in this session" },
        { status: 404 }
      );
    }

    // Generate scoring criteria based on job details
    // This would typically use a more sophisticated algorithm
    // For now, we'll use placeholder criteria
    const criteriaScores = [
      {
        criteriaId: "relevance",
        criteriaName: "Relevance to Question",
        score: 8,
        weight: 9,
      },
      {
        criteriaId: "structure",
        criteriaName: "Response Structure",
        score: 7,
        weight: 8,
      },
      {
        criteriaId: "clarity",
        criteriaName: "Clarity and Conciseness",
        score: 6,
        weight: 7,
      },
    ];

    // Calculate overall score
    const totalWeight = criteriaScores.reduce((sum, c) => sum + c.weight, 0);
    const weightedScore = criteriaScores.reduce(
      (sum, c) => sum + c.score * c.weight,
      0
    );
    const overallScore = Math.round(weightedScore / totalWeight);

    // Generate feedback
    const strengths = ["Clear communication", "Good structure"];
    const improvements = [
      "Add more specific examples",
      "Quantify achievements",
    ];
    const detailedFeedback = {
      relevance:
        "Your response directly addressed the question and demonstrated understanding of the key requirements.",
      structure:
        "You structured your answer well with a clear beginning, middle, and end.",
      clarity:
        "Your response was generally clear, but could be more concise in some areas.",
    };
    const overallFeedback =
      "You demonstrated good communication skills and structured your answers well. To improve, focus on providing more specific examples and quantifying your achievements where possible.";

    // Create or update the response
    const existingResponse = await prisma.interviewResponse.findUnique({
      where: { questionId },
    });

    if (existingResponse) {
      // Update existing response
      await prisma.interviewResponse.update({
        where: { id: existingResponse.id },
        data: {
          responseText,
          audioUrl,
          feedback: overallFeedback,
          strengths,
          improvements,
          score: overallScore,
          overallScore,
          criteriaScores: criteriaScores as any,
          contentScore: overallScore, // Simplified for now
          detailedFeedback: detailedFeedback as any,
        },
      });
    } else {
      // Create new response
      await prisma.interviewResponse.create({
        data: {
          questionId,
          sessionId,
          responseText,
          audioUrl,
          feedback: overallFeedback,
          strengths,
          improvements,
          score: overallScore,
          overallScore,
          criteriaScores: criteriaScores as any,
          contentScore: overallScore, // Simplified for now
          detailedFeedback: detailedFeedback as any,
        },
      });
    }

    // Return the evaluation results
    return NextResponse.json({
      overallScore,
      criteriaScores,
      strengths,
      improvements,
      detailedFeedback,
      overallFeedback,
    });
  } catch (error) {
    console.error("Error evaluating interview response:", error);
    return NextResponse.json(
      { error: "Failed to evaluate interview response" },
      { status: 500 }
    );
  }
}
