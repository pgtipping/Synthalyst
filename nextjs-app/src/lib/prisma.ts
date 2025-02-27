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

// Add reconnect function
export async function reconnectPrisma() {
  try {
    logger.info("Attempting to reconnect Prisma client...");

    // Disconnect if connected
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      logger.warn("Error during disconnect:", disconnectError);
    }

    // Create a new client
    globalForPrisma.prisma = createPrismaClient();

    // Test the new connection
    const connected = await testPrismaConnection();
    if (!connected) {
      throw new Error("Failed to reconnect to database");
    }

    logger.info("Prisma client reconnected successfully");
    return true;
  } catch (error) {
    logger.error("Prisma reconnection failed", error);
    return false;
  }
}

// Add a wrapper for database operations with retry
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      retries++;
      logger.warn(
        `Database operation failed, retry ${retries}/${maxRetries}`,
        error
      );

      if (retries >= maxRetries) {
        logger.error("Max retries reached, operation failed", error);
        throw error;
      }

      // Try to reconnect before retrying
      await reconnectPrisma();

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * Math.pow(2, retries))
      );
    }
  }

  throw new Error("Max retries reached");
}
