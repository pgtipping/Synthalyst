"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getValidImageUrl } from "@/lib/utils";

// Define proper types for blog posts
interface Author {
  name: string;
  image: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: Author;
  categories?: { name: string; slug: string }[];
  createdAt: string;
  views: number;
  likes: number;
}

export default function BlogPage() {
  const { data: session } = useSession();
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);

  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);

  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const [recentError, setRecentError] = useState<string | null>(null);
  const [popularError, setPopularError] = useState<string | null>(null);

  // Simplified fetch function with basic error handling
  // This function is kept for future use when connecting to real API endpoints
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchPosts = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  // Load mock data for development
  const loadMockData = () => {
    // Mock data for featured posts
    const mockFeaturedPosts = [
      {
        id: "1",
        title: "Getting Started with Next.js",
        slug: "getting-started-with-nextjs",
        excerpt: "Learn how to build modern web applications with Next.js",
        coverImage: "https://placehold.co/800x400?text=Next.js",
        author: {
          name: "John Doe",
          image: "https://placehold.co/100x100?text=JD",
        },
        createdAt: new Date().toISOString(),
        views: 120,
        likes: 45,
      },
      {
        id: "2",
        title: "React Server Components",
        slug: "react-server-components",
        excerpt: "Explore the power of React Server Components in Next.js",
        coverImage: "https://placehold.co/800x400?text=RSC",
        author: {
          name: "Jane Smith",
          image: "https://placehold.co/100x100?text=JS",
        },
        createdAt: new Date().toISOString(),
        views: 85,
        likes: 32,
      },
      {
        id: "3",
        title: "Building with TypeScript",
        slug: "building-with-typescript",
        excerpt: "Why TypeScript is essential for modern web development",
        coverImage: "https://placehold.co/800x400?text=TS",
        author: {
          name: "Alex Johnson",
          image: "https://placehold.co/100x100?text=AJ",
        },
        createdAt: new Date().toISOString(),
        views: 95,
        likes: 38,
      },
    ];

    // Mock data for recent posts
    const mockRecentPosts = [
      {
        id: "4",
        title: "Optimizing Performance in React Applications",
        slug: "optimizing-performance-react",
        excerpt:
          "Learn techniques to improve the performance of your React applications",
        coverImage: "https://placehold.co/800x400?text=Performance",
        author: {
          name: "Sarah Williams",
          image: "https://placehold.co/100x100?text=SW",
        },
        createdAt: new Date().toISOString(),
        views: 75,
        likes: 28,
      },
      {
        id: "5",
        title: "Introduction to Tailwind CSS",
        slug: "introduction-to-tailwind",
        excerpt: "Get started with the utility-first CSS framework",
        coverImage: "https://placehold.co/800x400?text=Tailwind",
        author: {
          name: "Mike Brown",
          image: "https://placehold.co/100x100?text=MB",
        },
        createdAt: new Date().toISOString(),
        views: 65,
        likes: 24,
      },
    ];

    // Mock data for popular posts
    const mockPopularPosts = [
      {
        id: "6",
        title: "The Future of Web Development",
        slug: "future-of-web-development",
        excerpt: "Exploring upcoming trends in web development",
        coverImage: "https://placehold.co/800x400?text=Future",
        author: {
          name: "Chris Davis",
          image: "https://placehold.co/100x100?text=CD",
        },
        createdAt: new Date().toISOString(),
        views: 150,
        likes: 60,
      },
      {
        id: "7",
        title: "Mastering CSS Grid",
        slug: "mastering-css-grid",
        excerpt: "A comprehensive guide to CSS Grid layout",
        coverImage: "https://placehold.co/800x400?text=CSS+Grid",
        author: {
          name: "Emily Wilson",
          image: "https://placehold.co/100x100?text=EW",
        },
        createdAt: new Date().toISOString(),
        views: 130,
        likes: 52,
      },
      {
        id: "8",
        title: "JavaScript Best Practices",
        slug: "javascript-best-practices",
        excerpt: "Write cleaner, more maintainable JavaScript code",
        coverImage: "https://placehold.co/800x400?text=JS+Best+Practices",
        author: {
          name: "David Thompson",
          image: "https://placehold.co/100x100?text=DT",
        },
        createdAt: new Date().toISOString(),
        views: 110,
        likes: 48,
      },
    ];

    return { mockFeaturedPosts, mockRecentPosts, mockPopularPosts };
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // In production, we would fetch real data from the API
        // For now, use mock data to avoid webpack issues
        const { mockFeaturedPosts, mockRecentPosts, mockPopularPosts } =
          loadMockData();

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFeaturedPosts(mockFeaturedPosts);
        setRecentPosts(mockRecentPosts);
        setPopularPosts(mockPopularPosts);
      } catch (error) {
        console.error("Error loading data:", error);
        setFeaturedError("Failed to load featured posts");
        setRecentError("Failed to load recent posts");
        setPopularError("Failed to load popular posts");
      } finally {
        setFeaturedLoading(false);
        setRecentLoading(false);
        setPopularLoading(false);
      }
    };

    loadData();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <div className="p-4">
            <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 animate-pulse mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-4 bg-gray-200 animate-pulse w-20" />
              </div>
              <div className="h-4 bg-gray-200 animate-pulse w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error message component
  const ErrorMessage = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      {message}
      <Button variant="outline" size="sm" className="ml-4" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-[850px] px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog", active: true },
          ]}
          className="mb-6"
        />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">The Synth Blog</h1>
          {session && (
            <Link href="/blog/new">
              <Button>Create New Post</Button>
            </Link>
          )}
        </div>

        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
          {featuredLoading ? (
            <LoadingSkeleton />
          ) : featuredError ? (
            <ErrorMessage
              message={featuredError}
              onRetry={() => {
                setFeaturedLoading(true);
                setFeaturedError(null);
                // In a real implementation, this would refetch the data
                setTimeout(() => {
                  const { mockFeaturedPosts } = loadMockData();
                  setFeaturedPosts(mockFeaturedPosts);
                  setFeaturedLoading(false);
                }, 1000);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {featuredPosts.length > 0 ? (
                featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group"
                  >
                    <article className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105">
                      {post.coverImage && (
                        <div className="relative h-48">
                          <Image
                            src={getValidImageUrl(post.coverImage)}
                            alt={post.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // If the image fails to load, replace with a placeholder
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://placehold.co/800x400?text=Synthalyst";
                              target.onerror = null; // Prevent infinite error loop
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            {post.author.image ? (
                              <Image
                                src={getValidImageUrl(post.author.image)}
                                alt={post.author.name || ""}
                                width={24}
                                height={24}
                                className="rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/images/synthalyst-team.png";
                                  target.onerror = null;
                                }}
                              />
                            ) : (
                              <Image
                                src="/images/synthalyst-team.png"
                                alt="Synthalyst Team"
                                width={24}
                                height={24}
                                className="rounded-full"
                                priority
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://placehold.co/24x24?text=S";
                                  target.onerror = null;
                                }}
                              />
                            )}
                            <span>{post.author.name || "Synthalyst Team"}</span>
                          </div>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No featured posts available
                </div>
              )}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mb-12">
          <NewsletterSignup
            variant="inline"
            title="Stay Updated with The Synth Blog"
            description="Subscribe to our newsletter to receive the latest insights, tools, and resources directly to your inbox."
            className="w-full"
          />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Posts */}
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
            {recentLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 animate-pulse mb-4" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                          <div className="h-4 bg-gray-200 animate-pulse w-20" />
                        </div>
                        <div className="h-4 bg-gray-200 animate-pulse w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentError ? (
              <ErrorMessage
                message={recentError}
                onRetry={() => {
                  setRecentLoading(true);
                  setRecentError(null);
                  // In a real implementation, this would refetch the data
                  setTimeout(() => {
                    const { mockRecentPosts } = loadMockData();
                    setRecentPosts(mockRecentPosts);
                    setRecentLoading(false);
                  }, 1000);
                }}
              />
            ) : (
              <div className="space-y-6">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <article className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              {post.author.image ? (
                                <Image
                                  src={getValidImageUrl(post.author.image)}
                                  alt={post.author.name || ""}
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/images/synthalyst-team.png";
                                    target.onerror = null;
                                  }}
                                />
                              ) : (
                                <Image
                                  src="/images/synthalyst-team.png"
                                  alt="Synthalyst Team"
                                  width={24}
                                  height={24}
                                  className="rounded-full"
                                  priority
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src =
                                      "https://placehold.co/24x24?text=S";
                                    target.onerror = null;
                                  }}
                                />
                              )}
                              <span>
                                {post.author.name || "Synthalyst Team"}
                              </span>
                            </div>
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent posts available
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Popular Posts Sidebar */}
          <aside>
            <h2 className="text-2xl font-semibold mb-6">Popular Posts</h2>
            {popularLoading ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i}>
                      <div className="h-5 bg-gray-200 animate-pulse mb-2 w-3/4" />
                      <div className="h-4 bg-gray-200 animate-pulse w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            ) : popularError ? (
              <ErrorMessage
                message={popularError}
                onRetry={() => {
                  setPopularLoading(true);
                  setPopularError(null);
                  // In a real implementation, this would refetch the data
                  setTimeout(() => {
                    const { mockPopularPosts } = loadMockData();
                    setPopularPosts(mockPopularPosts);
                    setPopularLoading(false);
                  }, 1000);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-6">
                  {popularPosts.length > 0 ? (
                    popularPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="block group"
                      >
                        <article>
                          <h3 className="font-semibold mb-2 group-hover:text-blue-600">
                            {post.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="mr-4">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span>{post.views} views</span>
                          </div>
                        </article>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No popular posts available
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
