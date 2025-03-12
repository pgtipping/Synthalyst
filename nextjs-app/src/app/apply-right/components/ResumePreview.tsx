"use client";

import React from "react";

interface ResumePreviewProps {
  content: string;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ content }) => {
  if (!content) {
    return (
      <div className="p-4 border rounded-md bg-white shadow-sm min-h-[500px] text-gray-400 flex items-center justify-center">
        <p>Your resume preview will appear here...</p>
      </div>
    );
  }

  // Split the content into lines
  const lines = content.split("\n");

  // Format the content with proper styling
  const formattedContent = lines.map((line, index) => {
    // Skip empty lines
    if (line.trim() === "") {
      return <div key={index} className="h-4"></div>;
    }

    // Clean text by removing unwanted characters
    const cleanText = (text: string) => {
      return text.replace(/\*/g, "").replace(/\[|\]/g, "");
    };

    // Check if this is a candidate name line (usually at the top, often with asterisks)
    if (
      index < 3 &&
      (line.includes("*[Candidate Name]*") ||
        (line.includes("**") && !line.includes("|") && !line.includes("@")))
    ) {
      return (
        <h1
          key={index}
          className="text-2xl font-bold text-center mb-2 text-gray-800"
        >
          {cleanText(line)}
        </h1>
      );
    }

    // Check if this is contact information (usually contains | or email symbols)
    if (
      index < 5 &&
      (line.includes("|") ||
        line.includes("@") ||
        (line.includes("[") && line.includes("]")))
    ) {
      return (
        <div key={index} className="text-center text-sm text-gray-600 mb-4">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a section header (marked with asterisks or starting with #)
    if (
      (line.includes("**") && line.trim().length < 50) ||
      line.startsWith("# ") ||
      line.startsWith("## ")
    ) {
      return (
        <h2
          key={index}
          className="text-lg font-bold mt-4 mb-2 pb-1 text-gray-800 border-b border-gray-300"
        >
          {cleanText(line)}
        </h2>
      );
    }

    // Check if this is a bullet point
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

      // Remove the bullet character and clean the text
      const bulletText = cleanText(line.trim().substring(1).trim());

      return (
        <div
          key={index}
          className="flex mb-1 text-gray-700"
          style={{ paddingLeft: `${indentLevel * 1.5}rem` }}
        >
          <span className="mr-2">•</span>
          <span>{bulletText}</span>
        </div>
      );
    }

    // Check if this is a company or position line (often has dates)
    if (
      (line.includes("Ltd") ||
        line.includes("Inc") ||
        line.includes("LLC") ||
        (line.includes("-") && (line.includes("20") || line.includes("19")))) &&
      line.trim().length < 100
    ) {
      return (
        <div key={index} className="font-semibold mt-3 mb-1 text-gray-800">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is part of a summary section
    const isSummary =
      index > 0 &&
      index < 15 &&
      lines
        .slice(Math.max(0, index - 5), index)
        .some(
          (l) =>
            l.toLowerCase().includes("summary") ||
            l.toLowerCase().includes("profile")
        );

    // Regular text
    return (
      <div
        key={index}
        className={`mb-1 ${isSummary ? "text-gray-600" : "text-gray-700"}`}
      >
        {cleanText(line)}
      </div>
    );
  });

  return (
    <div className="p-6 border rounded-md bg-white shadow-sm min-h-[500px] max-h-[700px] overflow-y-auto">
      <div className="max-w-2xl mx-auto">{formattedContent}</div>
    </div>
  );
};

export default ResumePreview;
