"use client";

import mammoth from "mammoth";
import JSZip from "jszip";
// Remove the direct import of pdfToText
// import pdfToText from "react-pdftotext";

/**
 * Parse a document file and extract its text content
 * @param file The file to parse (PDF, DOCX, DOC, or TXT)
 * @returns A promise that resolves to the extracted text
 */
export async function parseDocument(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // Handle different file types
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await parsePdf(file);
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      return await parseDocx(file);
    } else if (fileType === "application/msword" || fileName.endsWith(".doc")) {
      return await parseDoc(file);
    } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return await parseText(file);
    } else {
      throw new Error(
        `Unsupported file type: ${fileType}. Please upload a PDF, DOC, DOCX, or TXT file.`
      );
    }
  } catch (error) {
    console.error("Error parsing document:", error);

    // Provide specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("Could not find the body element")) {
        throw new Error(
          "Invalid document format. Please ensure you're uploading a valid Word file."
        );
      } else if (error.message.includes("Unsupported file type")) {
        throw new Error(
          "Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file."
        );
      } else if (
        error.message.includes("End of data reached") ||
        error.message.includes("Invalid compound document")
      ) {
        throw new Error(
          "The document appears to be corrupted or in an unsupported format."
        );
      }
    }

    // Generic fallback error
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

    if (!text || text.trim() === "") {
      throw new Error(
        "Could not extract text from PDF. The file may be empty or protected."
      );
    }

    return text.trim();
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      "Failed to extract text from PDF. Please try a different file format."
    );
  }
}

/**
 * Parse a DOCX document and extract its text content
 * @param file The DOCX document to parse
 * @returns A promise that resolves to the extracted text
 */
async function parseDocx(file: File): Promise<string> {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Validate file size
    if (arrayBuffer.byteLength === 0) {
      throw new Error("The document is empty.");
    }

    try {
      // First attempt: Use mammoth.js to extract text
      const result = await mammoth.extractRawText({ arrayBuffer });

      // Check if any text was extracted
      if (result.value && result.value.trim() !== "") {
        // Check for warnings
        if (result.messages && result.messages.length > 0) {
          console.warn("Warnings during document parsing:", result.messages);
        }

        return result.value.trim();
      }
    } catch (mammothError) {
      console.warn(
        "Mammoth.js parsing failed, trying fallback method:",
        mammothError
      );
      // Continue to fallback method
    }

    // Fallback method: Extract text from document.xml using JSZip
    return await extractTextFromDocxFallback(arrayBuffer);
  } catch (error) {
    console.error("Error parsing DOCX document:", error);

    // Provide more specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes("Could not find the body element")) {
        throw new Error(
          "Invalid DOCX format. The file may be corrupted or not a valid Word document."
        );
      } else if (error.message.includes("End of data reached")) {
        throw new Error(
          "The document appears to be corrupted or in an unsupported format."
        );
      }
    }

    // Re-throw the error to be handled by the parent function
    throw error;
  }
}

/**
 * Parse a DOC document and extract its text content
 * @param file The DOC document to parse
 * @returns A promise that resolves to the extracted text
 */
async function parseDoc(file: File): Promise<string> {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Validate file size
    if (arrayBuffer.byteLength === 0) {
      throw new Error("The document is empty.");
    }

    // First try mammoth - it can sometimes handle DOC files
    try {
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim() !== "") {
        return result.value.trim();
      }
    } catch (mammothError) {
      console.warn("Mammoth failed to parse DOC file:", mammothError);
      // Continue to alternative methods
    }

    // If we're here, mammoth failed. Try to convert the file to a Blob and read it as text
    // This is a fallback that might work for some DOC files
    try {
      // Create a new Blob from the ArrayBuffer
      const blob = new Blob([arrayBuffer]);

      // Try to read the blob as text - this might work for some DOC files
      // that are actually RTF or other text-based formats
      const text = await readBlobAsText(blob);

      if (text && text.trim() !== "" && !text.includes("\0\0\0\0")) {
        // Filter out binary content and extract readable text
        const cleanedText = cleanDocText(text);
        if (cleanedText && cleanedText.trim() !== "") {
          return cleanedText;
        }
      }
    } catch (blobError) {
      console.warn("Blob text extraction failed:", blobError);
    }

    // If we reach here, we couldn't extract text from the DOC file
    throw new Error(
      "Could not extract text from DOC file. Please convert it to DOCX or PDF and try again."
    );
  } catch (error) {
    console.error("Error parsing DOC document:", error);

    // Provide a specific error message for DOC files
    throw new Error(
      "Failed to extract text from DOC file. DOC is an older format with limited support. Please convert to DOCX or PDF and try again."
    );
  }
}

/**
 * Read a Blob as text
 * @param blob The Blob to read
 * @returns A promise that resolves to the text content
 */
function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

/**
 * Clean text extracted from DOC files
 * @param text The raw text extracted from a DOC file
 * @returns Cleaned text with binary content removed
 */
function cleanDocText(text: string): string {
  // Remove binary content and keep only readable text
  // This is a simple approach that might need refinement
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, "") // Remove binary characters
    .replace(/\uFFFD/g, "") // Remove replacement character
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

/**
 * Fallback method to extract text from DOCX files when mammoth.js fails
 * @param arrayBuffer The document as an ArrayBuffer
 * @returns A promise that resolves to the extracted text
 */
async function extractTextFromDocxFallback(
  arrayBuffer: ArrayBuffer
): Promise<string> {
  try {
    // Load the DOCX file using JSZip
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(arrayBuffer);

    // Try to find document.xml in different possible locations
    const possiblePaths = [
      "word/document.xml",
      "word/document2.xml",
      "document.xml",
    ];

    let documentXml = null;

    // Try each possible path
    for (const path of possiblePaths) {
      const file = zipContent.file(path);
      if (file) {
        documentXml = await file.async("string");
        break;
      }
    }

    if (!documentXml) {
      throw new Error("Could not find document content in the DOCX file.");
    }

    // Extract text from XML using regex
    // This is a simple approach that extracts text between <w:t> tags
    const textMatches = documentXml.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
    const extractedText = textMatches
      .map((match) => {
        // Extract the content between the tags and decode XML entities
        const content = match.replace(/<w:t[^>]*>(.*?)<\/w:t>/g, "$1");
        return decodeXmlEntities(content);
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (!extractedText) {
      throw new Error("No text content found in the document.");
    }

    return extractedText;
  } catch (error) {
    console.error("Fallback extraction failed:", error);
    throw new Error("Failed to extract text using fallback method.");
  }
}

/**
 * Decode XML entities in a string
 * @param str The string to decode
 * @returns The decoded string
 */
function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Parse a plain text file and extract its content
 * @param file The text file to parse
 * @returns A promise that resolves to the file content
 */
async function parseText(file: File): Promise<string> {
  try {
    const text = await file.text();

    if (!text || text.trim() === "") {
      throw new Error("The text file is empty.");
    }

    return text.trim();
  } catch (error) {
    console.error("Error parsing text file:", error);
    throw new Error("Failed to read text file. The file may be corrupted.");
  }
}
