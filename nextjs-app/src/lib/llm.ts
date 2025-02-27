import { Groq } from "groq-sdk";
import type { JobDescription } from "@/types/jobDescription";

interface GenerateJobDescriptionInput {
  title: string;
  department?: string;
  location?: string;
  employmentType: string;
  description?: string;
  responsibilities: string[];
  requirements: {
    required: {
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      description: string;
    }[];
    preferred: {
      name: string;
      level: "beginner" | "intermediate" | "advanced" | "expert";
      description: string;
    }[];
  };
  qualifications: {
    education: string[];
    experience: string[];
    certifications: string[];
  };
  salary?: {
    range: {
      min: number;
      max: number;
    };
    type: "hourly" | "monthly" | "yearly";
    currency?: string;
  };
  company?: {
    name?: string;
    description?: string;
    culture?: string[];
  };
  industry: string;
  level: string;
  userEmail: string;
}

export async function generateJobDescription(
  input: GenerateJobDescriptionInput
): Promise<JobDescription> {
  try {
    // Transform input data to match expected structure
    const transformedInput = {
      title: input.title,
      department: input.department || null,
      location: input.location || null,
      employmentType: input.employmentType,
      description: input.description || "",
      responsibilities: input.responsibilities,
      requirements: {
        required: input.requirements.required,
        preferred: input.requirements.preferred,
      },
      qualifications: {
        education: input.qualifications.education,
        experience: input.qualifications.experience,
        certifications: input.qualifications.certifications,
      },
      salary: input.salary || null,
      company: input.company || null,
      metadata: {
        industry: input.industry || null,
        level: input.level || null,
      },
    };

    const systemPrompt = `You are an expert in HR and job description writing with extensive experience in talent acquisition and employer branding. Your task is to generate professional and compelling job descriptions in JSON format.

IMPORTANT: Your response must be a valid JSON object matching this exact structure:
{
  "title": string,
  "department": string | null,
  "location": string | null,
  "employmentType": string,
  "description": string,
  "responsibilities": string[],
  "requirements": {
    "required": [
      {
        "name": string,
        "level": "beginner" | "intermediate" | "advanced" | "expert",
        "description": string
      }
    ],
    "preferred": [
      {
        "name": string,
        "level": "beginner" | "intermediate" | "advanced" | "expert",
        "description": string
      }
    ] | null
  },
  "qualifications": {
    "education": string[],
    "experience": string[],
    "certifications": string[]
  },
  "salary": {
    "range": {
      "min": number,
      "max": number
    },
    "type": "hourly" | "monthly" | "yearly",
    "currency": string
  } | null,
  "company": {
    "name": string,
    "description": string,
    "culture": string[]
  } | null,
  "metadata": {
    "industry": string,
    "level": string
  }
}

Generation Guidelines:
1. Create a compelling and engaging description that:
   - Highlights specific impact and growth opportunities
   - Emphasizes unique aspects of the role
   - Includes team and project context
   - Reflects company culture and values

2. Generate clear responsibilities that:
   - Are specific and actionable
   - Include measurable outcomes
   - Emphasize collaboration
   - Showcase growth opportunities

3. Define comprehensive requirements:
   - Place ALL skills (technical and soft) under requirements.required or requirements.preferred
   - Include both technical and soft skills (like communication, leadership)
   - Preferred skills are optional but recommended when appropriate
   - For each skill:
     * Set appropriate competency level (beginner/intermediate/advanced/expert)
     * Provide clear description of skill requirements
     * Align with position level and responsibilities

4. MANDATORY: Always include qualifications with non-empty arrays:
   - education: MUST be a non-empty array with at least one education requirement
   - experience: MUST be a non-empty array with at least one experience requirement
   - certifications: MUST be a non-empty array with at least one certification (or "No specific certifications required")
   - NEVER return null or empty arrays for any qualification field

5. Professional Standards:
   - Use inclusive language
   - Apply industry-standard terminology
   - Define clear progression requirements
   - Include measurable success criteria
   - Emphasize growth and development
   - Use action verbs and specific metrics

6. CRITICAL:
   - Output must be valid JSON matching the exact structure above
   - ALL skills must be under requirements (not in qualifications)
   - Qualifications must ONLY contain education, experience, and certifications
   - All qualification fields MUST be non-empty arrays with at least one item
   - Salary information is optional and can be omitted if not provided in the input
   - Department and location are optional and can be null`;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    console.log("\n=== JOB DESCRIPTION GENERATION ===\n");
    console.log("Input Data:");
    console.log(JSON.stringify(transformedInput, null, 2));

    let enhancedDescription: JobDescription;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please generate a fresh, professional job description based on these requirements:

${JSON.stringify(transformedInput, null, 2)}`,
        },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from LLM");
    }

    console.log("\nRaw LLM Response:");
    console.log(completion.choices[0].message.content);

    try {
      let jsonStr = completion.choices[0].message.content.trim();

      // Handle markdown code blocks
      if (jsonStr.includes("```json")) {
        const codeBlockStart = jsonStr.indexOf("```json") + "```json".length;
        const codeBlockEnd = jsonStr.lastIndexOf("```");
        if (codeBlockEnd > codeBlockStart) {
          jsonStr = jsonStr.slice(codeBlockStart, codeBlockEnd);
        }
      }

      // Clean up any remaining whitespace and parse
      jsonStr = jsonStr.trim();
      enhancedDescription = JSON.parse(jsonStr);

      // Validate the response structure
      if (
        !enhancedDescription.title ||
        !enhancedDescription.description ||
        !Array.isArray(enhancedDescription.responsibilities) ||
        !enhancedDescription.requirements?.required ||
        !Array.isArray(enhancedDescription.qualifications?.education) ||
        !Array.isArray(enhancedDescription.qualifications?.experience) ||
        !Array.isArray(enhancedDescription.qualifications?.certifications) ||
        enhancedDescription.qualifications.education.length === 0 ||
        enhancedDescription.qualifications.experience.length === 0 ||
        enhancedDescription.qualifications.certifications.length === 0
      ) {
        throw new Error(
          "Invalid response structure or missing required fields"
        );
      }

      console.log("\nParsed Enhanced Description:");
      console.log(JSON.stringify(enhancedDescription, null, 2));

      // Add metadata
      const finalResult = {
        ...enhancedDescription,
        metadata: {
          ...enhancedDescription.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: input.userEmail,
          isTemplate: false,
        },
      };

      console.log("\nFinal Result with Metadata:");
      console.log(JSON.stringify(finalResult, null, 2));
      console.log("\n=== END JOB DESCRIPTION GENERATION ===\n");

      return finalResult;
    } catch (parseError) {
      console.error("\nError parsing LLM response:", parseError);
      throw new Error("Failed to parse job description from LLM response");
    }
  } catch (error) {
    console.error("Error calling LLM:", error);
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        throw new Error(
          "Invalid API key. Please check your Groq API key configuration."
        );
      } else if (error.message.includes("404")) {
        throw new Error("Invalid model name or API endpoint.");
      }
      throw error;
    }
    throw new Error(
      "Failed to generate job description. Please try again later."
    );
  }
}
