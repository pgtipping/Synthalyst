"use client";

import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Import the DocumentProps type for proper typing
import type { DocumentProps } from "@react-pdf/renderer";

// Create a simple PDF utility function
const downloadPDF = async (
  documentElement: React.ReactElement<DocumentProps>,
  fileName: string
) => {
  try {
    // Dynamically import the PDF renderer
    const { pdf } = await import("@react-pdf/renderer");
    const blob = await pdf(documentElement).toBlob();
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const link = window.document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

interface PDFRendererProps {
  document: React.ReactElement<DocumentProps>;
  fileName: string;
  children: React.ReactNode;
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
