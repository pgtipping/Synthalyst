import { z } from "zod";

// Basic email validation schema
const basicEmailSchema = z.string().email("Invalid email address");

// Disposable email domains to block
const disposableEmailDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "trashmail.com",
  "yopmail.com",
  "disposablemail.com",
  "mailnesia.com",
  "tempinbox.com",
  // Add more as needed
];

/**
 * Validate an email address with basic checks
 * @param email Email address to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  try {
    basicEmailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if an email is from a disposable domain
 * @param email Email address to check
 * @returns Boolean indicating if email is from a disposable domain
 */
export function isDisposableEmail(email: string): boolean {
  if (!email) return false;

  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;

  return disposableEmailDomains.includes(domain);
}

/**
 * Comprehensive email validation
 * @param email Email address to validate
 * @returns Object with validation result and reason if invalid
 */
export function validateEmail(email: string): {
  isValid: boolean;
  reason?: string;
} {
  // Check if email is valid format
  if (!isValidEmail(email)) {
    return { isValid: false, reason: "Invalid email format" };
  }

  // Check if email is from a disposable domain
  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      reason: "Disposable email addresses are not allowed",
    };
  }

  // Additional checks can be added here

  return { isValid: true };
}

/**
 * Zod schema for comprehensive email validation
 */
export const emailValidationSchema = z
  .string()
  .email("Invalid email format")
  .refine((email) => !isDisposableEmail(email), {
    message: "Disposable email addresses are not allowed",
  });

/**
 * Normalize an email address (lowercase, trim)
 * @param email Email address to normalize
 * @returns Normalized email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
