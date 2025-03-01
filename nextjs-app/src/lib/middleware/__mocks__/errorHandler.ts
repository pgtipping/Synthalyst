import { NextResponse } from "next/server";
import { AppError } from "../../errors";
import { ZodError } from "zod";
import { logger } from "../../logger";

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  };
}

export async function errorHandler(
  error: unknown
): Promise<NextResponse<ErrorResponse>> {
  // Already handled operational errors
  if (error instanceof AppError) {
    logger.error("AppError:", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          status: error.statusCode,
        },
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors - check by name instead of instanceof
  const err = error as any;
  if (err?.name === "PrismaClientKnownRequestError" || err?.code) {
    logger.error("PrismaError:", { error });
    const statusCode = 400;
    let message = "Database operation failed";
    let code = "DATABASE_ERROR";

    switch (err.code) {
      case "P2002":
        message = "Unique constraint violation";
        code = "UNIQUE_CONSTRAINT_ERROR";
        break;
      case "P2025":
        message = "Record not found";
        code = "NOT_FOUND";
        break;
      case "P2003":
        message = "Foreign key constraint violation";
        code = "FOREIGN_KEY_ERROR";
        break;
      // Add more specific error codes as needed
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message,
          code,
          status: statusCode,
          details: err.meta,
        },
      },
      { status: statusCode }
    );
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    logger.error("ZodError:", { error });
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          status: 400,
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Handle ConflictError specifically for our tests
  if (err?.name === "ConflictError") {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: err.message,
          code: "CONFLICT",
          status: 409,
        },
      },
      { status: 409 }
    );
  }

  // Handle ValidationError specifically for our tests
  if (err?.name === "ValidationError") {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: err.message,
          code: "VALIDATION_ERROR",
          status: 400,
        },
      },
      { status: 400 }
    );
  }

  // Log unhandled errors
  if (error instanceof Error) {
    logger.error("Unhandled error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    logger.error("Unknown error:", error);
  }

  // Return generic error for unhandled cases
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
      },
    },
    { status: 500 }
  );
}
