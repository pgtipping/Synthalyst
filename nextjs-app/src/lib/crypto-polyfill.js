// This file provides polyfills for crypto functions that might be missing in some environments
// Specifically addressing the "Cannot set properties of undefined (setting 'SHA224')" error

// Import the crypto-browserify library
import cryptoBrowserify from "crypto-browserify";

// Create a safe initialization function
export function initCrypto() {
  // Only run in browser environment
  if (typeof window !== "undefined") {
    try {
      // Check if the global crypto object exists
      if (!window.crypto) {
        window.crypto = {};
      }

      // Ensure the subtle property exists
      if (!window.crypto.subtle) {
        window.crypto.subtle = {};
      }

      // Add any missing methods from crypto-browserify
      Object.keys(cryptoBrowserify).forEach((key) => {
        if (typeof window.crypto[key] === "undefined") {
          window.crypto[key] = cryptoBrowserify[key];
        }
      });

      // Specifically handle the SHA224 issue
      if (typeof window.crypto.SHA224 === "undefined") {
        window.crypto.SHA224 = cryptoBrowserify.SHA224 || function () {};
      }

      console.log("Crypto polyfills initialized successfully");
    } catch (error) {
      console.error("Error initializing crypto polyfills:", error);
    }
  }
}

// Export the crypto-browserify as a fallback
export default cryptoBrowserify;
