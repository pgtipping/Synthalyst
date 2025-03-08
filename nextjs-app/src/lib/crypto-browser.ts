/**
 * Browser-safe crypto functions
 * This file provides crypto functions that work safely in the browser without Node.js dependencies
 */

/**
 * Creates a SHA-256 hash of the provided content using Web Crypto API
 *
 * @param content - The string to hash
 * @returns A promise that resolves to a hex string representation of the hash
 */
export async function createHash(content: string): Promise<string> {
  try {
    // Use the Web Crypto API which is available in all modern browsers
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert the ArrayBuffer to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hashHex;
  } catch (error) {
    console.error("Error creating hash with Web Crypto API:", error);
    // Fall back to simple hash
    return createSimpleHash(content);
  }
}

/**
 * Synchronous version that uses a simple hash function
 * This is less secure but provides a synchronous alternative
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export function createHashSync(content: string): string {
  return createSimpleHash(content);
}

/**
 * Simple hash function for browsers
 * This is less secure but provides a fallback
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
function createSimpleHash(content: string): string {
  try {
    // djb2 algorithm - a simple but effective hash function
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) + hash + char; // hash * 33 + char
    }

    // Convert to hex string and pad to make it look like a SHA-256 hash (64 chars)
    const hashHex = Math.abs(hash).toString(16).padStart(8, "0");
    const paddedHash = hashHex.repeat(8).slice(0, 64);
    return paddedHash;
  } catch (error) {
    console.error("Error creating simple hash:", error);
    // Return a fallback hash
    return "fallback-hash-" + Date.now().toString(16).padStart(16, "0");
  }
}
