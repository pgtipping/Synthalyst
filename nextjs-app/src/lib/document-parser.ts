import { Buffer } from "buffer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

/**
 * Parse a PDF or DOCX file and extract the text content
 * @param file The file to parse
 * @returns The extracted text content
 */
export async function parseDocument(file: File): Promise<string> {
  try {
    const buffer = await fileToBuffer(file);

    if (file.type === "application/pdf") {
      return await parsePdf(buffer);
    } else if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await parseDocx(buffer);
    } else {
      throw new Error(
        "Unsupported file type. Please upload a PDF or DOCX file."
      );
    }
  } catch (error) {
    console.error("Error parsing document:", error);
    throw new Error(
      "Failed to parse document. Please try again with a different file."
    );
  }
}

/**
 * Convert a File object to a Buffer
 * @param file The file to convert
 * @returns A Buffer containing the file data
 */
async function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const buffer = Buffer.from(reader.result);
        resolve(buffer);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse a PDF file and extract the text content
 * @param buffer The PDF file as a Buffer
 * @returns The extracted text content
 */
async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error(
      "Failed to parse PDF. The file might be corrupted or password-protected."
    );
  }
}

/**
 * Parse a DOCX file and extract the text content
 * @param buffer The DOCX file as a Buffer
 * @returns The extracted text content
 */
async function parseDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error(
      "Failed to parse DOCX. The file might be corrupted or in an unsupported format."
    );
  }
}
