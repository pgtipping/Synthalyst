import { GET, POST } from "./route";
import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

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

// Access the global mock Prisma client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrismaClient = (global as any).__mockPrismaClient as PrismaClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetMockStorage = (global as any).__resetMockStorage as () => void;

describe("Categories API", () => {
  beforeEach(() => {
    // Reset the mock storage before each test
    if (resetMockStorage) {
      resetMockStorage();
    }
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("should return an empty list when no categories exist", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/categories"
      );
      const response = await GET(request as unknown as NextRequest, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toEqual([]);
      expect(data.data.pagination.total).toBe(0);
    });

    it("should return a list of categories with pagination", async () => {
      // Create test categories using the mock Prisma client
      await mockPrismaClient.category.create({
        data: {
          id: "cat1",
          name: "Category 1",
          slug: "category-1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await mockPrismaClient.category.create({
        data: {
          id: "cat2",
          name: "Category 2",
          slug: "category-2",
          description: "Description 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await mockPrismaClient.category.create({
        data: {
          id: "cat3",
          name: "Category 3",
          slug: "category-3",
          description: "Description 3",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/categories?page=1&limit=2"
      );
      const response = await GET(request as unknown as NextRequest, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
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
      // Create test categories using the mock Prisma client
      await mockPrismaClient.category.create({
        data: {
          id: "apple",
          name: "Apple",
          slug: "apple",
          description: "Fruit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await mockPrismaClient.category.create({
        data: {
          id: "banana",
          name: "Banana",
          slug: "banana",
          description: "Fruit",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await mockPrismaClient.category.create({
        data: {
          id: "carrot",
          name: "Carrot",
          slug: "carrot",
          description: "Vegetable",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const request = new MockNextRequest(
        "http://localhost:3000/api/categories?search=app"
      );
      const response = await GET(request as unknown as NextRequest, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories.length).toBe(1);
      expect(data.data.categories[0].name).toBe("Apple");
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.category.name).toBe("New Category");
      expect(data.data.category.description).toBe("New Description");
      expect(data.data.category.slug).toBe("new-category");
    });

    it("should return 400 if name is missing", async () => {
      const request = new MockNextRequest(
        "http://localhost:3000/api/categories",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            description: "New Description",
          }),
        }
      );
      const response = await POST(request as unknown as NextRequest, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
      });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeTruthy();
    });

    it("should return 409 if category with same name already exists", async () => {
      // Create a category first
      await mockPrismaClient.category.create({
        data: {
          id: "existing",
          name: "Existing Category",
          slug: "existing-category",
          description: "Existing Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
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
            description: "New Description",
          }),
        }
      );
      const response = await POST(request as unknown as NextRequest, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: Promise.resolve({}) as any,
      });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBeTruthy();
    });
  });
});
