import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow this route to be called by the superadmin email
    if (!session || session.user.email !== "pgtipping1@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Update the superadmin's role
    const updatedUser = await prisma.user.update({
      where: {
        email: "pgtipping1@gmail.com",
      },
      data: {
        role: "ADMIN",
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error setting superadmin role:", error);
    return NextResponse.json(
      { error: "Failed to set superadmin role" },
      { status: 500 }
    );
  }
}
