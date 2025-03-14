import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema for validating the request body
const startSessionSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().optional(),
  industry: z.string().optional(),
  jobLevel: z.string().optional(),
  requiredSkills: z.array(z.string()).optional(),
  questionCount: z.number().int().min(1).max(10).default(5),
});

const submitResponseSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  questionId: z.string().min(1, "Question ID is required"),
  responseText: z.string().min(1, "Response is required"),
  audioUrl: z.string().optional(),
});

// API route for starting a new mock interview session
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
    const validationResult = startSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { jobTitle, company, industry, questionCount } =
      validationResult.data;
    // Note: jobLevel and requiredSkills will be used in future implementation
    // when we integrate with the LLM for question generation

    // Create a new interview session
    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        jobTitle,
        company,
        industry,
        status: "in_progress",
      },
    });

    // Generate questions based on job details
    // This would typically call an LLM to generate appropriate questions
    // For now, we'll use placeholder questions
    const questionTypes = ["behavioral", "technical", "situational"];
    const questions = [];

    for (let i = 0; i < questionCount; i++) {
      const questionType = questionTypes[i % questionTypes.length];
      const question = await prisma.interviewQuestion.create({
        data: {
          sessionId: interviewSession.id,
          questionText: `Sample ${questionType} question ${
            i + 1
          } for ${jobTitle}`,
          questionOrder: i + 1,
          questionType,
        },
      });
      questions.push(question);
    }

    // Return the session and first question
    return NextResponse.json({
      sessionId: interviewSession.id,
      firstQuestion: questions[0],
      totalQuestions: questions.length,
    });
  } catch (error) {
    console.error("Error starting mock interview session:", error);
    return NextResponse.json(
      { error: "Failed to start mock interview session" },
      { status: 500 }
    );
  }
}

// API route for submitting a response and getting feedback
export async function PUT(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submitResponseSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, questionId, responseText, audioUrl } =
      validationResult.data;

    // Verify the session belongs to the user
    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        questions: {
          orderBy: { questionOrder: "asc" },
        },
      },
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

    // Generate feedback for the response
    // This would typically call an LLM to analyze the response and provide feedback
    // For now, we'll use placeholder feedback
    const feedback =
      "Your response was clear and well-structured. Consider providing more specific examples to strengthen your answer.";
    const strengths = ["Clear communication", "Good structure"];
    const improvements = [
      "Add more specific examples",
      "Quantify achievements",
    ];
    const score = 7; // On a scale of 1-10

    // Save the response and feedback
    await prisma.interviewResponse.create({
      data: {
        questionId,
        sessionId,
        responseText,
        audioUrl,
        feedback,
        strengths,
        improvements,
        score,
      },
    });

    // Find the next question in the session
    const currentQuestionIndex = interviewSession.questions.findIndex(
      (q) => q.id === questionId
    );
    const nextQuestion =
      interviewSession.questions[currentQuestionIndex + 1] || null;
    const isLastQuestion = nextQuestion === null;

    // If this was the last question, update the session status
    if (isLastQuestion) {
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: "completed",
          endedAt: new Date(),
        },
      });
    }

    // Return the feedback and next question (if any)
    return NextResponse.json({
      feedback: {
        text: feedback,
        strengths,
        improvements,
        score,
      },
      nextQuestion,
      isLastQuestion,
    });
  } catch (error) {
    console.error("Error processing interview response:", error);
    return NextResponse.json(
      { error: "Failed to process interview response" },
      { status: 500 }
    );
  }
}
