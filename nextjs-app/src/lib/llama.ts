import { openRouter } from "@/lib/openrouter";

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
    // Create a detailed prompt for Llama
    const prompt = `
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
