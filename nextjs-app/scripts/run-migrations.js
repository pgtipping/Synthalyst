#!/usr/bin/env node

/**
 * Script to run database migrations with retry logic
 * This can be run manually or as a separate deployment step
 */

import { execSync } from "child_process";
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runMigrations() {
  console.log("Starting database migrations...");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${MAX_RETRIES}...`);

      // Run the migration command
      execSync("npx prisma migrate deploy", { stdio: "inherit" });

      console.log("Migrations completed successfully!");
      return true;
    } catch (error) {
      console.error(`Migration attempt ${attempt} failed:`, error.message);

      if (attempt < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await sleep(RETRY_DELAY);
      } else {
        console.error("All migration attempts failed.");
        return false;
      }
    }
  }
}

// Run the migrations
runMigrations()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Unhandled error during migrations:", error);
    process.exit(1);
  });
