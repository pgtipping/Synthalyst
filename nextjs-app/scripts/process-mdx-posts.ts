import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

// Initialize Prisma client
const prisma = new PrismaClient();

// Path to MDX files
const POSTS_DIRECTORY = path.join(process.cwd(), "src", "app", "blog", "posts");

interface PostMetadata {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  authorImage?: string;
  image?: string;
  tags?: string[];
  featured?: boolean;
}

// Function to extract frontmatter from MDX files
function extractFrontmatter(content: string): {
  metadata: PostMetadata;
  content: string;
} {
  const frontmatterRegex = /---\r?\n([\s\S]*?)\r?\n---/;
  const match = frontmatterRegex.exec(content);

  if (!match || !match[1]) {
    throw new Error("No frontmatter found");
  }

  const frontmatterLines = match[1].split("\n");
  const metadata: PostMetadata = {
    title: "",
  };

  frontmatterLines.forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      const trimmedKey = key.trim();
      let value = valueParts.join(":").trim();

      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      // Handle different types based on key
      if (trimmedKey === "featured") {
        metadata.featured = value === "true";
      } else if (trimmedKey === "tags") {
        try {
          // Try to parse as JSON array
          if (value.startsWith("[") && value.endsWith("]")) {
            metadata.tags = JSON.parse(value.replace(/'/g, '"'));
          } else {
            // Fallback to simple comma-separated list
            metadata.tags = value.split(",").map((tag) => tag.trim());
          }
        } catch {
          console.warn(`Failed to parse tags: ${value}`);
          metadata.tags = [];
        }
      } else if (trimmedKey === "title") {
        metadata.title = value;
      } else if (trimmedKey === "description") {
        metadata.description = value;
      } else if (trimmedKey === "date") {
        metadata.date = value;
      } else if (trimmedKey === "author") {
        metadata.author = value;
      } else if (trimmedKey === "authorImage") {
        metadata.authorImage = value;
      } else if (trimmedKey === "image") {
        metadata.image = value;
      }
    }
  });

  // Extract content (everything after frontmatter)
  const contentAfterFrontmatter = content.replace(frontmatterRegex, "").trim();

  return { metadata, content: contentAfterFrontmatter };
}

// Function to process a single MDX file
async function processMdxFile(filePath: string, fileName: string) {
  try {
    const fullPath = path.join(filePath, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { metadata, content } = extractFrontmatter(fileContents);

    if (!metadata.title) {
      throw new Error("Post title is required");
    }

    // Generate slug from filename (remove .mdx extension)
    const slug = fileName.replace(/\.mdx$/, "");

    // Find or create author
    const authorEmail = metadata.author
      ? `${slugify(metadata.author, { lower: true })}@synthalyst.com`
      : "admin@synthalyst.com";
    const authorName = metadata.author || "Synthalyst Team";

    let author = await prisma.user.findUnique({
      where: { email: authorEmail },
    });

    if (!author) {
      // Create a default author if not found
      author = await prisma.user.create({
        data: {
          email: authorEmail,
          name: authorName,
          image: metadata.authorImage,
        },
      });
    }

    // Process tags
    const tagConnections = [];

    if (metadata.tags && metadata.tags.length > 0) {
      for (const tagName of metadata.tags) {
        const tagSlug = slugify(tagName, { lower: true });

        // Create tag if it doesn't exist
        const tag = await prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
          },
        });

        tagConnections.push({ id: tag.id });
      }
    }

    // Create or update post
    const post = await prisma.post.upsert({
      where: { slug },
      update: {
        title: metadata.title,
        content,
        excerpt: metadata.description,
        coverImage: metadata.image,
        published: true,
        featured: metadata.featured || false,
        tags: {
          connect: tagConnections,
        },
      },
      create: {
        title: metadata.title,
        slug,
        content,
        excerpt: metadata.description,
        coverImage: metadata.image,
        published: true,
        featured: metadata.featured || false,
        author: {
          connect: { id: author.id },
        },
        tags: {
          connect: tagConnections,
        },
      },
    });

    console.log(`Processed post: ${post.title} (${post.slug})`);
    return post;
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    return null;
  }
}

// Main function to process all MDX files
async function processAllMdxFiles() {
  try {
    // Ensure the posts directory exists
    if (!fs.existsSync(POSTS_DIRECTORY)) {
      console.error(`Posts directory not found: ${POSTS_DIRECTORY}`);
      return;
    }

    // Get all MDX files
    const mdxFiles = fs
      .readdirSync(POSTS_DIRECTORY)
      .filter((file) => file.endsWith(".mdx"));

    console.log(`Found ${mdxFiles.length} MDX files to process`);

    // Process each file
    for (const file of mdxFiles) {
      await processMdxFile(POSTS_DIRECTORY, file);
    }

    console.log("All MDX files processed successfully");
  } catch (error) {
    console.error("Error processing MDX files:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
processAllMdxFiles()
  .then(() => console.log("Done!"))
  .catch((error) => console.error("Script failed:", error));
