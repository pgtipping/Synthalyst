import "@testing-library/jest-dom";
import { cleanupDatabase } from "./setup";

beforeEach(async () => {
  await cleanupDatabase();
});

// Mock Next.js response utilities
jest.mock("next/server", () => {
  const originalModule = jest.requireActual("next/server");

  class MockNextRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(input, init);
      Object.defineProperty(this, "nextUrl", {
        get: () => new URL(input.toString()),
      });
    }
  }

  class MockNextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      super(body, init);
      Object.defineProperty(this, "status", {
        get: () => init?.status || 200,
      });
    }
  }

  return {
    ...originalModule,
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (data: unknown, init?: ResponseInit) => {
        const response = new MockNextResponse(JSON.stringify(data), {
          ...init,
          headers: {
            "content-type": "application/json",
            ...init?.headers,
          },
        });
        response.json = async () => data;
        return response;
      },
    },
  };
});
