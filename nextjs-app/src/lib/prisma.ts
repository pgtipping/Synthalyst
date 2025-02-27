import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with logging
const createPrismaClient = () => {
  // For production, enable logging to stdout
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }

  // For development, use default settings
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Add connection testing function
export async function testPrismaConnection() {
  try {
    logger.info("Testing Prisma database connection...");
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Prisma database connection successful");
    return true;
  } catch (error) {
    logger.error("Prisma connection test failed", error);
    return false;
  }
}
