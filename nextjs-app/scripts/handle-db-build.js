// This script is used to handle database connection issues during build time
// It creates a mock database client that can be used during static generation

const fs = require("fs");
const path = require("path");

// Create a mock Prisma client for build time
const mockPrismaClient = `
// This is a mock Prisma client for build time
// It's used to prevent database connection errors during static generation

const PrismaClient = function() {
  return {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $on: () => {},
    $transaction: (fn) => Promise.resolve([]),
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve([]),
    user: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      findFirst: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    },
    contactSubmission: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      findFirst: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      count: () => Promise.resolve(0),
    },
    // Add other models as needed
  };
};

module.exports = {
  PrismaClient,
  default: new PrismaClient()
};
`;

// Check if we're in a build environment
const isBuildEnv =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

if (isBuildEnv) {
  console.log("Build environment detected, creating mock Prisma client...");

  // Create the mock Prisma client
  const mockClientPath = path.join(
    process.cwd(),
    "node_modules",
    "@prisma",
    "client",
    "mock.js"
  );
  fs.writeFileSync(mockClientPath, mockPrismaClient);

  console.log("Mock Prisma client created at", mockClientPath);
}

console.log("Database handling for build complete");
