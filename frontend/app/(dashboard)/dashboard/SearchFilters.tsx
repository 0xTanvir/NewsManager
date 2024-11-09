// components/SearchFilters/SearchFilters.tsx
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface SearchFiltersProps {
  categories: string[];
  sources: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  defaultCategory?: string;
  defaultSource?: string;
}

export function SearchFilters({
  categories,
  sources,
  onSearchChange,
  onCategoryChange,
  onSourceChange,
  defaultCategory = "Categories",
  defaultSource = "Sources",
}: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedSource, setSelectedSource] = useState(defaultSource);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearchChange]);

  // Handle category change
  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      onCategoryChange(value);
    },
    [onCategoryChange]
  );

  // Handle source change
  const handleSourceChange = useCallback(
    (value: string) => {
      setSelectedSource(value);
      onSourceChange(value);
    },
    [onSourceChange]
  );

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search news articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>

      <Select value={selectedCategory} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={defaultCategory}>{defaultCategory}</SelectItem>
          {categories
            .filter((category) => category !== defaultCategory)
            .map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Select value={selectedSource} onValueChange={handleSourceChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={defaultSource}>{defaultSource}</SelectItem>
          {sources
            .filter((source) => source !== defaultSource)
            .map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
