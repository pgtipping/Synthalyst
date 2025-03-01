import { POST } from "./route";
import { hash } from "bcryptjs";

// Mock bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_123"),
}));

// Mock prisma
jest.mock("@/lib/prisma", () => {
  return {
    prisma: global.__mockPrismaClient,
    testPrismaConnection: jest.fn().mockResolvedValue(true),
  };
});

// Mock logger
jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("Auth Signup API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user successfully", async () => {
    // Mock user data
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Mock Prisma user.findUnique to return null (user doesn't exist)
    global.__mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

    // Mock Prisma user.create to return a new user
    global.__mockPrismaClient.user.create.mockResolvedValueOnce({
      id: "user_123",
      name: userData.name,
      email: userData.email,
      createdAt: new Date(),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(201);
    expect(data.message).toBe("User created successfully");
    expect(data.user).toBeDefined();
    expect(data.user.id).toBe("user_123");
    expect(data.user.name).toBe(userData.name);
    expect(data.user.email).toBe(userData.email);

    // Verify bcrypt was called
    expect(hash).toHaveBeenCalledWith(userData.password, 12);

    // Verify Prisma calls
    expect(global.__mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(global.__mockPrismaClient.user.create).toHaveBeenCalledWith({
      data: {
        name: userData.name,
        email: userData.email,
        password: "hashed_password_123",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  });

  it("should return 400 if user already exists", async () => {
    // Mock user data
    const userData = {
      name: "Existing User",
      email: "existing@example.com",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Mock Prisma user.findUnique to return an existing user
    global.__mockPrismaClient.user.findUnique.mockResolvedValueOnce({
      id: "existing_user_123",
      name: userData.name,
      email: userData.email,
      password: "hashed_password",
      createdAt: new Date(),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBe("User already exists");
    expect(data.code).toBe("USER_EXISTS");

    // Verify Prisma calls
    expect(global.__mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(global.__mockPrismaClient.user.create).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails", async () => {
    // Mock invalid user data (missing password)
    const userData = {
      name: "Test User",
      email: "test@example.com",
      // Missing password
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.code).toBe("VALIDATION_ERROR");

    // Verify Prisma calls were not made
    expect(global.__mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    expect(global.__mockPrismaClient.user.create).not.toHaveBeenCalled();
  });

  it("should return 400 if password is too weak", async () => {
    // Mock user data with weak password
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "weak", // Too short and missing uppercase/number
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.code).toBe("VALIDATION_ERROR");

    // Verify Prisma calls were not made
    expect(global.__mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    expect(global.__mockPrismaClient.user.create).not.toHaveBeenCalled();
  });

  it("should return 400 if email is invalid", async () => {
    // Mock user data with invalid email
    const userData = {
      name: "Test User",
      email: "invalid-email",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
    expect(data.code).toBe("VALIDATION_ERROR");

    // Verify Prisma calls were not made
    expect(global.__mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    expect(global.__mockPrismaClient.user.create).not.toHaveBeenCalled();
  });

  it("should return 500 if database connection fails", async () => {
    // Mock database connection failure
    const { testPrismaConnection } = jest.requireMock("@/lib/prisma");
    testPrismaConnection.mockResolvedValueOnce(false);

    // Mock user data
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data.error).toBe("Database connection failed");
    expect(data.code).toBe("DATABASE_CONNECTION_ERROR");

    // Verify Prisma calls were not made
    expect(global.__mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
    expect(global.__mockPrismaClient.user.create).not.toHaveBeenCalled();
  });

  it("should return 500 if user creation fails", async () => {
    // Mock user data
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Mock Prisma user.findUnique to return null (user doesn't exist)
    global.__mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

    // Mock Prisma user.create to throw an error
    global.__mockPrismaClient.user.create.mockRejectedValueOnce(
      new Error("Database error")
    );

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(500);
    expect(data.error).toContain("Failed to create user");
    expect(data.code).toBe("USER_CREATION_ERROR");

    // Verify Prisma calls
    expect(global.__mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(global.__mockPrismaClient.user.create).toHaveBeenCalled();
  });

  it("should return 400 if email is already in use (Prisma P2002 error)", async () => {
    // Mock user data
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "Password123",
    };

    // Mock request
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Mock Prisma user.findUnique to return null (user doesn't exist in initial check)
    global.__mockPrismaClient.user.findUnique.mockResolvedValueOnce(null);

    // Mock Prisma user.create to throw a P2002 error (unique constraint violation)
    const p2002Error = new Error(
      "Unique constraint failed on the fields: (`email`)"
    );
    Object.defineProperty(p2002Error, "code", { value: "P2002" });
    global.__mockPrismaClient.user.create.mockRejectedValueOnce(p2002Error);

    // Call the handler
    const response = await POST(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data.error).toBe("Email already in use");
    expect(data.code).toBe("EMAIL_IN_USE");

    // Verify Prisma calls
    expect(global.__mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });
    expect(global.__mockPrismaClient.user.create).toHaveBeenCalled();
  });
});
