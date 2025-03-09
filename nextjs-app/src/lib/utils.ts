import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID for use in the application
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validates and processes an image URL
 * @param url The image URL to validate
 * @param fallback Optional fallback URL if the provided URL is invalid
 * @returns A valid image URL
 */
export function getValidImageUrl(
  url: string | null | undefined,
  fallback?: string
): string {
  // Default fallback if none provided
  const defaultFallback = "https://placehold.co/800x400?text=Synthalyst";

  // If no URL provided, return fallback
  if (!url) {
    return fallback || defaultFallback;
  }

  // Handle team image consistently
  if (url.includes("synthalyst-team")) {
    return "/images/synthalyst-team.png";
  }

  // Check if URL is relative (starts with /)
  if (url.startsWith("/")) {
    return url; // Relative URLs are handled by Next.js
  }

  // Check if URL is a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return url;
    }
    return fallback || defaultFallback;
  } catch {
    // If URL parsing fails, return fallback
    return fallback || defaultFallback;
  }
}
