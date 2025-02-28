"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface UnifiedSearchFilters {
  search: string;
  industry?: string;
  level?: string;
  contentType: "all" | "templates" | "jobDescriptions";
  sortBy: "updatedAt" | "createdAt" | "version";
  sortOrder: "asc" | "desc";
  showLatestOnly: boolean;
}

interface UnifiedSearchProps {
  onSearch: (filters: UnifiedSearchFilters) => void;
  industries: string[];
  levels: string[];
  totalTemplates: number;
  totalJobDescriptions: number;
}

export function UnifiedSearch({
  onSearch,
  industries,
  levels,
  totalTemplates,
  totalJobDescriptions,
}: UnifiedSearchProps) {
  const [filters, setFilters] = useState<UnifiedSearchFilters>({
    search: "",
    contentType: "all",
    sortBy: "updatedAt",
    sortOrder: "desc",
    showLatestOnly: true,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Debounce search text changes only
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Trigger search only when debounced search or other filter values change
  useEffect(() => {
    const searchFilters = { ...filters, search: debouncedSearch };
    // Don't search if all values are default/empty
    if (
      !searchFilters.search &&
      searchFilters.contentType === "all" &&
      !searchFilters.industry &&
      !searchFilters.level &&
      searchFilters.sortBy === "updatedAt" &&
      searchFilters.sortOrder === "desc" &&
      searchFilters.showLatestOnly
    ) {
      return;
    }
    onSearch(searchFilters);
  }, [debouncedSearch, filters, onSearch]);

  const handleFilterChange = (
    key: keyof UnifiedSearchFilters,
    value: string | boolean
  ) => {
    // Convert "all" to undefined for industry and level filters
    const processedValue =
      key === "industry" || key === "level"
        ? value === "all"
          ? undefined
          : value
        : value;
    setFilters((prev) => ({ ...prev, [key]: processedValue }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search templates and job descriptions..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <Select
          value={filters.contentType}
          onValueChange={(value) =>
            handleFilterChange(
              "contentType",
              value as "all" | "templates" | "jobDescriptions"
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="templates">Templates</SelectItem>
            <SelectItem value="jobDescriptions">Job Descriptions</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            handleFilterChange(
              "sortBy",
              value as "updatedAt" | "createdAt" | "version"
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="version">Version</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={() =>
            handleFilterChange(
              "sortOrder",
              filters.sortOrder === "asc" ? "desc" : "asc"
            )
          }
        >
          {filters.sortOrder === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={filters.industry || "all"}
            onValueChange={(value) => handleFilterChange("industry", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select industry" />
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
          <Select
            value={filters.level || "all"}
            onValueChange={(value) => handleFilterChange("level", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Switch
              id="latest-only"
              checked={filters.showLatestOnly}
              onCheckedChange={(checked) =>
                handleFilterChange("showLatestOnly", checked)
              }
            />
            <Label htmlFor="latest-only">Latest versions only</Label>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {totalTemplates} Template{totalTemplates !== 1 && "s"}
          </Badge>
          <Badge variant="secondary">
            {totalJobDescriptions} Job Description
            {totalJobDescriptions !== 1 && "s"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
