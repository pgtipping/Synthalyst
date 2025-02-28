import "@testing-library/jest-dom";
import { cleanupDatabase } from "./setup";

// Define types for our mocks
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
}

interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
}

beforeEach(async () => {
  await cleanupDatabase();
});

// Mock Next.js response utilities
jest.mock("next/server", () => {
  class MockNextRequest {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: unknown;
    nextUrl: URL;

    constructor(input: string | URL | Request, init: RequestInit = {}) {
      this.url = typeof input === "string" ? input : input.toString();
      this.method = init.method || "GET";
      this.headers = init.headers || {};
      this.body = init.body;
      this.nextUrl = new URL(this.url);
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    clone() {
      return new MockNextRequest(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
      });
    }
  }

  class MockNextResponse extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit) {
      super(body, init);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (data: unknown, init: ResponseInit = {}) => {
        const responseInit = {
          status: init.status || 200,
          statusText: init.statusText || "",
          headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
          },
        };

        return new MockNextResponse(JSON.stringify(data), responseInit);
      },
    },
  };
});
