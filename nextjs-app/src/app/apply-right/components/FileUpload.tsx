"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileText, Loader2, AlertCircle, Info } from "lucide-react";
import { parseDocument } from "../utils/documentParser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadProps {
  onFileUpload: (file: File, text: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    // Reset error and warning states
    setError(null);
    setWarning(null);

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    // Check if it's a DOC file (older format)
    const isDocFile =
      selectedFile.type === "application/msword" ||
      selectedFile.name.toLowerCase().endsWith(".doc");

    if (isDocFile) {
      setWarning(
        "You've uploaded a DOC file (older Word format). While we'll try to process it, DOCX files provide better results. Consider converting your file to DOCX for optimal performance."
      );
      toast.info(
        "DOC files may have limited support. DOCX format is recommended for best results.",
        { duration: 6000 }
      );
    }

    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.toLowerCase().match(/\.(pdf|doc|docx|txt)$/)
    ) {
      const errorMsg = "Please upload a PDF, DOC, DOCX, or TXT file";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      const errorMsg = "File size exceeds 5MB limit";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Check if file is empty
    if (selectedFile.size === 0) {
      const errorMsg = "The file appears to be empty";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setFile(selectedFile);
    setIsLoading(true);

    try {
      // Parse the document to extract text
      const text = await parseDocument(selectedFile);

      if (!text || text.trim() === "") {
        throw new Error("Could not extract text from the document");
      }

      // If text is too short, it might indicate a parsing issue
      if (text.length < 100 && isDocFile) {
        setWarning(
          "Limited text was extracted from your DOC file. For better results, please convert to DOCX or PDF format."
        );
      }

      // Clear any previous errors
      setError(null);
      onFileUpload(selectedFile, text);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process file";

      // Provide more helpful error messages for DOC files
      if (isDocFile && errorMessage.includes("DOC file")) {
        setError(
          "We couldn't process your DOC file. Please convert it to DOCX format using Microsoft Word or a free online converter and try again."
        );
      } else {
        setError(errorMessage);
      }

      toast.error(errorMessage);
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        await processFile(droppedFile);
      }
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        await processFile(selectedFile);
      }
    },
    [processFile]
  );

  const openFileDialog = () => {
    // Trigger click on the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    setFile(null);
    setError(null);
    setWarning(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {warning && (
        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Note</AlertTitle>
          <AlertDescription className="text-amber-700">
            {warning}
          </AlertDescription>
        </Alert>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive
            ? "border-primary bg-primary/5"
            : error
            ? "border-destructive/50"
            : "border-muted-foreground/25"
        } ${!file && !isLoading ? "cursor-pointer" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!file && !isLoading ? openFileDialog : undefined}
      >
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">
              Processing your resume...
            </p>
          </div>
        ) : file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <Button variant="outline" onClick={resetFile} className="mt-2">
              Change File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Upload className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Drag and drop your resume</p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOCX (recommended), DOC, and TXT files (max 5MB)
              </p>
              <p className="text-xs text-muted-foreground">
                For best results, use DOCX or PDF format
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent double triggering
                  openFileDialog();
                }}
              >
                Browse Files
              </Button>
            </div>
          </div>
        )}
      </div>

      {!error && file && !isLoading && (
        <p className="text-sm text-center text-muted-foreground">
          Resume uploaded successfully. You can now proceed to the next step.
        </p>
      )}
    </div>
  );
}
