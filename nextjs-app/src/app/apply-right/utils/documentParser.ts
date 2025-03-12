"use client";

import mammoth from "mammoth";

/**
 * Parse a document file and extract its text content
 * @param file The file to parse (PDF, DOCX, DOC, or TXT)
 * @returns A promise that resolves to the extracted text
 */
export async function parseDocument(file: File): Promise<string> {
  const fileType = file.type;

  try {
    // Handle different file types
    if (fileType === "application/pdf") {
      // For PDF files, we'll use a simpler approach for now
      // In production, you might want to use a more robust solution
      return "PDF parsing is temporarily disabled. Please upload a DOC, DOCX, or TXT file instead.";
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      return await parseWord(file);
    } else if (fileType === "text/plain") {
      return await parseText(file);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error(
      "Failed to extract text from document. Please try a different file."
    );
  }
}

/**
 * Parse a Word document (DOCX/DOC) and extract its text content
 * @param file The Word document to parse
 * @returns A promise that resolves to the extracted text
 */
async function parseWord(file: File): Promise<string> {
  // Convert the file to an ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Extract text from the document
  const result = await mammoth.extractRawText({ arrayBuffer });

  return result.value.trim();
}

/**
 * Parse a plain text file and extract its content
 * @param file The text file to parse
 * @returns A promise that resolves to the file content
 */
async function parseText(file: File): Promise<string> {
  return await file.text();
}
