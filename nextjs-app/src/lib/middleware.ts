import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

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
    // Authentication check - only if required and not a public route
    if (requireAuth && !isPublicRoute(request.url)) {
      const session = await getServerSession(authOptions);
      if (!session) {
        throw new APIError("Unauthorized", 401, "UNAUTHORIZED");
      }
    }

    // Request body validation
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new APIError(
        "Invalid JSON in request body: " +
          (error instanceof Error ? error.message : "Unknown error"),
        400,
        "INVALID_JSON"
      );
    }

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

function isPublicRoute(url: string): boolean {
  const publicRoutes = [
    "/api/auth/signup",
    "/api/auth/signin",
    "/api/auth/callback",
  ];

  try {
    const parsedUrl = new URL(url);
    return publicRoutes.some((route) => parsedUrl.pathname.endsWith(route));
  } catch {
    // If URL parsing fails, return false to be safe
    return false;
  }
}

export function handleAPIError(error: unknown) {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code || "API_ERROR",
          status: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    // Log the full error details
    console.error("Unhandled Error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Return a more informative error response
    return NextResponse.json(
      {
        error: {
          message: `Server error: ${error.message}`,
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
          type: error.name,
        },
      },
      { status: 500 }
    );
  }

  // Handle unexpected errors
  return NextResponse.json(
    {
      error: {
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
        details:
          typeof error === "object" ? "Unknown error object" : String(error),
      },
    },
    { status: 500 }
  );
}
