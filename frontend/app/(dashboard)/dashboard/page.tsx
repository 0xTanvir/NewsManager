// page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { type NewsArticle } from "@/types/news";
import { getNews } from "./actions";
import { NewsTable } from "./NewsTable";
import { ArticleSummarySheet } from "./ArticleSummarySheet";
import { Pagination } from "./Pagination";
import { SearchFilters } from "./SearchFilters";
import { ErrorBoundary } from "./ErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 20;

// Create a component for the main dashboard content
function DashboardContent() {
  // State management
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof NewsArticle>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Categories");
  const [selectedSource, setSelectedSource] = useState<string>("Sources");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Data fetching
  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getNews({
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        query: searchTerm,
        sort: sortColumn,
        order: sortDirection,
        category: selectedCategory,
        source: selectedSource,
      });
      setNewsArticles(response.data);
      setTotalCount(response.count);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch news articles";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    sortColumn,
    sortDirection,
    selectedCategory,
    selectedSource,
  ]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Event handlers
  const handleShowSummary = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsSummaryOpen(true);
  };

  const handleSort = (column: keyof NewsArticle) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleOptimize = async (id: bigint) => {
    toast("Optimize functionality not implemented yet:" + id.toString());
  };

  const handleTranslate = async (id: bigint) => {
    toast("Translation functionality not implemented yet:" + id.toString());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleSourceChange = (value: string) => {
    setSelectedSource(value);
    setCurrentPage(1);
  };

  // Get unique categories and sources for filters
  const categories = [
    "Categories",
    ...new Set(newsArticles.map((article) => article.category)),
  ];
  const sources = [
    "Sources",
    ...new Set(newsArticles.map((article) => article.source_name)),
  ];

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <SearchFilters
        categories={categories}
        sources={sources}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSourceChange={handleSourceChange}
      />

      <NewsTable
        newsArticles={newsArticles}
        isLoading={isLoading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        onShowSummary={handleShowSummary}
        onOptimize={handleOptimize}
        onTranslate={handleTranslate}
      />

      {selectedArticle && (
        <ArticleSummarySheet
          article={selectedArticle}
          open={isSummaryOpen}
          onOpenChange={setIsSummaryOpen}
        />
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={ITEMS_PER_PAGE}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />
    </>
  );
}

// Main Dashboard Page component wrapped with ErrorBoundary
export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </div>
  );
}
