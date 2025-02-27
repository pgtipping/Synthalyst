import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma, testPrismaConnection } from "@/lib/prisma";
import { validateRequest, handleAPIError, APIError } from "@/lib/middleware";
import { logger } from "@/lib/logger";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

export async function POST(request: Request) {
  try {
    logger.info("Starting signup process...");

    // Test database connection first
    logger.info("Testing database connection...");
    const connectionTest = await testPrismaConnection();
    if (!connectionTest) {
      logger.error("Database connection test failed");
      throw new APIError(
        "Database connection failed",
        500,
        "DATABASE_CONNECTION_ERROR"
      );
    }
    logger.info("Database connection test passed");

    // Log request headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    logger.debug("Request headers:", headers);

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await request.clone().json();
      logger.debug("Request body received:", {
        email: requestBody.email
          ? `${requestBody.email.substring(0, 3)}...`
          : undefined,
        name: requestBody.name
          ? `${requestBody.name.substring(0, 3)}...`
          : undefined,
        hasPassword: !!requestBody.password,
      });
    } catch (error) {
      logger.error("Failed to parse request body", error);
      throw new APIError("Invalid request body", 400, "INVALID_REQUEST");
    }

    // Validate request using schema
    const { name, email, password } = await validateRequest(
      request,
      signupSchema,
      false // Don't require authentication for signup
    );

    logger.info("Request validated, checking for existing user...");

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        logger.info("User already exists:", { email });
        throw new APIError("User already exists", 400, "USER_EXISTS");
      }
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      logger.error("Error checking for existing user", error);
      throw new APIError(
        "Failed to check for existing user",
        500,
        "DATABASE_ERROR"
      );
    }

    logger.info("User doesn't exist, hashing password...");

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hash(password, 12);
      logger.debug("Password hashed successfully");
    } catch (error) {
      logger.error("Error hashing password", error);
      throw new APIError(
        "Failed to process password",
        500,
        "PASSWORD_HASH_ERROR"
      );
    }

    logger.info("Password hashed, creating user...");

    // Create user with detailed error handling
    try {
      // Test database connection before attempting to create user
      try {
        await prisma.$queryRaw`SELECT 1`;
        logger.info("Database connection verified before user creation");
      } catch (dbError) {
        logger.error(
          "Database connection failed before user creation",
          dbError
        );
        throw new APIError(
          "Database connection failed before user creation",
          500,
          "DATABASE_CONNECTION_ERROR"
        );
      }

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      logger.info("User created successfully:", { userId: user.id });

      return NextResponse.json(
        {
          message: "User created successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      logger.error("Error creating user in database", error);

      // Provide more specific error messages based on the error type
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        throw new APIError("Email already in use", 400, "EMAIL_IN_USE");
      } else if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2003"
      ) {
        throw new APIError(
          "Database constraint violation",
          400,
          "CONSTRAINT_ERROR"
        );
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown database error";
        throw new APIError(
          "Failed to create user: " + errorMessage,
          500,
          "USER_CREATION_ERROR"
        );
      }
    }
  } catch (error) {
    logger.error("Signup error:", error);

    // Enhanced error logging
    if (error instanceof Error) {
      logger.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Log additional details for Prisma errors
      if (
        error.name === "PrismaClientKnownRequestError" ||
        error.name === "PrismaClientUnknownRequestError" ||
        error.name === "PrismaClientRustPanicError" ||
        error.name === "PrismaClientInitializationError" ||
        error.name === "PrismaClientValidationError"
      ) {
        // @ts-expect-error - Accessing Prisma-specific properties
        const code = error.code;
        // @ts-expect-error - Accessing Prisma-specific properties
        const meta = error.meta;
        // @ts-expect-error - Accessing Prisma-specific properties
        const clientVersion = error.clientVersion;

        logger.error("Prisma error details:", {
          code,
          meta,
          clientVersion,
          cause: error.cause ? String(error.cause) : undefined,
        });
      }
    } else {
      // For non-Error objects
      logger.error("Non-Error object thrown:", {
        type: typeof error,
        value: String(error),
        valueJson: JSON.stringify(error),
      });
    }

    // Add environment information to help with debugging
    logger.error("Environment context:", {
      nodeEnv: process.env.NODE_ENV,
      databaseUrl: process.env.DATABASE_URL ? "Set (redacted)" : "Not set",
      nextAuthUrl: process.env.NEXTAUTH_URL ? "Set (redacted)" : "Not set",
      vercelEnv: process.env.VERCEL_ENV || "Not set",
    });

    return handleAPIError(error);
  }
}
