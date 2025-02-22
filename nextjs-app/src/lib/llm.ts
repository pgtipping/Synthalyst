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
  // Transform input data to match expected structure
  const transformedInput = {
    title: input.title,
    department: input.department || null,
    location: input.location || null,
    employmentType: input.employmentType,
    description: input.description,
    responsibilities: input.responsibilities,
    requirements: {
      required: input.requiredSkills,
      preferred: input.preferredSkills || null,
    },
    qualifications: {
      education: input.education || null,
      experience: input.experience || null,
      skills: input.requiredSkills,
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

  const systemPrompt = `You are an expert in HR and job description writing with extensive experience in talent acquisition and employer branding. Your task is to significantly enhance and professionalize job descriptions while maintaining strict JSON output format.

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

Enhancement Guidelines:
1. Make the description more compelling and engaging by:
   - Adding specific impact and growth opportunities
   - Highlighting unique aspects of the role
   - Including team and project context
   - Emphasizing company culture and values

2. Improve responsibilities by:
   - Making them more specific and actionable
   - Adding measurable outcomes
   - Including collaboration aspects
   - Highlighting growth opportunities

3. Enhance requirements and qualifications by:
   - Making skills more specific to the industry
   - Adding relevant technical or soft skills
   - Including modern tools and methodologies
   - Specifying clear experience levels
   - For each required skill:
     * Determine appropriate competency level (beginner/intermediate/advanced/expert)
     * Provide clear description of what that level means for the skill
     * Ensure alignment with position level and responsibilities

4. Professional Standards:
   - Use inclusive language
   - Maintain industry-standard terminology
   - Ensure clear progression requirements
   - Include measurable success criteria
   - Focus on growth and development
   - Use action verbs and specific metrics

5. CRITICAL: Output must be valid JSON matching the exact structure above`;

  const userPrompt = `Please significantly enhance this job description and return it in the required JSON format:

${JSON.stringify(transformedInput, null, 2)}

Enhancement Requirements:
1. Expand and improve the description to be more engaging and detailed
2. Make responsibilities more specific with measurable outcomes
3. Add relevant modern skills and technologies to requirements
4. Include specific growth and development opportunities
5. Add industry-specific terminology and best practices
6. Return ONLY the enhanced JSON object, no additional text
7. Ensure the JSON structure exactly matches the specified format

Make the enhancements substantial while keeping the core job requirements intact.`;

  try {
    console.log("\n=== JOB DESCRIPTION GENERATION ===");
    console.log("\nInput Data:");
    console.log(JSON.stringify(transformedInput, null, 2));

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
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
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from LLM");
    }

    console.log("\nRaw LLM Response:");
    console.log(completion.choices[0].message.content);

    let enhancedDescription;
    try {
      const content = completion.choices[0].message.content.trim();

      // Handle markdown code blocks
      let jsonStr = content;
      if (content.includes("```json")) {
        const codeBlockStart = content.indexOf("```json") + "```json".length;
        const codeBlockEnd = content.lastIndexOf("```");
        if (codeBlockEnd > codeBlockStart) {
          jsonStr = content.slice(codeBlockStart, codeBlockEnd);
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
    } catch (parseError) {
      console.error("\nError parsing LLM response:", parseError);
      throw new Error("Failed to parse job description from LLM response");
    }

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
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to generate job description. Please try again later."
    );
  }
}
