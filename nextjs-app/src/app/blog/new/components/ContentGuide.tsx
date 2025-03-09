"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronDown,
  Lightbulb,
  BookOpen,
  Sparkles,
  Info,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        {isOpen ? "Hide Writing Guide" : "Show Writing Guide"}
      </Button>

      {isOpen && (
        <Card className="mb-6 border border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Writing Guide for The Synth Blog
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Alert className="m-4 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="break-words">
                Welcome to The Synth Blog writing guide! This friendly guide
                will help you create engaging, valuable content that readers
                will love. Feel free to use it as inspiration rather than strict
                rules.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="voice">
              <TabsList className="w-full justify-start border-b px-4 overflow-x-auto">
                <TabsTrigger value="voice">Style & Tone</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="tips">Quick Tips</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="p-4 max-w-full">
                <div className="break-words">
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Our Writing Style
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Your unique voice matters! While keeping these style
                    elements in mind, don&apos;t be afraid to let your
                    personality shine through.
                  </p>
                  <ul className="ml-4 list-disc space-y-2">
                    <li>
                      <span className="font-medium">Forward-thinking:</span>{" "}
                      Share insights about what&apos;s coming next
                    </li>
                    <li>
                      <span className="font-medium">Approachable:</span> Write
                      like you&apos;re having a conversation with a friend
                    </li>
                    <li>
                      <span className="font-medium">Practical:</span> Include
                      actionable advice readers can apply today
                    </li>
                    <li>
                      <span className="font-medium">Evidence-based:</span> Back
                      up claims with data or examples when possible
                    </li>
                    <li>
                      <span className="font-medium">Positive:</span> Focus on
                      solutions and opportunities, not just problems
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="structure" className="p-4 max-w-full">
                <div className="break-words">
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Simple Structure for Great Posts
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    A well-structured post helps readers follow your ideas.
                    Here&apos;s a simple framework that works well:
                  </p>

                  <h4 className="mt-3 font-medium">Catchy Title</h4>
                  <p className="mb-2 text-sm text-gray-600">
                    Your title is your first impression! Make it specific and
                    interesting.
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Include what readers will gain</li>
                    <li>Keep it between 40-60 characters</li>
                    <li>
                      <span className="italic">Example:</span> &quot;5 AI Tools
                      That Will Transform How You Work in 2025&quot;
                    </li>
                  </ul>

                  <h4 className="mt-3 font-medium">Engaging Introduction</h4>
                  <p className="mb-2 text-sm text-gray-600">
                    Hook readers in the first few sentences.
                  </p>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Start with a surprising fact, question, or story</li>
                    <li>Explain why the topic matters to your readers</li>
                    <li>
                      Preview what they&apos;ll learn (without giving it all
                      away)
                    </li>
                  </ul>

                  <h4 className="mt-3 font-medium">Valuable Main Content</h4>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Break content into 3-5 main points or sections</li>
                    <li>Use subheadings to make scanning easy</li>
                    <li>Include real examples or case studies</li>
                    <li>Add visuals when they help explain concepts</li>
                  </ul>

                  <h4 className="mt-3 font-medium">Memorable Conclusion</h4>
                  <ul className="ml-4 list-disc space-y-1">
                    <li>Summarize key takeaways</li>
                    <li>Suggest a next step readers can take</li>
                    <li>End with a thought-provoking question or statement</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="p-4 max-w-full">
                <div className="break-words">
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Content Categories
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Choose one or more categories that best fit your content.
                    This helps readers find topics they&apos;re interested in.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary">
                        Innovation & Tech
                      </h4>
                      <p className="text-sm text-gray-600">
                        Latest developments in technology and innovative
                        approaches.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span> AI
                        Developments, Tool reviews, Digital transformation,
                        Future trends
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary">
                        Professional Growth
                      </h4>
                      <p className="text-sm text-gray-600">
                        Insights and strategies for career advancement and
                        professional development.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span>{" "}
                        Career development, Skill-building strategies, Industry
                        insights, Leadership perspectives
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary">Learning Lab</h4>
                      <p className="text-sm text-gray-600">
                        Educational approaches, methodologies, and learning
                        technologies.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span>{" "}
                        Training methodologies, Educational technology, Learning
                        strategies, Curriculum design
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary">
                        Productivity & Tools
                      </h4>
                      <p className="text-sm text-gray-600">
                        Methods, systems, and tools to enhance personal and team
                        productivity.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span>{" "}
                        Tool guides, Workflow optimization, Best practices,
                        Implementation tips
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary">
                        Industry Insights
                      </h4>
                      <p className="text-sm text-gray-600">
                        Analysis and perspectives on industry trends and
                        developments.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span>{" "}
                        Market analysis, Case studies, Expert interviews, Trend
                        forecasts
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-primary">
                        Community Corner
                      </h4>
                      <p className="text-sm text-gray-600">
                        Stories, contributions, and highlights from the
                        community.
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Example topics:</span>{" "}
                        User success stories, Guest contributions, Community
                        highlights, Expert Q&As
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tips" className="p-4 max-w-full">
                <div className="break-words">
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                    Quick Writing Tips
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    These simple tips can instantly make your writing more
                    engaging:
                  </p>

                  <ul className="ml-4 list-disc space-y-2">
                    <li>
                      <span className="font-medium">Use the active voice</span>{" "}
                      (&quot;AI tools transform businesses&quot; instead of
                      &quot;Businesses are transformed by AI tools&quot;)
                    </li>
                    <li>
                      <span className="font-medium">Keep paragraphs short</span>{" "}
                      (3-4 sentences max) for better readability
                    </li>
                    <li>
                      <span className="font-medium">Include subheadings</span>{" "}
                      every 200-300 words to break up text
                    </li>
                    <li>
                      <span className="font-medium">Add bullet points</span> for
                      lists (like this one!) to make information scannable
                    </li>
                    <li>
                      <span className="font-medium">Use specific examples</span>{" "}
                      to illustrate abstract concepts
                    </li>
                    <li>
                      <span className="font-medium">
                        Include a call-to-action
                      </span>{" "}
                      at the end of your post
                    </li>
                    <li>
                      <span className="font-medium">
                        Write conversationally
                      </span>{" "}
                      - it&apos;s okay to use &quot;you&quot; and &quot;I&quot;
                    </li>
                    <li>
                      <span className="font-medium">Proofread everything</span>{" "}
                      before publishing (or use our AI assistant to help!)
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="p-4 max-w-full">
                <div className="break-words">
                  <h3 className="mb-2 flex items-center font-semibold">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Examples to Inspire You
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    Sometimes seeing examples helps! Here are snippets from
                    successful posts:
                  </p>

                  <div className="space-y-4">
                    <div className="rounded-md border border-gray-200 p-3">
                      <h4 className="font-medium text-primary">
                        Great Title Example
                      </h4>
                      <p className="text-sm italic">
                        &quot;7 AI-Powered Tools That Will Transform Your HR
                        Department in 2025&quot;
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Why it works:</span>{" "}
                        Specific number, clear benefit, timely reference
                      </p>
                    </div>

                    <div className="rounded-md border border-gray-200 p-3">
                      <h4 className="font-medium text-primary">
                        Engaging Introduction Example
                      </h4>
                      <p className="text-sm italic">
                        &quot;Remember when creating a job description took days
                        of research and endless revisions? Those days are
                        officially over. With the rise of AI-powered writing
                        assistants, what once took days now takes minutes—and
                        the results are often better than what human HR
                        professionals could create alone. In this post,
                        I&apos;ll show you how these tools are revolutionizing
                        recruitment and how you can start using them
                        today.&quot;
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Why it works:</span>{" "}
                        Relatable opening, clear problem/solution, preview of
                        value
                      </p>
                    </div>

                    <div className="rounded-md border border-gray-200 p-3">
                      <h4 className="font-medium text-primary">
                        Strong Conclusion Example
                      </h4>
                      <p className="text-sm italic">
                        &quot;As AI continues to evolve, the line between human
                        and machine-generated content will blur even further.
                        The winners won&apos;t be those who resist this change,
                        but those who learn to collaborate effectively with AI
                        tools. Start with the techniques we&apos;ve covered
                        today, and you&apos;ll be well-positioned to ride this
                        wave of innovation rather than being swept away by it.
                        What AI tool will you try first?&quot;
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        <span className="font-medium">Why it works:</span>{" "}
                        Forward-looking perspective, actionable takeaway, ending
                        question
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
