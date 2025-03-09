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
import { ImagePlus, X, Sparkles, AlertCircle } from "lucide-react";
import ContentGuide from "./components/ContentGuide";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface GenerateContentForm {
  title: string;
  topic: string;
  category: string;
  targetAudience: string;
  keyPoints: string;
}

function NewPostContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // LLM generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentScore, setContentScore] = useState<number | null>(null);
  const [contentFeedback, setContentFeedback] = useState<string[] | null>(null);
  const [generateForm, setGenerateForm] = useState<GenerateContentForm>({
    title: "",
    topic: "",
    category: "",
    targetAudience: "",
    keyPoints: "",
  });

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

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Convert keyPoints string to array
      const keyPointsArray = generateForm.keyPoints
        .split(",")
        .map((point) => point.trim())
        .filter(Boolean);

      const response = await fetch("/api/blog/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: generateForm.title,
          topic: generateForm.topic,
          category: generateForm.category,
          targetAudience: generateForm.targetAudience,
          keyPoints: keyPointsArray,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Failed to generate content");
      }

      const data = await response.json();

      // Update form with generated content
      setContentScore(data.data.score);
      setContentFeedback(data.data.feedback);

      // Update the main form with the generated content
      setFormData({
        ...formData,
        content: data.data.content,
        title: generateForm.title || formData.title,
        categories: generateForm.category
          ? [...formData.categories, generateForm.category]
          : formData.categories,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate content"
      );
    } finally {
      setIsGenerating(false);
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
    <div className="container mx-auto max-w-5xl py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: "New Post", href: "/blog/new" },
        ]}
      />

      <h1 className="mb-6 mt-4 text-3xl font-bold">Create New Blog Post</h1>

      <ContentGuide />

      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      <Tabs defaultValue="manual" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="manual">Write Manually</TabsTrigger>
          <TabsTrigger value="ai">AI-Assisted</TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
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
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AI-Assisted Content Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ai-title">Title (optional)</Label>
                  <Input
                    id="ai-title"
                    value={generateForm.title}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter a title or leave blank for AI to suggest"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-topic">Topic (required)</Label>
                  <Input
                    id="ai-topic"
                    required
                    value={generateForm.topic}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        topic: e.target.value,
                      })
                    }
                    placeholder="What is the main topic of your blog post?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-category">Category</Label>
                  <Input
                    id="ai-category"
                    value={generateForm.category}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        category: e.target.value,
                      })
                    }
                    placeholder="E.g., Innovation & Tech, Professional Growth, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-audience">Target Audience</Label>
                  <Input
                    id="ai-audience"
                    value={generateForm.targetAudience}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        targetAudience: e.target.value,
                      })
                    }
                    placeholder="Who is this content for?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ai-keypoints">
                    Key Points (comma-separated)
                  </Label>
                  <Textarea
                    id="ai-keypoints"
                    value={generateForm.keyPoints}
                    onChange={(e) =>
                      setGenerateForm({
                        ...generateForm,
                        keyPoints: e.target.value,
                      })
                    }
                    placeholder="List key points to include, separated by commas"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={isGenerating || !generateForm.topic}
                    className="flex items-center"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Generating content, please wait...
                    </p>
                    <Progress value={45} className="h-2 w-full" />
                  </div>
                )}

                {contentScore !== null && (
                  <div className="mt-4 rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">Content Quality Score</h3>
                      <Badge
                        variant={
                          contentScore > 70
                            ? "default"
                            : contentScore > 50
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {contentScore}/100
                      </Badge>
                    </div>

                    <Progress
                      value={contentScore}
                      className="h-2 w-full"
                      color={
                        contentScore > 70
                          ? "bg-green-500"
                          : contentScore > 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }
                    />

                    {contentFeedback && contentFeedback.length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-2 font-medium">Feedback:</h4>
                        <ul className="space-y-1">
                          {contentFeedback.map((feedback, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm"
                            >
                              <AlertCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <span>{feedback}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          // Continue to manual editing with the generated content
                          const manualTab = document.querySelector(
                            '[data-value="manual"]'
                          );
                          if (manualTab && manualTab instanceof HTMLElement) {
                            manualTab.click();
                          }
                        }}
                      >
                        Continue to Manual Editing
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPostContent />
    </Suspense>
  );
}
