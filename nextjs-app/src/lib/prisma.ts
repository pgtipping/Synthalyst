import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with logging
const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      process.env.NODE_ENV === "production"
        ? [
            { emit: "event", level: "query" },
            { emit: "event", level: "error" },
            { emit: "event", level: "info" },
            { emit: "event", level: "warn" },
          ]
        : undefined,
  });

  // Set up logging for production
  if (process.env.NODE_ENV === "production") {
    client.$on("query", (e) => {
      logger.debug("Prisma Query", {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });

    client.$on("error", (e) => {
      logger.error("Prisma Error", { message: e.message, target: e.target });
    });

    client.$on("info", (e) => {
      logger.info("Prisma Info", { message: e.message, target: e.target });
    });

    client.$on("warn", (e) => {
      logger.warn("Prisma Warning", { message: e.message, target: e.target });
    });
  }

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Add connection testing function
export async function testPrismaConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error("Prisma connection test failed", error);
    return false;
  }
}
