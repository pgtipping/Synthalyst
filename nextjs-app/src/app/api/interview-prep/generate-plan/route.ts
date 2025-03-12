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
  try {
    // Validate the request body against our schema
    const data = await validateRequest(
      request,
      requestSchema,
      false // Don't require authentication for now
    );

    logger.info("Processing interview prep plan request", {
      jobTitle: data.jobDetails.jobTitle,
      isPremiumUser: data.isPremiumUser,
    });

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error("Gemini API key is missing");
      return NextResponse.json(
        {
          success: false,
          message: "Service configuration error. Please try again later.",
          fallbackMode: true,
          prepPlan: generateFallbackPlan(data.jobDetails, data.isPremiumUser),
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
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create the prompt for interview prep plan
      const prepPlanPrompt = `
        You are an expert career coach with 15+ years of experience helping job seekers prepare for interviews. Your task is to create a personalized interview preparation plan for a candidate applying for the following job:
        
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
        
        Format your response as a clear, structured preparation plan that the candidate can follow in the days leading up to their interview.
      `;

      // Generate the interview prep plan
      const prepPlanResult = await model.generateContent(prepPlanPrompt);
      const prepPlanResponse = await prepPlanResult.response;
      const prepPlan = prepPlanResponse.text();

      // Create the prompt for practice questions
      const questionsPrompt = `
        You are an expert interviewer with extensive experience in hiring for various roles. Your task is to create a set of interview questions for a candidate applying for the following job:
        
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
        1. Create ${
          data.isPremiumUser ? "10" : "5"
        } challenging but fair interview questions.
        2. Include a mix of behavioral, technical, and situational questions.
        3. Focus on questions that assess the required skills for the role.
        4. Include questions about past experiences and accomplishments.
        5. Add questions that evaluate cultural fit and soft skills.
        
        Format your response as a JSON array of strings, with each string being a complete interview question. For example:
        ["Tell me about a time when you faced a significant challenge in your previous role. How did you overcome it?", "What experience do you have with our tech stack?"]
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
          questionsText.match(/```\n([\s\S]*?)\n```/) || [null, questionsText];
        const jsonString = jsonMatch[1] || questionsText;
        questions = JSON.parse(jsonString);
      } catch (error) {
        logger.error("Failed to parse questions response", error);
        questions = generateFallbackQuestions(
          data.jobDetails,
          data.isPremiumUser
        );
      }

      return NextResponse.json(
        {
          success: true,
          prepPlan,
          questions,
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
          prepPlan: generateFallbackPlan(data.jobDetails, data.isPremiumUser),
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
  const jobTitle = jobDetails.jobTitle || "the position";
  const company = jobDetails.company || "the company";

  return `# Interview Preparation Plan for ${jobTitle}

## Research Phase (3-5 days before)
1. Research ${company} thoroughly - their products, services, mission, and recent news
2. Study the job description and identify key skills and qualifications
3. Prepare examples from your experience that demonstrate these skills
4. Research common interview questions for ${jobTitle} positions

## Practice Phase (1-2 days before)
1. Practice answering common interview questions out loud
2. Prepare your "tell me about yourself" response
3. Prepare 3-5 questions to ask the interviewer
4. Practice explaining your past experiences using the STAR method (Situation, Task, Action, Result)

## Day Before Preparation
1. Plan your outfit and prepare any materials you need to bring
2. Review your resume and be ready to discuss any item on it
3. Get a good night's sleep
4. Plan your route to the interview location or test your video conferencing setup

## Interview Day
1. Arrive 10-15 minutes early or log in 5 minutes before a virtual interview
2. Bring copies of your resume and a notepad
3. Remember to maintain good eye contact and positive body language
4. Listen carefully to questions before answering
5. Thank the interviewer for their time at the end

${
  isPremiumUser
    ? `## Follow-up
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
  const jobTitle = jobDetails.jobTitle || "this position";
  const company = jobDetails.company || "our company";
  const numQuestions = isPremiumUser ? 8 : 5;

  const commonQuestions = [
    `Tell me about yourself and why you're interested in ${jobTitle} at ${company}.`,
    `What relevant experience do you have for ${jobTitle}?`,
    `Describe a challenging situation you faced in your previous role and how you handled it.`,
    `What are your greatest strengths and how would they help you succeed in ${jobTitle}?`,
    `Where do you see yourself professionally in 5 years?`,
    `Why are you leaving your current position?`,
    `How do you handle pressure and stressful situations?`,
    `Describe your ideal work environment.`,
    `What questions do you have for me about ${company} or ${jobTitle}?`,
    `What salary range are you expecting for ${jobTitle}?`,
  ];

  // Return a subset of questions based on premium status
  return commonQuestions.slice(0, numQuestions);
}
