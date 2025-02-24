import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X, Edit2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
}

interface TemplateCategoriesProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectCategory: (categoryId: string) => void;
  onDeselectCategory: (categoryId: string) => void;
}

export function TemplateCategories({
  categories,
  selectedCategories,
  onSelectCategory,
  onDeselectCategory,
}: TemplateCategoriesProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#94a3b8",
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("/api/jd-developer/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      toast({
        title: "Success",
        description: "Category created successfully.",
      });

      setNewCategory({ name: "", description: "", color: "#94a3b8" });
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Create category error:", error);
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(
        `/api/jd-developer/categories/${editingCategory.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingCategory),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast({
        title: "Success",
        description: "Category updated successfully.",
      });

      setEditingCategory(null);
    } catch (error) {
      console.error("Update category error:", error);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/jd-developer/categories/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast({
        title: "Success",
        description: "Category deleted successfully.",
      });
    } catch (error) {
      console.error("Delete category error:", error);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Categories</h3>
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newCategory.description}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter category description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    className="w-20"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, color: e.target.value })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCategory(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`group relative inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              selectedCategories.includes(category.id)
                ? "border-transparent"
                : "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            style={{
              backgroundColor: selectedCategories.includes(category.id)
                ? category.color
                : undefined,
              color: selectedCategories.includes(category.id)
                ? "#fff"
                : undefined,
            }}
          >
            <span
              className="cursor-pointer"
              onClick={() =>
                selectedCategories.includes(category.id)
                  ? onDeselectCategory(category.id)
                  : onSelectCategory(category.id)
              }
            >
              {category.name}
            </span>
            <div className="ml-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => setEditingCategory(category)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => handleDeleteCategory(category.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editingCategory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter category description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={editingCategory.color}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    className="w-20"
                  />
                  <Input
                    value={editingCategory.color}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        color: e.target.value,
                      })
                    }
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateCategory}>Update</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
