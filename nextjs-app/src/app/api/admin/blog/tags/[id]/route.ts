import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if tag has posts
    if (tag._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with associated posts" },
        { status: 400 }
      );
    }

    // Delete tag
    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}

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
    const { name, slug } = await req.json();

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if another tag with same name or slug exists
    if (name || slug) {
      const existing = await prisma.tag.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [{ name: name || undefined }, { slug: slug || undefined }],
            },
          ],
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Tag with this name or slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update tag
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name: name || undefined,
        slug: slug || undefined,
      },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}
