// Test production database connection script
import { PrismaClient } from "@prisma/client";

async function testProductionDatabaseConnection(): Promise<void> {
  console.log("Testing PRODUCTION database connection...");

  // Use the production database URL from environment variables
  const databaseUrl =
    process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  console.log(
    "Using database URL:",
    databaseUrl ? `${databaseUrl.substring(0, 20)}...` : "Not set"
  );

  if (!databaseUrl) {
    console.error("❌ No database URL found in environment variables");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
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

    console.log("All production database tests passed successfully! ✅");
  } catch (error: unknown) {
    console.error("❌ Production database connection test failed:");
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

testProductionDatabaseConnection()
  .then(() => {
    console.log("Production database connection test completed.");
    process.exit(0);
  })
  .catch((error: unknown) => {
    console.error(
      "Unhandled error in test script:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  });
