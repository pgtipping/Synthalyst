"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContentGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="mb-4 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="mr-2 h-4 w-4" />
        ) : (
          <ChevronRight className="mr-2 h-4 w-4" />
        )}
        {isOpen ? "Hide Content Guide" : "Show Content Guide"}
      </Button>

      {isOpen && (
        <Card className="mb-6 border border-gray-200">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg">Content Creation Guide</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="voice">
              <TabsList className="w-full justify-start border-b px-4">
                <TabsTrigger value="voice">Voice & Tone</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="p-4">
                <h3 className="mb-2 font-semibold">Brand Voice & Tone</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Forward-thinking and solution-oriented</li>
                  <li>Authoritative yet approachable</li>
                  <li>Evidence-based and practical</li>
                  <li>Progressive and innovative</li>
                  <li>Focuses on actionable insights</li>
                </ul>
              </TabsContent>

              <TabsContent value="structure" className="p-4">
                <h3 className="mb-2 font-semibold">Content Structure</h3>

                <h4 className="mt-3 font-medium">Title Format</h4>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Must be clear and specific</li>
                  <li>Should include actionable or valuable insight</li>
                  <li>Length: 40-60 characters</li>
                  <li>
                    Example: &ldquo;How AI-Powered Task Management Is
                    Revolutionizing Team Productivity&rdquo;
                  </li>
                </ul>

                <h4 className="mt-3 font-medium">Introduction</h4>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Start with a compelling hook</li>
                  <li>Establish relevance to reader&apos;s progress</li>
                  <li>Clear problem statement or opportunity identification</li>
                  <li>Preview of key insights</li>
                </ul>

                <h4 className="mt-3 font-medium">Main Body</h4>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Minimum 3 key insights or takeaways</li>
                  <li>
                    Each insight must be actionable, evidence-based,
                    forward-looking, and progress-oriented
                  </li>
                  <li>Include real-world examples or case studies</li>
                  <li>Link to relevant Synthalyst tools when applicable</li>
                </ul>

                <h4 className="mt-3 font-medium">Conclusion</h4>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Actionable summary</li>
                  <li>Future implications</li>
                  <li>Call to action or next steps</li>
                  <li>Connection to relevant Synthalyst features or tools</li>
                </ul>
              </TabsContent>

              <TabsContent value="quality" className="p-4">
                <h3 className="mb-2 font-semibold">Quality Checklist</h3>
                <p className="mb-2">Before publication, ensure the content:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Delivers clear, actionable value</li>
                  <li>
                    Aligns with &ldquo;Insights That Power Progress&rdquo;
                    tagline
                  </li>
                  <li>Includes forward-looking perspectives</li>
                  <li>Connects to broader industry trends</li>
                  <li>References reliable sources</li>
                  <li>Links to relevant Synthalyst tools/features</li>
                  <li>Maintains professional yet accessible tone</li>
                  <li>Includes practical implementation steps</li>
                  <li>Encourages reader growth/progress</li>
                </ul>
              </TabsContent>

              <TabsContent value="seo" className="p-4">
                <h3 className="mb-2 font-semibold">
                  SEO & Metadata Requirements
                </h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Primary keyword in title</li>
                  <li>2-3 secondary keywords in subheadings</li>
                  <li>Meta description: 150-160 characters</li>
                  <li>Include relevant tags from category list</li>
                  <li>Add internal links to related Synthalyst content</li>
                </ul>

                <h3 className="mb-2 mt-4 font-semibold">Content Enhancement</h3>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Include relevant statistics or data points</li>
                  <li>Add visual elements (charts, infographics, diagrams)</li>
                  <li>Use subheadings for easy scanning</li>
                  <li>Include expert quotes when applicable</li>
                  <li>Provide additional resources section</li>
                </ul>
              </TabsContent>

              <TabsContent value="template" className="p-4">
                <h3 className="mb-2 font-semibold">Sample Query Template</h3>
                <p className="mb-2">
                  When creating content, use this template:
                </p>
                <div className="rounded bg-gray-100 p-3 font-mono text-sm">
                  <p>Create a blog post for The Synth that:</p>
                  <p>1. Category: [Specify primary category]</p>
                  <p>2. Topic: [Define specific topic]</p>
                  <p>
                    3. Key Angle: How this [topic] powers progress in
                    [industry/area]
                  </p>
                  <p>4. Required Elements:</p>
                  <p className="ml-3">- Minimum 3 actionable insights</p>
                  <p className="ml-3">
                    - Connection to Synthalyst tools/features
                  </p>
                  <p className="ml-3">- Forward-looking implications</p>
                  <p className="ml-3">- Practical implementation steps</p>
                  <p>5. Target Reader: [Specify audience]</p>
                  <p>
                    6. Desired Outcome: [What should readers be able to do after
                    reading]
                  </p>
                  <p>
                    Additional Context: [Any specific focus areas or
                    requirements]
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
