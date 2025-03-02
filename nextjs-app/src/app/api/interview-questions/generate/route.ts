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

    // Create a clear, structured prompt for the LLM
    const systemPrompt = `You are an expert interviewer who creates highly relevant and effective interview questions, evaluation guidelines, and scoring rubrics. 
Your responses will be used directly in an interview preparation tool.`;

    // Base prompt for generating questions
    let userPrompt = `Generate ${validatedData.numberOfQuestions} interview questions for a ${validatedData.jobLevel} position in the ${validatedData.industry} industry.

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
      userPrompt += `

Additionally, for each question, provide tips on how to evaluate the responses. These tips should:
1. Highlight what to look for in strong responses
2. Identify red flags or weak responses
3. Suggest follow-up questions if needed
4. Relate back to the core competencies being evaluated`;
    }

    // Add instructions for scoring rubric if requested
    if (validatedData.includeScoringRubric) {
      userPrompt += `

Also, create a comprehensive scoring rubric that can be used to evaluate all responses. The rubric should:
1. Include scoring categories (e.g., Excellent, Good, Average, Poor)
2. Define clear criteria for each scoring level
3. Cover both technical knowledge and soft skills
4. Be specific to the industry and job level`;
    }

    // Format the response as a simple, clear structure
    userPrompt += `

Format your response as follows:

QUESTIONS:
1. First question
2. Second question
...

${
  validatedData.includeEvaluationTips
    ? `
EVALUATION TIPS:
1. First tip
2. Second tip
...
`
    : ""
}

${
  validatedData.includeScoringRubric
    ? `
SCORING RUBRIC:
(Include your scoring rubric here)
`
    : ""
}

IMPORTANT: 
1. Use the exact section headers as shown above (QUESTIONS:, EVALUATION TIPS:, SCORING RUBRIC:)
2. Number each question and evaluation tip
3. Keep the scoring rubric in a simple text format
4. Do not use JSON, markdown code blocks, or other formatting that might confuse parsing`;

    const completion = await groq.chat.completions
      .create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
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

    // Parse the response using simple section-based extraction
    const result: {
      questions: string[];
      evaluationTips?: string[];
      scoringRubric?: string;
    } = { questions: [] };

    // Extract questions
    const questionsMatch = response.match(
      /QUESTIONS:([\s\S]*?)(?=EVALUATION TIPS:|SCORING RUBRIC:|$)/i
    );
    if (questionsMatch && questionsMatch[1]) {
      result.questions = questionsMatch[1]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^\d+\./.test(line))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);
    }

    // Extract evaluation tips if requested
    if (validatedData.includeEvaluationTips) {
      const tipsMatch = response.match(
        /EVALUATION TIPS:([\s\S]*?)(?=SCORING RUBRIC:|$)/i
      );
      if (tipsMatch && tipsMatch[1]) {
        result.evaluationTips = tipsMatch[1]
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => /^\d+\./.test(line))
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((line) => line.length > 0);
      } else {
        result.evaluationTips = [];
      }
    }

    // Extract scoring rubric if requested
    if (validatedData.includeScoringRubric) {
      const rubricMatch = response.match(/SCORING RUBRIC:([\s\S]*?)$/i);
      if (rubricMatch && rubricMatch[1]) {
        // Convert the plain text rubric to simple HTML
        const rubricText = rubricMatch[1].trim();

        // Simple HTML conversion
        let htmlRubric = '<div class="scoring-rubric">';

        // Process each line
        const lines = rubricText
          .split("\n")
          .filter((line) => line.trim().length > 0);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check if it's a heading (category)
          if (
            /^[A-Z][\w\s]+:$/.test(line) ||
            /^[A-Z][\w\s]+\(\d+(-\d+)?\):$/.test(line)
          ) {
            htmlRubric += `<h4 class="rubric-category">${line}</h4>`;
          }
          // Check if it's a numbered point
          else if (/^\d+\./.test(line)) {
            htmlRubric += `<p class="rubric-point">${line}</p>`;
          }
          // Otherwise, treat as regular text
          else {
            htmlRubric += `<p>${line}</p>`;
          }
        }

        htmlRubric += "</div>";
        result.scoringRubric = htmlRubric;
      } else {
        result.scoringRubric = "";
      }
    }

    // Validate that we have questions
    if (result.questions.length === 0) {
      // If no questions were found using the section-based approach, try a fallback
      const fallbackQuestions = response
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => /^\d+\./.test(line) && line.includes("?"))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim())
        .filter((line) => line.length > 0);

      if (fallbackQuestions.length > 0) {
        result.questions = fallbackQuestions;
      } else {
        throw new Error("No valid questions generated");
      }
    }

    return NextResponse.json(result);
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
