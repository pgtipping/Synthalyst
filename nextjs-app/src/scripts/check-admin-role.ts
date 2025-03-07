const { PrismaClient } = require("@prisma/client");

// This script checks if the user with email pgtipping1@gmail.com has the ADMIN role
async function main() {
  const prisma = new PrismaClient();

  try {
    // The email address to check
    const email = "pgtipping1@gmail.com";

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log(
        `User with email ${email} not found. They need to sign in at least once before being assigned the admin role.`
      );
      return;
    }

    console.log(`User found: ${user.name || "No name"} (${user.email})`);
    console.log(`Current role: ${user.role}`);

    if (user.role === "ADMIN") {
      console.log("✅ User has the ADMIN role");
    } else {
      console.log("❌ User does NOT have the ADMIN role");

      // Ask if the user wants to assign the ADMIN role
      console.log(
        "\nWould you like to assign the ADMIN role to this user? (Run the assign-admin script)"
      );
    }
  } catch (error) {
    console.error("Error checking admin role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
