"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Import the DocumentProps type for proper typing
import type { DocumentProps } from "@react-pdf/renderer";

// Create a simple PDF utility function
const downloadPDF = async (
  documentElement: React.ReactElement<DocumentProps>,
  fileName: string
) => {
  try {
    console.log("Starting PDF download process");
    console.log("Document prop:", documentElement ? "Exists" : "Undefined");
    console.log("FileName:", fileName);

    // Dynamically import the PDF renderer
    console.log("About to import @react-pdf/renderer");
    const { pdf } = await import("@react-pdf/renderer");
    console.log("pdf import successful:", pdf ? "Yes" : "No");

    // Create a blob from the PDF
    console.log("About to render to blob");
    const blob = await pdf(documentElement).toBlob();
    console.log("Blob created successfully:", blob ? "Yes" : "No");

    // Create a URL for the blob
    console.log("Creating URL for blob");
    const url = URL.createObjectURL(blob);
    console.log("URL created:", url ? "Yes" : "No");

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;

    // Append the link to the body
    document.body.appendChild(link);

    // Click the link to download the PDF
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);

    // Revoke the URL
    URL.revokeObjectURL(url);
    console.log("PDF download process completed successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Try to identify the specific issue
    if (error instanceof TypeError && error.message.includes("undefined")) {
      console.error(
        "Undefined value detected. Check if all required props are provided."
      );
      console.log(
        "Document structure:",
        JSON.stringify(
          documentElement,
          (key, value) => {
            if (React.isValidElement(value)) {
              return `[React Element: ${value.type.name || "Unknown"}]`;
            }
            return value;
          },
          2
        )
      );
    }
  }
};

interface PDFRendererProps {
  document: React.ReactElement<DocumentProps>;
  fileName: string;
  children: ReactNode;
}

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
      <h2 className="text-lg font-bold mb-2">Error generating PDF</h2>
      <p className="mb-2">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

export default function PDFRenderer({
  document,
  fileName,
  children,
}: PDFRendererProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGeneratePDF = async () => {
    try {
      if (!isClient) return;
      await downloadPDF(document, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  if (!isClient) {
    return <div className="opacity-50 cursor-not-allowed">{children}</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div onClick={handleGeneratePDF} className="cursor-pointer">
        {children}
      </div>
    </ErrorBoundary>
  );
}
