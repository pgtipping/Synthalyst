// Test database connection script
import { PrismaClient } from "@prisma/client";

async function testDatabaseConnection(): Promise<void> {
  console.log("Testing database connection...");
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  try {
    // Test basic connection
    console.log("Testing basic connection...");
    await prisma.$queryRaw`SELECT 1 as result`;
    console.log("✅ Basic connection successful");

    // Test user table access
    console.log("Testing user table access...");
    const userCount = await prisma.user.count();
    console.log(`✅ User table access successful. Total users: ${userCount}`);

    // Test a simple user creation and deletion
    console.log("Testing user creation...");
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: "TestPassword123",
      },
    });
    console.log(`✅ User creation successful. User ID: ${testUser.id}`);

    // Delete the test user
    console.log("Testing user deletion...");
    await prisma.user.delete({
      where: {
        id: testUser.id,
      },
    });
    console.log("✅ User deletion successful");

    console.log("All database tests passed successfully! ✅");
  } catch (error: unknown) {
    console.error("❌ Database connection test failed:");
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );

    if (error && typeof error === "object" && "code" in error) {
      console.error("Error code:", error.code);
    }

    if (error && typeof error === "object" && "meta" in error) {
      console.error("Error metadata:", error.meta);
    }

    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace available"
    );
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection()
  .then(() => {
    console.log("Database connection test completed.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      "Unhandled error in test script:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
