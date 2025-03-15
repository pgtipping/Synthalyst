import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";

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
  isPremiumUser: z.boolean().default(false),
});

export async function POST(request: Request) {
  console.log("Interview prep plan API endpoint called");
  try {
    // Log the request body for debugging
    const requestBody = await request.json();
    logger.info("Request body:", requestBody);
    console.log("Request body received:", JSON.stringify(requestBody));

    // Clone the request since we've already consumed the body
    const clonedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(requestBody),
    });

    // Validate the request body against our schema
    const data = await validateRequest(
      clonedRequest,
      requestSchema,
      false // Don't require authentication for now
    );

    logger.info("Processing interview prep plan request", {
      jobTitle: data.jobDetails.jobTitle,
      isPremiumUser: data.isPremiumUser,
    });

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini API key available:", apiKey ? "Yes" : "No");
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
      // Initialize the Google Generative AI client with a timeout
      logger.info("Initializing Google Generative AI client");
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the Gemini model with a faster model option
      logger.info("Getting Gemini model");
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite", // Use a faster model
        generationConfig: {
          maxOutputTokens: 2048, // Reduced token limit for faster response
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
        },
      });

      // Create a more concise prompt for interview prep plan
      logger.info("Creating prompt for interview prep plan");
      const prepPlanPrompt = `
        You are an expert career coach helping job seekers prepare for interviews. Create a personalized interview preparation plan for:
        
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
        
        INTERVIEW PREPARATION PLAN GUIDELINES:
        1. Create a structured preparation plan with clear steps and timelines.
        2. Include specific areas to focus on based on the job requirements.
        3. Suggest research topics about the company and industry.
        4. Recommend preparation strategies for common interview questions.
        5. Provide tips for demonstrating the required skills during the interview.
        
        Format your response as a JSON object with the following structure:
        {
          "sections": [
            {
              "type": "timeline",
              "title": "Timeline Overview",
              "content": "Content here..."
            },
            {
              "type": "phase",
              "title": "Research Phase (3-5 days before)",
              "items": [
                "Research point 1",
                "Research point 2"
              ]
            }
          ]
        }

        Section types can be: timeline, phase, goal, objective, star, category
        Each section should have a title and either content (string) or items (array of strings)
      `;

      // Set a timeout for the API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("API call timed out"));
        }, 15000); // 15 seconds timeout (reduced from 25s)
      });

      // Generate the interview prep plan with timeout
      const prepPlanPromise = model.generateContent(prepPlanPrompt);
      const prepPlanResult = (await Promise.race([
        prepPlanPromise,
        timeoutPromise,
      ])) as unknown as Awaited<ReturnType<typeof model.generateContent>>;

      if (!prepPlanResult) {
        throw new Error("Failed to generate interview prep plan");
      }

      const prepPlanResponse = prepPlanResult;
      const prepPlanText = prepPlanResponse.response.text();

      // Create a more concise prompt for practice questions
      const questionsPrompt = `
        You are an expert career coach. Create a list of 10 interview questions for:
        
        Job Title: ${data.jobDetails.jobTitle}
        ${data.jobDetails.company ? `Company: ${data.jobDetails.company}` : ""}
        ${
          data.jobDetails.industry
            ? `Industry: ${data.jobDetails.industry}`
            : ""
        }
        
        Format your response as a JSON array of strings, each containing one question.
      `;

      // Generate the questions with timeout
      const questionsPromise = model.generateContent(questionsPrompt);
      const questionsResult = (await Promise.race([
        questionsPromise,
        timeoutPromise,
      ])) as unknown as Awaited<ReturnType<typeof model.generateContent>>;

      if (!questionsResult) {
        throw new Error("Failed to generate interview questions");
      }

      const questionsResponse = questionsResult;
      const questionsText = questionsResponse.response.text();

      // Parse the responses
      let prepPlanData;
      let questionsData;

      try {
        prepPlanData = JSON.parse(prepPlanText);
      } catch (error) {
        logger.error("Error parsing prep plan JSON:", error);
        console.error("Error parsing prep plan JSON:", error);
        prepPlanData = {
          sections: [
            {
              type: "timeline",
              title: "Preparation Timeline",
              content:
                "Here's a structured timeline to prepare for your interview.",
            },
            // Add fallback sections
          ],
        };
      }

      try {
        questionsData = JSON.parse(questionsText);
      } catch (error) {
        logger.error("Error parsing questions JSON:", error);
        console.error("Error parsing questions JSON:", error);
        questionsData = generateFallbackQuestions(
          data.jobDetails,
          data.isPremiumUser
        );
      }

      // Return the response
      return NextResponse.json(
        {
          success: true,
          prepPlan: prepPlanData,
          questions: Array.isArray(questionsData)
            ? questionsData
            : generateFallbackQuestions(data.jobDetails, data.isPremiumUser),
        },
        { status: 200 }
      );
    } catch (error) {
      logger.error("Google AI API error", error);

      // Return a fallback response when the API fails
      return NextResponse.json(
        {
          success: true,
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
          message: "Interview prep plan generated with fallback system",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    logger.error("Failed to generate interview prep plan", error);
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
