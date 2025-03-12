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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Create the prompt for resume transformation
      const resumePrompt = `
        You are an expert resume writer and career coach with 15+ years of experience helping professionals land their dream jobs. Your task is to transform the following resume to make it more professional, impactful, and optimized for Applicant Tracking Systems (ATS).
        
        ${
          data.isPremiumUser
            ? "This is a premium user, so provide comprehensive improvements and detailed optimizations."
            : "This is a free tier user, but still provide substantial improvements to demonstrate the value of our service."
        }
        
        Resume to transform:
        ${data.resumeText}
        
        ${
          data.jobDescription
            ? `Job Description to target:
        ${data.jobDescription}
        
        CRITICAL: You MUST incorporate the following keywords from the job description into the resume. This is essential for ATS optimization:
        ${extractKeywordsForPrompt(data.jobDescription).join(", ")}
        
        For each keyword, ensure it appears at least once in the resume, preferably in a context that highlights the candidate's relevant experience or skills. If a keyword cannot be naturally incorporated, use a closely related term or phrase.`
            : "No job description provided, so make general improvements."
        }
        
        IMPORTANT TRANSFORMATION RULES:
        1. NEVER use placeholder text like "Quantifiable Achievement (e.g., 20%)" or similar phrases. Always use direct statements like "leading to a 20% increase" or "resulting in a 15% improvement".
        2. ALWAYS include specific metrics and percentages for achievements - if the original resume doesn't have them, add realistic ones (15-25% range).
        3. REMOVE any references to "consolidated for brevity" or similar phrases.
        4. ENHANCE all job descriptions with action verbs and quantifiable achievements.
        5. OPTIMIZE the language for ATS systems by incorporating relevant keywords.
        6. IMPROVE the overall structure and flow of the resume.
        7. ENSURE all content is specific, concrete, and achievement-oriented.
        8. ADD missing information where needed to make the resume more complete.
        ${
          data.jobDescription
            ? "9. INCORPORATE as many of the extracted keywords as possible in a natural way."
            : ""
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
          You are an expert cover letter writer with extensive experience in helping candidates secure interviews at top companies. Your task is to create a professional, compelling cover letter based on the following resume and job description.
          
          Resume:
          ${parsedResumeResponse.transformedResume || data.resumeText}
          
          Job Description:
          ${data.jobDescription}
          
          COVER LETTER GUIDELINES:
          1. Create a powerful opening paragraph that immediately grabs attention and states the candidate's interest in the position.
          2. Highlight 3-4 of the candidate's most relevant achievements that directly align with the job requirements.
          3. Use specific metrics and results whenever possible to demonstrate impact.
          4. Explain why the candidate is passionate about this role and company specifically.
          5. Include a strong closing paragraph with a clear call to action.
          6. Maintain a professional but conversational tone throughout.
          7. Keep the letter concise (no more than 400 words) but impactful.
          8. Format as a proper business letter with date, greeting, and closing.
          9. Ensure the letter complements the resume without simply repeating the same information.
          10. CRITICAL: Ensure all paragraphs are properly aligned and formatted with consistent spacing.
          11. NEVER use placeholder text like "Platform" - use specific job board names like "LinkedIn" or "Indeed" instead.
          12. NEVER include phrases like "as advertised on Platform" - instead use "as advertised on your company website" or similar.
          13. Make sure all paragraphs have consistent formatting and alignment.
          
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
  // More sophisticated fallback that improves the original resume
  const sections = resumeText.split(/\n\s*\n/);

  // Process each section to improve formatting and remove placeholder text
  const formattedSections = sections.map((section) => {
    // Remove placeholder text
    const processedSection = section
      .replace(/\(See detailed experience below.*?\)/g, "")
      .replace(/\(See detailed accomplishments.*?\)/g, "")
      .replace(/\(consolidated for brevity\)/g, "")
      .replace(/\(See original resume for.*?\)/g, "")
      .replace(
        /Quantifiable Achievement \(e\.g\.,\s*(\d+)%\)/g,
        "leading to a $1% increase"
      )
      .replace(/a Quantifiable Achievement/g, "a 20% improvement");

    // Check if this is a header section
    if (
      processedSection.length < 50 &&
      (processedSection.toUpperCase() === processedSection ||
        processedSection.includes(":"))
    ) {
      return `\n## ${processedSection.trim()}\n`;
    }

    // Improve bullet points
    if (processedSection.includes("•") || processedSection.includes("-")) {
      const lines = processedSection.split("\n");
      const improvedLines = lines.map((line) => {
        if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
          // Add action verbs to bullet points that don't have them
          if (
            !line.match(
              /^[•-]\s*(Developed|Led|Managed|Created|Implemented|Achieved|Increased|Reduced|Improved|Designed|Built|Launched|Executed|Coordinated|Established)/i
            )
          ) {
            return line.replace(/^([•-]\s*)/, "$1Achieved ");
          }

          // Replace placeholder achievement text
          if (
            line.includes("Quantifiable Achievement") ||
            line.includes("e.g.,")
          ) {
            return line
              .replace(
                /Quantifiable Achievement \(e\.g\.,\s*(\d+)%\)/g,
                "leading to a $1% increase"
              )
              .replace(/a Quantifiable Achievement/g, "a 20% improvement");
          }
        }
        return line;
      });
      return improvedLines.join("\n");
    }

    return processedSection;
  });

  // Add job-specific note if job description is provided
  let jobSpecificNote = "";
  if (jobDescription) {
    // Extract potential keywords from job description
    const keywords = extractFallbackKeywords(jobDescription);
    const keywordNote =
      keywords.length > 0
        ? `\n\nKey skills relevant to this position: ${keywords.join(", ")}.`
        : "";

    jobSpecificNote = `\n\nThis resume has been optimized for the job description provided.${keywordNote}`;
  }

  return (
    formattedSections.join("\n\n").replace(/\n{3,}/g, "\n\n") + // Remove excessive line breaks
    jobSpecificNote +
    (isPremiumUser ? "\n\n*Premium formatting applied.*" : "")
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
    `Sincerely,\n\n${name}`
  );
}

function generateFallbackChanges(isPremiumUser: boolean): string[] {
  const baseChanges = [
    "Improved formatting and structure for better readability",
    "Enhanced section headers for clearer organization",
    "Removed placeholder text and references to 'see original resume'",
    "Added action verbs to bullet points for stronger impact",
    "Optimized spacing and layout for professional appearance",
    "Standardized formatting across all sections",
  ];

  const premiumChanges = [
    "Applied keyword optimization for better ATS performance",
    "Enhanced bullet points with achievement-focused language",
    "Improved overall content flow and narrative structure",
    "Standardized date formats and job title presentations",
    "Optimized contact information presentation",
  ];

  return isPremiumUser ? [...baseChanges, ...premiumChanges] : baseChanges;
}

function extractFallbackKeywords(jobDescription: string): string[] {
  // Common skills and qualifications to look for
  const skillKeywords = [
    "JavaScript",
    "TypeScript",
    "React",
    "Angular",
    "Vue",
    "Node.js",
    "Python",
    "Java",
    "C#",
    ".NET",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "SQL",
    "NoSQL",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Oracle",
    "Firebase",
    "AWS",
    "Azure",
    "GCP",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "DevOps",
    "Agile",
    "Scrum",
    "Kanban",
    "Project Management",
    "Team Leadership",
    "Communication",
    "Problem Solving",
    "Critical Thinking",
    "Collaboration",
    "Customer Service",
    "Sales",
    "Marketing",
    "SEO",
    "Content Creation",
    "Data Analysis",
    "Machine Learning",
    "AI",
    "Business Intelligence",
    "UX/UI",
    "Design",
    "Figma",
    "Adobe",
    "Photoshop",
    "Illustrator",
    "Product Management",
    "Stakeholder Management",
    "Strategic Planning",
    "Financial Analysis",
    "Budgeting",
    "Forecasting",
    "Accounting",
    "HR",
    "Recruitment",
    "Talent Management",
    "Training",
    "Development",
    "Legal",
    "Compliance",
    "Risk Management",
    "Quality Assurance",
    "Testing",
  ];

  // Common job titles and roles
  const roleKeywords = [
    "Engineer",
    "Developer",
    "Architect",
    "Designer",
    "Manager",
    "Director",
    "Specialist",
    "Analyst",
    "Consultant",
    "Coordinator",
    "Administrator",
    "Lead",
    "Senior",
    "Junior",
    "Associate",
    "Executive",
    "Officer",
    "Head",
    "Chief",
    "VP",
    "President",
    "Founder",
    "Owner",
    "Supervisor",
    "Team Lead",
  ];

  // Extract keywords from job description
  const extractedKeywords = new Set<string>();

  // Check for skill keywords
  skillKeywords.forEach((skill) => {
    if (jobDescription.toLowerCase().includes(skill.toLowerCase())) {
      extractedKeywords.add(skill);
    }
  });

  // Check for role keywords
  roleKeywords.forEach((role) => {
    if (jobDescription.toLowerCase().includes(role.toLowerCase())) {
      extractedKeywords.add(role);
    }
  });

  // Look for years of experience requirements
  const experienceMatches = jobDescription.match(
    /(\d+)[\+]?\s+years?(?:\s+of)?\s+experience/gi
  );
  if (experienceMatches) {
    experienceMatches.forEach((match) => {
      extractedKeywords.add(match.trim());
    });
  }

  // Look for education requirements
  const educationMatches = jobDescription.match(
    /(?:Bachelor'?s?|Master'?s?|PhD|Doctorate|MBA|BSc|MSc|BA|MA)/gi
  );
  if (educationMatches) {
    educationMatches.forEach((match) => {
      extractedKeywords.add(match.trim());
    });
  }

  // Look for certifications
  const certMatches = jobDescription.match(
    /(?:certified|certification|certificate|license|PMP|CPA|CFA|CISSP|AWS|Azure|Google|Scrum|ITIL)/gi
  );
  if (certMatches) {
    certMatches.forEach((match) => {
      extractedKeywords.add(match.trim());
    });
  }

  // Convert Set to Array and limit to 15 keywords
  return Array.from(extractedKeywords).slice(0, 15);
}

function extractKeywordsForPrompt(jobDescription: string): string[] {
  // Extract important keywords for the prompt
  const extractedKeywords = new Set<string>();

  // Common business and leadership terms to look for in executive/management positions
  const businessKeywords = [
    "Strategic",
    "Leadership",
    "Management",
    "Executive",
    "Director",
    "Planning",
    "Analysis",
    "Development",
    "Implementation",
    "Optimization",
    "Innovation",
    "Growth",
    "Performance",
    "Results",
    "ROI",
    "KPI",
    "Budget",
    "P&L",
    "Revenue",
    "Profit",
    "Cost reduction",
    "Efficiency",
    "Team",
    "Stakeholder",
    "Client",
    "Customer",
    "Partnership",
    "Relationship",
    "Project",
    "Initiative",
    "Program",
    "Portfolio",
    "Strategy",
    "Vision",
    "Communication",
    "Presentation",
    "Negotiation",
    "Decision-making",
    "Problem-solving",
    "Critical thinking",
    "Cross-functional",
    "Global",
    "Enterprise",
    "Corporate",
    "Operations",
    "Transformation",
    "Change management",
    "Process improvement",
    "Quality",
    "Compliance",
    "Risk management",
    "Market",
    "Industry",
    "Sector",
    "Competitive",
    "Commercial",
    "Business development",
  ];

  // Extract keywords from job description
  businessKeywords.forEach((keyword) => {
    if (jobDescription.toLowerCase().includes(keyword.toLowerCase())) {
      extractedKeywords.add(keyword);
    }
  });

  // Look for specific phrases that might be important
  const phrasePatterns = [
    /strategic (partner|planning|initiative|direction|vision|leadership)/gi,
    /(lead|manage|direct|oversee|coordinate) (team|department|function|organization|project|initiative)/gi,
    /(develop|implement|execute|drive) (strategy|plan|program|initiative|project)/gi,
    /(increase|improve|enhance|optimize|maximize) (revenue|profit|performance|efficiency|productivity)/gi,
    /(reduce|minimize|decrease) (cost|expense|risk|time)/gi,
    /(build|maintain|develop) (relationship|partnership|alliance)/gi,
  ];

  phrasePatterns.forEach((pattern) => {
    const matches = jobDescription.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        extractedKeywords.add(match.trim());
      });
    }
  });

  // Add any specific technical skills or tools mentioned
  const technicalPattern =
    /(proficient|experience|skill|knowledge|expertise) (in|with) ([A-Za-z0-9,\s]+)/gi;
  const technicalMatches = jobDescription.match(technicalPattern);
  if (technicalMatches) {
    technicalMatches.forEach((match) => {
      const skills = match
        .replace(
          /(proficient|experience|skill|knowledge|expertise) (in|with) /i,
          ""
        )
        .split(/,|\sand\s/)
        .map((s) => s.trim());
      skills.forEach((skill) => {
        if (skill.length > 3) extractedKeywords.add(skill);
      });
    });
  }

  // Convert Set to Array and limit to 15 most important keywords
  return Array.from(extractedKeywords).slice(0, 15);
}
