import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// Helper function to serialize BigInt values
function serializeBigInt(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "bigint") {
    return data.toString();
  }

  if (Array.isArray(data)) {
    return data.map(serializeBigInt);
  }

  if (typeof data === "object") {
    return Object.fromEntries(
      Object.entries(data as Record<string, unknown>).map(([key, value]) => [
        key,
        serializeBigInt(value),
      ])
    );
  }

  return data;
}

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

  // No need to serialize the entire error object here
  // We'll serialize specific fields as needed

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

    // Enhanced error handling for Prisma errors
    if (error.name.startsWith("PrismaClient")) {
      // @ts-expect-error - Accessing Prisma-specific properties
      const code = error.code;

      // Handle specific Prisma errors
      if (code === "P2002") {
        return NextResponse.json(
          {
            error: {
              message: "A record with this data already exists",
              code: "DUPLICATE_RECORD",
              status: 409,
              // @ts-expect-error - Accessing Prisma-specific properties
              fields: serializeBigInt(error.meta?.target || []),
            },
          },
          { status: 409 }
        );
      }

      if (code === "P2025") {
        return NextResponse.json(
          {
            error: {
              message: "Record not found",
              code: "NOT_FOUND",
              status: 404,
            },
          },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        error: {
          message: "An unexpected error occurred",
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
          details:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        },
      },
      { status: 500 }
    );
  }

  // For unknown error types
  return NextResponse.json(
    {
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
      },
    },
    { status: 500 }
  );
}
