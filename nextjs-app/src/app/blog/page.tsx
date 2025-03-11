"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getValidImageUrl } from "@/lib/utils";
import NewsletterSignup from "@/components/NewsletterSignup";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  author: {
    name: string | null;
    image: string | null;
  };
  categories: { name: string; slug: string }[];
  createdAt: string;
  views: number;
  likes: number;
}

interface SectionState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

type SectionStateDispatch = React.Dispatch<React.SetStateAction<SectionState>>;
type SectionStateEntry = [SectionState, SectionStateDispatch];

const MAX_RETRIES = 3;

export default function BlogPage() {
  const { data: session } = useSession();
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);

  // Section-specific states
  const [featuredState, setFeaturedState] = useState<SectionState>({
    isLoading: true,
    error: null,
    retryCount: 0,
  });
  const [recentState, setRecentState] = useState<SectionState>({
    isLoading: true,
    error: null,
    retryCount: 0,
  });
  const [popularState, setPopularState] = useState<SectionState>({
    isLoading: true,
    error: null,
    retryCount: 0,
  });

  // Fetch helper with retry logic
  const fetchWithRetry = useCallback(
    async <T,>(url: string, retryCount = 0): Promise<T[]> => {
      // Helper function to delay execution (moved inside useCallback)
      const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Add timeout to fetch
      const fetchWithTimeout = async (url: string, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
          const response = await fetch(url, {
            signal: controller.signal,
            cache: "no-store",
          });
          clearTimeout(id);
          return response;
        } catch (error) {
          clearTimeout(id);
          throw error;
        }
      };

      try {
        console.log(`Fetching ${url} (attempt ${retryCount + 1}/2)...`);
        const response = await fetchWithTimeout(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate data structure
        if (!data?.data?.posts || !Array.isArray(data.data.posts)) {
          console.warn("Invalid response structure:", data);
          return []; // Return empty array instead of throwing
        }

        return data.data.posts as T[];
      } catch (error) {
        console.error(`Error fetching ${url}:`, error);

        // Only retry once to reduce resource usage
        if (retryCount < 1) {
          console.log(`Retrying fetch after delay...`);
          await delay(2000); // Fixed delay to avoid exponential growth
          return fetchWithRetry(url, retryCount + 1);
        }

        console.warn(`Max retries reached for ${url}, returning empty array`);
        return []; // Return empty array instead of throwing
      }
    },
    []
  );

  // Individual section fetch functions
  const fetchFeaturedPosts = useCallback(async () => {
    setFeaturedState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await fetchWithRetry<Post>("/api/posts?featured=true");
      setFeaturedPosts(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      setFeaturedState((prev) => ({
        ...prev,
        error: "Unable to load featured posts. Please try again later.",
      }));
      setFeaturedPosts([]);
    } finally {
      setFeaturedState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchWithRetry]);

  const fetchRecentPosts = useCallback(async () => {
    setRecentState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await fetchWithRetry<Post>("/api/posts?sort=recent");
      setRecentPosts(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      setRecentState((prev) => ({
        ...prev,
        error: "Unable to load recent posts. Please try again later.",
      }));
      setRecentPosts([]);
    } finally {
      setRecentState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchWithRetry]);

  const fetchPopularPosts = useCallback(async () => {
    setPopularState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await fetchWithRetry<Post>("/api/posts?sort=popular");
      setPopularPosts(posts);
    } catch (error) {
      console.error("Error fetching popular posts:", error);
      setPopularState((prev) => ({
        ...prev,
        error: "Unable to load popular posts. Please try again later.",
      }));
      setPopularPosts([]);
    } finally {
      setPopularState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [fetchWithRetry]);

  // Retry handlers
  const handleRetry = async (
    section: "featured" | "recent" | "popular",
    fetchFn: () => Promise<void>
  ) => {
    const stateMap: Record<string, SectionStateEntry> = {
      featured: [featuredState, setFeaturedState],
      recent: [recentState, setRecentState],
      popular: [popularState, setPopularState],
    };

    const [state, setState] = stateMap[section];

    if (state.retryCount < MAX_RETRIES) {
      setState((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }));
      await fetchFn();
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
    fetchRecentPosts();
    fetchPopularPosts();
  }, [fetchFeaturedPosts, fetchRecentPosts, fetchPopularPosts]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      <div className="h-48 bg-gray-200 rounded"></div>
    </div>
  );

  // Error message component with retry button
  const ErrorMessage = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="bg-red-50 text-red-700 p-4 rounded-md">
      <p className="mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="text-sm bg-red-100 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog", active: true },
          ]}
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
          {featuredState.isLoading ? (
            <LoadingSkeleton />
          ) : featuredState.error ? (
            <ErrorMessage
              message={featuredState.error}
              onRetry={() => handleRetry("featured", fetchFeaturedPosts)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                  // If the author image fails to load, use the default team image
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/images/synthalyst-team.png";
                                  target.onerror = null; // Prevent infinite error loop
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
                                  // If the default team image fails to load, use a text placeholder
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://placehold.co/24x24?text=S";
                                  target.onerror = null; // Prevent infinite error loop
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Posts */}
          <section className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Recent Posts</h2>
            {recentState.isLoading ? (
              <LoadingSkeleton />
            ) : recentState.error ? (
              <ErrorMessage
                message={recentState.error}
                onRetry={() => handleRetry("recent", fetchRecentPosts)}
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
                        <div className="p-6">
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                {post.author.image ? (
                                  <Image
                                    src={getValidImageUrl(post.author.image)}
                                    alt={post.author.name || ""}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                    onError={(e) => {
                                      // If the author image fails to load, use the default team image
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "/images/synthalyst-team.png";
                                      target.onerror = null; // Prevent infinite error loop
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
                                      // If the default team image fails to load, use a text placeholder
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "https://placehold.co/24x24?text=S";
                                      target.onerror = null; // Prevent infinite error loop
                                    }}
                                  />
                                )}
                                <span>
                                  {post.author.name || "Synthalyst Team"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span>👁️ {post.views}</span>
                                <span>❤️ {post.likes}</span>
                              </div>
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
            {popularState.isLoading ? (
              <LoadingSkeleton />
            ) : popularState.error ? (
              <ErrorMessage
                message={popularState.error}
                onRetry={() => handleRetry("popular", fetchPopularPosts)}
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
                          {post.coverImage && (
                            <div className="relative h-32 mb-2 rounded overflow-hidden">
                              <Image
                                src={getValidImageUrl(post.coverImage)}
                                alt={post.title}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // If the image fails to load, replace with a placeholder
                                  const target = e.target as HTMLImageElement;
                                  target.src =
                                    "https://placehold.co/400x200?text=Synthalyst";
                                  target.onerror = null; // Prevent infinite error loop
                                }}
                              />
                            </div>
                          )}
                          <h3 className="font-semibold mb-2 group-hover:text-blue-600">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span>👁️ {post.views}</span>
                              <span>❤️ {post.likes}</span>
                            </div>
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
