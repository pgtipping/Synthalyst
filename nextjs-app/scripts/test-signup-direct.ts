import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

async function testSignupDirect() {
  console.log("Starting direct signup test...");

  try {
    // Test database connection
    console.log("Testing database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");

    // Generate test user data
    const testEmail = `test-${Date.now()}@example.com`;
    const testName = "Test User";
    const testPassword = await hash("TestPassword123", 12);

    console.log(`Creating test user with email: ${testEmail}`);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (existingUser) {
      console.log("❌ User already exists");
      return;
    }

    // Create user directly using Prisma
    const user = await prisma.user.create({
      data: {
        name: testName,
        email: testEmail,
        password: testPassword,
      },
    });

    console.log("✅ User created successfully:", {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    // Clean up - delete the test user
    console.log("Cleaning up - deleting test user...");
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("✅ Test user deleted successfully");
  } catch (error) {
    console.error("❌ Error during direct signup test:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      // Log additional details for Prisma errors
      if (
        error.name === "PrismaClientKnownRequestError" ||
        error.name === "PrismaClientUnknownRequestError" ||
        error.name === "PrismaClientRustPanicError" ||
        error.name === "PrismaClientInitializationError" ||
        error.name === "PrismaClientValidationError"
      ) {
        // @ts-expect-error - Accessing Prisma-specific properties
        console.error("Prisma error code:", error.code);
        // @ts-expect-error - Accessing Prisma-specific properties
        console.error("Prisma error meta:", error.meta);
      }
    }
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
  }
}

// Run the test
testSignupDirect()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
