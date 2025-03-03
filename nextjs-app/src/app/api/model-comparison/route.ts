import { NextRequest } from "next/server";
import { z } from "zod";
import { compareModels } from "@/lib/modelComparison";
import {
  createHandler,
  successResponse,
  errorResponse,
} from "@/lib/api/handler";

// Validation schema for the request body
const modelComparisonSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  outputFormat: z.enum(["json", "text"]).optional().default("text"),
  jsonSchema: z.record(z.unknown()).optional(),
  maxTokens: z.number().int().positive().optional().default(1000),
  temperature: z.number().min(0).max(1).optional().default(0.7),
});

export const POST = createHandler(async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Validate request body
    const validatedData = modelComparisonSchema.parse(body);

    // Call the model comparison service
    const result = await compareModels(validatedData);

    return successResponse(result);
  } catch (error) {
    console.error("Error in model comparison API:", error);

    if (error instanceof z.ZodError) {
      return errorResponse("Invalid request data", "VALIDATION_ERROR", 400, {
        details: error.errors,
      });
    }

    return errorResponse(
      error instanceof Error ? error.message : "An unknown error occurred",
      "MODEL_COMPARISON_ERROR",
      500
    );
  }
});
