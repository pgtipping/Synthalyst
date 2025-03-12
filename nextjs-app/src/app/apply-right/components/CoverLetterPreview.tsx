"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverLetterPreviewProps {
  content: string;
}

export function CoverLetterPreview({ content }: CoverLetterPreviewProps) {
  // Format the content with proper line breaks and spacing
  const formattedContent = content.split("\n").map((line, index, array) => {
    // Empty lines create spacing
    if (line.trim() === "") {
      return <div key={index} className="h-4" />;
    }

    // Check if this is a date line (typically at the top of a cover letter)
    if (
      line.match(
        /^(January|February|March|April|May|June|July|August|September|October|November|December)/i
      ) &&
      index < 5
    ) {
      return (
        <p key={index} className="text-right text-muted-foreground mb-4">
          {line}
        </p>
      );
    }

    // Check if this is a greeting line (Dear...)
    if (line.trim().startsWith("Dear ") || line.trim().startsWith("To ")) {
      return (
        <p key={index} className="font-medium mb-4">
          {line}
        </p>
      );
    }

    // Check if this is a closing line (Sincerely, etc.)
    if (
      line.trim().startsWith("Sincerely,") ||
      line.trim().startsWith("Best regards,") ||
      line.trim().startsWith("Regards,") ||
      line.trim().startsWith("Yours truly,") ||
      line.trim().startsWith("Thank you,")
    ) {
      return (
        <p key={index} className="mt-4 mb-2">
          {line}
        </p>
      );
    }

    // Check if this is a signature line (usually after closing)
    const prevLine = index > 0 ? array[index - 1].trim() : "";
    if (
      (prevLine.startsWith("Sincerely,") ||
        prevLine.startsWith("Best regards,") ||
        prevLine.startsWith("Regards,") ||
        prevLine.startsWith("Yours truly,") ||
        prevLine.startsWith("Thank you,")) &&
      line.trim().length > 0
    ) {
      return (
        <p key={index} className="font-medium">
          {line}
        </p>
      );
    }

    // Regular paragraph
    return (
      <p key={index} className="mb-3 leading-relaxed">
        {line}
      </p>
    );
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-6">
      <div className="space-y-1 font-serif text-sm">
        {content ? (
          <div className="max-w-3xl mx-auto">{formattedContent}</div>
        ) : (
          <p className="text-muted-foreground">No cover letter available</p>
        )}
      </div>
    </ScrollArea>
  );
}
