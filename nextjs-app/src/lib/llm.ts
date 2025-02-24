import { Groq } from "groq-sdk";
import type { JobDescription } from "@/types/jobDescription";

interface GenerateJobDescriptionInput {
  title: string;
  department?: string;
  location?: string;
  employmentType: string;
  description?: string;
  responsibilities: string[];
  requiredSkills: {
    name: string;
    level: "beginner" | "intermediate" | "advanced" | "expert";
    description?: string;
  }[];
  preferredSkills?: string[];
  education?: string[];
  experience?: string[];
  certifications?: string[];
  salaryMin?: string;
  salaryMax?: string;
  salaryType: "hourly" | "monthly" | "yearly";
  currency?: string;
  companyName?: string;
  companyDescription?: string;
  companyCulture?: string[];
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
        required: input.requiredSkills.map((skill) => ({
          name: skill.name,
          level: skill.level,
          description:
            skill.description ||
            `${skill.level} level proficiency in ${skill.name}`,
        })),
        preferred: input.preferredSkills || null,
      },
      qualifications: {
        education: input.education || null,
        experience: input.experience || null,
        skills: input.requiredSkills.map((skill) => ({
          name: skill.name,
          level: skill.level,
          description:
            skill.description ||
            `${skill.level} level proficiency in ${skill.name}`,
        })),
        certifications: input.certifications || null,
      },
      salary:
        input.salaryMin || input.salaryMax
          ? {
              range: {
                min: parseInt(input.salaryMin || "0"),
                max: parseInt(input.salaryMax || "0"),
              },
              type: input.salaryType,
              currency: input.currency || null,
            }
          : null,
      company: input.companyName
        ? {
            name: input.companyName,
            description: input.companyDescription || null,
            culture: input.companyCulture || null,
          }
        : null,
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
  "employmentType": string | null,
  "description": string,
  "responsibilities": string[],
  "requirements": {
    "required": string[],
    "preferred": string[] | null
  },
  "qualifications": {
    "education": string[] | null,
    "experience": string[] | null,
    "skills": [
      {
        "name": string,
        "level": "beginner" | "intermediate" | "advanced" | "expert",
        "description": string
      }
    ],
    "certifications": string[] | null
  },
  "salary": {
    "range": {
      "min": number,
      "max": number
    } | null,
    "type": "hourly" | "monthly" | "yearly",
    "currency": string | null
  } | null,
  "company": {
    "name": string | null,
    "description": string | null,
    "culture": string[] | null
  } | null,
  "metadata": {
    "industry": string | null,
    "level": string | null
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

3. Define comprehensive requirements and qualifications:
   - Include industry-specific skills
   - Balance technical and soft skills
   - Incorporate modern tools and methodologies
   - Specify clear experience levels
   - For each required skill:
     * Set appropriate competency level (beginner/intermediate/advanced/expert)
     * Provide clear description of skill requirements
     * Align with position level and responsibilities

4. Professional Standards:
   - Use inclusive language
   - Apply industry-standard terminology
   - Define clear progression requirements
   - Include measurable success criteria
   - Emphasize growth and development
   - Use action verbs and specific metrics

5. CRITICAL: Output must be valid JSON matching the exact structure above`;

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
        !enhancedDescription.requirements?.required
      ) {
        throw new Error("Invalid response structure");
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
