import React from "react";
import {
  ExternalLink,
  BookOpen,
  Video,
  FileText,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define the resource type
export interface Resource {
  id: string;
  title: string;
  type: "book" | "video" | "article" | "course" | "tool" | "other";
  description: string;
  isPremium?: boolean;
  author?: string;
  url?: string;
}

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  // Get the appropriate icon based on resource type
  const getResourceIcon = (type: Resource["type"]) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card
      className={cn("overflow-hidden", className)}
      variant={resource.isPremium ? "gradient" : undefined}
      variantKey={resource.isPremium ? "accent" : undefined}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getResourceIcon(resource.type)}
            <h4
              className={cn("font-medium", resource.isPremium && "text-white")}
            >
              {resource.title}
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize",
                resource.isPremium && "border-white/20 text-white"
              )}
            >
              {resource.type}
            </Badge>
            {resource.isPremium && (
              <Badge variant="default" className="bg-white/20 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>
        </div>

        {resource.author && (
          <p
            className={cn(
              "text-sm text-muted-foreground mt-1",
              resource.isPremium && "text-white/70"
            )}
          >
            By {resource.author}
          </p>
        )}

        <p
          className={cn("text-sm mt-2", resource.isPremium && "text-white/90")}
        >
          {resource.description}
        </p>
      </CardContent>

      {resource.url && (
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button
            variant={resource.isPremium ? "secondary" : "outline"}
            size="sm"
            asChild
          >
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View Resource
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
