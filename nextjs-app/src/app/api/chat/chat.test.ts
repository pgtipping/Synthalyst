import { NextRequest } from "next/server";
import { Client } from "@botpress/client";
import { POST } from "./route";

interface BotpressErrorDetails {
  [key: string]: string | number | boolean;
}

// Create a mock BotpressError class
class MockBotpressError extends Error {
  code: string;
  status: number;
  details?: BotpressErrorDetails;

  constructor(
    code: string,
    status: number,
    message: string,
    details?: BotpressErrorDetails
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Store the MockBotpressError in global scope for the mock to access
(global as any).__MockBotpressError = MockBotpressError;

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn().mockResolvedValue({
    user: {
      email: "test@example.com",
    },
  }),
}));

// Mock the Botpress client
jest.mock("@botpress/client", () => {
  // Create a mock implementation that can be customized in tests
  const mockCreateConversation = jest.fn().mockResolvedValue({
    conversationId: "test-conversation-id",
  });

  const mockCreateMessage = jest.fn().mockResolvedValue({});

  const mockListMessages = jest.fn().mockResolvedValue({
    messages: [
      {
        payload: {
          type: "text",
          text: "Hello! How can I help you today?",
        },
      },
    ],
  });

  // Store mock functions in global scope for tests to access
  (global as any).__mockBotpressClient = {
    createConversation: mockCreateConversation,
    createMessage: mockCreateMessage,
    listMessages: mockListMessages,
  };

  return {
    Client: jest.fn().mockImplementation(() => ({
      createConversation: mockCreateConversation,
      createMessage: mockCreateMessage,
      listMessages: mockListMessages,
    })),
    BotpressError: (global as any).__MockBotpressError,
  };
});

describe("Chat API", () => {
  // Get the mock functions from global scope
  const mockBotpressClient = (global as any).__mockBotpressClient;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/chat", () => {
    it("should process chat message successfully", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        message: "Hello! How can I help you today?",
        conversationId: "test-conversation-id",
      });
    });

    it("should validate required message field", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          userId: "test-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({
        error: "Message is required",
      });
    });

    it("should handle conversation not found error", async () => {
      // Mock the error for this test
      mockBotpressClient.createConversation.mockRejectedValueOnce(
        new MockBotpressError(
          "conversation_not_found",
          404,
          "Conversation not found",
          {}
        )
      );

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({
        error: "Conversation not found",
      });
    });

    it("should handle rate limit exceeded error", async () => {
      // Mock the error for this test
      mockBotpressClient.createConversation.mockRejectedValueOnce(
        new MockBotpressError(
          "rate_limit_exceeded",
          429,
          "Too many requests",
          {}
        )
      );

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data).toEqual({
        error: "Too many requests",
      });
    });

    it("should handle unauthorized access error", async () => {
      // Mock the error for this test
      mockBotpressClient.createConversation.mockRejectedValueOnce(
        new MockBotpressError("unauthorized", 401, "Unauthorized access", {})
      );

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toEqual({
        error: "Unauthorized access",
      });
    });

    it("should include user email in conversation tags when authenticated", async () => {
      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      await POST(request);

      expect(mockBotpressClient.createConversation).toHaveBeenCalledWith({
        channel: "web",
        tags: {
          source: "web",
          userId: "test-user",
          email: "test@example.com",
        },
      });
    });
  });
});
