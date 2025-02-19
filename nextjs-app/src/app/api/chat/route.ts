import { NextResponse } from "next/server";
import { Client, BotpressError, TextMessagePayload } from "@botpress/client";
import { getServerSession } from "next-auth";

const botpress = new Client({
  token: process.env.BOTPRESS_TOKEN || "",
  workspaceId: process.env.BOTPRESS_WORKSPACE_ID || "",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const { message, userId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    try {
      // Create conversation
      const conversation = await botpress.createConversation({
        channel: "web",
        tags: {
          source: "web",
          userId: userId || "anonymous",
          ...(session?.user?.email && { email: session.user.email }),
        },
      });

      // Send message
      await botpress.createMessage({
        conversationId: conversation.conversationId,
        type: "text",
        tags: {
          source: "user",
        },
        payload: {
          type: "text",
          text: message,
        } as TextMessagePayload,
      });

      // List messages to get bot response
      const { messages } = await botpress.listMessages({
        conversationId: conversation.conversationId,
        tags: {
          source: "bot",
        },
      });

      const botMessage = messages[0]?.payload as TextMessagePayload;

      return NextResponse.json({
        message: botMessage?.text || "I'm processing your request...",
        conversationId: conversation.conversationId,
      });
    } catch (e) {
      const error = e as BotpressError;
      console.error("Botpress API error:", {
        code: error.code,
        status: error.status,
        message: error.message,
        details: error.details,
      });

      let status = 500;
      let message = "Failed to process message";

      switch (error.code) {
        case "conversation_not_found":
          status = 404;
          message = "Conversation not found";
          break;
        case "invalid_input":
          status = 400;
          message = "Invalid message format";
          break;
        case "unauthorized":
          status = 401;
          message = "Unauthorized access";
          break;
        case "rate_limit_exceeded":
          status = 429;
          message = "Too many requests";
          break;
      }

      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
