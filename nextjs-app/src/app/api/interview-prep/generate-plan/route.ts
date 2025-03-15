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
      // Initialize the Google Generative AI client
      logger.info("Initializing Google Generative AI client");
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the Gemini model
      logger.info("Getting Gemini model");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create the prompt for interview prep plan
      logger.info("Creating prompt for interview prep plan");
      const prepPlanPrompt = `
        You are an expert career coach  helping job seekers prepare for interviews. Your task is to create a personalized interview preparation plan for a candidate applying for the following job:
        
        ${
          data.isPremiumUser
            ? "This is a premium user, so provide comprehensive guidance and detailed preparation steps."
            : "This is a free tier user, but still provide substantial guidance to demonstrate the value of our service."
        }
        
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
            ? `Job Description: ${data.jobDetails.description}`
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
        6. Include advice on how to present accomplishments effectively.
        7. Suggest questions the candidate should ask the interviewer.
        8. Include tips for follow-up after the interview.
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        - DO NOT use markdown syntax like double asterisks (**) for bold text or single asterisks (*) for italic text
        - DO NOT use any markdown formatting in your response
        - Use plain text only for all content
        - For emphasis, use section titles and clear organization instead of text formatting
        
        IMPORTANT: Format your response as a JSON object with the following structure:
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
            },
            {
              "type": "goal",
              "title": "Overarching Goal",
              "content": "Content here..."
            }
          ]
        }

        Section types can be: timeline, phase, goal, objective, star, category
        Each section should have a title and either content (string) or items (array of strings)
      `;

      // Generate the interview prep plan
      const prepPlanResult = await model.generateContent(prepPlanPrompt);
      const prepPlanResponse = await prepPlanResult.response;

      // Create the prompt for practice questions
      const questionsPrompt = `
        You are an expert career coach with 15+ years of experience helping job seekers prepare for interviews. Your task is to create a list of interview questions that a candidate might be asked when applying for the following job:
        
        ${
          data.isPremiumUser
            ? "This is a premium user, so provide a comprehensive list of questions."
            : "This is a free tier user, so provide a focused list of the most important questions."
        }
        
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
            ? `Job Description: ${data.jobDetails.description}`
            : ""
        }
        
        ${
          data.jobDetails.requiredSkills &&
          data.jobDetails.requiredSkills.length > 0
            ? `Required Skills: ${data.jobDetails.requiredSkills.join(", ")}`
            : ""
        }
        
        INTERVIEW QUESTIONS GUIDELINES:
        1. Create a mix of behavioral, situational, and technical questions.
        2. Include questions specific to the job requirements and industry.
        3. Focus on questions that assess the required skills.
        4. Include questions about the candidate's experience and accomplishments.
        5. Add questions about the candidate's knowledge of the company and industry.
        
        IMPORTANT FORMATTING INSTRUCTIONS:
        - DO NOT use markdown syntax like double asterisks (**) for bold text or single asterisks (*) for italic text
        - DO NOT use any markdown formatting in your response
        - Use plain text only for all questions
        
        IMPORTANT: Format your response as a JSON array of strings, with each string being a question. For example:
        [
          "Tell me about your experience with...",
          "How would you handle...",
          "What do you know about our company?"
        ]
        
        ${
          data.isPremiumUser
            ? "Provide 15-20 questions."
            : "Provide 8-10 questions."
        }
      `;

      // Generate the practice questions
      const questionsResult = await model.generateContent(questionsPrompt);
      const questionsResponse = await questionsResult.response;
      const questionsText = questionsResponse.text();

      // Parse the questions JSON
      let questions: string[] = [];
      try {
        // Extract JSON from the response (it might be wrapped in markdown code blocks)
        const jsonMatch = questionsText.match(/```json\n([\s\S]*?)\n```/) ||
          questionsText.match(/```\n([\s\S]*?)\n```/) ||
          questionsText.match(/\[([\s\S]*?)\]/) || [null, questionsText]; // Try to match a JSON array directly

        let jsonString = jsonMatch[1] || questionsText;

        // Clean up the string to ensure it's valid JSON
        // If it's not already wrapped in brackets and looks like an array of strings, wrap it
        if (
          !jsonString.trim().startsWith("[") &&
          !jsonString.trim().startsWith("{")
        ) {
          // Check if it looks like a list of questions (numbered or bulleted)
          if (/^\d+\.|\*\s/.test(jsonString)) {
            // Convert to array format
            const lines = jsonString.split("\n").filter((line) => line.trim());
            const extractedQuestions = lines.map((line) => {
              // Remove numbers, bullets, etc.
              return line.replace(/^\d+\.\s*|\*\s*/, "").trim();
            });
            jsonString = JSON.stringify(extractedQuestions);
          } else {
            // Wrap in brackets to make it a JSON array
            jsonString = `[${jsonString}]`;
          }
        }

        // Try to parse the JSON
        try {
          questions = JSON.parse(jsonString);

          // Ensure questions is an array
          if (!Array.isArray(questions)) {
            if (typeof questions === "object" && questions !== null) {
              // If it's an object with questions property
              const questionsObj = questions as Record<string, unknown>;
              if (
                "questions" in questionsObj &&
                Array.isArray(questionsObj.questions)
              ) {
                questions = questionsObj.questions;
              } else {
                questions = Object.values(questionsObj)
                  .filter(
                    (value) =>
                      typeof value === "string" || typeof value === "number"
                  )
                  .map((value) => String(value));
              }
            } else {
              // Fallback to string array with one item
              questions = [String(questions)];
            }
          }
        } catch (parseError) {
          // If parsing fails, try to extract questions as an array of strings
          logger.error(
            "Failed to parse JSON directly, trying alternative extraction",
            parseError
          );

          // Extract questions as an array by looking for numbered items
          const questionRegex = /\d+\.\s*(.*?)(?=\d+\.|$)/g;
          const matches = [...jsonString.matchAll(questionRegex)];

          if (matches.length > 0) {
            questions = matches.map((match) => match[1].trim());
          } else {
            // Split by newlines as a last resort
            questions = jsonString
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .map((line) => line.trim());
          }
        }
      } catch (error) {
        logger.error("Failed to parse questions response", error);
        questions = generateFallbackQuestions(
          data.jobDetails,
          data.isPremiumUser
        );
      }

      // Parse the prep plan
      let prepPlan;
      try {
        const prepPlanText = prepPlanResponse.text();
        const jsonMatch = prepPlanText.match(/```json\n([\s\S]*?)\n```/) ||
          prepPlanText.match(/```\n([\s\S]*?)\n```/) || [null, prepPlanText];

        const prepPlanJsonString = jsonMatch[1] || prepPlanText;

        // Try to parse the JSON
        prepPlan = JSON.parse(prepPlanJsonString);

        // Ensure prepPlan has a sections array
        if (!prepPlan.sections) {
          prepPlan = { sections: [] };
        }
      } catch (error) {
        logger.error("Failed to parse prep plan response", error);
        // Create a fallback prep plan
        prepPlan = {
          sections: [
            {
              type: "goal",
              title: "Interview Preparation Plan",
              content: generateFallbackPlan(
                data.jobDetails,
                data.isPremiumUser
              ),
            },
          ],
        };
      }

      // Final safety check to ensure we always return valid data
      if (!prepPlan || typeof prepPlan !== "object") {
        prepPlan = {
          sections: [
            {
              type: "goal",
              title: "Interview Preparation Plan",
              content: generateFallbackPlan(
                data.jobDetails,
                data.isPremiumUser
              ),
            },
          ],
        };
      }

      if (!prepPlan.sections) {
        prepPlan.sections = [];
      }

      if (!Array.isArray(questions)) {
        questions = generateFallbackQuestions(
          data.jobDetails,
          data.isPremiumUser
        );
      }

      // Add one more safety check to ensure we always return valid data
      // This will catch any edge cases that might have been missed
      const finalPrepPlan =
        prepPlan && typeof prepPlan === "object" ? prepPlan : { sections: [] };
      if (!finalPrepPlan.sections) {
        finalPrepPlan.sections = [];
      }

      const finalQuestions = Array.isArray(questions) ? questions : [];

      return NextResponse.json(
        {
          success: true,
          prepPlan: finalPrepPlan,
          questions: finalQuestions,
          message: "Interview prep plan generated successfully",
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

function generateFallbackPlan(
  jobDetails: z.infer<typeof requestSchema>["jobDetails"],
  isPremiumUser: boolean = false
): string {
  console.log("Generating fallback plan for:", jobDetails.jobTitle);
  const jobTitle = jobDetails.jobTitle || "the position";
  const company = jobDetails.company || "the company";

  return `INTERVIEW PREPARATION PLAN for ${jobTitle}

TIMELINE: Research Phase (3-5 days before)
1. Research ${company} thoroughly - their products, services, mission, and recent news
2. Study the job description and identify key skills and qualifications
3. Prepare examples from your experience that demonstrate these skills
4. Research common interview questions for ${jobTitle} positions

PHASE 1: Practice Phase (1-2 days before)
1. Practice answering common interview questions out loud
2. Prepare your "tell me about yourself" response
3. Prepare 3-5 questions to ask the interviewer
4. Practice explaining your past experiences using the STAR method (Situation, Task, Action, Result)

PHASE 2: Day Before Preparation
1. Plan your outfit and prepare any materials you need to bring
2. Review your resume and be ready to discuss any item on it
3. Get a good night's sleep
4. Plan your route to the interview location or test your video conferencing setup

PHASE 3: Interview Day
1. Arrive 10-15 minutes early or log in 5 minutes before a virtual interview
2. Bring copies of your resume and a notepad
3. Remember to maintain good eye contact and positive body language
4. Listen carefully to questions before answering
5. Thank the interviewer for their time at the end

${
  isPremiumUser
    ? `PHASE 4: Follow-up
1. Send a thank-you email within 24 hours
2. Reference specific topics discussed during the interview
3. Reiterate your interest in the position
4. Provide any additional information requested during the interview`
    : ""
}`;
}

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
