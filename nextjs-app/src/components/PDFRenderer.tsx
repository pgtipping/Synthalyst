"use client";

import React, { useState, useEffect } from "react";
import { pdf, Document, DocumentProps } from "@react-pdf/renderer";
import { ErrorBoundary } from "react-error-boundary";

interface PDFRendererProps {
  document: React.ReactElement<DocumentProps, typeof Document>;
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

      // Generate the PDF blob
      const blob = await pdf(document).toBlob();

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;

      // Append to the document, click it, and remove it
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);

      // Clean up the URL object
      URL.revokeObjectURL(url);
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
