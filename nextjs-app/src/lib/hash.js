/**
 * Simple hash function that works in both browser and server environments
 * This replaces the crypto dependency with a pure JavaScript implementation
 */

/**
 * Creates a hash of the provided content
 * Uses a simple but effective algorithm (djb2)
 *
 * @param {string} content - The string to hash
 * @returns {string} A hex string representation of the hash
 */
export function createHash(content) {
  // djb2 algorithm
  let hash = 5381;

  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) + hash + char; // hash * 33 + char
  }

  // Convert to hex string and pad to make it look like a SHA-256 hash (64 chars)
  const hashHex = Math.abs(hash).toString(16).padStart(8, "0");
  return hashHex.repeat(8).slice(0, 64);
}

// Alias for compatibility with existing code
export const createHashSync = createHash;
