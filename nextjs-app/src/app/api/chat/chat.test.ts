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
  return {
    Client: jest.fn().mockImplementation(() => ({
      createConversation: jest.fn().mockResolvedValue({
        conversationId: "test-conversation-id",
      }),
      createMessage: jest.fn().mockResolvedValue({}),
      listMessages: jest.fn().mockResolvedValue({
        messages: [
          {
            payload: {
              type: "text",
              text: "Hello! How can I help you today?",
            },
          },
        ],
      }),
    })),
    BotpressError: MockBotpressError,
  };
});

describe("Chat API", () => {
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
      const mockClient = new Client({ token: "test", workspaceId: "test" });
      (mockClient.createConversation as jest.Mock).mockRejectedValueOnce(
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
      const mockClient = new Client({ token: "test", workspaceId: "test" });
      (mockClient.createConversation as jest.Mock).mockRejectedValueOnce(
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
      const mockClient = new Client({ token: "test", workspaceId: "test" });
      (mockClient.createConversation as jest.Mock).mockRejectedValueOnce(
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
      const mockCreateConversation = jest.fn().mockResolvedValue({
        conversationId: "test-conversation-id",
      });

      (Client as jest.Mock).mockImplementationOnce(() => ({
        createConversation: mockCreateConversation,
        createMessage: jest.fn().mockResolvedValue({}),
        listMessages: jest.fn().mockResolvedValue({
          messages: [
            {
              payload: {
                type: "text",
                text: "Hello! How can I help you today?",
              },
            },
          ],
        }),
      }));

      const request = new NextRequest("http://localhost:3000/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: "Hello",
          userId: "test-user",
        }),
      });

      await POST(request);

      expect(mockCreateConversation).toHaveBeenCalledWith({
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
