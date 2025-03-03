"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ModelComparisonResponse } from "@/types/modelComparison";

// Form validation schema
const formSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  outputFormat: z.enum(["json", "text"]),
  jsonSchema: z.string().optional(),
  maxTokens: z.number().int().positive().max(4000),
  temperature: z.number().min(0).max(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function ModelComparisonPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ModelComparisonResponse | null>(null);
  const [activeTab, setActiveTab] = useState("form");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      outputFormat: "text",
      jsonSchema: "",
      maxTokens: 1000,
      temperature: 0.7,
    },
  });

  const outputFormat = watch("outputFormat");
  const temperature = watch("temperature");
  const maxTokens = watch("maxTokens");

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // Parse JSON schema if provided and output format is JSON
      let jsonSchema;
      if (data.outputFormat === "json" && data.jsonSchema) {
        try {
          jsonSchema = JSON.parse(data.jsonSchema);
        } catch {
          alert("Invalid JSON schema. Please check your input.");
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch("/api/model-comparison", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: data.prompt,
          outputFormat: data.outputFormat,
          jsonSchema,
          maxTokens: data.maxTokens,
          temperature: data.temperature,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error?.message || "Failed to compare models"
        );
      }

      setResult(responseData.data);
      setActiveTab("results");
    } catch (error) {
      console.error("Error comparing models:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        Model Comparison: Llama 3.2 3b vs Gemini
      </h1>
      <p className="text-gray-600 mb-8">
        Compare the output of Llama 3.2 3b and Gemini models with the same
        prompt and parameters. Particularly useful for testing structured JSON
        output capabilities.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="form">Input</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison Input</CardTitle>
              <CardDescription>
                Enter a prompt and configure parameters to compare both models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="comparison-form"
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter your prompt here..."
                    className="min-h-[150px]"
                    {...register("prompt")}
                  />
                  {errors.prompt && (
                    <p className="text-red-500 text-sm">
                      {errors.prompt.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="output-format"
                      checked={outputFormat === "json"}
                      onCheckedChange={(checked) =>
                        setValue("outputFormat", checked ? "json" : "text")
                      }
                    />
                    <Label htmlFor="output-format">JSON Output</Label>
                  </div>
                </div>

                {outputFormat === "json" && (
                  <div className="space-y-2">
                    <Label htmlFor="json-schema">JSON Schema (optional)</Label>
                    <Textarea
                      id="json-schema"
                      placeholder="Enter JSON schema..."
                      className="min-h-[100px]"
                      {...register("jsonSchema")}
                    />
                    <p className="text-xs text-gray-500">
                      Provide a JSON schema to guide the model&apos;s output
                      structure.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="temperature">
                      Temperature: {temperature}
                    </Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[temperature]}
                    onValueChange={(value) => setValue("temperature", value[0])}
                  />
                  <p className="text-xs text-gray-500">
                    Lower values produce more deterministic outputs, higher
                    values more creative.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                  </div>
                  <Slider
                    id="max-tokens"
                    min={100}
                    max={4000}
                    step={100}
                    value={[maxTokens]}
                    onValueChange={(value) => setValue("maxTokens", value[0])}
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="comparison-form" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Comparing...
                  </>
                ) : (
                  "Compare Models"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {result && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Llama 3.2 3b
                      {result.llama.isValidJson && (
                        <Badge variant="outline" className="ml-2 bg-green-100">
                          Valid JSON
                        </Badge>
                      )}
                      {!result.llama.isValidJson && outputFormat === "json" && (
                        <Badge variant="outline" className="ml-2 bg-red-100">
                          Invalid JSON
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Processing Time: {result.llama.processingTime}ms
                      {result.llama.tokenUsage && (
                        <span className="block">
                          Tokens: {result.llama.tokenUsage.input} in /{" "}
                          {result.llama.tokenUsage.output} out
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                      <pre className="text-sm whitespace-pre-wrap">
                        {result.llama.output}
                      </pre>
                    </div>
                    {result.llama.error && (
                      <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                        <p className="font-semibold">Error:</p>
                        <p>{result.llama.error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Gemini
                      {result.gemini.isValidJson && (
                        <Badge variant="outline" className="ml-2 bg-green-100">
                          Valid JSON
                        </Badge>
                      )}
                      {!result.gemini.isValidJson &&
                        outputFormat === "json" && (
                          <Badge variant="outline" className="ml-2 bg-red-100">
                            Invalid JSON
                          </Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                      Processing Time: {result.gemini.processingTime}ms
                      {result.gemini.tokenUsage && (
                        <span className="block">
                          Tokens: {result.gemini.tokenUsage.input} in /{" "}
                          {result.gemini.tokenUsage.output} out
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                      <pre className="text-sm whitespace-pre-wrap">
                        {result.gemini.output}
                      </pre>
                    </div>
                    {result.gemini.error && (
                      <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
                        <p className="font-semibold">Error:</p>
                        <p>{result.gemini.error}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Comparison Analysis</CardTitle>
                  <CardDescription>
                    Differences and performance comparison between the two
                    models.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Performance</h3>
                      {result.comparison.performanceComparison && (
                        <>
                          <p>
                            <span className="font-medium">
                              Processing Time Ratio:
                            </span>{" "}
                            {result.comparison.performanceComparison.processingTimeRatio.toFixed(
                              2
                            )}
                            {result.comparison.performanceComparison
                              .processingTimeRatio < 1 ? (
                              <span className="text-green-600 ml-2">
                                (Llama was{" "}
                                {(
                                  1 /
                                  result.comparison.performanceComparison
                                    .processingTimeRatio
                                ).toFixed(2)}
                                x faster)
                              </span>
                            ) : (
                              <span className="text-blue-600 ml-2">
                                (Gemini was{" "}
                                {result.comparison.performanceComparison.processingTimeRatio.toFixed(
                                  2
                                )}
                                x faster)
                              </span>
                            )}
                          </p>
                          {result.comparison.performanceComparison
                            .tokenEfficiencyRatio && (
                            <p>
                              <span className="font-medium">
                                Token Efficiency Ratio:
                              </span>{" "}
                              {result.comparison.performanceComparison.tokenEfficiencyRatio.toFixed(
                                2
                              )}
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {outputFormat === "json" && (
                      <>
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Structural Differences
                          </h3>
                          {result.comparison.structuralDifferences?.length ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {result.comparison.structuralDifferences.map(
                                (diff, index) => (
                                  <li key={index} className="text-gray-700">
                                    {diff}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-gray-600">
                              No structural differences found.
                            </p>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Content Differences
                          </h3>
                          {result.comparison.contentDifferences?.length ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {result.comparison.contentDifferences.map(
                                (diff, index) => (
                                  <li key={index} className="text-gray-700">
                                    {diff}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <p className="text-gray-600">
                              No content differences found.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
