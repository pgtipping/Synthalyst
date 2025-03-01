import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import "@testing-library/jest-dom";
import { PrismaClient } from "@prisma/client";

// Access the global mock Prisma client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockPrismaClient = (global as any).__mockPrismaClient as PrismaClient;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetMockStorage = (global as any).__resetMockStorage as () => void;

describe("Posts API", () => {
  beforeEach(() => {
    // Reset the mock storage before each test
    if (resetMockStorage) {
      resetMockStorage();
    }
    jest.clearAllMocks();
  });

  describe("GET /api/posts", () => {
    it("should return empty list when no posts exist", async () => {
      const req = new NextRequest("http://localhost:3000/api/posts");
      const response = await GET(req, { params: {} as any });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(0);
      expect(data.data.pagination.total).toBe(0);
    });

    it("should return list of posts with pagination", async () => {
      // Create test user and category first
      const user = await mockPrismaClient.user.create({
        data: {
          id: "user1",
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const category = await mockPrismaClient.category.create({
        data: {
          id: "cat1",
          name: "Test Category",
          slug: "test-category",
          description: "Test Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create multiple posts sequentially
      await mockPrismaClient.post.create({
        data: {
          id: "post1",
          title: "First Post",
          slug: "first-post",
          content: "First post content",
          published: true,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Add category to post using a direct update to the storage
      // Since postCategory is not directly exposed in the PrismaClient type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrismaClient as any)._storage.postCategories.push({
        postId: "post1",
        categoryId: category.id,
      });

      await mockPrismaClient.post.create({
        data: {
          id: "post2",
          title: "Second Post",
          slug: "second-post",
          content: "Second post content",
          published: true,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Add category to post using a direct update to the storage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrismaClient as any)._storage.postCategories.push({
        postId: "post2",
        categoryId: category.id,
      });

      const req = new NextRequest("http://localhost:3000/api/posts");
      const response = await GET(req, { params: {} as any });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(2);
      expect(data.data.pagination.total).toBe(2);
    });

    it("should filter posts by category", async () => {
      // Create test user and categories first
      const user = await mockPrismaClient.user.create({
        data: {
          id: "user1",
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const category1 = await mockPrismaClient.category.create({
        data: {
          id: "cat1",
          name: "Category 1",
          slug: "category-1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const category2 = await mockPrismaClient.category.create({
        data: {
          id: "cat2",
          name: "Category 2",
          slug: "category-2",
          description: "Description 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create posts in different categories
      await mockPrismaClient.post.create({
        data: {
          id: "post1",
          title: "Post in Category 1",
          slug: "post-in-category-1",
          content: "Post content",
          published: true,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Add category to post using a direct update to the storage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrismaClient as any)._storage.postCategories.push({
        postId: "post1",
        categoryId: category1.id,
      });

      await mockPrismaClient.post.create({
        data: {
          id: "post2",
          title: "Post in Category 2",
          slug: "post-in-category-2",
          content: "Post content",
          published: true,
          authorId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Add category to post using a direct update to the storage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockPrismaClient as any)._storage.postCategories.push({
        postId: "post2",
        categoryId: category2.id,
      });

      const req = new NextRequest(
        `http://localhost:3000/api/posts?categoryId=${category1.id}`
      );
      const response = await GET(req, { params: {} as any });
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
      const user = await mockPrismaClient.user.create({
        data: {
          id: "user1",
          name: "Test User",
          email: "test@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const category = await mockPrismaClient.category.create({
        data: {
          id: "cat1",
          name: "Test Category",
          slug: "test-category",
          description: "Test Description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const req = new NextRequest("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          title: "New Post",
          content: "Post content",
          authorEmail: user.email,
          categoryIds: [category.id],
        }),
      });

      const response = await POST(req, { params: {} as any });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.post.title).toBe("New Post");
      expect(data.data.post.content).toBe("Post content");
      expect(data.data.post.author.email).toBe(user.email);
      expect(data.data.post.categories).toHaveLength(1);
      expect(data.data.post.categories[0].id).toBe(category.id);
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
  });
});
