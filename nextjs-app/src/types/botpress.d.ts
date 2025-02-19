declare module "@botpress/client" {
  type MessageType = "text" | "image" | "card" | "carousel" | "quick_reply";

  interface BaseMessagePayload {
    type: MessageType;
  }

  interface TextMessagePayload extends BaseMessagePayload {
    type: "text";
    text: string;
  }

  interface ImageMessagePayload extends BaseMessagePayload {
    type: "image";
    url: string;
    caption?: string;
  }

  interface CardMessagePayload extends BaseMessagePayload {
    type: "card";
    title: string;
    subtitle?: string;
    imageUrl?: string;
    actions?: Array<{
      label: string;
      value: string;
    }>;
  }

  interface BotpressError extends Error {
    code: string;
    status: number;
    details?: unknown;
  }

  interface CreateConversationResponse {
    conversationId: string;
    tags: { [key: string]: string };
  }

  interface CreateMessageInput {
    conversationId: string;
    type: MessageType;
    tags: { [key: string]: string };
    payload: TextMessagePayload | ImageMessagePayload | CardMessagePayload;
  }

  interface ListMessagesResponse {
    messages: Array<{
      id: string;
      conversationId: string;
      type: MessageType;
      tags: { [key: string]: string };
      payload: TextMessagePayload | ImageMessagePayload | CardMessagePayload;
    }>;
  }

  interface CreateConversationInput {
    channel: string;
    tags: { [key: string]: string };
  }

  export class Client {
    constructor(config: { token: string; workspaceId: string });
    createConversation(
      input: CreateConversationInput
    ): Promise<CreateConversationResponse>;
    createMessage(input: CreateMessageInput): Promise<void>;
    listMessages(input: {
      conversationId: string;
      tags?: { [key: string]: string };
    }): Promise<ListMessagesResponse>;
  }
}
