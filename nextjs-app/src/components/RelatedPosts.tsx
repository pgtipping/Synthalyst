"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";

// Define the post type
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  publishedAt: Date;
  category?: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  posts: Post[];
}

export default function RelatedPosts({
  currentPostId,
  posts = [],
}: RelatedPostsProps) {
  // Filter out the current post and limit to 3 related posts
  const relatedPosts = posts
    .filter((post) => post.id !== currentPostId)
    .slice(0, 3);

  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative h-48 w-full">
              <OptimizedImage
                src={
                  post.coverImage ||
                  "https://placehold.co/800x400?text=Synthalyst"
                }
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardContent className="pt-4 flex-grow">
              {post.category && (
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                    {post.category}
                  </span>
                </div>
              )}
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                <h3 className="text-lg font-semibold line-clamp-2">
                  {post.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-gray-500 dark:text-gray-400">
              {formatDate(post.publishedAt)}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
