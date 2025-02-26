import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "../middleware/errorHandler";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    status: number;
    details?: unknown;
  };
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RouteHandlerConfig<T = unknown> {
  validationSchema?: ZodSchema<T>;
  requireAuth?: boolean;
}

export type ApiHandler<T = unknown, P = Record<string, string>> = (
  req: NextRequest,
  context: { params: P },
  body?: T
) => Promise<NextResponse<ApiResponse>>;

export function createHandler<T = unknown, P = Record<string, string>>(
  handler: ApiHandler<T, P>,
  config: RouteHandlerConfig<T> = {}
) {
  return async (req: NextRequest, context: { params: P }) => {
    try {
      // Method validation
      const allowedMethods: HttpMethod[] = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
      ];
      if (!allowedMethods.includes(req.method as HttpMethod)) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: `Method ${req.method} not allowed`,
              code: "METHOD_NOT_ALLOWED",
              status: 405,
            },
          },
          { status: 405 }
        );
      }

      // Parse and validate request body if needed
      let body: T | undefined;
      if (
        req.method !== "GET" &&
        req.headers.get("content-type")?.includes("application/json")
      ) {
        const rawBody = await req.json();

        if (config.validationSchema) {
          try {
            body = config.validationSchema.parse(rawBody);
          } catch (error) {
            if (error instanceof ZodError) {
              throw new ValidationError("Validation failed");
            }
            throw error;
          }
        } else {
          body = rawBody;
        }
      }

      // TODO: Add authentication check here when auth is set up
      if (config.requireAuth) {
        // const session = await getSession();
        // if (!session) throw new AuthenticationError();
      }

      // Call the actual route handler
      const response = await handler(req, context, body);
      return response;
    } catch (error) {
      return errorHandler(error);
    }
  };
}

export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  status: number = 500,
  details?: Record<string, unknown>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        status,
        ...(details && { details }),
      },
    },
    { status }
  );
}
