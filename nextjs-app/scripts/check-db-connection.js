#!/usr/bin/env node

/**
 * Script to check database connection before attempting migrations
 * This can be run manually or as part of the deployment process
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function checkDatabaseConnection() {
  console.log("Checking database connection...");

  try {
    // Try a simple query to check connection
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful!");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkDatabaseConnection()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Unhandled error during database check:", error);
    process.exit(1);
  });
