import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    const testEmail = "test@example.com";

    // Check if test user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    if (existingUser) {
      console.log("Test user already exists!");
      console.log("Login credentials:");
      console.log("Email:", existingUser.email);
      console.log("Password: testpassword123");
      console.log("User details:", {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      });
      return;
    }

    // Create a new test user only if it doesn't exist
    const hashedPassword = await hash("testpassword123", 12);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: "Test User",
        password: hashedPassword,
        emailVerified: new Date(),
        role: "user",
      },
    });

    console.log("Test user created successfully!");
    console.log("Login credentials:");
    console.log("Email:", user.email);
    console.log("Password: testpassword123");
    console.log("User details:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Error managing test user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
