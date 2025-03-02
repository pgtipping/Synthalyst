import { NextResponse } from "next/server";
import axios from "axios";
import { z } from "zod";

const learningContentSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  contentType: z.enum(
    ["Lesson", "Tutorial", "Exercise", "Case Study", "Quiz", "Assessment"],
    {
      errorMap: () => ({ message: "Invalid content type" }),
    }
  ),
  targetAudience: z.string().min(1, "Target audience is required"),
  learningLevel: z.enum(["Beginner", "Intermediate", "Advanced"], {
    errorMap: () => ({ message: "Invalid learning level" }),
  }),
  contentFormat: z.enum(["Text", "Markdown", "HTML"], {
    errorMap: () => ({ message: "Invalid content format" }),
  }),
  specificRequirements: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = learningContentSchema.safeParse(body);
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
      contentType,
      targetAudience,
      learningLevel,
      contentFormat,
      specificRequirements,
    } = result.data;

    const prompt = `
    Create detailed learning content for the following:

    Topic: ${topic}
    Content Type: ${contentType}
    Target Audience: ${targetAudience}
    Learning Level: ${learningLevel}
    Content Format: ${contentFormat}
    Specific Requirements: ${specificRequirements}

    Please structure the content based on the content type:

    For Lesson:
    1. Introduction
    2. Key Concepts
    3. Detailed Explanations
    4. Examples
    5. Summary
    6. Check for Understanding

    For Tutorial:
    1. Overview
    2. Prerequisites
    3. Step-by-Step Instructions
    4. Common Issues and Solutions
    5. Practice Exercise
    6. Next Steps

    For Exercise:
    1. Learning Objective
    2. Instructions
    3. Exercise Questions/Tasks
    4. Hints/Tips
    5. Solution Guidelines
    6. Self-Assessment Criteria

    For Case Study:
    1. Background
    2. Problem Statement
    3. Data/Information
    4. Analysis Questions
    5. Discussion Points
    6. Learning Outcomes

    For Quiz:
    1. Instructions
    2. Multiple Choice Questions
    3. Short Answer Questions
    4. Scenario-based Questions
    5. Answer Key
    6. Explanations

    For Assessment:
    1. Assessment Objectives
    2. Instructions
    3. Mixed Question Types
    4. Scoring Criteria
    5. Sample Answers
    6. Feedback Guidelines

    Make the content engaging and appropriate for the target audience and learning level.
    Include practical examples and interactive elements where applicable.
    Format the content according to the specified content format.
    Address any specific requirements mentioned.
    `;

    const response = await axios.post(
      "https://api.groq.com/v1/chat/completions",
      {
        model: "llama-3.2-3b-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert instructional designer and content creator.",
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
      content: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Learning content generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate learning content" },
      { status: 500 }
    );
  }
}
