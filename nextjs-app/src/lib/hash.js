/**
 * Simple hash function that works in both browser and server environments
 * This replaces the crypto dependency with a pure JavaScript implementation
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Log a warning if this is imported on the client side
if (isBrowser) {
  console.warn(
    "Warning: hash.js is being imported on the client side. " +
      "This should only be used in server components or API routes."
  );
}

/**
 * Creates a hash of the provided content
 * Uses a simple but effective algorithm (djb2)
 *
 * @param {string} content - The string to hash
 * @returns {string} A hex string representation of the hash
 */
export function createHash(content) {
  if (!content) {
    return "empty-content-" + Date.now().toString(16);
  }

  try {
    // djb2 algorithm
    let hash = 5381;

    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) + hash + char; // hash * 33 + char
    }

    // Convert to hex string and pad to make it look like a SHA-256 hash (64 chars)
    const hashHex = Math.abs(hash).toString(16).padStart(8, "0");
    return hashHex.repeat(8).slice(0, 64);
  } catch (error) {
    console.error("Error creating hash:", error);
    // Return a fallback hash
    return "error-hash-" + Date.now().toString(16);
  }
}

// Alias for compatibility with existing code
export const createHashSync = createHash;
