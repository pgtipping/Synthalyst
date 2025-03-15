"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  BookOpen,
  PenTool,
  Download,
  Tag,
  Clock,
  History,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  LanguageSelector,
  LanguageInfo,
} from "@/components/ui/language-selector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormData {
  title: string;
  topic: string;
  contentType: string;
  targetAudience: string;
  learningLevel: string;
  contentFormat: string;
  specificRequirements: string;
}

interface LearningContent {
  id: string;
  title: string;
  topic: string;
  contentType: string;
  targetAudience: string;
  learningLevel: string;
  contentFormat: string;
  content: string;
  specificRequirements: string | null;
  tags: string[];
  timestamp: string;
}

// Replace the specific model type with a generic "LEARNING_MODEL" constant
// This will be used for the LanguageSelector and LanguageInfo components
const LEARNING_MODEL = "LEARNING_MODEL";

export default function LearningContent() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    topic: "",
    contentType: "Lesson",
    targetAudience: "",
    learningLevel: "Beginner",
    contentFormat: "Markdown",
    specificRequirements: "",
  });
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("create");
  const [savedContents, setSavedContents] = useState<LearningContent[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  const fetchSavedContent = useCallback(async () => {
    if (!session?.user) return;

    setIsLoadingHistory(true);
    try {
      const response = await fetch("/api/learning-content");
      if (!response.ok) {
        throw new Error("Failed to fetch saved content");
      }
      const data = await response.json();
      setSavedContents(data.entries || []);
    } catch (error) {
      console.error("Error fetching saved content:", error);
      toast.error("Failed to load saved content");
    } finally {
      setIsLoadingHistory(false);
    }
  }, [session]);

  // Fetch saved content when component mounts or when tab changes to history
  useEffect(() => {
    if (activeTab === "history" && session?.user) {
      fetchSavedContent();
    }
  }, [activeTab, session, fetchSavedContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!formData.targetAudience.trim()) {
      toast.error("Please enter a target audience");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/learning-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, language: selectedLanguage }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate learning content");
      }

      const data = await response.json();
      setContent(data.content);

      // Add to saved contents if not already there
      if (activeTab === "create" && data.id) {
        setSavedContents((prev) => [data, ...prev]);
      }

      toast.success("Learning content generated successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      toast.error("Failed to generate learning content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter saved content based on search query
    // This is a client-side search, but could be replaced with an API call
    // if the dataset becomes large
  };

  const downloadContent = () => {
    if (!content) return;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.title.replace(
      /\s+/g,
      "_"
    )}_${formData.contentType.toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast.success("Content downloaded successfully!");
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          {
            label: "Learning Content Creator",
            href: "/learning-content",
            active: true,
          },
        ]}
        className="mb-6"
      />

      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Learning Content Creator</h1>
          <p className="text-muted-foreground">
            Create tailored educational content matching your style and level
            preferences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" className="flex items-center">
              <PenTool className="w-4 h-4 mr-2" />
              Create Content
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              Saved Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Create Learning Content
                </CardTitle>
                <CardDescription>
                  Fill in the details below to generate tailored educational
                  content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Introduction to Machine Learning"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="topic" className="text-sm font-medium">
                        Topic
                      </label>
                      <Input
                        id="topic"
                        name="topic"
                        value={formData.topic}
                        onChange={handleInputChange}
                        placeholder="e.g., Neural Networks, Business Ethics"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="contentType"
                        className="text-sm font-medium"
                      >
                        Content Type
                      </label>
                      <Select
                        value={formData.contentType}
                        onValueChange={(value) =>
                          handleSelectChange("contentType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lesson">Lesson</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="Exercise">Exercise</SelectItem>
                          <SelectItem value="Case Study">Case Study</SelectItem>
                          <SelectItem value="Quiz">Quiz</SelectItem>
                          <SelectItem value="Assessment">Assessment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="targetAudience"
                        className="text-sm font-medium"
                      >
                        Target Audience
                      </label>
                      <Input
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleInputChange}
                        placeholder="e.g., College Students, Working Professionals"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="learningLevel"
                        className="text-sm font-medium"
                      >
                        Learning Level
                      </label>
                      <Select
                        value={formData.learningLevel}
                        onValueChange={(value) =>
                          handleSelectChange("learningLevel", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select learning level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="contentFormat"
                        className="text-sm font-medium"
                      >
                        Content Format
                      </label>
                      <Select
                        value={formData.contentFormat}
                        onValueChange={(value) =>
                          handleSelectChange("contentFormat", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Text">Text</SelectItem>
                          <SelectItem value="Markdown">Markdown</SelectItem>
                          <SelectItem value="HTML">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="specificRequirements"
                      className="text-sm font-medium"
                    >
                      Specific Requirements (Optional)
                    </label>
                    <Textarea
                      id="specificRequirements"
                      name="specificRequirements"
                      value={formData.specificRequirements}
                      onChange={handleInputChange}
                      placeholder="Any specific requirements or focus areas for the content..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <LanguageSelector
                      modelType={LEARNING_MODEL}
                      onLanguageChange={handleLanguageChange}
                      defaultLanguage={selectedLanguage}
                    />
                    <LanguageInfo modelType={LEARNING_MODEL} />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {content && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-primary" />
                    Generated Content
                  </CardTitle>
                  <CardDescription className="flex justify-between items-center">
                    <span>
                      {formData.title} - {formData.contentType}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none dark:prose-invert bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                    {content.split("\n").map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={downloadContent}
                    disabled={!content}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-5 h-5 mr-2 text-primary" />
                  Saved Content
                </CardTitle>
                <CardDescription>
                  Browse your previously generated learning content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                      placeholder="Search saved content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Search</Button>
                  </form>
                </div>

                {isLoadingHistory ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : savedContents.length > 0 ? (
                  <div className="space-y-4">
                    {savedContents.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="flex items-center justify-between">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {item.timestamp
                                ? format(
                                    new Date(item.timestamp),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )
                                : "Recent"}
                            </span>
                            <Badge>{item.contentType}</Badge>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="font-medium mr-2">Topic:</span>
                              {item.topic}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="font-medium mr-2">
                                Audience:
                              </span>
                              {item.targetAudience}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="font-medium mr-2">Level:</span>
                              {item.learningLevel}
                            </div>
                          </div>
                          <div className="mt-2 prose max-w-none dark:prose-invert line-clamp-3 text-sm">
                            {item.content
                              .split("\n")
                              .slice(0, 3)
                              .map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex flex-wrap gap-2">
                          {item.tags &&
                            item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="flex items-center"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>
                      No saved content found. Start creating learning content to
                      build your library.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
