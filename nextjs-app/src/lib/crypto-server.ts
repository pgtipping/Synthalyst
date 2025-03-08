/**
 * Server-side crypto functions
 * This file should ONLY be imported in server components or API routes
 */

import crypto from "crypto";

/**
 * Creates a SHA-256 hash of the provided content using Node.js crypto
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export function createHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Alias for createHash to maintain API compatibility with crypto-browser
 */
export const createHashSync = createHash;
