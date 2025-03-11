"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import ContentGuide from "./components/ContentGuide";
import AIAssistant from "./components/AIAssistant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";

// Define the blog categories
const BLOG_CATEGORIES = [
  { name: "Innovation & Tech", value: "innovation-tech" },
  { name: "Professional Growth", value: "professional-growth" },
  { name: "Learning Lab", value: "learning-lab" },
  { name: "Productivity & Tools", value: "productivity-tools" },
  { name: "Industry Insights", value: "industry-insights" },
  { name: "Community Corner", value: "community-corner" },
];

interface CreatePostForm {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  published: boolean;
  featured: boolean;
}

const NewBlogPost = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePostForm>({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    categories: [],
    tags: [],
    published: true,
    featured: false,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData({ ...formData, coverImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session?.user?.email) {
      setError("User email is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Transform categories and tags arrays to IDs
      const categoryIds = formData.categories.map((cat: string) =>
        cat.toLowerCase().replace(/\s+/g, "-")
      );
      const tagIds = formData.tags.map((tag: string) =>
        tag.toLowerCase().replace(/\s+/g, "-")
      );

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt || undefined,
          coverImage: formData.coverImage || undefined,
          categoryIds,
          tagIds,
          published: formData.published,
          featured: formData.featured,
          authorEmail: session.user.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create post");
      }

      const data = await response.json();
      router.push(`/blog/${data.data.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-yellow-600">Please sign in to create a post.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "New Post", href: "/blog/new" },
        ]}
      />

      <h1 className="mb-6 mt-4 text-3xl font-bold">Create New Blog Post</h1>

      <ContentGuide />

      <AIAssistant
        onContentGenerated={(content) => {
          setFormData({ ...formData, content });
        }}
        onTagsGenerated={(categories, tags) => {
          setFormData({ ...formData, categories, tags });
        }}
        currentContent={formData.content}
      />

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Blog Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter post title"
                />
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <Card className="border-2 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center">
                      {!imagePreview ? (
                        <label
                          htmlFor="image-upload"
                          className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg transition-colors hover:bg-accent/50"
                        >
                          <ImagePlus className="mb-2 h-12 w-12 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload image
                          </p>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="relative h-48 w-full">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 z-10"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, coverImage: "" });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Image
                            src={imagePreview}
                            alt="Cover preview"
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <RichTextEditor
                      id="content"
                      content={formData.content}
                      onChange={(value) =>
                        setFormData({ ...formData, content: value })
                      }
                      placeholder="Write your post content here..."
                      className="min-h-[400px] w-full"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="preview" className="space-y-4">
                  <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none border rounded-lg p-6 min-h-[400px]">
                    <h1 className="!mt-0">
                      {formData.title || "Your Post Title"}
                    </h1>
                    {formData.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: formData.content }}
                        className="[&>*:first-child]:!mt-0"
                      />
                    ) : (
                      <p className="text-muted-foreground">
                        Your preview will appear here...
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Write a brief excerpt for your post..."
                  className="h-24"
                />
              </div>

              <div className="space-y-4">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {BLOG_CATEGORIES.map((category) => (
                    <label
                      key={category.value}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                        formData.categories.includes(category.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-accent"
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={category.value}
                        checked={formData.categories.includes(category.value)}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({
                            ...formData,
                            categories: e.target.checked
                              ? [...formData.categories, value]
                              : formData.categories.filter((c) => c !== value),
                          });
                        }}
                        className="sr-only"
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Enter tags separated by commas"
                  value={formData.tags.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tags: e.target.value
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, published: checked })
                    }
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                  <Label htmlFor="featured">Feature this post</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/blog")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function NewPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewBlogPost />
    </Suspense>
  );
}
