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

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define a comprehensive MockStorage interface
export interface MockStorage {
  categories: Category[];
  users: User[];
  posts: Post[];
  postCategories: PostCategory[];
  templates: Template[];
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

interface FindManyTemplateArgs {
  where?: {
    name?: { contains?: string };
    description?: { contains?: string };
  };
  skip?: number;
  take?: number;
}

interface FindUniqueTemplateArgs {
  where: {
    id: string;
  };
}

interface CreateTemplateArgs {
  data: Omit<Template, "id" | "createdAt" | "updatedAt">;
}

// Define a type for the transaction client
interface TransactionClient {
  post: unknown;
  category: unknown;
  user: unknown;
  template: unknown;
}

// Create a factory function for creating mock Prisma clients
export const createMockPrismaClient = (
  initialData: Partial<MockStorage> = {}
) => {
  // Initialize storage with default empty arrays and merge with initialData
  const storage: MockStorage = {
    categories: [],
    users: [],
    posts: [],
    postCategories: [],
    templates: [],
    ...initialData,
  };

  // Reset the mock storage
  const resetStorage = (): void => {
    storage.categories = initialData.categories || [];
    storage.users = initialData.users || [];
    storage.posts = initialData.posts || [];
    storage.postCategories = initialData.postCategories || [];
    storage.templates = initialData.templates || [];
  };

  // Create the mock client
  const mockClient = {
    category: {
      findMany: jest.fn(async (args: FindManyCategoryArgs = {}) => {
        try {
          let result = [...storage.categories];

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
                posts: storage.postCategories.filter(
                  (pc) => pc.categoryId === category.id
                ).length,
              },
            }));
          }

          return result;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      findFirst: jest.fn(async (args: FindFirstCategoryArgs = {}) => {
        try {
          if (args.where) {
            if (args.where.OR) {
              const conditions = args.where.OR;
              return storage.categories.find((category) =>
                conditions.some(
                  (condition) =>
                    (condition.name && category.name === condition.name) ||
                    (condition.slug && category.slug === condition.slug)
                )
              );
            }
          }
          return null;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      create: jest.fn(async (args: CreateCategoryArgs) => {
        try {
          const newCategory: Category = {
            id: `cat_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...args.data,
          };

          storage.categories.push(newCategory);

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
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      count: jest.fn(async (args: CountCategoryArgs = {}) => {
        try {
          // Apply where filter if provided
          if (args.where) {
            if (args.where.OR) {
              return storage.categories.filter((category) => {
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
          return storage.categories.length;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
    },
    user: {
      findMany: jest.fn(async (args: FindManyUserArgs = {}) => {
        try {
          let result = [...storage.users];

          // Apply where filter if provided
          if (args.where) {
            if (args.where.id) {
              result = result.filter((user) => user.id === args.where?.id);
            }
            if (args.where.email) {
              result = result.filter(
                (user) => user.email === args.where?.email
              );
            }
          }

          // Apply pagination
          if (args.skip !== undefined && args.take !== undefined) {
            result = result.slice(args.skip, args.skip + args.take);
          }

          return result;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      findUnique: jest.fn(async (args: FindUniqueUserArgs) => {
        try {
          if (args.where.id) {
            return (
              storage.users.find((user) => user.id === args.where.id) || null
            );
          }
          if (args.where.email) {
            return (
              storage.users.find((user) => user.email === args.where.email) ||
              null
            );
          }
          return null;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      create: jest.fn(async (args: CreateUserArgs) => {
        try {
          const newUser: User = {
            id: `user_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...args.data,
          };
          storage.users.push(newUser);
          return newUser;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
    },
    post: {
      findMany: jest.fn(async (args: FindManyPostArgs = {}) => {
        try {
          let result = [...storage.posts];

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
                enrichedPost.author = storage.users.find(
                  (user) => user.id === post.authorId
                );
              }

              if (args.include?.categories) {
                enrichedPost.categories = storage.categories.filter(
                  (category) =>
                    storage.postCategories.some(
                      (pc) =>
                        pc.postId === post.id && pc.categoryId === category.id
                    )
                );
              }

              return enrichedPost;
            });
          }

          return result;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      create: jest.fn(async (args: CreatePostArgs) => {
        try {
          const newPost: Post = {
            id: `post_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...args.data,
          };
          storage.posts.push(newPost);

          // Handle categories connection
          if (args.data.categories?.connect) {
            args.data.categories.connect.forEach((category) => {
              storage.postCategories.push({
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
              result.author = storage.users.find(
                (user) => user.id === newPost.authorId
              );
            }

            if (args.include.categories) {
              result.categories = storage.categories.filter((category) =>
                storage.postCategories.some(
                  (pc) =>
                    pc.postId === newPost.id && pc.categoryId === category.id
                )
              );
            }

            return result;
          }

          return newPost;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
    },
    template: {
      findMany: jest.fn(async (args: FindManyTemplateArgs = {}) => {
        try {
          let result = [...storage.templates];

          // Apply where filter if provided
          if (args.where) {
            if (args.where.name?.contains) {
              const nameContains = args.where.name.contains;
              result = result.filter((template) =>
                template.name.toLowerCase().includes(nameContains.toLowerCase())
              );
            }
            if (args.where.description?.contains) {
              const descContains = args.where.description.contains;
              result = result.filter((template) =>
                template.description
                  .toLowerCase()
                  .includes(descContains.toLowerCase())
              );
            }
          }

          // Apply pagination
          if (args.skip !== undefined && args.take !== undefined) {
            result = result.slice(args.skip, args.skip + args.take);
          }

          return result;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      findUnique: jest.fn(async (args: FindUniqueTemplateArgs) => {
        try {
          return (
            storage.templates.find(
              (template) => template.id === args.where.id
            ) || null
          );
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
      create: jest.fn(async (args: CreateTemplateArgs) => {
        try {
          const newTemplate: Template = {
            id: `template_${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...args.data,
          };
          storage.templates.push(newTemplate);
          return newTemplate;
        } catch (error) {
          console.error("Mock Prisma operation failed:", error);
          throw error;
        }
      }),
    },
    $transaction: jest.fn(
      async <T>(
        callback: (prisma: TransactionClient) => Promise<T>
      ): Promise<T> => {
        try {
          return callback({
            post: mockClient.post,
            category: mockClient.category,
            user: mockClient.user,
            template: mockClient.template,
          });
        } catch (error) {
          console.error("Mock Prisma transaction failed:", error);
          throw error;
        }
      }
    ),
    $executeRawUnsafe: jest.fn(async (): Promise<null> => {
      try {
        // Mock implementation for database cleanup
        resetStorage();
        return null;
      } catch (error) {
        console.error("Mock Prisma operation failed:", error);
        throw error;
      }
    }),
    $disconnect: jest.fn(async (): Promise<void> => {
      // No-op for mock
    }),
    $queryRaw: jest.fn(async (): Promise<Array<{ 1: number }>> => {
      try {
        // Mock implementation for connection test
        return [{ 1: 1 }];
      } catch (error) {
        console.error("Mock Prisma operation failed:", error);
        throw error;
      }
    }),
  } as unknown as PrismaClient;

  return mockClient;
};

// For backward compatibility
export const mockPrismaClient = createMockPrismaClient();
export function resetMockStorage(): void {
  // This is kept for backward compatibility
  // In new tests, use the createMockPrismaClient function instead
  (
    mockPrismaClient as unknown as { $executeRawUnsafe: () => Promise<null> }
  ).$executeRawUnsafe();
}

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

// Export a function to get the mock client (for backward compatibility)
export function getMockPrismaClient(): PrismaClient {
  return mockPrismaClient;
}
