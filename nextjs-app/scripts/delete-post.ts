import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deletePost() {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: "mastering-the-training-plan-creator" },
    });

    if (!post) {
      console.log("Post not found");
      return;
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deletePost();
