"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { CompetencyFramework } from "../types";
import { toast } from "sonner";

interface FrameworkSearchProps {
  frameworks?: CompetencyFramework[];
  onSearchResults: (results: CompetencyFramework[]) => void;
}

export default function FrameworkSearch({
  frameworks,
  onSearchResults,
}: FrameworkSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [jobFunctionFilter, setJobFunctionFilter] = useState("all");
  const [roleLevelFilter, setRoleLevelFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [savedSearches, setSavedSearches] = useState<
    {
      name: string;
      filters: {
        searchTerm: string;
        industryFilter: string;
        jobFunctionFilter: string;
        roleLevelFilter: string;
        dateFilter: string;
      };
    }[]
  >([]);
  const [savedSearchName, setSavedSearchName] = useState("");
  const [showSaveSearch, setShowSaveSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allFrameworks, setAllFrameworks] = useState<CompetencyFramework[]>(
    frameworks || []
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch frameworks if not provided as props
  useEffect(() => {
    const fetchFrameworks = async () => {
      if (frameworks) {
        setAllFrameworks(frameworks);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/competency-manager/frameworks");

        if (!response.ok) {
          throw new Error("Failed to fetch frameworks");
        }

        const data = await response.json();
        setAllFrameworks(data.frameworks || []);
      } catch (err) {
        console.error("Error fetching frameworks:", err);
        setError("Failed to load frameworks. Please try again.");
        toast.error("Failed to load frameworks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrameworks();
  }, [frameworks]);

  // Extract unique values for filter dropdowns
  const industries = [...new Set(allFrameworks.map((f) => f.industry))];
  const jobFunctions = [...new Set(allFrameworks.map((f) => f.jobFunction))];
  const roleLevels = [...new Set(allFrameworks.map((f) => f.roleLevel))];

  // Apply filters and search
  const applySearch = useCallback(() => {
    let results = [...allFrameworks];

    // Apply text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (framework) =>
          framework.name.toLowerCase().includes(searchLower) ||
          (framework.description?.toLowerCase() || "").includes(searchLower) ||
          framework.competencies.some(
            (comp) =>
              comp.name.toLowerCase().includes(searchLower) ||
              comp.description.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply industry filter
    if (industryFilter && industryFilter !== "all") {
      results = results.filter(
        (framework) => framework.industry === industryFilter
      );
    }

    // Apply job function filter
    if (jobFunctionFilter && jobFunctionFilter !== "all") {
      results = results.filter(
        (framework) => framework.jobFunction === jobFunctionFilter
      );
    }

    // Apply role level filter
    if (roleLevelFilter && roleLevelFilter !== "all") {
      results = results.filter(
        (framework) => framework.roleLevel === roleLevelFilter
      );
    }

    // Apply date filter
    if (dateFilter && dateFilter !== "all") {
      const today = new Date();
      let dateLimit: Date;

      switch (dateFilter) {
        case "today":
          dateLimit = new Date(today.setHours(0, 0, 0, 0));
          break;
        case "week":
          dateLimit = new Date(today.setDate(today.getDate() - 7));
          break;
        case "month":
          dateLimit = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case "year":
          dateLimit = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          dateLimit = new Date(0); // Beginning of time
      }

      results = results.filter((framework) => {
        const frameworkDate = new Date(framework.createdAt || "");
        return frameworkDate >= dateLimit;
      });
    }

    // Send results to parent component
    onSearchResults(results);
  }, [
    allFrameworks,
    searchTerm,
    industryFilter,
    jobFunctionFilter,
    roleLevelFilter,
    dateFilter,
    onSearchResults,
  ]);

  // Load saved searches from localStorage on component mount
  useEffect(() => {
    const savedSearchesFromStorage = localStorage.getItem(
      "savedFrameworkSearches"
    );
    if (savedSearchesFromStorage) {
      setSavedSearches(JSON.parse(savedSearchesFromStorage));
    }
  }, []);

  // Save searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "savedFrameworkSearches",
      JSON.stringify(savedSearches)
    );
  }, [savedSearches]);

  // Apply search whenever any filter changes or when frameworks are loaded
  useEffect(() => {
    if (allFrameworks.length > 0 && !isLoading) {
      applySearch();
    }
  }, [
    allFrameworks,
    searchTerm,
    industryFilter,
    jobFunctionFilter,
    roleLevelFilter,
    dateFilter,
    isLoading,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setIndustryFilter("all");
    setJobFunctionFilter("all");
    setRoleLevelFilter("all");
    setDateFilter("all");
    // No need to call onSearchResults directly as the useEffect will handle it
  }, []);

  // Save current search
  const saveSearch = useCallback(() => {
    if (!savedSearchName.trim()) return;

    const newSavedSearch = {
      name: savedSearchName,
      filters: {
        searchTerm,
        industryFilter,
        jobFunctionFilter,
        roleLevelFilter,
        dateFilter,
      },
    };

    setSavedSearches([...savedSearches, newSavedSearch]);
    setSavedSearchName("");
    setShowSaveSearch(false);
  }, [
    savedSearchName,
    searchTerm,
    industryFilter,
    jobFunctionFilter,
    roleLevelFilter,
    dateFilter,
    savedSearches,
  ]);

  // Load a saved search
  const loadSavedSearch = useCallback(
    (index: number) => {
      const savedSearch = savedSearches[index];
      setSearchTerm(savedSearch.filters.searchTerm || "");
      setIndustryFilter(savedSearch.filters.industryFilter || "all");
      setJobFunctionFilter(savedSearch.filters.jobFunctionFilter || "all");
      setRoleLevelFilter(savedSearch.filters.roleLevelFilter || "all");
      setDateFilter(savedSearch.filters.dateFilter || "all");
      // No need to call applySearch directly as the useEffect will handle it
    },
    [savedSearches]
  );

  // Delete a saved search
  const deleteSavedSearch = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering the parent onClick
      const updatedSearches = [...savedSearches];
      updatedSearches.splice(index, 1);
      setSavedSearches(updatedSearches);
    },
    [savedSearches]
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Loading frameworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-medium">Search Frameworks</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Text search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, description, or competency"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Industry filter */}
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Function filter */}
        <div className="space-y-2">
          <Label htmlFor="jobFunction">Job Function</Label>
          <Select
            value={jobFunctionFilter}
            onValueChange={setJobFunctionFilter}
          >
            <SelectTrigger id="jobFunction">
              <SelectValue placeholder="All Job Functions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Job Functions</SelectItem>
              {jobFunctions.map((jobFunction) => (
                <SelectItem key={jobFunction} value={jobFunction}>
                  {jobFunction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Level filter */}
        <div className="space-y-2">
          <Label htmlFor="roleLevel">Role Level</Label>
          <Select value={roleLevelFilter} onValueChange={setRoleLevelFilter}>
            <SelectTrigger id="roleLevel">
              <SelectValue placeholder="All Role Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Role Levels</SelectItem>
              {roleLevels.map((roleLevel) => (
                <SelectItem key={roleLevel} value={roleLevel}>
                  {roleLevel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date filter */}
        <div className="space-y-2">
          <Label htmlFor="date">Created</Label>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger id="date">
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowSaveSearch(!showSaveSearch)}
        >
          {showSaveSearch ? "Cancel" : "Save Search"}
        </Button>
      </div>

      {/* Save search form */}
      {showSaveSearch && (
        <div className="mt-4 p-4 border rounded-lg">
          <Label htmlFor="savedSearchName">Search Name</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="savedSearchName"
              placeholder="My Saved Search"
              value={savedSearchName}
              onChange={(e) => setSavedSearchName(e.target.value)}
            />
            <Button onClick={saveSearch}>Save</Button>
          </div>
        </div>
      )}

      {/* Saved searches */}
      {savedSearches.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Saved Searches</h4>
          <div className="space-y-2">
            {savedSearches.map((search, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-accent"
                onClick={() => loadSavedSearch(index)}
              >
                <span>{search.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => deleteSavedSearch(index, e)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
