"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  Loader2,
  AlertCircle,
  BookmarkPlus,
  Bookmark,
  Filter,
} from "lucide-react";
import FeedbackLayout from "@/components/FeedbackLayout";
import Link from "next/link";

// Question Library Types
interface Question {
  id: string;
  questionText: string;
  jobType: string;
  industry: string;
  difficulty: string;
  category: string;
  isSaved: boolean;
  notes: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface QuestionsResponse {
  questions: Question[];
  pagination: PaginationInfo;
}

export default function QuestionsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Filter states
  const [jobType, setJobType] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch questions based on filters and pagination
  useEffect(() => {
    fetchQuestions();
  }, [
    jobType,
    industry,
    difficulty,
    category,
    pagination.currentPage,
    activeTab,
  ]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (jobType) params.append("jobType", jobType);
      if (industry) params.append("industry", industry);
      if (difficulty) params.append("difficulty", difficulty);
      if (category) params.append("category", category);
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", pagination.currentPage.toString());
      params.append("limit", pagination.itemsPerPage.toString());

      // Add saved filter if on saved tab
      if (activeTab === "saved") {
        params.append("saved", "true");
      }

      const response = await fetch(
        `/api/interview-prep/questions?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch questions");
      }

      const data: QuestionsResponse = await response.json();
      setQuestions(data.questions);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to fetch questions",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
    fetchQuestions();
  };

  const clearFilters = () => {
    setJobType("");
    setIndustry("");
    setDifficulty("");
    setCategory("");
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const saveQuestion = async (questionId: string) => {
    try {
      const response = await fetch("/api/interview-prep/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save question");
      }

      // Update the local state to reflect the saved status
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, isSaved: true } : q
        )
      );

      toast({
        title: "Question Saved",
        description: "The question has been saved to your library.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save question",
      });
    }
  };

  const unsaveQuestion = async (questionId: string) => {
    try {
      const response = await fetch(
        `/api/interview-prep/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove question");
      }

      // Update the local state to reflect the unsaved status
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, isSaved: false } : q
        )
      );

      // If on saved tab, remove the question from the list
      if (activeTab === "saved") {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionId)
        );
      }

      toast({
        title: "Question Removed",
        description: "The question has been removed from your library.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to remove question",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  return (
    <FeedbackLayout appName="Question Library">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center space-x-1 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href="/interview-prep"
            className="text-muted-foreground hover:text-foreground"
          >
            Interview Prep
          </Link>
          <span className="text-muted-foreground">/</span>
          <span>Question Library</span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Interview Question Library</h1>
          <p className="text-muted-foreground">
            Browse and save interview questions to practice for your upcoming
            interviews.
          </p>
        </div>

        <Tabs defaultValue="all" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="saved">Saved Questions</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
                <CardDescription>
                  Narrow down questions by job type, industry, difficulty, or
                  category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <Select value={jobType} onValueChange={setJobType}>
                        <SelectTrigger id="jobType">
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Job Types</SelectItem>
                          <SelectItem value="software-engineer">
                            Software Engineer
                          </SelectItem>
                          <SelectItem value="product-manager">
                            Product Manager
                          </SelectItem>
                          <SelectItem value="data-scientist">
                            Data Scientist
                          </SelectItem>
                          <SelectItem value="ux-designer">
                            UX Designer
                          </SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Industries</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger id="difficulty">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Difficulties</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">
                            Intermediate
                          </SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          <SelectItem value="behavioral">Behavioral</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="situational">
                            Situational
                          </SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 sm:flex-none">
                        <Filter className="h-4 w-4 mr-2" />
                        Apply Filters
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearFilters}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : questions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {questions.map((question) => (
                      <Card key={question.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">
                                {question.questionText}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                {question.jobType && (
                                  <Badge variant="outline">
                                    {question.jobType}
                                  </Badge>
                                )}
                                {question.industry && (
                                  <Badge variant="outline">
                                    {question.industry}
                                  </Badge>
                                )}
                                {question.difficulty && (
                                  <Badge variant="secondary">
                                    {question.difficulty}
                                  </Badge>
                                )}
                                {question.category && (
                                  <Badge>{question.category}</Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                question.isSaved
                                  ? unsaveQuestion(question.id)
                                  : saveQuestion(question.id)
                              }
                            >
                              {question.isSaved ? (
                                <Bookmark className="h-5 w-5 text-primary" />
                              ) : (
                                <BookmarkPlus className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(
                                Math.max(1, pagination.currentPage - 1)
                              )
                            }
                            className={
                              pagination.currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: pagination.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === pagination.totalPages ||
                              Math.abs(page - pagination.currentPage) <= 1
                          )
                          .map((page, i, array) => {
                            // Add ellipsis if there are gaps
                            if (i > 0 && array[i - 1] !== page - 1) {
                              return (
                                <React.Fragment key={`ellipsis-${page}`}>
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                  <PaginationItem>
                                    <PaginationLink
                                      isActive={page === pagination.currentPage}
                                      onClick={() => handlePageChange(page)}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                </React.Fragment>
                              );
                            }

                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={page === pagination.currentPage}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(
                                  pagination.totalPages,
                                  pagination.currentPage + 1
                                )
                              )
                            }
                            className={
                              pagination.currentPage === pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Questions Found</AlertTitle>
                  <AlertDescription>
                    No questions match your current filters. Try adjusting your
                    search criteria.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : questions.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {questions.map((question) => (
                      <Card key={question.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-lg">
                                {question.questionText}
                              </CardTitle>
                              <div className="flex flex-wrap gap-2">
                                {question.jobType && (
                                  <Badge variant="outline">
                                    {question.jobType}
                                  </Badge>
                                )}
                                {question.industry && (
                                  <Badge variant="outline">
                                    {question.industry}
                                  </Badge>
                                )}
                                {question.difficulty && (
                                  <Badge variant="secondary">
                                    {question.difficulty}
                                  </Badge>
                                )}
                                {question.category && (
                                  <Badge>{question.category}</Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => unsaveQuestion(question.id)}
                            >
                              <Bookmark className="h-5 w-5 text-primary" />
                            </Button>
                          </div>
                        </CardHeader>
                        {question.notes && (
                          <CardContent>
                            <div className="bg-muted p-3 rounded-md">
                              <h4 className="text-sm font-medium mb-1">
                                Your Notes
                              </h4>
                              <p className="text-sm">{question.notes}</p>
                            </div>
                          </CardContent>
                        )}
                        <CardFooter>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              router.push(
                                `/interview-prep/questions/${question.id}`
                              )
                            }
                          >
                            Edit Notes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(
                                Math.max(1, pagination.currentPage - 1)
                              )
                            }
                            className={
                              pagination.currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: pagination.totalPages },
                          (_, i) => i + 1
                        )
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === pagination.totalPages ||
                              Math.abs(page - pagination.currentPage) <= 1
                          )
                          .map((page, i, array) => {
                            // Add ellipsis if there are gaps
                            if (i > 0 && array[i - 1] !== page - 1) {
                              return (
                                <React.Fragment key={`ellipsis-${page}`}>
                                  <PaginationItem>
                                    <PaginationEllipsis />
                                  </PaginationItem>
                                  <PaginationItem>
                                    <PaginationLink
                                      isActive={page === pagination.currentPage}
                                      onClick={() => handlePageChange(page)}
                                    >
                                      {page}
                                    </PaginationLink>
                                  </PaginationItem>
                                </React.Fragment>
                              );
                            }

                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={page === pagination.currentPage}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(
                                  pagination.totalPages,
                                  pagination.currentPage + 1
                                )
                              )
                            }
                            className={
                              pagination.currentPage === pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Saved Questions</AlertTitle>
                  <AlertDescription>
                    You haven&apos;t saved any questions yet. Browse the
                    question library and save questions to practice later.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FeedbackLayout>
  );
}
