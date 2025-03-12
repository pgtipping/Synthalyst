"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  content: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  // Format the content with proper line breaks and spacing
  const formattedContent = content.split("\n").map((line, index, array) => {
    // Check if the line is a header (starts with # or ##) or contains ** for emphasis
    if (line.startsWith("# ") || line.startsWith("## ")) {
      const headerText = line.replace(/^#+ /, "");
      return (
        <h3 key={index} className="font-bold text-lg mt-6 mb-2 text-primary">
          {headerText}
        </h3>
      );
    }

    // Check if the line contains a name (usually at the top of the resume)
    if (
      line.includes("*[Candidate Name]*") ||
      (index < 3 && line.includes("**"))
    ) {
      return (
        <h2 key={index} className="font-bold text-2xl mt-2 mb-4 text-center">
          {line.replace(/\*/g, "")}
        </h2>
      );
    }

    // Handle contact information line (usually contains phone, email, LinkedIn)
    if (
      (index < 5 && line.includes("[") && line.includes("]")) ||
      (index < 5 && line.includes("|"))
    ) {
      return (
        <div key={index} className="text-center mb-4 text-muted-foreground">
          {line}
        </div>
      );
    }

    // Check if the line is a bullet point
    if (
      line.trim().startsWith("•") ||
      line.trim().startsWith("-") ||
      line.trim().startsWith("*")
    ) {
      // Determine indentation level based on leading spaces
      const indentMatch = line.match(/^\s+/);
      const indentLevel = indentMatch
        ? Math.floor(indentMatch[0].length / 2)
        : 0;

      return (
        <li
          key={index}
          className={cn(
            "ml-6 pl-2 mb-1.5 relative before:absolute before:content-[''] before:w-1.5 before:h-1.5 before:bg-primary/70 before:rounded-full before:left-[-0.75rem] before:top-[0.5rem]",
            indentLevel > 0 && `ml-${6 + indentLevel * 4}`
          )}
        >
          {line.trim().substring(1).trim()}
        </li>
      );
    }

    // Handle section titles (often marked with asterisks)
    if (line.includes("**") && line.trim().length < 50) {
      const cleanText = line.replace(/\*/g, "");
      return (
        <h4
          key={index}
          className="font-semibold text-base mt-4 mb-2 border-b pb-1 border-muted"
        >
          {cleanText}
        </h4>
      );
    }

    // Handle company or position lines (often have dates at the end)
    if (
      line.includes("Ltd") ||
      line.includes("Inc") ||
      line.includes("LLC") ||
      (line.includes("-") && (line.includes("20") || line.includes("19")))
    ) {
      return (
        <div key={index} className="font-medium mt-3 mb-1">
          {line}
        </div>
      );
    }

    // Empty lines create spacing
    if (line.trim() === "") {
      return <div key={index} className="h-2" />;
    }

    // Regular text - check if it's part of a summary section
    const isSummary =
      index > 0 &&
      index < 20 &&
      array
        .slice(Math.max(0, index - 5), index)
        .some(
          (l) =>
            l.toLowerCase().includes("summary") ||
            l.toLowerCase().includes("profile")
        );

    return (
      <p
        key={index}
        className={cn("mb-1.5", isSummary ? "text-muted-foreground" : "")}
      >
        {line}
      </p>
    );
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-6">
      <div className="space-y-1 font-sans text-sm">
        {content ? (
          <div className="max-w-3xl mx-auto">{formattedContent}</div>
        ) : (
          <p className="text-muted-foreground">No content to display</p>
        )}
      </div>
    </ScrollArea>
  );
}
