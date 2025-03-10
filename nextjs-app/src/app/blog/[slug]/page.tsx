import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  // Ensure params.slug is available before using it
  const slug = await params.slug;
  if (!slug) {
    notFound();
  }

  try {
    // Ensure API URL is defined
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("API URL is not defined");
    }

    // Fetch data server-side
    const [postRes, relatedRes, commentsRes] = await Promise.all([
      fetch(`${apiUrl}/api/posts/${slug}`),
      fetch(`${apiUrl}/api/posts/${slug}/related`),
      fetch(`${apiUrl}/api/posts/${slug}/comments`),
    ]);

    if (!postRes.ok) {
      notFound();
    }

    const post = await postRes.json();
    const related = await relatedRes.json();
    const comments = await commentsRes.json();

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title, href: `/blog/${slug}`, active: true },
          ]}
        />

        <article className="prose lg:prose-xl mx-auto">
          <h1>{post.title}</h1>
          <div className="flex items-center space-x-4 text-gray-500">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{post.author.name || "Synthalyst Team"}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relatedPost: RelatedPost) => (
                <div
                  key={relatedPost.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600">{relatedPost.excerpt}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Comments</h2>
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment: Comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg shadow p-6"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="font-semibold">{comment.author.name}</span>
                    <span className="text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog post:", error);
    notFound();
  }
}

export default BlogPostPage;
