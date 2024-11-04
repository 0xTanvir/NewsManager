"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Trash2,
  Zap,
  Languages,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { newsApi, type NewsArticle } from "@/services/newsApi";

export default function DashboardPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] =
    useState<keyof NewsArticle>("published_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSource, setSelectedSource] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null
  );

  const itemsPerPage = 20;

  const handleShowSummary = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsSummaryOpen(true);
  };

  const fetchNews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await newsApi.getNews({
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
        query: searchTerm,
        sort: sortColumn,
        order: sortDirection,
        category: selectedCategory,
        source: selectedSource,
      });
      setNewsArticles(response.data);
      setTotalCount(response.count);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch news articles"
      );
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

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when search changes
      fetchNews();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchNews]);

  const handleSort = (column: keyof NewsArticle) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await newsApi.deleteNews(id);
      toast.success("News article deleted successfully");
      fetchNews();
    } catch (error) {
      console.log(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete news article"
      );
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
  };

  const handleUpdate = async (updatedArticle: NewsArticle) => {
    try {
      await newsApi.updateNews(updatedArticle.id, updatedArticle);
      toast.success("News article updated successfully");
      fetchNews();
      setEditingArticle(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update news article"
      );
    }
  };

  const handleOptimize = async (id: string) => {
    toast("Optimize functionality not implemented yet:" + id);
  };

  const handleTranslate = async (id: string) => {
    toast("Translation functionality not implemented yet:" + id);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // The rest of your JSX remains largely the same, just handle loading state
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">News Management Dashboard</h1>
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
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {[
              "All",
              ...new Set(newsArticles.map((article) => article.category)),
            ].map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            {[
              "All",
              ...new Set(newsArticles.map((article) => article.source_name)),
            ].map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table component remains the same except for the loading state */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("headline")}
              >
                Headline{" "}
                {sortColumn === "headline" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category{" "}
                {sortColumn === "category" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("source_name")}
              >
                Source{" "}
                {sortColumn === "source_name" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("published_at")}
              >
                Posted At{" "}
                {sortColumn === "published_at" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : newsArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No news articles found
                </TableCell>
              </TableRow>
            ) : (
              newsArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <img
                      src={article.image_link}
                      alt={article.headline}
                      className="w-20 h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col gap-2">
                      <span>{article.headline}</span>
                    </div>
                  </TableCell>

                  <TableCell>{article.category}</TableCell>
                  <TableCell>{article.source_name}</TableCell>
                  <TableCell>
                    {new Date(article.published_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowSummary(article)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Summary</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOptimize(article.id)}
                            >
                              <Zap className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optimize</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTranslate(article.id)}
                            >
                              <Languages className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Translate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Drawer */}
      <Sheet open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Article Summary</SheetTitle>
            <SheetDescription>
              Quick overview and key points of the article
            </SheetDescription>
          </SheetHeader>

          {selectedArticle && (
            <div className="space-y-6">
              {/* Article Image */}
              <Card>
                <CardContent className="p-0">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={selectedArticle.image_link}
                      alt={selectedArticle.headline}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">
                      {selectedArticle.headline}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedArticle.meta_description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Article Details */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Source & Date
                </Label>
                <p className="text-sm">
                  {selectedArticle.source_name} •{" "}
                  {new Date(selectedArticle.published_at).toLocaleString()}
                </p>
              </div>

              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {selectedArticle.story}
                  </p>
                </CardContent>
              </Card>

              {/* Bullet Points Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Key Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>
                      This article can attract attention due to its coverage of{" "}
                      {selectedArticle.category}
                    </li>
                    <li>
                      The story is timely and relevant to current events in{" "}
                      {selectedArticle.category}
                    </li>
                    <li>
                      It provides valuable insights into{" "}
                      {selectedArticle.headline.toLowerCase()}
                    </li>
                    <li>
                      The coverage includes perspectives from{" "}
                      {selectedArticle.source_name}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Metadata */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Category
                </Label>
                <p className="text-sm">{selectedArticle.category}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  Keywords
                </Label>
                <p className="text-sm">
                  {selectedArticle.meta_keywords || "No keywords available"}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Pagination section updated with total count from API */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
          articles
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Edit dialog remains the same */}
      {editingArticle && (
        <Dialog
          open={!!editingArticle}
          onOpenChange={() => setEditingArticle(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit News Article</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="headline" className="text-right">
                  Headline
                </Label>
                <Input
                  id="headline"
                  value={editingArticle.headline}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      headline: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      category: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="story" className="text-right">
                  Story
                </Label>
                <Textarea
                  id="story"
                  value={editingArticle.story}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      story: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={() => handleUpdate(editingArticle)}>
              Save Changes
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
