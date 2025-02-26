import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { headers } from "next/headers";
import { rateLimit } from "./rate-limit";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function validateRequest<T>(
  request: Request,
  schema: ZodSchema<T>,
  requireAuth: boolean = true
): Promise<T> {
  try {
    // Rate limiting
    const ip = headers().get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await rateLimit(ip);
    if (!success) {
      throw new APIError("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    }

    // Authentication check
    if (requireAuth) {
      const session = await getServerSession(authOptions);
      if (!session) {
        throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
      }
    }

    // Request body validation
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new APIError(
        "Validation failed: " + error.errors[0].message,
        400,
        "VALIDATION_ERROR"
      );
    }
    throw error;
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Default error response
  return NextResponse.json(
    {
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
}
