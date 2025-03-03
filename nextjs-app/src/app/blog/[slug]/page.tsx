"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import MDXContent from "@/components/MDXContent";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  author: {
    name: string | null;
    image: string | null;
  };
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
  createdAt: string;
  views: number;
  likes: number;
}

interface Comment {
  id: string;
  content: string;
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
  replies: Comment[];
}

export default function BlogPostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const slug = params?.slug;
        if (!slug) return;

        const [postRes, relatedRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${slug}`),
          fetch(`/api/posts/${slug}/related`),
          fetch(`/api/posts/${slug}/comments`),
        ]);

        if (!postRes.ok || !relatedRes.ok || !commentsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [postData, relatedData, commentsData] = await Promise.all([
          postRes.json(),
          relatedRes.json(),
          commentsRes.json(),
        ]);

        setPost(postData.data);
        setRelatedPosts(relatedData.data);
        setComments(commentsData.data);

        // Increment view count
        fetch(`/api/posts/${slug}/view`, { method: "POST" });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.slug) {
      fetchData();
    }
  }, [params?.slug]);

  const handleLike = async () => {
    if (!session) return;

    try {
      const slug = params?.slug;
      if (!slug) return;

      const res = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to like post");
      }

      const data = await res.json();
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : null));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !newComment.trim()) {
      setCommentError("You must be logged in to comment");
      return;
    }

    try {
      const slug = params?.slug;
      if (!slug) return;

      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          authorEmail: session.user.email,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add comment");
      }

      const data = await res.json();
      setComments((prev) => [data.data, ...prev]);
      setNewComment("");
      setCommentError(null);
    } catch (error) {
      console.error("Error adding comment:", error);
      setCommentError(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error || "Post not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}`, active: true },
          ]}
        />

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/synthalyst-team.png"
                alt={post.author.name || "Synthalyst Team"}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500">👁️ {post.views}</span>
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
              >
                <span>❤️</span>
                <span>{post.likes}</span>
              </button>
            </div>
          </div>

          <MDXContent content={post.content} />

          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
              >
                {category.name}
              </Link>
            ))}
            {post.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </article>

        {/* Comments Section */}
        <section className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Comments</h2>

          {session ? (
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              {commentError && (
                <p className="mt-2 text-sm text-red-600">{commentError}</p>
              )}
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p>Please sign in to leave a comment.</p>
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4 mb-4">
                  {comment.author.image && (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name || ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{comment.author.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {relatedPost.coverImage && (
                      <div className="relative h-48">
                        <Image
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{relatedPost.author.name}</span>
                        <span>
                          {new Date(relatedPost.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
