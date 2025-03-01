import { PrismaClient } from "@prisma/client";

async function testAccountTable() {
  const prisma = new PrismaClient();

  try {
    console.log("Testing Account table existence...");

    // Try to query the Account table
    const result = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'Account'
      );
    `;

    console.log("Account table exists check result:", result);

    // Try to count records in the Account table
    try {
      const countResult =
        await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Account"`;
      console.log(
        `✅ Account table exists and has ${
          (countResult as any)[0].count
        } records`
      );
    } catch (error) {
      console.error("❌ Error counting Account records:", error);
    }
  } catch (error) {
    console.error("❌ Error checking Account table:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAccountTable()
  .then(() => console.log("Account table test completed"))
  .catch((error) => console.error("Account table test failed:", error));
