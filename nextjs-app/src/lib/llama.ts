import { openRouter } from "@/lib/openrouter";

interface Resource {
  id: string;
  title: string;
  author?: string;
  type: "book" | "article" | "course" | "tool" | "community";
  url?: string;
  publicationDate?: string;
  description: string;
  relevanceScore: number;
}

interface PlanGenerationParams {
  title: string;
  description: string;
  objectives: string[];
  targetAudienceLevel: string;
  duration: string;
  prerequisites: string;
  learningStylePrimary: string;
  industry: string;
  materialsRequired: string[];
  certificationDetails: string;
  additionalNotes: string;
  isPremiumUser?: boolean;
  resources?: Resource[] | null;
}

interface PlanResponse {
  text: string;
  model: string;
}

/**
 * Generates a training plan using Llama 3.2 3b
 */
export async function generatePlanWithLlama(
  data: PlanGenerationParams
): Promise<PlanResponse> {
  try {
    // Create a base prompt for all users
    let prompt = `
      Create a detailed training plan based on:
      
      Title: ${data.title}
      ${data.description ? `Description: ${data.description}` : ""}
      Learning Objectives: ${data.objectives.join("\n- ")}
      Target Audience Level: ${data.targetAudienceLevel}
      Duration: ${data.duration}
      ${data.prerequisites ? `Prerequisites: ${data.prerequisites}` : ""}
      ${
        data.learningStylePrimary
          ? `Learning Style: ${data.learningStylePrimary}`
          : ""
      }
      ${data.industry ? `Industry/Domain: ${data.industry}` : ""}
      ${
        data.materialsRequired.length > 0
          ? `Materials Required: ${data.materialsRequired.join(", ")}`
          : ""
      }
      ${
        data.certificationDetails
          ? `Certification Details: ${data.certificationDetails}`
          : ""
      }
      ${data.additionalNotes ? `Additional Notes: ${data.additionalNotes}` : ""}
      
      Structure the plan with:
      1. Overview - A brief introduction to the training plan
      2. Learning Objectives - Detailed breakdown of what participants will learn
      3. Target Audience - Who this training is designed for
      4. Prerequisites - What participants should know before starting
      5. Training Structure - How the training is organized
      6. Detailed Content - Organized by modules or sessions
      7. Learning Activities - Specific exercises, discussions, and hands-on practice
      8. Assessment Methods - How learning will be evaluated
      9. Resources - Materials, tools, and references
      
      For each module or session, include:
      - Title
      - Duration
      - Learning objectives
      - Content outline
      - Activities
      - Resources needed
    `;

    // For premium users: Include Gemini resources
    if (data.isPremiumUser && data.resources && data.resources.length > 0) {
      prompt += `
        
        Incorporate these current, AI-curated resources where appropriate in your plan:
        
        ${data.resources
          .map((resource) => {
            return `
          - ${resource.title}${resource.author ? ` by ${resource.author}` : ""}
            Type: ${resource.type}
            ${
              resource.publicationDate
                ? `Published: ${resource.publicationDate}`
                : ""
            }
            ${resource.url ? `URL: ${resource.url}` : ""}
            Description: ${resource.description}
          `;
          })
          .join("\n")}
        
        When referencing these resources in your plan, mark them as "AI-Curated" to indicate they are premium resources.
      `;
    }
    // For free users: Enhanced prompt for better resource recommendations
    else {
      prompt += `
        
        Include a comprehensive resources section with:
        
        1. Books and publications:
           - Include author names and publication years
           - Prioritize respected authors and foundational texts
           - Include both beginner and advanced options
        
        2. Online courses and tutorials:
           - Include platform names (Coursera, Udemy, YouTube, etc.)
           - Specify if they're free or paid when possible
           - Include estimated completion time when relevant
        
        3. Tools and software:
           - Specify which learning objectives they support
           - Include both free and commercial options
           - Note any special features relevant to the learning objectives
        
        4. Communities and forums:
           - Include online communities, forums, and discussion groups
           - Mention any regular meetups or conferences if applicable
           - Note which are most beginner-friendly
        
        Organize resources by difficulty level (beginner, intermediate, advanced) and relevance to specific learning objectives. For each resource, include a brief 1-2 sentence description explaining its value to the learner.
      `;
    }

    // Add formatting instructions
    prompt += `
      Format the plan in a clear, professional structure with headings and bullet points.
      Use HTML formatting for better readability.
    `;

    // Call Llama API via OpenRouter
    const response = await openRouter.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct",
      messages: [
        {
          role: "system",
          content:
            "You are an expert training plan creator with deep knowledge of instructional design and adult learning principles. Create detailed, well-structured training plans that follow best practices in education and professional development.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    // Extract the response text
    const responseText = response.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Empty response from Llama");
    }

    return {
      text: responseText,
      model: "meta-llama/llama-3.2-3b-instruct",
    };
  } catch (error) {
    console.error("Error generating training plan with Llama:", error);
    throw error;
  }
}
