"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverLetterPreviewProps {
  content: string;
}

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  // Format the content with proper line breaks and spacing
  const formattedContent = content.split("\n").map((line, index) => {
    // Empty lines create spacing
    if (line.trim() === "") {
      return <div key={index} className="h-4" />;
    }

    // Regular text
    return (
      <p key={index} className="mb-2">
        {line}
      </p>
    );
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-1 font-serif text-sm">
        {content ? (
          formattedContent
        ) : (
          <p className="text-muted-foreground">No cover letter available</p>
        )}
      </div>
    </ScrollArea>
  );
}
