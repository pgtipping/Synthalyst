"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreatePostForm {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  categories: string[]; // This will be transformed to categoryIds
  tags: string[]; // This will be transformed to tagIds
  published: boolean;
  featured: boolean;
}

export default function NewPostPage() {
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
    published: false,
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
      // In a real app, you'd probably want to validate these against existing categories/tags
      const categoryIds = formData.categories.map((cat) =>
        cat.toLowerCase().replace(/\s+/g, "-")
      );
      const tagIds = formData.tags.map((tag) =>
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

      const post = await response.json();
      router.push(`/blog/${post.data.slug}`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create post"
      );
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
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
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
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              required
              rows={10}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write your post content here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={3}
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              placeholder="Brief summary of your post"
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
                      className="flex flex-col items-center justify-center w-full h-48 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors"
                    >
                      <ImagePlus className="h-12 w-12 text-muted-foreground mb-2" />
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
                    <div className="relative w-full h-48">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
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
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">Categories</Label>
            <Input
              id="categories"
              value={formData.categories.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categories: e.target.value
                    .split(",")
                    .map((cat) => cat.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Enter categories (comma-separated)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
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
              placeholder="Enter tags (comma-separated)"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
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
              <Label htmlFor="featured">Featured post</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
