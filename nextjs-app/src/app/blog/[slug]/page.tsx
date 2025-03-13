import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  Tag,
  ThumbsUp,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { getValidImageUrl } from "@/lib/utils";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";
import RelatedPosts from "@/components/RelatedPosts";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Mock data for a blog post
const getMockPost = (slug: string) => {
  return {
    id: "1",
    slug,
    title: "Understanding Next.js App Router and Server Components",
    excerpt:
      "Learn how Next.js App Router and Server Components work together to create fast, SEO-friendly web applications.",
    content: `
      <h2>Introduction to Next.js App Router</h2>
      <p>Next.js App Router is a new routing system introduced in Next.js 13 that provides a more intuitive and powerful way to handle routing in your application.</p>
      
      <h2>Server Components</h2>
      <p>Server Components allow you to render components on the server, reducing the amount of JavaScript sent to the client and improving performance.</p>
      
      <h2>Benefits of App Router</h2>
      <ul>
        <li>Improved performance with streaming and partial rendering</li>
        <li>Better SEO with server-rendered content</li>
        <li>More intuitive routing with nested layouts</li>
        <li>Built-in support for loading and error states</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Next.js App Router and Server Components represent a significant step forward in web development, allowing developers to build faster, more SEO-friendly applications with less client-side JavaScript.</p>
    `,
    coverImage: "https://placehold.co/1200x630?text=Next.js+App+Router",
    publishedAt: new Date("2025-03-10"),
    author: {
      name: "John Doe",
      avatar: "https://placehold.co/100x100?text=JD",
    },
    category: "Web Development",
  };
};

// Mock data for related posts
const getMockRelatedPosts = () => {
  return [
    {
      id: "2",
      slug: "optimizing-nextjs-performance",
      title: "Optimizing Next.js Performance",
      excerpt:
        "Learn how to optimize your Next.js application for better performance and user experience.",
      coverImage: "https://placehold.co/800x400?text=Performance",
      publishedAt: new Date("2025-03-08"),
      category: "Performance",
    },
    {
      id: "3",
      slug: "nextjs-seo-best-practices",
      title: "Next.js SEO Best Practices",
      excerpt:
        "Discover the best practices for optimizing your Next.js application for search engines.",
      coverImage: "https://placehold.co/800x400?text=SEO",
      publishedAt: new Date("2025-03-05"),
      category: "SEO",
    },
    {
      id: "4",
      slug: "nextjs-accessibility",
      title: "Building Accessible Next.js Applications",
      excerpt:
        "Learn how to make your Next.js applications accessible to all users.",
      coverImage: "https://placehold.co/800x400?text=Accessibility",
      publishedAt: new Date("2025-03-01"),
      category: "Accessibility",
    },
  ];
};

// Generate dynamic metadata for the blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
      },
    });

    if (!post) {
      return {
        title: "Post Not Found | Synthalyst Blog",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: `${post.title} | Synthalyst Blog`,
      description: post.excerpt || `Read ${post.title} on Synthalyst Blog`,
      keywords: post.categories.map((category) => category.name),
      authors: [
        {
          name: post.author?.name || "Synthalyst Team",
          url: post.author?.name
            ? `/author/${post.author.name.toLowerCase().replace(/\s+/g, "-")}`
            : undefined,
        },
      ],
      alternates: {
        canonical: `https://synthalyst.com/blog/${slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Synthalyst Blog`,
        url: `https://synthalyst.com/blog/${slug}`,
        type: "article",
        publishedTime: post.createdAt.toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author?.name || "Synthalyst Team"],
        tags: post.categories.map((category) => category.name),
        images: [
          {
            url:
              getValidImageUrl(post.coverImage) ||
              "https://synthalyst.com/images/blog-default.jpg",
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || `Read ${post.title} on Synthalyst Blog`,
        images: [
          getValidImageUrl(post.coverImage) ||
            "https://synthalyst.com/images/blog-default.jpg",
        ],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post | Synthalyst Blog",
      description: "Read our latest blog posts on Synthalyst Blog",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        categories: true,
      },
    });

    if (!post) {
      notFound();
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    // Format dates
    const publishDate = format(post.createdAt, "MMMM d, yyyy");
    const readingTime = Math.max(
      1,
      Math.ceil(post.content.split(/\s+/).length / 200)
    );

    // Prepare JSON-LD structured data
    const blogPostJsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || `Read ${post.title} on Synthalyst Blog`,
      image:
        getValidImageUrl(post.coverImage) ||
        "https://synthalyst.com/images/blog-default.jpg",
      datePublished: post.createdAt.toISOString(),
      dateModified: post.updatedAt.toISOString(),
      author: {
        "@type": "Person",
        name: post.author?.name || "Synthalyst Team",
        url: post.author?.name
          ? `https://synthalyst.com/author/${post.author.name
              .toLowerCase()
              .replace(/\s+/g, "-")}`
          : "https://synthalyst.com",
      },
      publisher: {
        "@type": "Organization",
        name: "Synthalyst",
        logo: {
          "@type": "ImageObject",
          url: "https://synthalyst.com/icons/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://synthalyst.com/blog/${slug}`,
      },
      keywords: post.categories.map((category) => category.name).join(", "),
    };

    const relatedPosts = getMockRelatedPosts();

    return (
      <>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogPostJsonLd),
          }}
        />

        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title, href: `/blog/${post.slug}`, active: true },
            ]}
            className="mb-6"
          />

          <article className="bg-white rounded-lg shadow-sm overflow-hidden">
            {post.coverImage && (
              <div className="relative w-full h-[400px]">
                <Image
                  src={getValidImageUrl(post.coverImage)}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                  >
                    <Badge
                      variant="secondary"
                      className="hover:bg-secondary/80"
                    >
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 text-gray-500 mb-6">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">{publishDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{readingTime} min read</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{post.views} views</span>
                </div>
              </div>

              <div className="flex items-center mb-8">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={post.author?.image || "/images/default-avatar.png"}
                    alt={post.author?.name || "Author"}
                  />
                  <AvatarFallback>
                    {post.author?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {post.author?.name || "Synthalyst Team"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {post.author?.bio?.substring(0, 60) || "Synthalyst Author"}
                    {post.author?.bio && post.author.bio.length > 60
                      ? "..."
                      : ""}
                  </p>
                </div>
              </div>

              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <Separator className="my-8" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Like ({post.likes})
                  </Button>
                  <ShareButtons
                    url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
                    title={post.title}
                    summary={post.excerpt || ""}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                    >
                      <Badge
                        variant="outline"
                        className="hover:bg-secondary/10"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {category.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <CommentSection postId={post.id} />

          <RelatedPosts currentPostId={post.id} posts={relatedPosts} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}
