const { PrismaClient } = require("@prisma/client");

// This script assigns the ADMIN role to a specific user by email
async function main() {
  const prisma = new PrismaClient();

  try {
    // The email address that should have admin privileges
    const adminEmail = "pgtipping1@gmail.com";

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: adminEmail,
      },
    });

    if (!user) {
      console.log(
        `User with email ${adminEmail} not found. They need to sign in at least once before being assigned the admin role.`
      );
      return;
    }

    // Update the user's role to ADMIN
    const updatedUser = await prisma.user.update({
      where: {
        email: adminEmail,
      },
      data: {
        role: "ADMIN",
      },
    });

    console.log(`Successfully assigned ADMIN role to ${updatedUser.email}`);
  } catch (error) {
    console.error("Error assigning admin role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
