"use client";

import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, FileText, Loader2 } from "lucide-react";
import { parseDocument } from "../utils/documentParser";

interface FileUploadProps {
  onFileUpload: (file: File, text: string) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF, DOC, DOCX, or TXT file");
      return;
    }

    // Check file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
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

      onFileUpload(selectedFile, text);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to process file"
      );
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

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive
            ? "border-primary bg-primary/5"
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
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the parent div's onClick
                setFile(null);
              }}
              className="mt-2"
            >
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
                Supports PDF, DOC, DOCX, and TXT files (max 5MB)
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
    </div>
  );
}
