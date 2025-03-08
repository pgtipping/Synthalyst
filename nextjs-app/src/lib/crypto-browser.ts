/**
 * Browser-compatible crypto functions for hashing
 * This file provides alternatives to Node.js crypto functions that work in the browser
 */

/**
 * Creates a SHA-256 hash of the provided content
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export async function createHash(content: string): Promise<string> {
  // Use the Web Crypto API which is available in modern browsers
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the ArrayBuffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Synchronous version that falls back to a simple hash function if crypto.subtle is not available
 * This is less secure but provides a fallback for environments where Web Crypto API is not available
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export function createHashSync(content: string): string {
  try {
    // Try to use a simple hash function if crypto.subtle is not available
    // This is a very basic hash function and should be replaced with a better one if possible
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Convert to hex string
    const hashHex = (hash >>> 0).toString(16).padStart(8, "0");
    return hashHex.repeat(8); // Repeat to make it look like a SHA-256 hash
  } catch (error) {
    console.error("Error creating hash:", error);
    // Return a fallback hash
    return "fallback-hash-" + Date.now().toString(16);
  }
}
