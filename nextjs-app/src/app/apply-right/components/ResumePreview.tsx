"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResumePreviewProps {
  content: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  // Format the content with proper line breaks and spacing
  const formattedContent = content.split("\n").map((line, index) => {
    // Check if the line is a header (starts with # or ##)
    if (line.startsWith("# ") || line.startsWith("## ")) {
      const headerText = line.replace(/^#+ /, "");
      return (
        <h3 key={index} className="font-bold text-lg mt-4 mb-2">
          {headerText}
        </h3>
      );
    }

    // Check if the line is a bullet point
    if (
      line.trim().startsWith("•") ||
      line.trim().startsWith("-") ||
      line.trim().startsWith("*")
    ) {
      return (
        <li key={index} className="ml-4">
          {line.trim().substring(1).trim()}
        </li>
      );
    }

    // Empty lines create spacing
    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }

    // Regular text
    return (
      <p key={index} className="mb-1">
        {line}
      </p>
    );
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-1 font-mono text-sm">
        {content ? (
          formattedContent
        ) : (
          <p className="text-muted-foreground">No content to display</p>
        )}
      </div>
    </ScrollArea>
  );
}
