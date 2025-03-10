import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Update subscriber schema
const updateSubscriberSchema = z.object({
  name: z.string().optional().nullable(),
  confirmed: z.boolean().optional(),
  active: z.boolean().optional(),
  unsubscribed: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// PATCH /api/admin/newsletter/subscribers/[id] - Update a subscriber
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    // Validate the request body
    const result = updateSubscriberSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 }
      );
    }

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Check if the subscriber exists
    const existingSubscriber = await prismaAny.newsletter.findUnique({
      where: { id },
    });

    if (!existingSubscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Update the subscriber
    const updatedSubscriber = await prismaAny.newsletter.update({
      where: { id },
      data: result.data,
    });

    return NextResponse.json({
      message: "Subscriber updated successfully",
      subscriber: updatedSubscriber,
    });
  } catch (error) {
    console.error("Error updating subscriber:", error);
    return NextResponse.json(
      { error: "Failed to update subscriber" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/newsletter/subscribers/[id] - Delete a subscriber
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and has admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Use type assertion to work around the type error
    const prismaAny = prisma as any;

    // Check if the subscriber exists
    const existingSubscriber = await prismaAny.newsletter.findUnique({
      where: { id },
    });

    if (!existingSubscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    // Delete the subscriber
    await prismaAny.newsletter.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Subscriber deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
