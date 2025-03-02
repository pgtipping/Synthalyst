import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { z } from "zod";

const requestSchema = z.object({
  industry: z.string().min(2, "Industry is required"),
  jobLevel: z.string().min(2, "Job level is required"),
  roleDescription: z
    .string()
    .min(20, "Please provide a detailed role description"),
  coreCompetencies: z
    .string()
    .min(10, "Please specify at least one core competency"),
  numberOfQuestions: z.string().min(1, "Number of questions is required"),
  includeEvaluationTips: z.boolean().default(false),
  includeScoringRubric: z.boolean().default(false),
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    let validatedData;
    try {
      validatedData = requestSchema.parse(body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Validation error", details: validationError.errors },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Base prompt for generating questions
    let prompt = `Generate ${validatedData.numberOfQuestions} interview questions for a ${validatedData.jobLevel} position in the ${validatedData.industry} industry.

Role Description:
${validatedData.roleDescription}

Core Competencies to Evaluate:
${validatedData.coreCompetencies}

For each question:
1. Focus on evaluating both technical skills and core competencies
2. Ensure questions are specific to the industry and job level
3. Include a mix of behavioral and situational questions
4. Consider the role description when crafting questions
5. Make questions challenging but appropriate for the level`;

    // Add instructions for evaluation tips if requested
    if (validatedData.includeEvaluationTips) {
      prompt += `

Additionally, for each question, provide tips on how to evaluate the responses. These tips should:
1. Highlight what to look for in strong responses
2. Identify red flags or weak responses
3. Suggest follow-up questions if needed
4. Relate back to the core competencies being evaluated`;
    }

    // Add instructions for scoring rubric if requested
    if (validatedData.includeScoringRubric) {
      prompt += `

Also, create a comprehensive scoring rubric that can be used to evaluate all responses. The rubric should:
1. Include scoring categories (e.g., Excellent, Good, Average, Poor)
2. Define clear criteria for each scoring level
3. Cover both technical knowledge and soft skills
4. Be specific to the industry and job level
5. Format the rubric as HTML with appropriate headings, tables, and styling`;
    }

    // Final instruction for formatting the response
    if (
      validatedData.includeEvaluationTips ||
      validatedData.includeScoringRubric
    ) {
      prompt += `

Format your response as a JSON object with the following structure:
{
  "questions": ["Question 1", "Question 2", ...],
  ${
    validatedData.includeEvaluationTips
      ? `"evaluationTips": ["Tip for Question 1", "Tip for Question 2", ...],`
      : ""
  }
  ${
    validatedData.includeScoringRubric
      ? `"scoringRubric": "HTML formatted rubric"`
      : ""
  }
}`;
    } else {
      prompt += `

Please return only the numbered list of questions without any additional text or explanations.`;
    }

    const completion = await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content:
              "You are an expert interviewer who creates highly relevant and effective interview questions, evaluation guidelines, and scoring rubrics.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.7,
        max_tokens: 4000,
      })
      .catch((error) => {
        console.error("LLM API Error:", error);
        throw new Error("Failed to generate questions from LLM");
      });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No response received from LLM");
    }

    // If we requested additional content, try to parse the JSON response
    if (
      validatedData.includeEvaluationTips ||
      validatedData.includeScoringRubric
    ) {
      try {
        // Try to parse the response as JSON
        const parsedResponse = JSON.parse(response);

        // Validate that we have questions
        if (
          !parsedResponse.questions ||
          !Array.isArray(parsedResponse.questions) ||
          parsedResponse.questions.length === 0
        ) {
          throw new Error("No valid questions in the response");
        }

        // Return the parsed response
        return NextResponse.json(parsedResponse);
      } catch (parseError) {
        console.error("Error parsing LLM response as JSON:", parseError);

        // Fallback to extracting questions only
        const questions = response
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((question) => question.length > 0);

        if (questions.length === 0) {
          throw new Error("No valid questions generated");
        }

        return NextResponse.json({ questions });
      }
    } else {
      // Split the response into individual questions and clean them up
      const questions = response
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((question) => question.length > 0);

      if (questions.length === 0) {
        throw new Error("No valid questions generated");
      }

      return NextResponse.json({ questions });
    }
  } catch (error) {
    console.error("Error generating interview questions:", error);

    // Determine the appropriate error response
    if (error instanceof Error) {
      const errorMessage = error.message;

      if (errorMessage.includes("GROQ_API_KEY")) {
        return NextResponse.json(
          { error: "Service configuration error" },
          { status: 503 }
        );
      }

      if (
        errorMessage.includes("Failed to generate") ||
        errorMessage.includes("No response") ||
        errorMessage.includes("No valid questions")
      ) {
        return NextResponse.json(
          { error: "Failed to generate questions. Please try again." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
