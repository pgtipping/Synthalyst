import { prisma } from "../prisma";
import { hash } from "bcryptjs";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cleanupDatabaseWithRetry(maxRetries = 3, retryDelay = 1000) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Database cleanup attempt ${attempt}/${maxRetries}...`);

      // First, terminate all other connections to prevent deadlocks
      await prisma.$executeRawUnsafe(`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = current_database()
          AND pid <> pg_backend_pid()
          AND state = 'idle';
      `);

      // Get tables in proper order (children first, then parents)
      const tableOrder = [
        "Post_categories", // Junction table first
        "Post",
        "Category",
        "User",
      ];

      // Delete from each table in order
      for (const table of tableOrder) {
        try {
          await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
          console.log(`Cleaned table: ${table}`);
        } catch (tableError: unknown) {
          console.error(`Error cleaning table ${table}:`, tableError);
          throw tableError;
        }
      }

      console.log("Database cleanup completed successfully");
      return;
    } catch (error: unknown) {
      lastError = error;
      console.error(`Error in cleanup attempt ${attempt}:`, error);

      // Add specific handling for deadlock errors
      const prismaError = error as { code?: string };
      if (prismaError.code === "40P01") {
        // Deadlock detected
        console.log("Deadlock detected, waiting longer before retry...");
        await sleep(retryDelay * 2); // Wait longer for deadlocks
      } else if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await sleep(retryDelay);
      }
    }
  }
  throw lastError; // If all retries failed, throw the last error
}

export async function cleanupDatabase() {
  await cleanupDatabaseWithRetry();
}

export async function createTestUser(
  override: Partial<{ email: string; name: string }> = {}
) {
  const defaultUser = {
    email: "test@example.com",
    name: "Test User",
    ...override,
  };

  try {
    const user = await prisma.user.create({
      data: {
        ...defaultUser,
        emailVerified: new Date(),
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  }
}

export async function createTestCategory(
  override: Partial<{ name: string; description: string }> = {}
) {
  const defaultCategory = {
    name: "Test Category",
    description: "Test category description",
    ...override,
  };

  try {
    const category = await prisma.category.create({
      data: {
        ...defaultCategory,
        slug: defaultCategory.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
    return category;
  } catch (error) {
    console.error("Error creating test category:", error);
    throw error;
  }
}

export async function createTestPost(
  authorId: string,
  override: Partial<{
    title: string;
    content: string;
    published: boolean;
    categoryIds: string[];
  }> = {}
) {
  const { categoryIds, ...postData } = override;

  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!user) {
      throw new Error(
        `User with ID ${authorId} not found. Please create the user first.`
      );
    }

    // Verify categories exist if provided
    if (categoryIds?.length) {
      const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
      });

      if (categories.length !== categoryIds.length) {
        const foundIds = categories.map((c) => c.id);
        const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
        throw new Error(
          `Categories not found: ${missingIds.join(
            ", "
          )}. Please create the categories first.`
        );
      }
    }

    const defaultPost = {
      title: "Test Post",
      content: "Test post content",
      published: true,
      ...postData,
    };

    // Create post in a transaction to ensure atomicity
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          ...defaultPost,
          slug: defaultPost.title.toLowerCase().replace(/\s+/g, "-"),
          authorId,
          ...(categoryIds && {
            categories: {
              connect: categoryIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          author: true,
          categories: true,
        },
      });
      return newPost;
    });

    return post;
  } catch (error) {
    console.error("Error creating test post:", error);
    throw error;
  }
}

export async function logDatabaseState() {
  console.log("\n=== Database State ===");

  // Log users
  const users = await prisma.user.findMany();
  console.log("\nUsers:", users.length);
  users.forEach((user) => console.log(`- ${user.name} (${user.id})`));

  // Log categories
  const categories = await prisma.category.findMany();
  console.log("\nCategories:", categories.length);
  categories.forEach((cat) => console.log(`- ${cat.name} (${cat.id})`));

  // Log posts
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      categories: true,
    },
  });
  console.log("\nPosts:", posts.length);
  posts.forEach((post) => {
    console.log(`- ${post.title} (${post.id})`);
    console.log(`  Author: ${post.author.name}`);
    console.log(
      `  Categories: ${post.categories.map((c) => c.name).join(", ")}`
    );
  });

  console.log("\n===================\n");
}

interface SectionState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

type SectionStateDispatch = React.Dispatch<React.SetStateAction<SectionState>>;
type SectionStateEntry = [SectionState, SectionStateDispatch];

// Retry handlers
const handleRetry = async (
  section: "featured" | "recent" | "popular",
  fetchFn: () => Promise<void>
) => {
  const stateMap: Record<string, SectionStateEntry> = {
    featured: [featuredState, setFeaturedState],
    recent: [recentState, setRecentState],
    popular: [popularState, setPopularState],
  };

  const [state, setState] = stateMap[section];

  if (state.retryCount < MAX_RETRIES) {
    setState((prev: SectionState) => ({
      ...prev,
      retryCount: prev.retryCount + 1,
    }));
    await fetchFn();
  }
};

// Fetch helper with retry logic
const fetchWithRetry = async <T>(url: string, retryCount = 0): Promise<T[]> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Validate data structure
    if (!data?.data?.posts || !Array.isArray(data.data.posts)) {
      throw new Error("Invalid response data structure");
    }

    return data.data.posts as T[];
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await delay(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
      return fetchWithRetry<T>(url, retryCount + 1);
    }
    throw error;
  }
};

export async function createTestUserWithPassword(
  override: Partial<{ email: string; name: string; password: string }> = {}
) {
  const defaultUser = {
    email: "test@example.com",
    name: "Test User",
    password: "testpassword123",
    ...override,
  };

  try {
    const hashedPassword = await hash(defaultUser.password, 12);
    const user = await prisma.user.create({
      data: {
        email: defaultUser.email,
        name: defaultUser.name,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });
    return { user, password: defaultUser.password };
  } catch (error) {
    console.error("Error creating test user:", error);
    throw error;
  }
}
