import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prismaMock);
});

// Mock Request global
global.Request = class Request {
  constructor(_input: string | Request, _init?: RequestInit) {}
} as unknown as typeof Request;

// Mock TextEncoder and TextDecoder
if (typeof TextEncoder === "undefined") {
  global.TextEncoder = class TextEncoder {
    encode(text: string): Uint8Array {
      return new Uint8Array(Buffer.from(text));
    }
  } as any;
}

if (typeof TextDecoder === "undefined") {
  global.TextDecoder = class TextDecoder {
    decode(buffer: Uint8Array): string {
      return Buffer.from(buffer).toString();
    }
  } as any;
}
