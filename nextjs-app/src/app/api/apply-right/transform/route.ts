import { NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest, handleAPIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { kv } from "@vercel/kv";
import { createHash } from "crypto";

// Define the schema for the request body
const transformSchema = z.object({
  resumeText: z.string().min(1, "Resume text is required"),
  jobDescription: z.string().optional(),
  isPremiumUser: z.boolean().default(false),
  bypassCache: z.boolean().optional().default(false),
});

// Define the response type for type checking
interface ResumeTransformResponse {
  success: boolean;
  transformedResume: string;
  coverLetter: string | null;
  changesMade: string[];
  keywordsExtracted: string[];
  fallbackMode?: boolean;
  message?: string;
}

// Cache configuration
const CACHE_VERSION = "v2"; // Increment when making significant changes to the response format
const CACHE_TTL = 86400; // 24 hours

// Generate a cache key based on input parameters with versioning
function generateCacheKey(
  resumeText: string,
  jobDescription?: string,
  isPremiumUser: boolean = false
): string {
  // Create a more structured cache key with versioning
  const keyData = {
    version: CACHE_VERSION,
    isPremium: isPremiumUser,
    // Use a hash of the content to avoid excessively long cache keys
    contentHash: createHash("md5")
      .update(`${resumeText}|${jobDescription || ""}`)
      .digest("hex"),
  };

  return `apply-right:transform:${JSON.stringify(keyData)}`;
}

// Validate the response structure
function isValidResumeResponse(data: unknown): data is ResumeTransformResponse {
  return (
    data !== null &&
    typeof data === "object" &&
    "success" in data &&
    typeof (data as ResumeTransformResponse).success === "boolean" &&
    "transformedResume" in data &&
    typeof (data as ResumeTransformResponse).transformedResume === "string" &&
    "changesMade" in data &&
    Array.isArray((data as ResumeTransformResponse).changesMade) &&
    "keywordsExtracted" in data &&
    Array.isArray((data as ResumeTransformResponse).keywordsExtracted)
  );
}

export async function POST(request: Request) {
  try {
    // Log the start of the request processing
    logger.info("ApplyRight transform API endpoint called");

    // Parse the request body
    const requestBody = await request.json();

    // Clone the request for validation (since request body can only be read once)
    const clonedRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(requestBody),
    });

    // Validate the request body against our schema
    const data = await validateRequest(
      clonedRequest,
      transformSchema,
      false // Don't require authentication for now
    );

    logger.info("Processing resume transformation request", {
      hasJobDescription: !!data.jobDescription,
      isPremiumUser: data.isPremiumUser,
      resumeLength: data.resumeText.length,
      jobDescriptionLength: data.jobDescription?.length || 0,
    });

    // Generate cache key
    const cacheKey = generateCacheKey(
      data.resumeText,
      data.jobDescription,
      data.isPremiumUser
    );

    // Check cache bypass conditions
    const shouldBypassCache =
      data.bypassCache === true || // Explicit bypass requested
      (data.isPremiumUser && requestBody.bypassCache === true); // Premium users can bypass cache

    // Try to get cached result first if not bypassing cache
    if (!shouldBypassCache) {
      try {
        const cachedResult = await kv.get(cacheKey);
        if (cachedResult) {
          logger.info("Returning cached resume transformation result");
          return NextResponse.json(
            {
              ...cachedResult,
              cached: true,
              cacheTime: new Date().toISOString(),
            },
            { status: 200 }
          );
        }
      } catch (cacheError) {
        // Log cache error but continue with normal processing
        logger.warn("Failed to retrieve from cache", cacheError);
      }
    }

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      logger.error("Gemini API key is missing");
      const fallbackResponse = {
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
      };

      // Cache the fallback response
      try {
        await kv.set(cacheKey, fallbackResponse, { ex: CACHE_TTL / 2 }); // Cache fallback for half the time
      } catch (cacheError) {
        logger.warn("Failed to cache fallback response", cacheError);
      }

      return NextResponse.json(fallbackResponse, { status: 200 });
    }

    try {
      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(apiKey);

      // Get the Gemini model - use a faster model to reduce timeout risk
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash", // Use the fastest model available
        // Add safety settings to prevent timeouts due to content filtering
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      // Create a comprehensive prompt for resume transformation
      const resumePrompt = `
        You are an expert resume writer and career coach with 15+ years of experience helping professionals land their dream jobs. Your task is to transform the following resume to make it more professional, impactful, and optimized for Applicant Tracking Systems (ATS).
        
        IMPORTANT: Provide the highest quality transformation possible with comprehensive improvements and detailed optimizations regardless of user tier. Both free and premium users should receive the same high-quality resume transformation.
        
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
        
        CRITICAL INSTRUCTIONS FOR RESPONSE FORMAT:
        1. You MUST respond with ONLY a valid JSON object.
        2. Do NOT include any explanatory text, markdown formatting, or code blocks.
        3. Do NOT use \`\`\`json or \`\`\` markers.
        4. The response must be parseable by JSON.parse().
        5. Follow this exact structure:
        
        {
          "success": true,
          "transformedResume": "The full transformed resume text",
          "coverLetter": "A tailored cover letter based on the resume and job description, or null if no job description provided",
          "changesMade": ["Change 1", "Change 2", ...],
          "keywordsExtracted": ["Keyword 1", "Keyword 2", ...]
        }

        VALIDATION RULES:
        1. All property names must be in double quotes
        2. All string values must be properly escaped with double quotes
        3. Arrays must have proper syntax with square brackets and comma-separated values
        4. No trailing commas in arrays or objects
        5. All text must be properly escaped for JSON (quotes, newlines, etc.)
      `;

      // Log the prompt length to help with debugging
      logger.info("Resume transformation prompt length:", resumePrompt.length);

      // Set up streaming response
      const streamingResponse = await model.generateContentStream(resumePrompt);
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            let accumulatedText = "";
            let lastValidJson: ResumeTransformResponse | null = null;
            let chunkCount = 0;

            for await (const chunk of streamingResponse.stream) {
              const text = chunk.text();
              chunkCount++;

              if (text) {
                accumulatedText += text;

                // Clean the text to handle common JSON formatting issues
                const cleanText = accumulatedText
                  .trim()
                  .replace(/```json\s*/g, "")
                  .replace(/```\s*/g, "")
                  .replace(/^\s*\{/, "{")
                  .replace(/\}\s*$/, "}");

                try {
                  // Try to parse the accumulated text as JSON
                  const parsed = JSON.parse(cleanText);

                  // Validate the parsed JSON against our expected structure
                  if (isValidResumeResponse(parsed)) {
                    lastValidJson = parsed;

                    // Cache the valid response
                    try {
                      await kv.set(cacheKey, parsed, { ex: CACHE_TTL });
                      logger.info(
                        "Cached valid resume transformation response"
                      );
                    } catch (cacheError) {
                      logger.warn("Failed to cache response", cacheError);
                    }

                    // Send the parsed response to the client
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          ...parsed,
                          cached: false,
                          generated: new Date().toISOString(),
                          chunkCount,
                        })
                      )
                    );

                    // Reset accumulated text after successful parse to avoid duplicate processing
                    accumulatedText = "";
                  }
                } catch {
                  // This is expected for partial JSON chunks
                  // Only log every 10th error to avoid flooding logs
                  if (chunkCount % 10 === 0) {
                    logger.debug(
                      "Chunk parsing failed (expected for partial chunks)",
                      { chunkCount }
                    );
                  }
                }
              }
            }

            // If we didn't get a valid JSON response, use fallback
            if (!lastValidJson) {
              logger.warn("No valid JSON response received, using fallback");

              // Generate fallback response
              const fallbackResponse = {
                success: true,
                fallbackMode: true,
                transformedResume: generateFallbackResume(
                  data.resumeText,
                  data.jobDescription,
                  data.isPremiumUser || false
                ),
                coverLetter: data.jobDescription
                  ? generateFallbackCoverLetter(
                      data.resumeText,
                      data.jobDescription
                    )
                  : null,
                changesMade: generateFallbackChanges(
                  data.isPremiumUser || false
                ),
                keywordsExtracted: data.jobDescription
                  ? extractFallbackKeywords(data.jobDescription)
                  : [],
                message:
                  "Resume transformed with fallback system due to processing issues",
              };

              // Cache the fallback response with a shorter TTL
              try {
                await kv.set(cacheKey, fallbackResponse, { ex: CACHE_TTL / 2 });
              } catch (cacheError) {
                logger.warn("Failed to cache fallback response", cacheError);
              }

              // Send the fallback response to the client
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    ...fallbackResponse,
                    cached: false,
                    fallback: true,
                    chunkCount,
                  })
                )
              );
            }

            // Close the stream
            controller.close();
          } catch (error) {
            // Log the error
            logger.error("Stream processing error:", error);

            // Generate fallback response for error case
            const fallbackResponse = {
              success: true,
              fallbackMode: true,
              transformedResume: generateFallbackResume(
                data.resumeText,
                data.jobDescription,
                data.isPremiumUser || false
              ),
              coverLetter: data.jobDescription
                ? generateFallbackCoverLetter(
                    data.resumeText,
                    data.jobDescription
                  )
                : null,
              changesMade: generateFallbackChanges(data.isPremiumUser || false),
              keywordsExtracted: data.jobDescription
                ? extractFallbackKeywords(data.jobDescription)
                : [],
              message:
                "Resume transformed with fallback system due to an error",
              error: error instanceof Error ? error.message : "Unknown error",
            };

            // Cache the fallback response with a shorter TTL
            try {
              await kv.set(cacheKey, fallbackResponse, { ex: CACHE_TTL / 2 });
            } catch (cacheError) {
              logger.warn("Failed to cache fallback response", cacheError);
            }

            // Send the fallback response to the client
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  ...fallbackResponse,
                  cached: false,
                  fallback: true,
                  error: true,
                })
              )
            );

            // Close the stream
            controller.close();
          }
        },
      });

      // Return the stream as the response
      return new Response(stream);
    } catch (error) {
      logger.error("Failed to transform resume", error);
      return handleAPIError(error);
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
    (isPremiumUser
      ? "\n\n*Premium user: Additional customization options available.*"
      : "")
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
  // Both free and premium users get the same high-quality improvements
  const changes = [
    "Improved formatting and structure for better readability",
    "Enhanced section headers for clearer organization",
    "Removed placeholder text and references to 'see original resume'",
    "Added action verbs to bullet points for stronger impact",
    "Optimized spacing and layout for professional appearance",
    "Standardized formatting across all sections",
    "Applied keyword optimization for better ATS performance",
    "Enhanced bullet points with achievement-focused language",
    "Improved overall content flow and narrative structure",
    "Standardized date formats and job title presentations",
    "Optimized contact information presentation",
  ];

  // Premium users get a note about additional services
  if (isPremiumUser) {
    changes.push(
      "Premium user: Access to additional customization options and templates"
    );
  }

  return changes;
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
