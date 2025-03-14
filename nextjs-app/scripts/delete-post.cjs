const { PrismaClient } = require("@prisma/client");

async function deletePost(databaseUrl) {
  // Create Prisma client with the provided database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });

  try {
    console.log(`Attempting to delete post in database: ${databaseUrl}`);

    const post = await prisma.post.findUnique({
      where: { slug: "mastering-the-training-plan-creator" },
    });

    if (!post) {
      console.log("Post not found in this database");
      return;
    }

    await prisma.post.delete({
      where: { id: post.id },
    });

    console.log(`Post deleted successfully from database: ${databaseUrl}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get database URL from environment variable, fallback to local if not provided
const databaseUrl =
  process.env.DATABASE_URL || "postgresql://localhost:5432/synthalyst";

// Execute the deletion
deletePost(databaseUrl).catch((error) => {
  console.error("Failed to delete post:", error);
  process.exit(1);
});
