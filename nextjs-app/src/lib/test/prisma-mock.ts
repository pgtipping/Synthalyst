// Mock implementation of Prisma client for testing
import { PrismaClient } from "@prisma/client";

// Define interfaces for mock data
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  categories?: Category[];
}

interface PostCategory {
  postId: string;
  categoryId: string;
}

// Define interfaces for method parameters
interface FindManyCategoryArgs {
  where?: {
    OR?: Array<{
      name?: { contains?: string };
      description?: { contains?: string };
    }>;
  };
  skip?: number;
  take?: number;
  include?: {
    _count?: {
      select?: {
        posts?: boolean;
      };
    };
  };
}

interface FindFirstCategoryArgs {
  where?: {
    OR?: Array<{
      name?: string;
      slug?: string;
    }>;
  };
}

interface CreateCategoryArgs {
  data: Omit<Category, "id" | "createdAt" | "updatedAt">;
  include?: {
    _count?: {
      select?: {
        posts?: boolean;
      };
    };
  };
}

interface CountCategoryArgs {
  where?: {
    OR?: Array<{
      name?: { contains?: string };
      description?: { contains?: string };
    }>;
  };
}

interface FindManyUserArgs {
  where?: {
    id?: string;
    email?: string;
  };
  skip?: number;
  take?: number;
}

interface FindUniqueUserArgs {
  where: {
    id?: string;
    email?: string;
  };
}

interface CreateUserArgs {
  data: Omit<User, "id" | "createdAt" | "updatedAt">;
}

interface FindManyPostArgs {
  where?: {
    authorId?: string;
    published?: boolean;
  };
  skip?: number;
  take?: number;
  include?: {
    author?: boolean;
    categories?: boolean;
  };
}

interface CreatePostArgs {
  data: Omit<Post, "id" | "createdAt" | "updatedAt"> & {
    categories?: {
      connect: Array<{ id: string }>;
    };
  };
  include?: {
    author?: boolean;
    categories?: boolean;
  };
}

// Define a type for the transaction client
interface TransactionClient {
  post: typeof mockPrismaClient.post;
  category: typeof mockPrismaClient.category;
  user: typeof mockPrismaClient.user;
}

// In-memory storage for mock data
const mockStorage: {
  categories: Category[];
  users: User[];
  posts: Post[];
  postCategories: PostCategory[];
} = {
  categories: [],
  users: [],
  posts: [],
  postCategories: [],
};

// Reset the mock storage
export function resetMockStorage(): void {
  mockStorage.categories = [];
  mockStorage.users = [];
  mockStorage.posts = [];
  mockStorage.postCategories = [];
}

// Create a mock Prisma client
export const mockPrismaClient = {
  category: {
    findMany: jest.fn(async (args: FindManyCategoryArgs = {}) => {
      let result = [...mockStorage.categories];

      // Apply where filter if provided
      if (args.where) {
        if (args.where.OR) {
          result = result.filter((category) => {
            return args.where?.OR?.some((condition) => {
              if (condition.name?.contains) {
                return category.name
                  .toLowerCase()
                  .includes(condition.name.contains.toLowerCase());
              }
              if (condition.description?.contains) {
                return category.description
                  .toLowerCase()
                  .includes(condition.description.contains.toLowerCase());
              }
              return false;
            });
          });
        }
      }

      // Apply pagination
      if (args.skip !== undefined && args.take !== undefined) {
        result = result.slice(args.skip, args.skip + args.take);
      }

      // Apply include
      if (args.include?._count?.select?.posts) {
        result = result.map((category) => ({
          ...category,
          _count: {
            posts: mockStorage.postCategories.filter(
              (pc) => pc.categoryId === category.id
            ).length,
          },
        }));
      }

      return result;
    }),
    findFirst: jest.fn(async (args: FindFirstCategoryArgs = {}) => {
      if (args.where) {
        if (args.where.OR) {
          const conditions = args.where.OR;
          return mockStorage.categories.find((category) =>
            conditions.some(
              (condition) =>
                (condition.name && category.name === condition.name) ||
                (condition.slug && category.slug === condition.slug)
            )
          );
        }
      }
      return null;
    }),
    create: jest.fn(async (args: CreateCategoryArgs) => {
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };

      mockStorage.categories.push(newCategory);

      // Apply include
      if (args.include?._count?.select?.posts) {
        return {
          ...newCategory,
          _count: {
            posts: 0, // New category has no posts
          },
        };
      }

      return newCategory;
    }),
    count: jest.fn(async (args: CountCategoryArgs = {}) => {
      // Apply where filter if provided
      if (args.where) {
        if (args.where.OR) {
          return mockStorage.categories.filter((category) => {
            return args.where?.OR?.some((condition) => {
              if (condition.name?.contains) {
                return category.name
                  .toLowerCase()
                  .includes(condition.name.contains.toLowerCase());
              }
              if (condition.description?.contains) {
                return category.description
                  .toLowerCase()
                  .includes(condition.description.contains.toLowerCase());
              }
              return false;
            });
          }).length;
        }
      }
      return mockStorage.categories.length;
    }),
  },
  user: {
    findMany: jest.fn(async (args: FindManyUserArgs = {}) => {
      let result = [...mockStorage.users];

      // Apply where filter if provided
      if (args.where) {
        if (args.where.id) {
          result = result.filter((user) => user.id === args.where?.id);
        }
        if (args.where.email) {
          result = result.filter((user) => user.email === args.where?.email);
        }
      }

      // Apply pagination
      if (args.skip !== undefined && args.take !== undefined) {
        result = result.slice(args.skip, args.skip + args.take);
      }

      return result;
    }),
    findUnique: jest.fn(async (args: FindUniqueUserArgs) => {
      if (args.where.id) {
        return (
          mockStorage.users.find((user) => user.id === args.where.id) || null
        );
      }
      if (args.where.email) {
        return (
          mockStorage.users.find((user) => user.email === args.where.email) ||
          null
        );
      }
      return null;
    }),
    create: jest.fn(async (args: CreateUserArgs) => {
      const newUser: User = {
        id: `user_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      mockStorage.users.push(newUser);
      return newUser;
    }),
  },
  post: {
    findMany: jest.fn(async (args: FindManyPostArgs = {}) => {
      let result = [...mockStorage.posts];

      // Apply where filter if provided
      if (args.where) {
        if (args.where.authorId) {
          result = result.filter(
            (post) => post.authorId === args.where?.authorId
          );
        }
        if (args.where.published !== undefined) {
          result = result.filter(
            (post) => post.published === args.where?.published
          );
        }
      }

      // Apply pagination
      if (args.skip !== undefined && args.take !== undefined) {
        result = result.slice(args.skip, args.skip + args.take);
      }

      // Apply include
      if (args.include) {
        result = result.map((post) => {
          const enrichedPost = { ...post } as Post & {
            author?: User;
            categories?: Category[];
          };

          if (args.include?.author) {
            enrichedPost.author = mockStorage.users.find(
              (user) => user.id === post.authorId
            );
          }

          if (args.include?.categories) {
            enrichedPost.categories = mockStorage.categories.filter(
              (category) =>
                mockStorage.postCategories.some(
                  (pc) => pc.postId === post.id && pc.categoryId === category.id
                )
            );
          }

          return enrichedPost;
        });
      }

      return result;
    }),
    create: jest.fn(async (args: CreatePostArgs) => {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...args.data,
      };
      mockStorage.posts.push(newPost);

      // Handle categories connection
      if (args.data.categories?.connect) {
        args.data.categories.connect.forEach((category) => {
          mockStorage.postCategories.push({
            postId: newPost.id,
            categoryId: category.id,
          });
        });
      }

      // Apply include
      if (args.include) {
        const result = { ...newPost } as Post & {
          author?: User;
          categories?: Category[];
        };

        if (args.include.author) {
          result.author = mockStorage.users.find(
            (user) => user.id === newPost.authorId
          );
        }

        if (args.include.categories) {
          result.categories = mockStorage.categories.filter((category) =>
            mockStorage.postCategories.some(
              (pc) => pc.postId === newPost.id && pc.categoryId === category.id
            )
          );
        }

        return result;
      }

      return newPost;
    }),
  },
  $transaction: jest.fn(
    async <T>(
      callback: (prisma: TransactionClient) => Promise<T>
    ): Promise<T> => {
      return callback({
        post: mockPrismaClient.post,
        category: mockPrismaClient.category,
        user: mockPrismaClient.user,
      });
    }
  ),
  $executeRawUnsafe: jest.fn(async (): Promise<null> => {
    // Mock implementation for database cleanup
    resetMockStorage();
    return null;
  }),
  $disconnect: jest.fn(async (): Promise<void> => {
    // No-op for mock
  }),
  $queryRaw: jest.fn(async (): Promise<Array<{ 1: number }>> => {
    // Mock implementation for connection test
    return [{ 1: 1 }];
  }),
} as unknown as PrismaClient;

// Mock Prisma namespace for error handling
export const Prisma = {
  PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    clientVersion: string;

    constructor(
      message: string,
      {
        code,
        clientVersion,
        meta,
      }: { code: string; clientVersion: string; meta?: Record<string, unknown> }
    ) {
      super(message);
      this.name = "PrismaClientKnownRequestError";
      this.code = code;
      this.clientVersion = clientVersion;
      this.meta = meta;
    }
  },
  PrismaClientValidationError: class PrismaClientValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "PrismaClientValidationError";
    }
  },
};

// Export a function to get the mock client
export function getMockPrismaClient(): PrismaClient {
  return mockPrismaClient;
}
