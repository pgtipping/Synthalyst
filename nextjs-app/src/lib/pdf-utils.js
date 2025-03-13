// PDF utility functions with crypto polyfill integration
import { pdf } from "@react-pdf/renderer";
import { initCrypto } from "./crypto-polyfill";

/**
 * Safely generates a PDF blob with crypto polyfill initialization
 * @param {React.ReactElement} document - The React PDF document component
 * @returns {Promise<Blob>} - A promise that resolves to the PDF blob
 */
export async function generatePDFBlob(document) {
  // Initialize crypto polyfills to prevent SHA224 errors
  initCrypto();

  try {
    // Generate the PDF blob
    return await pdf(document).toBlob();
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

/**
 * Safely generates and downloads a PDF with crypto polyfill initialization
 * @param {React.ReactElement} document - The React PDF document component
 * @param {string} fileName - The name of the file to download
 * @returns {Promise<void>}
 */
export async function downloadPDF(document, fileName) {
  try {
    // Initialize crypto polyfills
    initCrypto();

    // Only run in browser environment
    if (typeof window === "undefined") {
      throw new Error("downloadPDF can only be used in browser environment");
    }

    // Generate the PDF blob
    const blob = await generatePDFBlob(document);

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
    console.error("Error downloading PDF:", error);
    throw error;
  }
}
