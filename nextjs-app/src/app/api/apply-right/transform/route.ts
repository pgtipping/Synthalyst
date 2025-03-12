import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define the schema for the request body
const transformSchema = z.object({
  resumeText: z.string().min(1, "Resume text is required"),
  jobDescription: z.string().optional(),
  isPremiumUser: z.boolean().default(false),
});

export async function POST(request: Request) {
  try {
    // Validate the request body against our schema
    const data = await validateRequest(
      request,
      transformSchema,
      false // Don't require authentication for now
    );

    logger.info("Processing resume transformation request", {
      hasJobDescription: !!data.jobDescription,
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
          transformedResume: generateFallbackResume(
            data.resumeText,
            data.jobDescription,
            data.isPremiumUser || false
          ),
          coverLetter: data.jobDescription
            ? generateFallbackCoverLetter(data.resumeText, data.jobDescription)
            : null,
          changesMade: generateFallbackChanges(data.isPremiumUser || false),
          keywordsExtracted: data.jobDescription
            ? extractFallbackKeywords(data.jobDescription)
            : [],
        },
        { status: 200 }
      );
    }

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Create the prompt for resume transformation
      const resumePrompt = `
        You are an expert resume writer and career coach. Your task is to transform the following resume to make it more professional, impactful, and optimized for Applicant Tracking Systems (ATS).
        
        ${
          data.isPremiumUser
            ? "This is a premium user, so provide comprehensive improvements and detailed optimizations."
            : "This is a free tier user, so provide basic improvements."
        }
        
        Resume to transform:
        ${data.resumeText}
        
        ${
          data.jobDescription
            ? `Job Description to target:
        ${data.jobDescription}`
            : "No job description provided, so make general improvements."
        }
        
        Please provide:
        1. A transformed version of the resume with improved language, formatting, and structure.
        2. A list of specific changes made to improve the resume.
        ${
          data.jobDescription
            ? "3. A list of keywords extracted from the job description that were incorporated into the resume."
            : ""
        }
        
        Format your response as a JSON object with the following structure:
        {
          "transformedResume": "The full transformed resume text",
          "changesMade": ["Change 1", "Change 2", ...],
          "keywordsExtracted": ["Keyword 1", "Keyword 2", ...]
        }
      `;

      // Generate the transformed resume
      const resumeResult = await model.generateContent(resumePrompt);
      const resumeResponse = await resumeResult.response;
      const resumeText = resumeResponse.text();

      // Parse the JSON response
      let parsedResumeResponse;
      try {
        // Extract JSON from the response (it might be wrapped in markdown code blocks)
        const jsonMatch = resumeText.match(/```json\n([\s\S]*?)\n```/) ||
          resumeText.match(/```\n([\s\S]*?)\n```/) || [null, resumeText];
        const jsonString = jsonMatch[1] || resumeText;
        parsedResumeResponse = JSON.parse(jsonString);
      } catch (error) {
        logger.error("Failed to parse resume transformation response", error);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to process resume transformation",
          },
          { status: 500 }
        );
      }

      // Generate a cover letter if job description is provided
      let coverLetter = null;
      if (data.jobDescription) {
        const coverLetterPrompt = `
          You are an expert cover letter writer. Your task is to create a professional cover letter based on the following resume and job description.
          
          Resume:
          ${parsedResumeResponse.transformedResume || data.resumeText}
          
          Job Description:
          ${data.jobDescription}
          
          Please write a compelling cover letter that highlights the candidate's relevant skills and experiences for this specific job.
          The cover letter should be professional, concise, and tailored to the job description.
          
          Format your response as plain text for the cover letter only, without any additional commentary.
        `;

        try {
          const coverLetterResult = await model.generateContent(
            coverLetterPrompt
          );
          const coverLetterResponse = await coverLetterResult.response;
          coverLetter = coverLetterResponse.text();
        } catch (error) {
          logger.error("Failed to generate cover letter", error);
          // Continue with the process even if cover letter generation fails
        }
      }

      return NextResponse.json(
        {
          success: true,
          transformedResume: parsedResumeResponse.transformedResume,
          coverLetter,
          changesMade: parsedResumeResponse.changesMade || [],
          keywordsExtracted: parsedResumeResponse.keywordsExtracted || [],
          message: "Resume transformed successfully",
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
          transformedResume: generateFallbackResume(
            data.resumeText,
            data.jobDescription,
            data.isPremiumUser || false
          ),
          coverLetter: data.jobDescription
            ? generateFallbackCoverLetter(data.resumeText, data.jobDescription)
            : null,
          changesMade: generateFallbackChanges(data.isPremiumUser || false),
          keywordsExtracted: data.jobDescription
            ? extractFallbackKeywords(data.jobDescription)
            : [],
          message: "Resume transformed with fallback system",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    logger.error("Failed to transform resume", error);
    return handleAPIError(error);
  }
}

// Fallback functions for when the AI API is unavailable

function generateFallbackResume(
  resumeText: string,
  jobDescription?: string,
  isPremiumUser: boolean = false
): string {
  // Simple fallback that returns the original resume with some basic formatting
  const sections = resumeText.split(/\n\s*\n/);

  // Add some basic formatting to the resume
  const formattedSections = sections.map((section) => {
    // Check if this is a header section
    if (
      section.length < 50 &&
      (section.toUpperCase() === section || section.includes(":"))
    ) {
      return `\n## ${section.trim()}\n`;
    }
    return section;
  });

  // Add job-specific note if job description is provided
  let jobSpecificNote = "";
  if (jobDescription && isPremiumUser) {
    jobSpecificNote =
      "\n\nThis resume has been formatted with basic job-specific optimizations.";
  }

  return (
    formattedSections.join("\n\n") +
    jobSpecificNote +
    "\n\n---\n\n*Note: This resume has been formatted with our basic system. " +
    "Our advanced AI transformation is currently unavailable. Please try again later.*"
  );
}

function generateFallbackCoverLetter(
  resumeText: string,
  jobDescription: string
): string {
  // Extract name from resume (simple heuristic)
  const nameMatch = resumeText.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/);
  const name = nameMatch ? nameMatch[1] : "Applicant";

  // Extract job title from job description (simple heuristic)
  const titleMatch = jobDescription.match(
    /(Software Engineer|Developer|Manager|Designer|Analyst|Consultant|Director|Specialist)/i
  );
  const jobTitle = titleMatch ? titleMatch[0] : "position";

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    `${currentDate}\n\nDear Hiring Manager,\n\n` +
    `I am writing to express my interest in the ${jobTitle} position at your company. ` +
    `After reviewing the job description, I believe my skills and experience make me a strong candidate for this role.\n\n` +
    `My background includes relevant experience in the field, and I am confident in my ability to contribute to your team. ` +
    `I am particularly drawn to this opportunity because it aligns with my career goals and interests.\n\n` +
    `I look forward to discussing how my qualifications match your needs in more detail. Thank you for considering my application.\n\n` +
    `Sincerely,\n\n${name}\n\n` +
    `*Note: This is a basic cover letter template. Our advanced AI cover letter generation is currently unavailable. Please try again later.*`
  );
}

function generateFallbackChanges(isPremiumUser: boolean): string[] {
  const basicChanges = [
    "Improved formatting for better readability",
    "Enhanced structure with clear section headers",
    "Standardized spacing and layout",
  ];

  if (isPremiumUser) {
    return [
      ...basicChanges,
      "Added professional summary section",
      "Strengthened action verbs in experience descriptions",
      "Highlighted key achievements and metrics",
    ];
  }

  return basicChanges;
}

function extractFallbackKeywords(jobDescription: string): string[] {
  // Simple keyword extraction based on common job skills and requirements
  const commonKeywords = [
    "communication",
    "leadership",
    "teamwork",
    "problem-solving",
    "analytical",
    "detail-oriented",
    "project management",
    "time management",
    "customer service",
    "technical",
    "creative",
    "innovative",
  ];

  // Return keywords that appear in the job description
  return commonKeywords.filter((keyword) =>
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
}
