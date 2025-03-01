import { GET, POST } from "./route";
import {
  createTestCategory,
  cleanupDatabase,
  logDatabaseState,
} from "@/lib/test/setup";
import { NextRequest } from "next/server";

// Mock the NextRequest class
class MockNextRequest {
  url: string;
  method: string;
  headers: Headers;
  body: string | null;

  constructor(
    url: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: string;
    } = {}
  ) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Headers(options.headers || {});
    this.body = options.body || null;
  }

  json(): Promise<unknown> {
    return Promise.resolve(this.body ? JSON.parse(this.body) : null);
  }
}

// Mock the errorHandler module
jest.mock("@/lib/middleware/errorHandler");

describe("Categories API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await logDatabaseState();
  });

  describe("GET /api/categories", () => {
    it("should return an empty list when no categories exist", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/categories"
      );
      const response = await GET(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toEqual([]);
      expect(data.data.pagination.total).toBe(0);
    });

    it("should return a list of categories with pagination", async () => {
      // Create test categories
      await createTestCategory({
        name: "Category 1",
        description: "Description 1",
      });
      await createTestCategory({
        name: "Category 2",
        description: "Description 2",
      });
      await createTestCategory({
        name: "Category 3",
        description: "Description 3",
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/categories?page=1&limit=2"
      );
      const response = await GET(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories.length).toBe(2);
      expect(data.data.pagination.total).toBe(3);
      expect(data.data.pagination.page).toBe(1);
      expect(data.data.pagination.limit).toBe(2);
      expect(data.data.pagination.totalPages).toBe(2);
    });

    it("should filter categories by search query", async () => {
      // Create test categories
      await createTestCategory({ name: "Apple", description: "Fruit" });
      await createTestCategory({ name: "Banana", description: "Fruit" });
      await createTestCategory({ name: "Carrot", description: "Vegetable" });

      const request = new MockNextRequest(
        "http://localhost:3000/api/categories?searchQuery=fruit"
      );
      const response = await GET(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories.length).toBe(2);
      expect(data.data.categories[0].name).toBe("Apple");
      expect(data.data.categories[1].name).toBe("Banana");
    });
  });

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/categories",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "New Category",
            description: "New Description",
          }),
        }
      );
      const response = await POST(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("New Category");
      expect(data.data.description).toBe("New Description");
      expect(data.data.slug).toBe("new-category");
    });

    it("should validate required fields", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/categories",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const response = await POST(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should prevent duplicate category names", async () => {
      // Create a category first
      await createTestCategory({
        name: "Existing Category",
        description: "Description",
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/categories",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: "Existing Category",
            description: "Another Description",
          }),
        }
      );
      const response = await POST(request as unknown as NextRequest, {
        params: Promise.resolve({}),
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("CONFLICT");
    });
  });
});
