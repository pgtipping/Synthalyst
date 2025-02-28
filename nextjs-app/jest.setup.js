import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";

// Enable fetch mocks
enableFetchMocks();

// Define global Request and Response if they don't exist
if (typeof global.Request === "undefined") {
  global.Request = class MockRequest {
    constructor(input, init = {}) {
      this.url = input;
      this.method = init.method || "GET";
      this.headers = init.headers || {};
      this.body = init.body;
    }

    clone() {
      return new Request(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
      });
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class MockResponse {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || "";
      this.headers = init.headers || {};
      this.ok = this.status >= 200 && this.status < 300;
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === "string"
        ? this.body
        : JSON.stringify(this.body);
    }
  };
}

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
}));

// Mock next/server
jest.mock("next/server", () => {
  class MockNextRequest {
    constructor(input, init = {}) {
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
    constructor(body, init = {}) {
      super(body, init);
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: {
      json: (data, init = {}) => {
        const responseInit = {
          status: init.status || 200,
          statusText: init.statusText || "",
          headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
          },
        };

        const response = new MockNextResponse(
          JSON.stringify(data),
          responseInit
        );

        // Ensure the response has a json method
        response.json = async () => data;

        return response;
      },
    },
  };
});
