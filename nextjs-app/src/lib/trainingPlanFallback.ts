import {
  PlanGenerationParams,
  generateDefaultTrainingPlan,
} from "./defaultTrainingPlan";
import { generatePlanWithLlama } from "./llama";
import { generatePlanWithGemini } from "./trainingPlanGemini";
import { generatePlanWithGroq } from "./trainingPlanGroq";

interface PlanResponse {
  text: string;
}

/**
 * Generates a training plan using a multi-layered fallback mechanism:
 * 1. Try Llama 3.2 via OpenRouter (primary)
 * 2. If that fails, try Gemini 2.0 Flash
 * 3. If that fails, try Mixtral 8x7B via Groq
 * 4. If all LLM services fail, use a default template
 */
export async function generateTrainingPlanWithFallback(
  data: PlanGenerationParams
): Promise<PlanResponse> {
  const errors: Error[] = [];

  // Try Llama 3.2 via OpenRouter (primary)
  try {
    console.log("Attempting to generate training plan with Llama 3.2...");
    const response = await generatePlanWithLlama(data);
    console.log("Successfully generated training plan with Llama 3.2");
    return { text: response.text };
  } catch (error) {
    console.error("Error generating training plan with Llama 3.2:", error);
    errors.push(error instanceof Error ? error : new Error(String(error)));

    // Continue to fallback
    console.log("Falling back to Gemini 2.0 Flash...");
  }

  // Try Gemini 2.0 Flash (first fallback)
  try {
    console.log(
      "Attempting to generate training plan with Gemini 2.0 Flash..."
    );
    const response = await generatePlanWithGemini(data);
    console.log("Successfully generated training plan with Gemini 2.0 Flash");
    return { text: response.text };
  } catch (error) {
    console.error(
      "Error generating training plan with Gemini 2.0 Flash:",
      error
    );
    errors.push(error instanceof Error ? error : new Error(String(error)));

    // Continue to next fallback
    console.log("Falling back to Mixtral 8x7B via Groq...");
  }

  // Try Mixtral 8x7B via Groq (second fallback)
  try {
    console.log("Attempting to generate training plan with Mixtral 8x7B...");
    const response = await generatePlanWithGroq(data);
    console.log("Successfully generated training plan with Mixtral 8x7B");
    return { text: response.text };
  } catch (error) {
    console.error("Error generating training plan with Mixtral 8x7B:", error);
    errors.push(error instanceof Error ? error : new Error(String(error)));

    // Continue to final fallback
    console.log(
      "All LLM services failed. Using default training plan template..."
    );
  }

  // Use default template as final fallback
  try {
    console.log("Generating default training plan template...");
    const defaultPlanText = generateDefaultTrainingPlan(data);

    return {
      text: defaultPlanText,
    };
  } catch (error) {
    console.error("Error generating default training plan template:", error);
    errors.push(error instanceof Error ? error : new Error(String(error)));

    // If even the default template fails, throw a comprehensive error
    const errorMessage =
      "All training plan generation methods failed. Details: " +
      errors.map((e, i) => `[Attempt ${i + 1}] ${e.message}`).join("; ");

    throw new Error(errorMessage);
  }
}
