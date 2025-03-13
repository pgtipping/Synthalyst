declare module "pdf-parse" {
  interface PDFParseOptions {
    pagerender?: (pageData: any) => string;
    max?: number;
    version?: string;
  }

  interface PDFParseResult {
    numpages: number;
    numrender: number;
    info: {
      PDFFormatVersion: string;
      IsAcroFormPresent: boolean;
      IsXFAPresent: boolean;
      [key: string]: any;
    };
    metadata: {
      [key: string]: any;
    } | null;
    text: string;
    version: string;
  }

  function PDFParse(
    dataBuffer: Buffer | Uint8Array | ArrayBuffer,
    options?: PDFParseOptions
  ): Promise<PDFParseResult>;

  export = PDFParse;
}
