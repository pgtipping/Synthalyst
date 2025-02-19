import { NextRequest } from "next/server";
import {
  createTestUser,
  createTestCategory,
  createTestPost,
  cleanupDatabase,
  logDatabaseState,
} from "@/lib/test/setup";
import { GET, POST } from "./route";
import "@testing-library/jest-dom";

describe("Posts API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await logDatabaseState();
  });

  describe("GET /api/posts", () => {
    it("should return empty list when no posts exist", async () => {
      const req = new NextRequest("http://localhost:3000/api/posts");
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(0);
      expect(data.data.pagination.total).toBe(0);
    });

    it("should return list of posts with pagination", async () => {
      // Create test user and category first
      const user = await createTestUser();
      const category = await createTestCategory();

      // Create multiple posts sequentially
      await createTestPost(user.id, {
        title: "First Post",
        categoryIds: [category.id],
      });
      await createTestPost(user.id, {
        title: "Second Post",
        categoryIds: [category.id],
      });

      const req = new NextRequest("http://localhost:3000/api/posts");
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(2);
      expect(data.data.pagination.total).toBe(2);
    });

    it("should filter posts by category", async () => {
      // Create test user and categories first
      const user = await createTestUser();
      const category1 = await createTestCategory({ name: "Category 1" });
      const category2 = await createTestCategory({ name: "Category 2" });

      // Create posts in different categories
      await createTestPost(user.id, {
        title: "Post in Category 1",
        categoryIds: [category1.id],
      });
      await createTestPost(user.id, {
        title: "Post in Category 2",
        categoryIds: [category2.id],
      });

      const req = new NextRequest(
        `http://localhost:3000/api/posts?categoryId=${category1.id}`
      );
      const response = await GET(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(1);
      expect(data.data.posts[0].categories[0].id).toBe(category1.id);
    });
  });

  describe("POST /api/posts", () => {
    it("should create a new post", async () => {
      // Create test user and category first
      const user = await createTestUser();
      const category = await createTestCategory();

      const req = new NextRequest("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: "New Post",
          content: "Post content",
          categoryIds: [category.id],
          published: true,
          authorId: user.id,
        }),
      });

      const response = await POST(req, { params: {} });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe("New Post");
      expect(data.data.slug).toBe("new-post");
      expect(data.data.categories).toHaveLength(1);
      expect(data.data.categories[0].id).toBe(category.id);
    });

    it("should validate required fields", async () => {
      const req = new NextRequest("http://localhost:3000/api/posts", {
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

    it("should prevent duplicate slugs", async () => {
      // Create test user first
      const user = await createTestUser();
      await createTestPost(user.id, { title: "Existing Post" });

      const req = new NextRequest("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: "Existing Post",
          content: "New content",
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
