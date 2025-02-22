"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

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
const RETRY_DELAY = 1000;

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

  // Helper function to delay execution
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch helper with retry logic
  const fetchWithRetry = async <T,>(
    url: string,
    retryCount = 0
  ): Promise<T[]> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Validate data structure
      if (!data?.data?.posts || !Array.isArray(data.data.posts)) {
        throw new Error("Invalid response data structure");
      }

      return data.data.posts as T[];
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await delay(RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
        return fetchWithRetry<T>(url, retryCount + 1);
      }
      throw error;
    }
  };

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
        error:
          error instanceof Error
            ? error.message
            : "Failed to load featured posts",
      }));
      setFeaturedPosts([]);
    } finally {
      setFeaturedState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchRecentPosts = useCallback(async () => {
    setRecentState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await fetchWithRetry<Post>("/api/posts?sort=recent");
      setRecentPosts(posts);
    } catch (error) {
      console.error("Error fetching recent posts:", error);
      setRecentState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load recent posts",
      }));
      setRecentPosts([]);
    } finally {
      setRecentState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const fetchPopularPosts = useCallback(async () => {
    setPopularState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const posts = await fetchWithRetry<Post>("/api/posts?sort=popular");
      setPopularPosts(posts);
    } catch (error) {
      console.error("Error fetching popular posts:", error);
      setPopularState((prev) => ({
        ...prev,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load popular posts",
      }));
      setPopularPosts([]);
    } finally {
      setPopularState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog", active: true },
          ]}
        />

        <h1 className="text-4xl font-bold">The Synth</h1>

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
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
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
                            {post.author.image && (
                              <Image
                                src={post.author.image}
                                alt={post.author.name || ""}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span>{post.author.name}</span>
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
                                {post.author.image && (
                                  <Image
                                    src={post.author.image}
                                    alt={post.author.name || ""}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                  />
                                )}
                                <span>{post.author.name}</span>
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

        {/* Authentication and Create Post Section */}
        <div className="mt-8 flex items-center justify-between border-t pt-8">
          {session ? (
            <Link
              href="/blog/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ✍️ Create New Post
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Sign in to create a post</p>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
