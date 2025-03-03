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
