import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["user", "ADMIN"]),
});

// This is the correct pattern for App Router API routes with dynamic parameters in Next.js 15
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object to get the id
    const { id } = await params;

    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" &&
        session.user.email !== "pgtipping1@gmail.com")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user to update
    const userToUpdate = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });

    // Prevent modification of the superadmin account
    if (userToUpdate?.email === "pgtipping1@gmail.com") {
      return NextResponse.json(
        { error: "Cannot modify superadmin role" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const result = updateRoleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid role", details: result.error.format() },
        { status: 400 }
      );
    }

    const { role } = result.data;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
