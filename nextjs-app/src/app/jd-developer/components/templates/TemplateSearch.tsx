import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

interface TemplateSearchProps {
  onSearch: (filters: TemplateFilters) => void;
  industries: string[];
  levels: string[];
}

export interface TemplateFilters {
  search: string;
  industry?: string;
  level?: string;
  sortBy: "createdAt" | "updatedAt" | "version";
  sortOrder: "asc" | "desc";
  showLatestOnly: boolean;
}

export function TemplateSearch({
  onSearch,
  industries,
  levels,
}: TemplateSearchProps) {
  const [filters, setFilters] = useState<TemplateFilters>({
    search: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
    showLatestOnly: true,
  });

  const handleFilterChange = (
    key: keyof TemplateFilters,
    value: string | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        <Input
          placeholder="Search templates..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="flex-1"
        />
        <Select
          value={filters.industry}
          onValueChange={(value) => handleFilterChange("industry", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Industry" />
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
        <Select
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Sort By</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.sortBy === "updatedAt"}
            onCheckedChange={() => handleFilterChange("sortBy", "updatedAt")}
          >
            Last Updated
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.sortBy === "createdAt"}
            onCheckedChange={() => handleFilterChange("sortBy", "createdAt")}
          >
            Creation Date
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.sortBy === "version"}
            onCheckedChange={() => handleFilterChange("sortBy", "version")}
          >
            Version
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.sortOrder === "desc"}
            onCheckedChange={() =>
              handleFilterChange(
                "sortOrder",
                filters.sortOrder === "desc" ? "asc" : "desc"
              )
            }
          >
            Descending Order
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.showLatestOnly}
            onCheckedChange={() =>
              handleFilterChange("showLatestOnly", !filters.showLatestOnly)
            }
          >
            Latest Versions Only
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
