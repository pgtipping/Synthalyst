import { PrismaClient } from "@prisma/client";

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testUserQuery() {
  console.log("Testing user query in production database...");

  try {
    // Test database connection
    console.log("Testing database connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful");

    // Generate test email
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`Testing query for email: ${testEmail}`);

    // Test the exact query used in the signup route
    console.log("Executing findUnique query...");
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    console.log("Query result:", existingUser);
    console.log("✅ User query successful");

    // Test user creation
    console.log("Testing user creation...");
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: testEmail,
        password: "hashedpassword",
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log("✅ User created successfully:", user);

    // Clean up - delete the test user
    console.log("Cleaning up - deleting test user...");
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log("✅ Test user deleted successfully");
  } catch (error) {
    console.error("❌ Error during user query test:", error);

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
testUserQuery()
  .then(() => {
    console.log("Test completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error:", error);
    process.exit(1);
  });
