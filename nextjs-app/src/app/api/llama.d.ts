declare module "llama" {
  export function createCompletion(options: {
    model: string;
    prompt: string;
    apiKey: string;
  }): Promise<{ completion: string }>;
}
