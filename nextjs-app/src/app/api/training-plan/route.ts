import { NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";

const trainingPlanSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  learningObjectives: z.string().min(1, "Learning objectives are required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  duration: z.string().min(1, "Duration is required"),
  preferredLearningStyle: z
    .string()
    .min(1, "Preferred learning style is required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = trainingPlanSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    const {
      topic,
      learningObjectives,
      targetAudience,
      duration,
      preferredLearningStyle,
    } = result.data;

    const prompt = `
    Create a detailed training plan and curriculum for the following:

    Topic: ${topic}
    Learning Objectives: ${learningObjectives}
    Target Audience: ${targetAudience}
    Duration: ${duration}
    Preferred Learning Style: ${preferredLearningStyle}

    Please structure the plan with:
    1. Course Overview
    2. Learning Objectives
    3. Prerequisites (if any)
    4. Detailed Curriculum Breakdown by Modules/Weeks
    5. Learning Activities and Assessments
    6. Resources and Materials
    7. Success Metrics

    For each module/week, include:
    - Topics covered
    - Learning activities (aligned with preferred learning style)
    - Assignments or assessments
    - Estimated time allocation
    - Required resources

    Make the plan practical, engaging, and tailored to the target audience.
    Include specific examples and hands-on activities where appropriate.
    `;

    const response = await axios.post(
      "https://api.groq.com/v1/chat/completions",
      {
        model: "llama-3.2-3b-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert curriculum designer and instructional specialist.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
      plan: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Training plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate training plan" },
      { status: 500 }
    );
  }
}
