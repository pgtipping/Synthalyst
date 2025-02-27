const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function createTestUser() {
  const prisma = new PrismaClient();

  try {
    console.log("Creating test user...");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    if (existingUser) {
      console.log("Test user already exists:", existingUser.id);
      return existingUser;
    }

    // Create new user
    const hashedPassword = await bcrypt.hash("Test123!", 10);

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("Test user created successfully!");
    console.log("ID:", user.id);
    console.log("Email:", user.email);
    console.log("Password: Test123!");

    return user;
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
