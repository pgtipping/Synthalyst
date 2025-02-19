import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

async function testLogin() {
  const testEmail = "test@example.com";
  const testPassword = "testpassword123";

  try {
    console.log("1. Attempting to find user...");
    const user = await prisma.user.findUnique({
      where: { email: testEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
      },
    });

    console.log("User query result:", user);

    if (!user || !user.password) {
      throw new Error("No user found with this email");
    }

    console.log("\n2. User found, comparing passwords...");
    const isValid = await compare(testPassword, user.password);
    console.log("Password comparison result:", isValid);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    console.log("\n3. Login successful!");
    console.log("User details:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("\nLogin test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
