import { prisma } from "../prisma";
import {
  cleanupDatabase,
  createTestUser,
  createTestCategory,
  createTestPost,
  logDatabaseState,
} from "./setup";

describe("Database Stress Tests", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await logDatabaseState();
  });

  it("should handle concurrent post creations without deadlocks", async () => {
    // Create base test data
    const user = await createTestUser();
    const category = await createTestCategory();

    // Create multiple posts concurrently
    const numberOfPosts = 10;
    const postPromises = Array.from({ length: numberOfPosts }).map((_, index) =>
      createTestPost(user.id, {
        title: `Concurrent Post ${index}`,
        categoryIds: [category.id],
      })
    );

    // Wait for all posts to be created
    const posts = await Promise.all(postPromises);

    // Verify all posts were created
    expect(posts).toHaveLength(numberOfPosts);
    posts.forEach((post) => {
      expect(post.author.id).toBe(user.id);
      expect(post.categories[0].id).toBe(category.id);
    });
  });

  it("should handle concurrent database cleanups without deadlocks", async () => {
    // Create test data
    const user = await createTestUser();
    const category = await createTestCategory();
    await createTestPost(user.id, {
      title: "Test Post",
      categoryIds: [category.id],
    });

    // Attempt multiple concurrent cleanups
    const numberOfCleanups = 5;
    const cleanupPromises = Array.from({ length: numberOfCleanups }).map(() =>
      cleanupDatabase()
    );

    // All cleanups should complete without errors
    await expect(Promise.all(cleanupPromises)).resolves.not.toThrow();

    // Verify database is empty
    const users = await prisma.user.count();
    const categories = await prisma.category.count();
    const posts = await prisma.post.count();

    expect(users).toBe(0);
    expect(categories).toBe(0);
    expect(posts).toBe(0);
  });

  it("should handle rapid sequential operations without deadlocks", async () => {
    // Create and delete entities rapidly
    for (let i = 0; i < 5; i++) {
      // Create entities
      const user = await createTestUser({
        email: `user${i}@test.com`,
        name: `User ${i}`,
      });
      const category = await createTestCategory({
        name: `Category ${i}`,
      });
      await createTestPost(user.id, {
        title: `Post ${i}`,
        categoryIds: [category.id],
      });

      // Immediately cleanup
      await cleanupDatabase();

      // Verify cleanup
      const counts = await prisma.$transaction([
        prisma.user.count(),
        prisma.category.count(),
        prisma.post.count(),
      ]);

      expect(counts).toEqual([0, 0, 0]);
    }
  });

  it("should handle concurrent entity creations with relationships", async () => {
    // Create base user
    const user = await createTestUser();

    // Create categories and posts concurrently
    const operations = Array.from({ length: 5 }).map(async (_, index) => {
      // Create category
      const category = await createTestCategory({
        name: `Concurrent Category ${index}`,
      });

      // Create multiple posts for this category
      const posts = await Promise.all(
        Array.from({ length: 3 }).map((_, postIndex) =>
          createTestPost(user.id, {
            title: `Post ${index}-${postIndex}`,
            categoryIds: [category.id],
          })
        )
      );

      return { category, posts };
    });

    // Wait for all operations to complete
    const results = await Promise.all(operations);

    // Verify results
    expect(results).toHaveLength(5);
    results.forEach(({ category, posts }) => {
      expect(posts).toHaveLength(3);
      posts.forEach((post) => {
        expect(post.categories[0].id).toBe(category.id);
        expect(post.author.id).toBe(user.id);
      });
    });
  });
});
