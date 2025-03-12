"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, File, X } from "lucide-react";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    onFileUpload(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 
          flex flex-col items-center justify-center
          transition-colors
          ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }
          ${selectedFile ? "bg-muted/50" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleChange}
        />

        {!selectedFile ? (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">Drag & drop your resume</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button onClick={openFileSelector} variant="outline">
              Select File
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, DOCX (Max 5MB)
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <File className="h-10 w-10 text-primary mb-4" />
            <p className="text-lg font-medium mb-1">File selected</p>
            <div className="flex items-center bg-muted p-2 rounded-md mt-2">
              <span className="text-sm truncate max-w-[200px]">
                {selectedFile.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
