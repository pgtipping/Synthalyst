"use client";

import mammoth from "mammoth";
// Remove the direct import of pdfToText
// import pdfToText from "react-pdftotext";

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
      return await parsePdf(file);
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
 * Parse a PDF document and extract its text content
 * @param file The PDF document to parse
 * @returns A promise that resolves to the extracted text
 */
async function parsePdf(file: File): Promise<string> {
  try {
    // Dynamically import the PDF parser only when needed (client-side only)
    if (typeof window === "undefined") {
      // We're on the server, return a message
      return "PDF parsing is only available in the browser. The file will be processed when viewed in the browser.";
    }

    // We're in the browser, dynamically import the PDF parser
    const pdfToTextModule = await import("react-pdftotext");
    const pdfToText = pdfToTextModule.default;

    const text = await pdfToText(file);
    return text.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      "Failed to extract text from PDF. Please try a different file format."
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
