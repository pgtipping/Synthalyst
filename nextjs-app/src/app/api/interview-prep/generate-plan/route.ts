import { NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { redisCache } from "@/lib/redis-cache";
import { redisMonitor } from "@/lib/redis-monitor";

// Type definitions
interface InterviewPlanSection {
  type: string;
  title: string;
  content?: string;
  items?: string[];
}

interface InterviewPlan {
  success: boolean;
  prepPlan: {
    sections: InterviewPlanSection[];
  };
  questions: string[];
}

// Cache configuration
const CACHE_VERSION = "v1";
const CACHE_TTL = 60 * 60 * 24; // 24 hours
const CACHE_PREFIX = "llm_responses";
const CACHE_WARM_TITLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Project Manager",
  "Business Analyst",
] as const;

// Define the schema for the request body
const requestSchema = z.object({
  jobDetails: z.object({
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().optional(),
    industry: z.string().optional(),
    jobLevel: z.string().optional(),
    description: z.string().optional(),
    requiredSkills: z.array(z.string()).optional(),
    resumeText: z.string().optional(),
  }),
  isPremiumUser: z.boolean(),
});

type RequestType = z.infer<typeof requestSchema>;

// Cache key generator with versioning
function generateCacheKey(data: RequestType): string {
  const keyData = {
    version: CACHE_VERSION,
    title: data.jobDetails.jobTitle,
    company: data.jobDetails.company || "",
    industry: data.jobDetails.industry || "",
    level: data.jobDetails.jobLevel || "",
    isPremium: data.isPremiumUser,
    optionalHash: Buffer.from(
      JSON.stringify({
        description: data.jobDetails.description,
        skills: data.jobDetails.requiredSkills,
        resume: data.jobDetails.resumeText?.substring(0, 100),
      })
    ).toString("base64"),
  };

  return `interview-prep:${JSON.stringify(keyData)}`;
}

// Move isValidInterviewPlan outside the stream handler
function isValidInterviewPlan(data: unknown): data is InterviewPlan {
  return (
    data !== null &&
    typeof data === "object" &&
    "success" in data &&
    typeof (data as InterviewPlan).success === "boolean" &&
    "prepPlan" in data &&
    (data as InterviewPlan).prepPlan &&
    Array.isArray((data as InterviewPlan).prepPlan.sections) &&
    Array.isArray((data as InterviewPlan).questions) &&
    (data as InterviewPlan).questions.length >= 10 &&
    (data as InterviewPlan).prepPlan.sections.every(
      (section: InterviewPlanSection) =>
        section.type &&
        section.title &&
        ((section.type === "timeline" && typeof section.content === "string") ||
          (section.type !== "timeline" && Array.isArray(section.items)))
    )
  );
}

// Cache warming function with proper types
async function warmCache(model: GenerativeModel) {
  logger.info("Starting cache warming for common job titles");

  for (const title of CACHE_WARM_TITLES) {
    const mockData: RequestType = {
      jobDetails: {
        jobTitle: title,
        company: undefined,
        industry: undefined,
        jobLevel: undefined,
        description: undefined,
        requiredSkills: undefined,
        resumeText: undefined,
      },
      isPremiumUser: false,
    };

    const cacheKey = generateCacheKey(mockData);
    const exists = await redisCache.get(cacheKey);

    if (!exists) {
      logger.info(`Warming cache for ${title}`);
      try {
        const response = await generatePlanWithModel(model, mockData);
        if (response) {
          await redisCache.set(cacheKey, response, {
            prefix: CACHE_PREFIX,
            ttl: CACHE_TTL,
          });
          logger.info(`Cache warmed for ${title}`);
        }
      } catch (error) {
        logger.error(`Cache warming failed for ${title}:`, error);
      }
    }
  }
}

// Plan generation helper with proper types
async function generatePlanWithModel(
  model: GenerativeModel,
  data: RequestType
): Promise<InterviewPlan | null> {
  const prepPlanPrompt = `
    You are an expert career coach helping job seekers prepare for interviews. Create a comprehensive and personalized interview preparation plan for:
    
    Job Title: ${data.jobDetails.jobTitle}
    ${data.jobDetails.company ? `Company: ${data.jobDetails.company}` : ""}
    ${data.jobDetails.industry ? `Industry: ${data.jobDetails.industry}` : ""}
    ${data.jobDetails.jobLevel ? `Job Level: ${data.jobDetails.jobLevel}` : ""}
    ${
      data.jobDetails.description
        ? `Job Description: ${data.jobDetails.description.substring(0, 500)}...`
        : ""
    }
    ${
      data.jobDetails.requiredSkills &&
      data.jobDetails.requiredSkills.length > 0
        ? `Required Skills: ${data.jobDetails.requiredSkills.join(", ")}`
        : ""
    }
    
    CRITICAL INSTRUCTIONS FOR RESPONSE FORMAT:
    1. You MUST respond with ONLY a valid JSON object.
    2. Do NOT include any explanatory text, markdown formatting, or code blocks.
    3. Do NOT use \`\`\`json or \`\`\` markers.
    4. The response must be parseable by JSON.parse().
    5. Follow this exact structure:

    {
      "success": true,
      "prepPlan": {
        "sections": [
          {
            "type": "string (one of: timeline, phase, goal, objective, star, category)",
            "title": "string",
            "content": "string (for timeline type)",
            "items": ["string"] (for other types)
          }
        ]
      },
      "questions": ["string (at least 10 interview questions)"]
    }

    VALIDATION RULES:
    1. Each section MUST have type and title
    2. Timeline sections use content, other types use items array
    3. Questions array MUST have at least 10 questions
    4. All text fields must use proper JSON escaping for quotes and special characters
    5. No trailing commas allowed
    6. All property names must be in double quotes

    Make the content detailed and tailored to the specific job.
    Each section should provide actionable and specific preparation steps.
    Questions should be highly relevant to the role and company.
  `;

  try {
    const response = await model.generateContent(prepPlanPrompt);
    const parts = response.response.text().split("\n");
    const jsonText = parts.find((part) => part.trim().startsWith("{"));

    if (jsonText) {
      const parsed = JSON.parse(jsonText);
      if (isValidInterviewPlan(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    logger.error("Plan generation failed:", error);
  }

  return null;
}

export async function POST(request: Request) {
  console.log("Interview prep plan API endpoint called");
  try {
    const requestBody = await request.json();
    logger.info("Request body:", requestBody);

    const clonedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(requestBody),
    });

    const data = await validateRequest(clonedRequest, requestSchema, false);

    // Generate cache key
    const cacheKey = generateCacheKey(data);

    // Check cache bypass conditions
    const shouldBypassCache =
      data.isPremiumUser && // Premium users get fresh responses
      requestBody.bypassCache === true; // Explicit bypass requested

    if (!shouldBypassCache) {
      // Try to get cached response
      const cachedResponse = await redisCache.get<InterviewPlan>(cacheKey, {
        prefix: CACHE_PREFIX,
      });

      if (cachedResponse) {
        logger.info("Returning cached interview prep plan");
        await redisMonitor.trackCache(cacheKey, true);
        return new Response(
          JSON.stringify({
            ...cachedResponse,
            cached: true,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }

    await redisMonitor.trackCache(cacheKey, false);
    logger.info(
      "No cached response found or cache bypassed, generating new plan"
    );

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Checking Gemini API key configuration...");
    console.log("API key exists:", !!apiKey);
    console.log("API key length:", apiKey?.length || 0);
    console.log("Environment:", process.env.NODE_ENV);

    if (!apiKey) {
      logger.error("Gemini API key is missing");
      console.error("Gemini API key is missing in environment variables");
      return NextResponse.json(
        {
          success: false,
          message: "Service configuration error. Please try again later.",
          fallbackMode: true,
          prepPlan: {
            sections: [
              {
                type: "timeline",
                title: "Preparation Timeline",
                content:
                  "Here's a structured timeline to prepare for your interview.",
              },
              {
                type: "phase",
                title: "Research Phase (3-5 days before)",
                items: [
                  `Research ${
                    data.jobDetails.company || "the company"
                  } thoroughly - their products, services, mission, and recent news`,
                  "Study the job description and identify key skills and qualifications",
                  "Prepare examples from your experience that demonstrate these skills",
                  `Research common interview questions for ${
                    data.jobDetails.jobTitle || "the position"
                  } positions`,
                ],
              },
              {
                type: "phase",
                title: "Practice Phase (1-2 days before)",
                items: [
                  "Practice answering common interview questions out loud",
                  'Prepare your "tell me about yourself" response',
                  "Prepare 3-5 questions to ask the interviewer",
                  "Practice explaining your past experiences using the STAR method (Situation, Task, Action, Result)",
                ],
              },
              {
                type: "phase",
                title: "Day Before Preparation",
                items: [
                  "Plan your outfit and prepare any materials you need to bring",
                  "Review your resume and be ready to discuss any item on it",
                  "Get a good night's sleep",
                  "Plan your route to the interview location or test your video conferencing setup",
                ],
              },
              {
                type: "phase",
                title: "Interview Day",
                items: [
                  "Arrive 10-15 minutes early or log in 5 minutes before a virtual interview",
                  "Bring copies of your resume and a notepad",
                  "Remember to maintain good eye contact and positive body language",
                  "Listen carefully to questions before answering",
                  "Thank the interviewer for their time at the end",
                ],
              },
              ...(data.isPremiumUser
                ? [
                    {
                      type: "phase",
                      title: "Follow-up",
                      items: [
                        "Send a thank-you email within 24 hours",
                        "Reference specific topics discussed during the interview",
                        "Reiterate your interest in the position",
                        "Provide any additional information requested during the interview",
                      ],
                    },
                  ]
                : []),
            ],
          },
          questions: generateFallbackQuestions(
            data.jobDetails,
            data.isPremiumUser
          ),
        },
        { status: 200 }
      );
    }

    try {
      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey!);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
        },
      });

      // Warm cache for common job titles in background
      warmCache(model).catch((error) =>
        logger.error("Cache warming failed:", error)
      );

      // Create a more comprehensive prompt for interview prep plan
      logger.info("Creating prompt for interview prep plan");
      const prepPlanPrompt = `
        You are an expert career coach helping job seekers prepare for interviews. Create a comprehensive and personalized interview preparation plan for:
        
        Job Title: ${data.jobDetails.jobTitle}
        ${data.jobDetails.company ? `Company: ${data.jobDetails.company}` : ""}
        ${
          data.jobDetails.industry
            ? `Industry: ${data.jobDetails.industry}`
            : ""
        }
        ${
          data.jobDetails.jobLevel
            ? `Job Level: ${data.jobDetails.jobLevel}`
            : ""
        }
        ${
          data.jobDetails.description
            ? `Job Description: ${data.jobDetails.description.substring(
                0,
                500
              )}...`
            : ""
        }
        ${
          data.jobDetails.requiredSkills &&
          data.jobDetails.requiredSkills.length > 0
            ? `Required Skills: ${data.jobDetails.requiredSkills.join(", ")}`
            : ""
        }
        
        CRITICAL INSTRUCTIONS FOR RESPONSE FORMAT:
        1. You MUST respond with ONLY a valid JSON object.
        2. Do NOT include any explanatory text, markdown formatting, or code blocks.
        3. Do NOT use \`\`\`json or \`\`\` markers.
        4. The response must be parseable by JSON.parse().
        5. Follow this exact structure:

        {
          "success": true,
          "prepPlan": {
            "sections": [
              {
                "type": "string (one of: timeline, phase, goal, objective, star, category)",
                "title": "string",
                "content": "string (for timeline type)",
                "items": ["string"] (for other types)
              }
            ]
          },
          "questions": ["string (at least 10 interview questions)"]
        }

        VALIDATION RULES:
        1. Each section MUST have type and title
        2. Timeline sections use content, other types use items array
        3. Questions array MUST have at least 10 questions
        4. All text fields must use proper JSON escaping for quotes and special characters
        5. No trailing commas allowed
        6. All property names must be in double quotes

        Make the content detailed and tailored to the specific job.
        Each section should provide actionable and specific preparation steps.
        Questions should be highly relevant to the role and company.
      `;

      console.log("Prompt length:", prepPlanPrompt.length);

      // Set up streaming response
      const streamingResponse = await model.generateContentStream(
        prepPlanPrompt
      );
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            let accumulatedText = "";
            let lastValidJson: InterviewPlan | null = null;

            for await (const chunk of streamingResponse.stream) {
              const text = chunk.text();
              if (text) {
                accumulatedText += text;
                const cleanText = accumulatedText
                  .trim()
                  .replace(/```json\s*/g, "")
                  .replace(/```\s*/g, "")
                  .replace(/^\s*\{/, "{")
                  .replace(/\}\s*$/, "}");

                try {
                  const parsed = JSON.parse(cleanText);
                  if (isValidInterviewPlan(parsed)) {
                    lastValidJson = parsed;

                    // Cache the valid response
                    await redisCache.set(cacheKey, parsed, {
                      prefix: CACHE_PREFIX,
                      ttl: CACHE_TTL,
                    });

                    // Track successful generation
                    await redisMonitor.trackCache(cacheKey, true);

                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          ...parsed,
                          cached: false,
                          generated: new Date().toISOString(),
                        })
                      )
                    );
                    accumulatedText = "";
                  }
                } catch (error) {
                  console.log("Chunk parsing failed:", error);
                }
              }
            }

            if (!lastValidJson) {
              // Handle invalid or missing response
              const fallback = generateFallbackContent(data);
              await redisCache.set(cacheKey, fallback, {
                prefix: CACHE_PREFIX,
                ttl: CACHE_TTL / 2, // Cache fallback for less time
              });
              await redisMonitor.trackCache(cacheKey, false);
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    ...fallback,
                    cached: false,
                    fallback: true,
                  })
                )
              );
            }

            controller.close();
          } catch (error) {
            console.error("Stream processing error:", error);
            const fallback = generateFallbackContent(data);

            // Cache fallback with shorter TTL
            await redisCache.set(cacheKey, fallback, {
              prefix: CACHE_PREFIX,
              ttl: CACHE_TTL / 2,
            });

            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  ...fallback,
                  cached: false,
                  fallback: true,
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                })
              )
            );
            controller.close();
          }
        },
      });

      return new Response(stream);
    } catch (error) {
      logger.error("Failed to generate plan:", error);

      // Invalidate cache on error
      await redisCache.delete(cacheKey);

      return handleAPIError(error);
    }
  } catch (error) {
    logger.error("Request processing failed:", error);
    return handleAPIError(error);
  }
}

// Fallback functions for when the AI API is unavailable
function generateFallbackQuestions(
  jobDetails: z.infer<typeof requestSchema>["jobDetails"],
  isPremiumUser: boolean = false
): string[] {
  console.log("Generating fallback questions for:", jobDetails.jobTitle);
  const jobTitle = jobDetails.jobTitle || "the position";
  const company = jobDetails.company || "the company";
  const industry = jobDetails.industry || "your industry";

  const baseQuestions = [
    `Tell me about your experience that qualifies you for ${jobTitle}.`,
    `Why are you interested in working for ${company}?`,
    `What do you know about ${company} and our position in ${industry}?`,
    `Describe a challenging situation you faced in your previous role and how you handled it.`,
    `What are your strengths and weaknesses as they relate to ${jobTitle}?`,
    `Where do you see yourself in 5 years?`,
    `Why should we hire you for this position?`,
    `How do you handle stress and pressure?`,
    `Describe your ideal work environment.`,
    `What questions do you have for me about the role or company?`,
  ];

  const premiumQuestions = [
    `What specific skills or experiences do you have that align with our needs for ${jobTitle}?`,
    `How do you stay current with trends and developments in ${industry}?`,
    `Describe a time when you had to learn a new skill quickly. How did you approach it?`,
    `What's the most innovative project you've worked on, and what was your contribution?`,
    `How do you prioritize tasks when handling multiple projects?`,
    `Tell me about a time when you received constructive feedback and how you responded to it.`,
    `How would your previous colleagues describe your work style?`,
    `What motivates you professionally?`,
    `Describe a situation where you had to work with a difficult team member. How did you handle it?`,
    `What are your salary expectations for this role?`,
  ];

  return isPremiumUser
    ? [...baseQuestions, ...premiumQuestions]
    : baseQuestions;
}

function generateFallbackContent(data: {
  jobDetails: { company?: string; jobTitle?: string };
}): InterviewPlan {
  return {
    success: true,
    prepPlan: {
      sections: [
        {
          type: "timeline",
          title: "Preparation Timeline",
          content:
            "Here's a structured timeline to prepare for your interview.",
        },
        {
          type: "phase",
          title: "Research Phase (3-5 days before)",
          items: [
            `Research ${
              data.jobDetails.company || "the company"
            } thoroughly - their products, services, mission, and recent news`,
            "Study the job description and identify key skills and qualifications",
            "Prepare examples from your experience that demonstrate these skills",
            `Research common interview questions for ${
              data.jobDetails.jobTitle || "the position"
            } positions`,
          ],
        },
        {
          type: "phase",
          title: "Practice Phase (1-2 days before)",
          items: [
            "Practice answering common interview questions out loud",
            'Prepare your "tell me about yourself" response',
            "Prepare 3-5 questions to ask the interviewer",
            "Practice explaining your past experiences using the STAR method (Situation, Task, Action, Result)",
          ],
        },
        {
          type: "phase",
          title: "Day Before Preparation",
          items: [
            "Plan your outfit and prepare any materials you need to bring",
            "Review your resume and be ready to discuss any item on it",
            "Get a good night's sleep",
            "Plan your route to the interview location or test your video conferencing setup",
          ],
        },
        {
          type: "phase",
          title: "Interview Day",
          items: [
            "Arrive 10-15 minutes early or log in 5 minutes before a virtual interview",
            "Bring copies of your resume and a notepad",
            "Remember to maintain good eye contact and positive body language",
            "Listen carefully to questions before answering",
            "Thank the interviewer for their time at the end",
          ],
        },
      ],
    },
    questions: [
      "Can you tell me about yourself?",
      "Why are you interested in this position?",
      "What are your greatest strengths and weaknesses?",
      "Tell me about a challenging situation you faced at work and how you handled it.",
      "Where do you see yourself in 5 years?",
      "Why do you want to leave your current position?",
      "What do you know about our company?",
      "How do you handle stress and pressure?",
      "Describe a time when you had to work as part of a team.",
      "What questions do you have for me?",
    ],
  };
}
