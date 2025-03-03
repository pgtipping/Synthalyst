import { openRouter } from "./openrouter";
import { getGeminiModel } from "./gemini";
import {
  ModelComparisonRequest,
  ModelComparisonResponse,
  ModelOutput,
} from "@/types/modelComparison";

/**
 * Calls the Llama 3.2 3b model via OpenRouter with the given prompt and parameters
 */
async function callLlama(
  prompt: string,
  outputFormat: "json" | "text" = "text",
  jsonSchema?: Record<string, unknown>,
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<ModelOutput> {
  const startTime = Date.now();

  try {
    // Prepare system message for JSON output if needed
    const systemMessage =
      outputFormat === "json"
        ? `You are a helpful assistant that responds in JSON format only. ${
            jsonSchema
              ? `Follow this JSON schema: ${JSON.stringify(jsonSchema)}`
              : "Provide a valid JSON object."
          }`
        : "You are a helpful assistant.";

    // Call OpenRouter with Llama 3.2 3b
    const response = await openRouter.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
      temperature: temperature,
    });

    const processingTime = Date.now() - startTime;
    const rawOutput = response.choices[0]?.message?.content || "";

    let isValidJson = false;
    const output = rawOutput;

    if (outputFormat === "json") {
      try {
        // Verify if the output is valid JSON
        JSON.parse(rawOutput);
        isValidJson = true;
      } catch {
        isValidJson = false;
      }
    }

    return {
      output,
      rawOutput,
      isValidJson,
      processingTime,
      tokenUsage: {
        input: response.usage?.prompt_tokens || 0,
        output: response.usage?.completion_tokens || 0,
        total: response.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    return {
      output: "",
      rawOutput: "",
      isValidJson: false,
      processingTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Calls the Gemini model with the given prompt and parameters
 */
async function callGemini(
  prompt: string,
  outputFormat: "json" | "text" = "text",
  jsonSchema?: Record<string, unknown>,
  maxTokens: number = 1000,
  temperature: number = 0.7
): Promise<ModelOutput> {
  const startTime = Date.now();

  try {
    // Get Gemini model
    const model = getGeminiModel();

    // Prepare prompt for JSON output if needed
    const formattedPrompt =
      outputFormat === "json"
        ? `${prompt}\n\nRespond with a valid JSON object only. No other text.${
            jsonSchema
              ? `\n\nThe JSON should follow this schema: ${JSON.stringify(
                  jsonSchema
                )}`
              : ""
          }`
        : prompt;

    // Call Gemini API with the specified parameters
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      },
    });

    const response = await result.response;
    const rawOutput = response.text();

    const processingTime = Date.now() - startTime;

    let isValidJson = false;
    let output = rawOutput;

    if (outputFormat === "json") {
      try {
        // Try to extract JSON from the response
        const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          output = jsonMatch[0];
          // Verify if the output is valid JSON
          JSON.parse(output);
          isValidJson = true;
        }
      } catch {
        isValidJson = false;
      }
    }

    // Gemini doesn't provide token usage information in the same way
    return {
      output,
      rawOutput,
      isValidJson,
      processingTime,
    };
  } catch (error) {
    const processingTime = Date.now() - startTime;
    return {
      output: "",
      rawOutput: "",
      isValidJson: false,
      processingTime,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Compare the outputs from both models and analyze differences
 */
function compareOutputs(
  llama: ModelOutput,
  gemini: ModelOutput
): ModelComparisonResponse["comparison"] {
  const structuralDifferences: string[] = [];
  const contentDifferences: string[] = [];

  // Calculate performance comparison
  const processingTimeRatio = llama.processingTime / gemini.processingTime;

  let tokenEfficiencyRatio: number | undefined;
  if (llama.tokenUsage && gemini.tokenUsage) {
    tokenEfficiencyRatio =
      llama.tokenUsage.output /
      llama.tokenUsage.input /
      (gemini.tokenUsage.output / gemini.tokenUsage.input);
  }

  // For JSON outputs, compare structure and content
  if (llama.isValidJson && gemini.isValidJson) {
    try {
      const llamaJson = JSON.parse(llama.output);
      const geminiJson = JSON.parse(gemini.output);

      // Compare keys at top level
      const llamaKeys = Object.keys(llamaJson);
      const geminiKeys = Object.keys(geminiJson);

      // Check for missing keys
      const llamaMissingKeys = geminiKeys.filter(
        (key) => !llamaKeys.includes(key)
      );
      const geminiMissingKeys = llamaKeys.filter(
        (key) => !geminiKeys.includes(key)
      );

      if (llamaMissingKeys.length > 0) {
        structuralDifferences.push(
          `Llama is missing these keys: ${llamaMissingKeys.join(", ")}`
        );
      }

      if (geminiMissingKeys.length > 0) {
        structuralDifferences.push(
          `Gemini is missing these keys: ${geminiMissingKeys.join(", ")}`
        );
      }

      // Compare common keys for content differences
      const commonKeys = llamaKeys.filter((key) => geminiKeys.includes(key));

      for (const key of commonKeys) {
        if (
          JSON.stringify(llamaJson[key]) !== JSON.stringify(geminiJson[key])
        ) {
          contentDifferences.push(`Different values for key "${key}"`);
        }
      }
    } catch {
      structuralDifferences.push("Error comparing JSON structures");
    }
  } else {
    if (!llama.isValidJson && !gemini.isValidJson) {
      structuralDifferences.push("Both models failed to produce valid JSON");
    } else if (!llama.isValidJson) {
      structuralDifferences.push("Llama failed to produce valid JSON");
    } else {
      structuralDifferences.push("Gemini failed to produce valid JSON");
    }
  }

  return {
    structuralDifferences,
    contentDifferences,
    performanceComparison: {
      processingTimeRatio,
      tokenEfficiencyRatio,
    },
  };
}

/**
 * Compare the output of Llama 3.2 3b and Gemini models
 */
export async function compareModels(
  request: ModelComparisonRequest
): Promise<ModelComparisonResponse> {
  const {
    prompt,
    outputFormat = "text",
    jsonSchema,
    maxTokens = 1000,
    temperature = 0.7,
  } = request;

  // Call both models in parallel
  const [llamaResult, geminiResult] = await Promise.all([
    callLlama(prompt, outputFormat, jsonSchema, maxTokens, temperature),
    callGemini(prompt, outputFormat, jsonSchema, maxTokens, temperature),
  ]);

  // Compare the outputs
  const comparison = compareOutputs(llamaResult, geminiResult);

  return {
    llama: llamaResult,
    gemini: geminiResult,
    comparison,
  };
}
