"use client";

import { useState, useEffect } from "react";
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
import { Search, X } from "lucide-react";
import { CompetencyFramework } from "../types";

interface FrameworkSearchProps {
  frameworks: CompetencyFramework[];
  onSearchResults: (results: CompetencyFramework[]) => void;
}

export default function FrameworkSearch({
  frameworks,
  onSearchResults,
}: FrameworkSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [jobFunctionFilter, setJobFunctionFilter] = useState("");
  const [roleLevelFilter, setRoleLevelFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
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

  // Extract unique values for filter dropdowns
  const industries = [...new Set(frameworks.map((f) => f.industry))];
  const jobFunctions = [...new Set(frameworks.map((f) => f.jobFunction))];
  const roleLevels = [...new Set(frameworks.map((f) => f.roleLevel))];

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

  // Apply filters and search
  const applySearch = () => {
    let results = [...frameworks];

    // Apply text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(
        (framework) =>
          framework.name.toLowerCase().includes(searchLower) ||
          framework.description.toLowerCase().includes(searchLower) ||
          framework.competencies.some(
            (comp) =>
              comp.name.toLowerCase().includes(searchLower) ||
              comp.description.toLowerCase().includes(searchLower)
          )
      );
    }

    // Apply industry filter
    if (industryFilter) {
      results = results.filter(
        (framework) => framework.industry === industryFilter
      );
    }

    // Apply job function filter
    if (jobFunctionFilter) {
      results = results.filter(
        (framework) => framework.jobFunction === jobFunctionFilter
      );
    }

    // Apply role level filter
    if (roleLevelFilter) {
      results = results.filter(
        (framework) => framework.roleLevel === roleLevelFilter
      );
    }

    // Apply date filter
    if (dateFilter) {
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
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setIndustryFilter("");
    setJobFunctionFilter("");
    setRoleLevelFilter("");
    setDateFilter("");
    onSearchResults(frameworks); // Reset to show all frameworks
  };

  // Save current search
  const saveSearch = () => {
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
  };

  // Load a saved search
  const loadSavedSearch = (index: number) => {
    const savedSearch = savedSearches[index];
    setSearchTerm(savedSearch.filters.searchTerm || "");
    setIndustryFilter(savedSearch.filters.industryFilter || "");
    setJobFunctionFilter(savedSearch.filters.jobFunctionFilter || "");
    setRoleLevelFilter(savedSearch.filters.roleLevelFilter || "");
    setDateFilter(savedSearch.filters.dateFilter || "");

    // Apply the search immediately
    setTimeout(applySearch, 0);
  };

  // Delete a saved search
  const deleteSavedSearch = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    const updatedSearches = [...savedSearches];
    updatedSearches.splice(index, 1);
    setSavedSearches(updatedSearches);
  };

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
              <SelectItem value="">All Industries</SelectItem>
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
              <SelectItem value="">All Job Functions</SelectItem>
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
              <SelectItem value="">All Role Levels</SelectItem>
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
              <SelectItem value="">Any Time</SelectItem>
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
          <Button onClick={applySearch} className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
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
