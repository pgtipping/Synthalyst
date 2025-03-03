import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Model Comparison - Llama 3.2 3b vs Gemini | Synthalyst",
  description:
    "Compare the output of Llama 3.2 3b and Gemini models with the same prompt and parameters. Particularly useful for testing structured JSON output capabilities.",
};

export default function ModelComparisonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
