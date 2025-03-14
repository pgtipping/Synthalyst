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

// Initialize Groq client only if API key is available
let groq: Groq | null = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

// Fallback sample questions for when the LLM service is unavailable
const getFallbackQuestions = (industry: string, jobLevel: string) => {
  return {
    questions: [
      `Tell me about your experience in the ${industry} industry and how it relates to this ${jobLevel} position.`,
      `Describe a challenging situation you faced in a previous role and how you resolved it.`,
      `How do you stay updated with the latest trends and developments in the ${industry} industry?`,
      `What methodologies or frameworks do you typically use in your work?`,
      `How do you handle tight deadlines and competing priorities?`,
    ],
    evaluationTips: [
      "Look for specific examples that demonstrate relevant experience in the industry.",
      "Assess problem-solving abilities and approach to challenges.",
      "Evaluate commitment to professional development and industry knowledge.",
      "Check for familiarity with industry-standard methodologies appropriate for the job level.",
      "Assess time management and prioritization skills.",
    ],
    scoringRubric: `<div class="scoring-rubric space-y-4">
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Excellent</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            4-5 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Provides specific, relevant examples from experience</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">2.</span> Demonstrates deep industry knowledge</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">3.</span> Shows clear problem-solving methodology</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Good</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            3-4 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Provides relevant examples but may lack specificity</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">2.</span> Shows good industry knowledge</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">3.</span> Has reasonable problem-solving approach</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Average</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            2-3 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Provides generic examples</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">2.</span> Shows basic industry knowledge</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">3.</span> Problem-solving approach needs development</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Poor</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            1-2 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Unable to provide relevant examples</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">2.</span> Limited industry knowledge</p>
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">3.</span> Unclear problem-solving approach</p>
        </div>
      </div>
    </div>`,
  };
};

export async function POST(req: Request) {
  try {
    // Check for API key before processing request
    if (!process.env.GROQ_API_KEY || !groq) {
      console.error("GROQ_API_KEY is not configured");

      // During build time or when API key is missing, try to parse the request
      // and return fallback content instead of failing
      try {
        const body = await req.json().catch(() => null);
        if (body) {
          const { industry = "general", jobLevel = "professional" } = body;
          const fallbackContent = getFallbackQuestions(industry, jobLevel);

          console.log("Using fallback content due to missing API key");
          return NextResponse.json(fallbackContent);
        }
      } catch (parseError) {
        console.error(
          "Failed to parse request for fallback content:",
          parseError
        );
      }

      return NextResponse.json(
        {
          error: "Service temporarily unavailable",
          message:
            "The LLM service is not properly configured. Please try again later or contact support.",
        },
        { status: 503 }
      );
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
Your responses will be used directly in an interview preparation tool.

IMPORTANT INSTRUCTIONS:
1. Generate EXACTLY ${validatedData.numberOfQuestions} DISTINCT, STANDALONE interview questions
2. Do NOT include additional questions in the evaluation tips or as follow-up questions
3. Evaluation tips should focus on how to evaluate responses, not introduce new questions
4. Each question should be complete and self-contained
5. For scoring rubrics, ensure each level has ONE detailed, well-formed criterion that clearly distinguishes performance levels
6. Maintain consistent quality and detail across all outputs`;

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
5. Make questions challenging but appropriate for the level

IMPORTANT: Generate EXACTLY ${validatedData.numberOfQuestions} distinct questions. Do not include additional questions as follow-up questions in the evaluation tips.`;

    // Add instructions for evaluation tips if requested
    if (validatedData.includeEvaluationTips) {
      userPrompt += `

Additionally, for each question, provide tips on how to evaluate the responses. These tips should:
1. Highlight what to look for in strong responses
2. Identify red flags or weak responses
3. Provide guidance on what constitutes a good answer
4. Relate back to the core competencies being evaluated

NOTE: Evaluation tips should NOT contain new interview questions. They should only provide guidance on evaluating responses to the main questions.`;
    }

    // Add instructions for scoring rubric if requested
    if (validatedData.includeScoringRubric) {
      userPrompt += `

Also, create a comprehensive scoring rubric that can be used to evaluate all responses. The rubric should:
1. Include scoring categories (e.g., Excellent, Good, Average, Poor)
2. Define clear criteria for each scoring level
3. Cover both technical knowledge and soft skills
4. Be specific to the industry and job level

For each scoring level, provide ONE detailed, complete criterion that:
- Is a full sentence with proper grammar
- Clearly describes what to look for at that performance level
- Includes specific details related to the ${validatedData.industry} industry
- Addresses both technical skills and core competencies
- Is proportional in quality to the level (e.g., "Excellent" should describe excellence)

Example format for each level:
Excellent: "Demonstrates comprehensive knowledge of [industry] concepts, provides specific examples from experience, and clearly articulates how their skills address the core competencies."`;
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
        temperature: 0.5,
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

      // Check if we have the requested number of questions
      const requestedCount = parseInt(validatedData.numberOfQuestions);
      if (result.questions.length < requestedCount) {
        console.warn(
          `LLM returned fewer questions than requested: ${result.questions.length} vs ${requestedCount}`
        );
      }
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
          .filter((line) => line.length > 0)
          // Filter out tips that look like questions (ending with question mark)
          .filter((tip) => !tip.trim().endsWith("?"));
      } else {
        result.evaluationTips = [];
      }
    }

    // Extract scoring rubric if requested
    if (validatedData.includeScoringRubric) {
      const rubricMatch = response.match(/SCORING RUBRIC:([\s\S]*?)$/i);
      if (rubricMatch && rubricMatch[1]) {
        // Convert the plain text rubric to our enhanced HTML structure
        const rubricText = rubricMatch[1].trim();

        // Parse the rubric text to identify different scoring levels
        let levels = [];
        let currentLevel = null;
        let currentPoints = null;
        let currentCriteria = [];

        // Process each line
        const lines = rubricText
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0);

        // First pass: Try to identify level headers with more flexible patterns
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];

          // More flexible pattern matching for level headers
          // Match patterns like "Excellent (4-5 points):", "Good (3):", "Average:", etc.
          const levelMatch = line.match(
            /^([A-Za-z]+(?:\s+[A-Za-z]+)?)(?:\s*\((\d+(?:-\d+)?)\s*(?:points?|)\))?:?$/i
          );

          if (levelMatch) {
            // If we were processing a previous level, save it
            if (currentLevel && currentCriteria.length > 0) {
              levels.push({
                level: currentLevel,
                points: currentPoints,
                criteria: [...currentCriteria],
              });
            }

            // Start a new level
            currentLevel = levelMatch[1];
            currentPoints = levelMatch[2] || "";
            currentCriteria = [];
          }
          // Check if it's a bullet point or numbered item
          else if (/^[-•*]|\d+\./.test(line)) {
            // Clean up the line by removing the bullet or number
            const cleanedLine = line.replace(/^[-•*]|\d+\.\s*/, "").trim();
            if (cleanedLine && currentLevel) {
              currentCriteria.push(cleanedLine);
            }
          }
          // If it's a continuation of the previous line or a non-bullet point
          else if (currentLevel && !line.match(/^[A-Za-z]+:/)) {
            // If it doesn't look like a new section, add it to criteria
            currentCriteria.push(line);
          }
        }

        // Add the last level if there is one
        if (currentLevel && currentCriteria.length > 0) {
          levels.push({
            level: currentLevel,
            points: currentPoints,
            criteria: [...currentCriteria],
          });
        }

        // Second pass: If no levels were found, try to extract from paragraph format
        if (levels.length === 0 || levels.length < 3) {
          // Look for patterns like "Excellent (4 points): criteria..."
          const paragraphLevels = rubricText.match(
            /([A-Za-z]+(?:\s+[A-Za-z]+)?)\s*\((\d+(?:-\d+)?)\s*(?:points?|)\):\s*([^.]+(?:\.[^.]+)*)/g
          );

          if (paragraphLevels) {
            // Clear existing levels if we're doing a second pass
            if (levels.length < 3) {
              levels = [];
            }

            paragraphLevels.forEach((levelText) => {
              const match = levelText.match(
                /([A-Za-z]+(?:\s+[A-Za-z]+)?)\s*\((\d+(?:-\d+)?)\s*(?:points?|)\):\s*(.+)/
              );
              if (match) {
                const [, level, points, criteriaText] = match;
                const criteria = criteriaText
                  .split(".")
                  .map((c) => c.trim())
                  .filter((c) => c.length > 0);

                if (criteria.length > 0) {
                  levels.push({
                    level,
                    points,
                    criteria,
                  });
                }
              }
            });
          }
        }

        // Third pass: If still not enough levels, try to extract from continuous text
        if (levels.length === 0 || levels.length < 3) {
          // Look for standard level names in the text
          const standardLevels = ["excellent", "good", "average", "poor"];
          const foundLevels = new Set(levels.map((l) => l.level.toLowerCase()));

          // For each standard level not found yet
          standardLevels.forEach((standardLevel) => {
            if (
              !Array.from(foundLevels).some((fl) => fl.includes(standardLevel))
            ) {
              // Look for this level in the text
              const regex = new RegExp(
                `${standardLevel}\\s*(?:\\(?(\\d+(?:-\\d+)?)\\s*(?:points?|)?\\)?)?[:\\.]?\\s*([^.]+(?:\\.[^.]+)*)`,
                "i"
              );
              const match = rubricText.match(regex);

              if (match) {
                const [, points = "", criteriaText] = match;
                if (criteriaText) {
                  const criteria = criteriaText
                    .split(".")
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0);

                  if (criteria.length > 0) {
                    levels.push({
                      level:
                        standardLevel.charAt(0).toUpperCase() +
                        standardLevel.slice(1),
                      points,
                      criteria,
                    });
                  }
                }
              }
            }
          });
        }

        // Ensure we have all standard levels
        if (levels.length < 4) {
          const standardLevels = [
            {
              level: "Excellent",
              points: "4",
              defaultCriteria: [
                "Strong examples, clear communication, organized and detail-oriented",
              ],
            },
            {
              level: "Good",
              points: "3",
              defaultCriteria: [
                "Good examples, effective communication, mostly organized",
              ],
            },
            {
              level: "Average",
              points: "2",
              defaultCriteria: [
                "Basic examples, adequate communication, somewhat organized",
              ],
            },
            {
              level: "Poor",
              points: "1",
              defaultCriteria: [
                "Weak or no examples, poor communication, disorganized",
              ],
            },
          ];

          // Add any missing standard levels
          const existingLevels = new Set(
            levels.map((l) => l.level.toLowerCase())
          );
          standardLevels.forEach((sl) => {
            if (
              !Array.from(existingLevels).some((el) =>
                el.includes(sl.level.toLowerCase())
              )
            ) {
              levels.push({
                level: sl.level,
                points: sl.points,
                criteria: sl.defaultCriteria,
              });
            }
          });

          // Sort levels in the standard order (Excellent -> Good -> Average -> Poor)
          levels.sort((a, b) => {
            const aIndex = standardLevels.findIndex((sl) =>
              a.level.toLowerCase().includes(sl.level.toLowerCase())
            );
            const bIndex = standardLevels.findIndex((sl) =>
              b.level.toLowerCase().includes(sl.level.toLowerCase())
            );
            return aIndex - bIndex;
          });
        }

        // First, make sure we have exactly one criterion per level
        levels.forEach((level) => {
          // If a level has multiple criteria, keep only the first one
          if (level.criteria.length > 1) {
            level.criteria = [level.criteria[0]];
          }
          // If a level has no criteria, add a default one
          else if (level.criteria.length === 0) {
            const defaultCriteria = {
              excellent:
                "Strong examples, clear communication, organized and detail-oriented",
              good: "Good examples, effective communication, mostly organized",
              average:
                "Basic examples, adequate communication, somewhat organized",
              poor: "Weak or no examples, poor communication, disorganized",
            };

            // Find the matching default criterion
            for (const [key, value] of Object.entries(defaultCriteria)) {
              if (level.level.toLowerCase().includes(key)) {
                level.criteria = [value];
                break;
              }
            }

            // If no match found, use a generic criterion
            if (level.criteria.length === 0) {
              level.criteria = ["Meets expectations for this level"];
            }
          }

          // Validate the quality of the criterion
          const criterion = level.criteria[0];

          // More comprehensive quality checks
          const isLowQuality =
            criterion.length < 15 || // Too short
            !criterion.includes(" ") || // Single word
            criterion.split(" ").length < 5 || // Too few words
            !criterion.match(/[.!?]$/) || // Not a complete sentence
            !(
              criterion.toLowerCase().includes("skill") ||
              criterion.toLowerCase().includes("competenc") ||
              criterion.toLowerCase().includes("knowledge") ||
              criterion.toLowerCase().includes("demonstrat") ||
              criterion.toLowerCase().includes("abilit")
            ); // Lacks key assessment terms

          if (isLowQuality) {
            // Replace with a better default based on the level
            const industrySpecificDefaults = {
              excellent: `Demonstrates strong technical skills, core competencies, and deep understanding of the ${validatedData.industry} industry, providing specific examples and clear articulation of complex concepts.`,
              good: `Shows good technical skills and understanding of the ${validatedData.industry} industry with effective communication and relevant examples, though may have minor areas for improvement.`,
              average: `Shows basic technical skills and core competencies related to the ${validatedData.industry} industry, but lacks depth in examples or comprehensive understanding.`,
              poor: `Lacks technical skills and core competencies required for the ${validatedData.industry} industry, with minimal relevant examples and unclear communication.`,
            };

            // Find the matching default criterion
            for (const [key, value] of Object.entries(
              industrySpecificDefaults
            )) {
              if (level.level.toLowerCase().includes(key)) {
                level.criteria = [value];
                break;
              }
            }
          }
        });

        // Generate professional-looking HTML for the scoring rubric
        result.scoringRubric = generateProfessionalRubricHtml(levels);
      } else {
        // If no rubric was found, use the fallback
        result.scoringRubric = getFallbackQuestions(
          validatedData.industry,
          validatedData.jobLevel
        ).scoringRubric;
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

    // Ensure we have the requested number of questions
    const requestedCount = parseInt(validatedData.numberOfQuestions);
    if (result.questions.length < requestedCount) {
      // Generate generic questions to fill the gap
      const industry = validatedData.industry;
      const jobLevel = validatedData.jobLevel;
      const genericQuestions = [
        `Tell me about your experience in the ${industry} industry and how it relates to this ${jobLevel} position.`,
        `Describe a challenging situation you faced in a previous role and how you resolved it.`,
        `How do you stay updated with the latest trends and developments in the ${industry} industry?`,
        `What methodologies or frameworks do you typically use in your work?`,
        `How do you handle tight deadlines and competing priorities?`,
        `Can you describe a project where you had to collaborate with cross-functional teams?`,
        `What's your approach to problem-solving in a fast-paced environment?`,
        `How do you handle feedback and criticism?`,
        `Describe a situation where you had to learn a new skill or technology quickly.`,
        `How do you ensure the quality of your work?`,
      ];

      // Add generic questions until we reach the requested count
      while (
        result.questions.length < requestedCount &&
        genericQuestions.length > 0
      ) {
        const genericQuestion = genericQuestions.shift();
        if (genericQuestion && !result.questions.includes(genericQuestion)) {
          result.questions.push(genericQuestion);
        }
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

// Function to generate professional-looking HTML for the scoring rubric
function generateProfessionalRubricHtml(
  levels: Array<{ level: string; points: string | null; criteria: string[] }>
): string {
  // If no levels were found, create a structured fallback with predefined levels
  // instead of the simple single-card fallback
  if (levels.length === 0) {
    // Create a default structured rubric with standard scoring levels
    return `<div class="scoring-rubric space-y-4">
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Excellent</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            4-5 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Strong, detailed response demonstrating technical skills and core competencies</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Good</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            3-4 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Adequate response demonstrating some technical skills and core competencies</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Average</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            2-3 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Limited response that may touch on technical skills or core competencies</p>
        </div>
      </div>
      
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">Poor</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            1-2 points
          </span>
        </div>
        <div class="p-4 bg-white">
          <p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> Inadequate or off-topic response that does not demonstrate technical skills</p>
        </div>
      </div>
    </div>`;
  }

  // Build the HTML with a professional style
  let htmlRubric = '<div class="scoring-rubric space-y-4">';

  levels.forEach(({ level, points, criteria }) => {
    const displayPoints =
      points ||
      (level.toLowerCase().includes("excellent")
        ? "4-5"
        : level.toLowerCase().includes("good")
        ? "3-4"
        : level.toLowerCase().includes("average")
        ? "2-3"
        : level.toLowerCase().includes("poor")
        ? "1-2"
        : "");

    htmlRubric += `
      <div class="mb-4 overflow-hidden rounded-lg shadow-sm border border-indigo-200 transition-all hover:shadow-md hover:translate-y-[-2px]">
        <div class="bg-indigo-50 px-4 py-3 border-b-2 border-indigo-400 flex justify-between items-center">
          <p class="font-semibold text-indigo-900 text-lg">${level}</p>
          <span class="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${displayPoints} points
          </span>
        </div>
        <div class="p-4 bg-white">`;

    // Only display the first criterion for each level
    htmlRubric += `<p class="mb-2 text-gray-800"><span class="font-semibold mr-2">1.</span> ${criteria[0]}</p>`;

    htmlRubric += `
        </div>
      </div>`;
  });

  htmlRubric += "</div>";
  return htmlRubric;
}
