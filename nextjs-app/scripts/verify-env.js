/**
 * Environment Variable Verification Script
 *
 * This script checks that all required environment variables are set
 * and outputs diagnostic information to help troubleshoot deployment issues.
 */

// Log the deployment environment
console.log("=== ENVIRONMENT VERIFICATION ===");
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`VERCEL: ${process.env.VERCEL}`);
console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV}`);

// Check essential environment variables
const requiredVars = [
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_BASE_URL",
  "NEXT_PUBLIC_API_URL",
  "NEXT_PUBLIC_APP_URL",
  "DATABASE_URL",
];

const missingVars = [];

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  // Mask sensitive values while still showing they exist
  const displayValue =
    varName === "DATABASE_URL"
      ? value
        ? "******"
        : "NOT SET"
      : value || "NOT SET";

  console.log(`${varName}: ${displayValue}`);

  if (!value) {
    missingVars.push(varName);
  }
});

// Check for production URLs
if (process.env.NODE_ENV === "production") {
  const prodUrl = "https://www.synthalyst.com";

  // Check URL configurations
  const urlVars = [
    "NEXTAUTH_URL",
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_API_URL",
    "NEXT_PUBLIC_APP_URL",
  ];
  const incorrectUrls = [];

  urlVars.forEach((varName) => {
    const value = process.env[varName];
    if (value && value !== prodUrl) {
      incorrectUrls.push(
        `${varName} is set to "${value}" but should be "${prodUrl}"`
      );
    }
  });

  if (incorrectUrls.length > 0) {
    console.log("\n⚠️ URL CONFIGURATION ISSUES:");
    incorrectUrls.forEach((msg) => console.log(`- ${msg}`));
  }
}

// Summary
if (missingVars.length > 0) {
  console.log("\n⚠️ MISSING ENVIRONMENT VARIABLES:");
  missingVars.forEach((varName) => console.log(`- ${varName}`));
  console.log("\nThese variables need to be set for proper operation!");
} else {
  console.log("\n✅ All required environment variables are set");
}

// Database URL check
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  const isNeonDb = dbUrl.includes("neon.tech");
  const hasSslMode = dbUrl.includes("sslmode=require");

  if (process.env.NODE_ENV === "production") {
    if (!isNeonDb) {
      console.log(
        "\n⚠️ DATABASE_URL does not appear to be a Neon PostgreSQL URL"
      );
      console.log(
        "   For production, a Neon PostgreSQL database is recommended"
      );
    }

    if (!hasSslMode) {
      console.log("\n⚠️ DATABASE_URL does not include 'sslmode=require'");
      console.log("   For production databases, SSL should be enabled");
    }
  }
}

console.log("\n=== ENVIRONMENT VERIFICATION COMPLETE ===");
