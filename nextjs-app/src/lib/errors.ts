export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_SERVER_ERROR",
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Authentication Errors
export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "UNAUTHENTICATED");
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "UNAUTHORIZED");
  }
}

// Resource Errors
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

// Database Errors
export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, "DATABASE_ERROR", true);
  }
}

// Rate Limiting
export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

// API Errors
export class APIError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode, "API_ERROR");
  }
}

// Payment Errors
export class PaymentError extends AppError {
  constructor(message: string) {
    super(message, 402, "PAYMENT_REQUIRED");
  }
}

// Input Validation
export class InputValidationError extends AppError {
  constructor(errors: Record<string, string[]>) {
    super("Validation failed", 400, "VALIDATION_ERROR");
    Object.assign(this, { errors });
  }
}

// Service Unavailable
export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporarily unavailable") {
    super(message, 503, "SERVICE_UNAVAILABLE");
  }
}

// AI Service Errors
export class AIServiceError extends AppError {
  constructor(message: string) {
    super(message, 500, "AI_SERVICE_ERROR");
  }
}

// File Operation Errors
export class FileOperationError extends AppError {
  constructor(message: string) {
    super(message, 500, "FILE_OPERATION_ERROR");
  }
}

// Helper function to determine if an error is operational
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};
