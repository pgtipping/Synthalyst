import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Initialize clients - only create actual clients on the server side
// For client-side, create mock clients that will be replaced with API calls
const openai = isClient
  ? ({
      chat: {
        completions: {
          create: async () => {
            throw new Error(
              "OpenAI client should not be called directly from the client side"
            );
          },
        },
      },
    } as unknown as OpenAI)
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });

const genAI = isClient
  ? ({
      getGenerativeModel: () => ({
        generateContent: async () => {
          throw new Error(
            "Google AI client should not be called directly from the client side"
          );
        },
      }),
    } as unknown as GoogleGenerativeAI)
  : new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Model aliases
export const MODELS = {
  // OpenAI models
  GPT_4O: "gpt-4o",
  GPT_4O_MINI: "gpt-4o-mini",

  // Google models
  GEMINI_1_5_FLASH_8B: "gemini-1.5-flash-8b",
  GEMINI_1_5_FLASH: "gemini-1.5-flash",

  // Generic model types for UI (do not expose specific models to users)
  KNOWLEDGE_MODEL: "KNOWLEDGE_MODEL",
  LEARNING_MODEL: "LEARNING_MODEL",
};

// Task complexity levels
export enum TaskComplexity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

// Task types
export enum TaskType {
  KNOWLEDGE_GPT = "knowledge_gpt",
  LEARNING_CREATOR = "learning_creator",
}

// Supported languages
export const SUPPORTED_LANGUAGES = {
  [MODELS.GPT_4O_MINI]: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Dutch",
    "Turkish",
    "Swedish",
    "Polish",
    "Danish",
    "Norwegian",
    "Finnish",
  ],
  [MODELS.GEMINI_1_5_FLASH_8B]: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
  ],
  // Add generic model types with combined language support
  [MODELS.KNOWLEDGE_MODEL]: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
  ],
  [MODELS.LEARNING_MODEL]: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",
    "Hindi",
    "Dutch",
    "Turkish",
    "Swedish",
    "Polish",
    "Danish",
    "Norwegian",
    "Finnish",
  ],
};

// Interface for model selection parameters
interface ModelSelectionParams {
  taskType: TaskType;
  complexity?: TaskComplexity;
  contentLength?: number;
  language?: string;
  prioritizeCost?: boolean;
}

// Function to select the appropriate model based on parameters
export function selectModel(params: ModelSelectionParams): string {
  const {
    taskType,
    complexity = TaskComplexity.MEDIUM,
    contentLength = 0,
    language = "English",
    prioritizeCost = true,
  } = params;

  // Default models for each task type
  if (taskType === TaskType.KNOWLEDGE_GPT) {
    // For Knowledge GPT, default to Gemini 1.5 Flash-8B

    // Check if language is supported by Gemini
    const isLanguageSupported =
      SUPPORTED_LANGUAGES[MODELS.GEMINI_1_5_FLASH_8B].includes(language);

    // If language not supported or high complexity, use GPT-4o-Mini
    if (!isLanguageSupported || complexity === TaskComplexity.HIGH) {
      return MODELS.GPT_4O_MINI;
    }

    return MODELS.GEMINI_1_5_FLASH_8B;
  } else if (taskType === TaskType.LEARNING_CREATOR) {
    // For Learning Creator, default to GPT-4o-Mini

    // If prioritizing cost and content is short, use Gemini for lower complexity tasks
    if (
      prioritizeCost &&
      contentLength < 1000 &&
      complexity !== TaskComplexity.HIGH
    ) {
      // Check if language is supported by Gemini
      const isLanguageSupported =
        SUPPORTED_LANGUAGES[MODELS.GEMINI_1_5_FLASH_8B].includes(language);

      if (isLanguageSupported) {
        return MODELS.GEMINI_1_5_FLASH_8B;
      }
    }

    return MODELS.GPT_4O_MINI;
  }

  // Fallback to GPT-4o-Mini if task type is not recognized
  return MODELS.GPT_4O_MINI;
}

// Function to estimate the cost of a request
export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = {
    [MODELS.GPT_4O]: { input: 0.01, output: 0.03 },
    [MODELS.GPT_4O_MINI]: { input: 0.00015, output: 0.0006 },
    [MODELS.GEMINI_1_5_FLASH_8B]: { input: 0.0000375, output: 0.00015 },
    [MODELS.GEMINI_1_5_FLASH]: { input: 0.000075, output: 0.0003 },
  };

  const modelCost = costs[model as keyof typeof costs];

  if (!modelCost) {
    return 0;
  }

  return inputTokens * modelCost.input + outputTokens * modelCost.output;
}

// Function to get the provider for a model
export function getModelProvider(model: string): "openai" | "google" {
  if (model.startsWith("gpt")) {
    return "openai";
  } else if (model.startsWith("gemini")) {
    return "google";
  }

  throw new Error(`Unknown model provider for model: ${model}`);
}

// Generic function to generate content using the appropriate API
export async function generateContent(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7,
  maxTokens: number = 1000,
  language: string = "English"
): Promise<string> {
  if (isClient) {
    // Use the API route on the client side
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          systemPrompt,
          userPrompt,
          temperature,
          maxTokens,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.content || "";
    } catch (error) {
      console.error("Error calling generate API:", error);
      throw error;
    }
  } else {
    // Server-side generation
    const provider = getModelProvider(model);

    if (provider === "openai") {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0]?.message?.content?.trim() || "";
    } else if (provider === "google") {
      const geminiModel = genAI.getGenerativeModel({ model });

      const result = await geminiModel.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });

      return result.response.text().trim();
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Function to detect the complexity of a task based on the prompt
export function detectTaskComplexity(prompt: string): TaskComplexity {
  // Simple heuristic based on prompt length and complexity indicators
  const wordCount = prompt.split(/\s+/).length;

  // Check for complexity indicators in the prompt
  const complexityIndicators = [
    "analyze",
    "compare",
    "evaluate",
    "synthesize",
    "critique",
    "complex",
    "detailed",
    "comprehensive",
    "in-depth",
    "thorough",
  ];

  const hasComplexityIndicators = complexityIndicators.some((indicator) =>
    prompt.toLowerCase().includes(indicator)
  );

  if (wordCount > 100 || hasComplexityIndicators) {
    return TaskComplexity.HIGH;
  } else if (wordCount > 50) {
    return TaskComplexity.MEDIUM;
  } else {
    return TaskComplexity.LOW;
  }
}

// Function to detect the language of the prompt
export function detectLanguage(prompt: string): string {
  // This is a simplified implementation
  // In a production environment, you would use a more sophisticated language detection library

  // Common language indicators
  const languageIndicators = {
    English: ["the", "and", "is", "in", "to", "of", "a"],
    Spanish: ["el", "la", "es", "en", "y", "de", "un", "una"],
    French: ["le", "la", "est", "en", "et", "de", "un", "une"],
    German: ["der", "die", "das", "ist", "in", "und", "ein", "eine"],
    Chinese: ["的", "是", "在", "有", "和", "不", "我", "这"],
    Japanese: ["は", "の", "に", "を", "た", "が", "で", "て"],
    Russian: ["и", "в", "не", "на", "я", "что", "с", "по"],
  };

  const promptLower = prompt.toLowerCase();
  let bestMatch = "English"; // Default
  let highestScore = 0;

  Object.entries(languageIndicators).forEach(([language, indicators]) => {
    const score = indicators.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      const matches = promptLower.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);

    if (score > highestScore) {
      highestScore = score;
      bestMatch = language;
    }
  });

  return bestMatch;
}

// Function to create a multilingual system prompt
export function createMultilingualSystemPrompt(
  basePrompt: string,
  language: string
): string {
  return `${basePrompt}

Please respond in ${language}. Ensure that your response is culturally appropriate and uses natural expressions in ${language}.`;
}

// New version of generateContent function with updated signature
export async function generateContentV2({
  messages,
  type = "knowledge",
  language = "English",
  temperature = 0.7,
  maxTokens = 1000,
}: {
  messages: { role: "system" | "user" | "assistant"; content: string }[];
  type?: string;
  language?: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  if (isClient) {
    // Use the API route on the client side
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: messages.find((m) => m.role === "user")?.content || "",
          language,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.content || "";
    } catch (error) {
      console.error("Error calling generate API:", error);
      throw error;
    }
  } else {
    // Server-side generation
    // Map generic model type to actual model
    let model = "";

    if (type === "knowledge" || type === MODELS.KNOWLEDGE_MODEL) {
      model = MODELS.GEMINI_1_5_FLASH_8B; // Use Gemini for knowledge queries
    } else if (type === "learning" || type === MODELS.LEARNING_MODEL) {
      model = MODELS.GPT_4O_MINI; // Use GPT for learning content
    } else {
      // If it's already a specific model, use it
      model = type;
    }

    console.log(`Model Router - Using model: ${model} for type: ${type}`);
    console.log(`Model Router - Language: ${language}`);

    const provider = getModelProvider(model);

    if (provider === "openai") {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      });

      return response.choices[0]?.message?.content?.trim() || "";
    } else if (provider === "google") {
      const geminiModel = genAI.getGenerativeModel({ model });

      // For Gemini, we need to handle system messages differently
      // since Gemini doesn't support system role
      const systemMessage =
        messages.find((msg) => msg.role === "system")?.content || "";
      const userMessages = messages.filter((msg) => msg.role === "user");
      const assistantMessages = messages.filter(
        (msg) => msg.role === "assistant"
      );

      // Combine system message with the first user message if it exists
      const formattedMessages = [];

      if (userMessages.length > 0) {
        // Add system instructions to the first user message
        const firstUserMessage = userMessages[0];
        const enhancedUserContent = systemMessage
          ? `${systemMessage}\n\n${firstUserMessage.content}`
          : firstUserMessage.content;

        formattedMessages.push({
          role: "user",
          parts: [{ text: enhancedUserContent }],
        });

        // Add remaining messages in alternating order
        for (
          let i = 0;
          i < Math.max(userMessages.length - 1, assistantMessages.length);
          i++
        ) {
          if (i < assistantMessages.length) {
            formattedMessages.push({
              role: "model",
              parts: [{ text: assistantMessages[i].content }],
            });
          }

          if (i + 1 < userMessages.length) {
            formattedMessages.push({
              role: "user",
              parts: [{ text: userMessages[i + 1].content }],
            });
          }
        }
      } else if (systemMessage) {
        // If there's only a system message, treat it as a user message
        formattedMessages.push({
          role: "user",
          parts: [{ text: systemMessage }],
        });
      }

      const result = await geminiModel.generateContent({
        contents: formattedMessages,
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
        },
      });

      return result.response.text().trim();
    }

    throw new Error(`Unsupported provider: ${provider}`);
  }
}
