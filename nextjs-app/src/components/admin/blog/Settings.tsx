"use client";

import { useState } from "react";
import { Category, Tag } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";

interface SettingsProps {
  categories: Category[];
  tags: Tag[];
}

export default function Settings({
  categories: initialCategories,
  tags: initialTags,
}: SettingsProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [tags, setTags] = useState(initialTags);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const response = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategory.trim(),
          slug: newCategory.trim().toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const category = await response.json();
      setCategories([...categories, category]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/admin/blog/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  const handleAddTag = async () => {
    if (!newTag.trim()) return;

    try {
      const response = await fetch("/api/admin/blog/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTag.trim(),
          slug: newTag.trim().toLowerCase().replace(/\s+/g, "-"),
        }),
      });

      if (!response.ok) throw new Error("Failed to add tag");

      const tag = await response.json();
      setTags([...tags, tag]);
      setNewTag("");
    } catch (error) {
      console.error("Error adding tag:", error);
      alert("Failed to add tag. Please try again.");
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return;

    try {
      const response = await fetch(`/api/admin/blog/tags/${tagId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete tag");

      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag. Please try again.");
    }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button onClick={handleAddCategory}>Add Category</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span>{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Input
                placeholder="New tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button onClick={handleAddTag}>Add Tag</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span>{tag.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
