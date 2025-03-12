"use client";

import React from "react";

interface CoverLetterPreviewProps {
  content: string;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ content }) => {
  if (!content) {
    return (
      <div className="p-4 border rounded-md bg-white shadow-sm min-h-[500px] text-gray-400 flex items-center justify-center">
        <p>Your cover letter preview will appear here...</p>
      </div>
    );
  }

  // Split the content into lines
  const lines = content.split("\n");

  // Clean text by removing unwanted characters
  const cleanText = (text: string) => {
    return text.replace(/\*/g, "").replace(/\[|\]/g, "");
  };

  // Format the content with proper styling
  const formattedContent = lines.map((line, index) => {
    // Skip empty lines
    if (line.trim() === "") {
      return <div key={index} className="h-4"></div>;
    }

    // Check if this is a date line (usually contains month names or date formats)
    if (
      (line.match(/\b\d{1,2}(st|nd|rd|th)?\b/) ||
        line.match(
          /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/
        ) ||
        line.match(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/)) &&
      index < 10
    ) {
      return (
        <div key={index} className="text-right mb-6 text-gray-600 font-serif">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a sender info line (usually at the top)
    if (index < 5 && !line.includes("Dear") && !line.includes("To Whom")) {
      return (
        <div key={index} className="font-serif mb-1 text-gray-800">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a recipient info line (usually after sender info and before greeting)
    if (
      index < 15 &&
      index > 3 &&
      !line.includes("Dear") &&
      !line.includes("To Whom") &&
      !line.match(
        /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/
      )
    ) {
      return (
        <div key={index} className="font-serif mb-1 text-gray-800">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a greeting line (Dear...)
    if (line.includes("Dear") || line.includes("To Whom")) {
      return (
        <div key={index} className="font-serif mt-6 mb-6 text-gray-800">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a closing line (Sincerely, etc.)
    if (
      line.match(
        /^(Sincerely|Best regards|Regards|Yours truly|Respectfully|Thank you)/i
      )
    ) {
      return (
        <div key={index} className="font-serif mt-6 mb-1 text-gray-800">
          {cleanText(line)}
        </div>
      );
    }

    // Check if this is a signature line (usually after closing)
    if (
      index > lines.length - 5 &&
      line.trim() !== "" &&
      !line.match(
        /^(Sincerely|Best regards|Regards|Yours truly|Respectfully|Thank you)/i
      )
    ) {
      return (
        <div
          key={index}
          className="font-serif font-semibold mt-8 mb-1 text-gray-800"
        >
          {cleanText(line)}
        </div>
      );
    }

    // Regular paragraph text
    return (
      <div
        key={index}
        className="font-serif mb-4 text-gray-700 leading-relaxed"
      >
        {cleanText(line)}
      </div>
    );
  });

  return (
    <div className="p-8 border rounded-md bg-white shadow-sm min-h-[500px] max-h-[700px] overflow-y-auto">
      <div className="max-w-2xl mx-auto">{formattedContent}</div>
    </div>
  );
};

export default CoverLetterPreview;
