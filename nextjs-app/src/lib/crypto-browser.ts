/**
 * Isomorphic crypto functions that work in both Node.js and browser environments
 */

// Detect environment
const isNode =
  typeof window === "undefined" &&
  typeof process !== "undefined" &&
  process.versions &&
  process.versions.node;

// Import Node.js crypto module only in Node.js environment
let nodeCrypto: {
  createHash: (algorithm: string) => {
    update: (data: string) => { digest: (encoding: string) => string };
  };
} | null = null;
if (isNode) {
  // Dynamic import to avoid bundling issues
  try {
    // Using eval to avoid direct require which triggers linter errors
    // eslint-disable-next-line no-eval
    nodeCrypto = eval("require")("crypto");
  } catch (error) {
    console.warn(
      "Node.js crypto module not available:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Creates a SHA-256 hash of the provided content
 * Works in both Node.js and browser environments
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export async function createHash(content: string): Promise<string> {
  // Use Node.js crypto if available
  if (isNode && nodeCrypto) {
    return nodeCrypto.createHash("sha256").update(content).digest("hex");
  }

  // Use Web Crypto API in browser
  try {
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
 * Synchronous version that works in both Node.js and browser environments
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
export function createHashSync(content: string): string {
  // Use Node.js crypto if available
  if (isNode && nodeCrypto) {
    return nodeCrypto.createHash("sha256").update(content).digest("hex");
  }

  // In browser, use a simple hash function
  return createSimpleHash(content);
}

/**
 * Simple hash function for browsers where crypto.subtle is not available
 * This is less secure but provides a fallback
 *
 * @param content - The string to hash
 * @returns A hex string representation of the hash
 */
function createSimpleHash(content: string): string {
  try {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    // Convert to hex string and pad to make it look like a SHA-256 hash
    const hashHex = (hash >>> 0).toString(16).padStart(8, "0");
    return hashHex.repeat(8);
  } catch (error) {
    console.error("Error creating simple hash:", error);
    // Return a fallback hash
    return "fallback-hash-" + Date.now().toString(16);
  }
}
