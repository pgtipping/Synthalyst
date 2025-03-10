import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function ensureSuperadmin() {
  try {
    // Find or create the superadmin user
    const superadmin = await prisma.user.upsert({
      where: { email: "pgtipping1@gmail.com" },
      update: { role: "ADMIN" },
      create: {
        email: "pgtipping1@gmail.com",
        role: "ADMIN",
        name: "Super Admin",
      },
    });

    console.log("Superadmin role set successfully:", superadmin);
  } catch (error) {
    console.error("Error setting superadmin role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureSuperadmin();
