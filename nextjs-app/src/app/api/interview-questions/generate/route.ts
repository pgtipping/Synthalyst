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

Format your response as a valid JSON object with the following structure:
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
}

IMPORTANT: 
1. Ensure each question is a separate string in the questions array.
2. Ensure each evaluation tip is a separate string in the evaluationTips array.
3. Make sure the evaluation tips are clearly separate from the questions.
4. Do not include the question text in the evaluation tips.
5. Return ONLY the JSON object without any additional text, markdown formatting, or code blocks.
6. The JSON must be valid and parseable.`;
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
              "You are an expert interviewer who creates highly relevant and effective interview questions, evaluation guidelines, and scoring rubrics. When asked to return JSON, you always return valid, properly formatted JSON without any additional text, markdown formatting, or code blocks. You ensure that questions and evaluation tips are clearly separated in their respective arrays.",
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
        let parsedResponse;

        // First, try to find and extract a JSON object from the response
        // This handles cases where the LLM might add explanatory text before or after the JSON
        const jsonMatch = response.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          try {
            parsedResponse = JSON.parse(jsonMatch[0]);
          } catch (innerError) {
            console.error("Error parsing extracted JSON:", innerError);
            // Fall through to the next parsing attempt
          }
        }

        // If the extracted JSON parsing failed, try parsing the whole response
        if (!parsedResponse) {
          try {
            // Try to clean up the response before parsing
            const cleanedResponse = response
              .replace(/```json/g, "")
              .replace(/```/g, "")
              .trim();
            parsedResponse = JSON.parse(cleanedResponse);
          } catch (innerError) {
            console.error("Error parsing whole response as JSON:", innerError);
            // Fall through to the fallback
          }
        }

        // If we have a parsed response, validate and clean it
        if (parsedResponse) {
          // Ensure questions is an array of strings
          if (parsedResponse.questions) {
            if (typeof parsedResponse.questions === "string") {
              // Handle case where questions might be a string instead of an array
              parsedResponse.questions = parsedResponse.questions
                .split("\n")
                .filter((q: string) => q.trim())
                .map((q: string) => q.replace(/^\d+\.\s*/, "").trim());
            } else if (Array.isArray(parsedResponse.questions)) {
              // Clean up each question in the array
              parsedResponse.questions = parsedResponse.questions
                .filter((q: unknown) => q && typeof q === "string")
                .map((q: string) => q.replace(/^\d+\.\s*/, "").trim());
            } else {
              // Invalid questions format, set to empty array
              parsedResponse.questions = [];
            }
          } else {
            parsedResponse.questions = [];
          }

          // Ensure evaluationTips is an array of strings if requested
          if (validatedData.includeEvaluationTips) {
            if (
              !parsedResponse.evaluationTips ||
              !Array.isArray(parsedResponse.evaluationTips)
            ) {
              // Try to extract tips from the response if not properly formatted
              parsedResponse.evaluationTips = extractEvaluationTips(response);
            } else {
              // Clean up each tip in the array
              parsedResponse.evaluationTips = parsedResponse.evaluationTips
                .filter((tip: unknown) => tip && typeof tip === "string")
                .map((tip: string) => tip.trim());
            }
          }

          // Ensure scoringRubric is a string if requested
          if (validatedData.includeScoringRubric) {
            if (
              !parsedResponse.scoringRubric ||
              typeof parsedResponse.scoringRubric !== "string"
            ) {
              // Try to extract rubric from the response if not properly formatted
              parsedResponse.scoringRubric = extractScoringRubric(response);
            }
          }

          // Validate that we have questions
          if (parsedResponse.questions.length === 0) {
            // If no questions were found in the JSON, try to extract them from the text
            parsedResponse.questions = extractQuestions(response);
            if (parsedResponse.questions.length === 0) {
              throw new Error("No valid questions in the response");
            }
          }

          // Return the cleaned parsed response
          return NextResponse.json(parsedResponse);
        }

        // If we couldn't parse the JSON, fall back to extracting content manually
        const questions = extractQuestions(response);
        const result: {
          questions: string[];
          evaluationTips?: string[];
          scoringRubric?: string;
        } = { questions };

        if (validatedData.includeEvaluationTips) {
          result.evaluationTips = extractEvaluationTips(response);
        }

        if (validatedData.includeScoringRubric) {
          result.scoringRubric = extractScoringRubric(response);
        }

        if (questions.length === 0) {
          throw new Error("No valid questions generated");
        }

        return NextResponse.json(result);
      } catch (parseError) {
        console.error("Error processing LLM response:", parseError);

        // Fallback to extracting questions only
        const questions = extractQuestions(response);

        if (questions.length === 0) {
          throw new Error("No valid questions generated");
        }

        return NextResponse.json({ questions });
      }
    } else {
      // Split the response into individual questions and clean them up
      const questions = extractQuestions(response);

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

// Helper function to extract questions from text
function extractQuestions(text: string): string[] {
  // Look for numbered questions (e.g., "1. Question text")
  const numberedQuestions = text.match(/\d+\.\s*([^\n]+)/g) || [];

  // Clean up the questions
  const questions = numberedQuestions
    .map((q: string) => q.replace(/^\d+\.\s*/, "").trim())
    .filter(
      (q: string) =>
        q.length > 0 &&
        !q.includes('"questions":') &&
        !q.includes('"evaluationTips":') &&
        !q.includes('"scoringRubric":')
    );

  // If we found questions, return them
  if (questions.length > 0) {
    return questions;
  }

  // Otherwise, try to extract questions by looking for lines that end with a question mark
  const questionLines = text
    .split("\n")
    .filter((line: string) => line.trim().endsWith("?"))
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 10); // Minimum length to be considered a question

  if (questionLines.length > 0) {
    return questionLines;
  }

  // Last resort: split by newlines and filter out short lines and obvious non-questions
  return text
    .split("\n")
    .map((line: string) => line.trim())
    .filter(
      (line: string) =>
        line.length > 15 &&
        !line.startsWith("{") &&
        !line.startsWith("}") &&
        !line.includes('"questions":') &&
        !line.includes('"evaluationTips":') &&
        !line.includes('"scoringRubric":')
    );
}

// Helper function to extract evaluation tips from text
function extractEvaluationTips(text: string): string[] {
  // First, try to find a dedicated "Evaluation Tips" section
  const tipsSection = text.match(
    /(?:evaluation tips|tips for evaluating responses|evaluation guidelines):?[\s\S]*?(?=scoring rubric:|$)/i
  );

  if (tipsSection) {
    // Extract numbered tips from the section
    const numberedTips =
      tipsSection[0].match(/(?:\d+\.|•|\*)\s*([^\n]+)/g) || [];

    // Clean up the tips
    const tips = numberedTips
      .map((tip: string) => tip.replace(/^(?:\d+\.|•|\*)\s*/, "").trim())
      .filter(
        (tip: string) =>
          tip.length > 0 &&
          !tip.includes('"questions":') &&
          !tip.includes('"evaluationTips":') &&
          !tip.includes('"scoringRubric":')
      );

    if (tips.length > 0) {
      return tips;
    }
  }

  // If we couldn't find a dedicated tips section, try to find tips associated with each question
  // Look for patterns like "Question 1: ... Evaluation: ..." or "Q1: ... Tip: ..."
  const questionBlocks = text.split(/(?:\d+\.|Q\d+:)/);

  // Skip the first element as it's likely to be empty or introductory text
  const potentialTips = questionBlocks
    .slice(1)
    .map((block) => {
      // Look for evaluation/tip sections within each question block
      const tipMatch = block.match(
        /(?:evaluation|tip|how to evaluate|what to look for|assessment):?([^?]*?)(?=\d+\.|Q\d+:|$)/i
      );
      return tipMatch ? tipMatch[1].trim() : null;
    })
    .filter((tip): tip is string => tip !== null && tip.length > 20);

  if (potentialTips.length > 0) {
    return potentialTips;
  }

  // Last resort: look for lines that might be tips
  return text
    .split("\n")
    .map((line: string) => line.trim())
    .filter(
      (line: string) =>
        line.length > 20 &&
        !line.endsWith("?") && // Not a question
        (line.includes("look for") ||
          line.includes("strong response") ||
          line.includes("weak response") ||
          line.includes("red flag") ||
          line.includes("follow-up") ||
          line.includes("evaluate") ||
          line.includes("assessment") ||
          line.includes("candidate should")) &&
        !line.includes('"questions":') &&
        !line.includes('"evaluationTips":') &&
        !line.includes('"scoringRubric":')
    );
}

// Helper function to extract scoring rubric from text
function extractScoringRubric(text: string): string {
  // Try to find a section that might contain a scoring rubric
  const rubricSection = text.match(/scoring rubric:?[\s\S]*?(?=$)/i);

  if (rubricSection) {
    // Clean up the rubric text
    let rubric = rubricSection[0].trim();

    // If it's just the heading, try to get more content
    if (rubric.length < 30) {
      // Take everything after the rubric heading
      const index = text.indexOf(rubric);
      if (index !== -1) {
        rubric = text.substring(index).trim();
      }
    }

    // Convert the rubric to HTML format if it's not already
    if (!rubric.includes("<")) {
      // Simple conversion of plain text to HTML
      rubric =
        "<h3>Scoring Rubric</h3>" +
        rubric
          .split("\n")
          .map((line: string) => {
            line = line.trim();
            if (line.match(/^#+\s/)) {
              // Heading
              return `<h4>${line.replace(/^#+\s/, "")}</h4>`;
            } else if (line.match(/^\d+\.\s/)) {
              // Numbered list item
              return `<p>${line}</p>`;
            } else if (line.match(/^[A-Z][a-z]+:/)) {
              // Category
              return `<h5>${line}</h5>`;
            } else if (line.length > 0) {
              // Regular paragraph
              return `<p>${line}</p>`;
            }
            return "";
          })
          .join("");
    }

    return rubric;
  }

  // If we couldn't find a dedicated rubric section, create a basic one
  return `
    <h3>Scoring Rubric</h3>
    <h4>Excellent (5)</h4>
    <p>Response fully addresses the question, demonstrates deep understanding, and provides specific examples.</p>
    <h4>Good (4)</h4>
    <p>Response addresses the question well, shows good understanding, and includes some specific details.</p>
    <h4>Satisfactory (3)</h4>
    <p>Response addresses the basic requirements of the question with adequate understanding.</p>
    <h4>Needs Improvement (2)</h4>
    <p>Response partially addresses the question with limited understanding or lacks specificity.</p>
    <h4>Poor (1)</h4>
    <p>Response fails to address the question or shows significant misunderstanding.</p>
  `;
}
