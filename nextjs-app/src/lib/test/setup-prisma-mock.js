// This file is used to set up the Prisma mock for Jest
// It's imported directly in jest.config.js

import { createMockPrismaClient, resetMockStorage } from "./prisma-mock";

// Create a mock client instance
const mockPrismaClient = createMockPrismaClient();

// Store the mock functions in global scope for tests to access
global.__mockPrismaClient = mockPrismaClient;
global.__resetMockStorage = resetMockStorage;

// Mock the Prisma module
jest.mock("@/lib/prisma", () => {
  return {
    prisma: global.__mockPrismaClient,
    testPrismaConnection: jest.fn().mockResolvedValue(true),
    reconnectPrisma: jest.fn().mockResolvedValue(true),
    withRetry: jest.fn().mockImplementation((fn) => fn()),
  };
});

// Reset mock storage before each test
beforeEach(() => {
  if (global.__resetMockStorage) {
    global.__resetMockStorage();
  }
});
