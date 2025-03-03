export interface ModelComparisonRequest {
  prompt: string;
  outputFormat?: "json" | "text";
  jsonSchema?: Record<string, unknown>;
  maxTokens?: number;
  temperature?: number;
}

export interface ModelComparisonResponse {
  llama: {
    output: string;
    rawOutput: string;
    isValidJson: boolean;
    processingTime: number;
    tokenUsage?: {
      input: number;
      output: number;
      total: number;
    };
    error?: string;
  };
  gemini: {
    output: string;
    rawOutput: string;
    isValidJson: boolean;
    processingTime: number;
    tokenUsage?: {
      input: number;
      output: number;
      total: number;
    };
    error?: string;
  };
  comparison: {
    structuralDifferences?: string[];
    contentDifferences?: string[];
    performanceComparison?: {
      processingTimeRatio: number;
      tokenEfficiencyRatio?: number;
    };
  };
}

export interface ModelOutput {
  output: string;
  rawOutput: string;
  isValidJson: boolean;
  processingTime: number;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  error?: string;
}
