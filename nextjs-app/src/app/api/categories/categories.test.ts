import { NextRequest } from "next/server";
import {
  createTestCategory,
  cleanupDatabase,
  logDatabaseState,
} from "@/lib/test/setup";
import { GET, POST } from "./route";
import "@testing-library/jest-dom";

describe("Categories API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await logDatabaseState();
  });

  describe("GET /api/categories", () => {
    it("should return empty list when no categories exist", async () => {
      const req = new NextRequest("http://localhost:3000/api/categories");
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toHaveLength(0);
      expect(data.data.pagination.total).toBe(0);
    });

    it("should return list of categories with pagination", async () => {
      // Create multiple categories sequentially to avoid race conditions
      await createTestCategory({
        name: "First Category",
        description: "First category description",
      });
      await createTestCategory({
        name: "Second Category",
        description: "Second category description",
      });

      const req = new NextRequest("http://localhost:3000/api/categories");
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toHaveLength(2);
      expect(data.data.pagination.total).toBe(2);
      expect(data.data.categories[0]._count).toBeDefined();
      expect(data.data.categories[0]._count.posts).toBeDefined();
    });

    it("should filter categories by search query", async () => {
      await Promise.all([
        createTestCategory({
          name: "Development",
          description: "Programming and software development",
        }),
        createTestCategory({
          name: "Business",
          description: "Business and entrepreneurship",
        }),
      ]);

      const req = new NextRequest(
        "http://localhost:3000/api/categories?searchQuery=development"
      );
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toHaveLength(1);
      expect(data.data.categories[0].name).toBe("Development");
    });
  });

  describe("POST /api/categories", () => {
    it("should create a new category", async () => {
      const req = new NextRequest("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "New Category",
          description: "A test category",
        }),
      });

      const response = await POST(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe("New Category");
      expect(data.data.slug).toBe("new-category");
      expect(data.data.description).toBe("A test category");
      expect(data.data._count.posts).toBe(0);
    });

    it("should validate required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const response = await POST(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("VALIDATION_ERROR");
    });

    it("should prevent duplicate category names", async () => {
      await createTestCategory({ name: "Existing Category" });

      const req = new NextRequest("http://localhost:3000/api/categories", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Existing Category",
          description: "This should fail",
        }),
      });

      const response = await POST(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe("CONFLICT");
    });
  });
});
