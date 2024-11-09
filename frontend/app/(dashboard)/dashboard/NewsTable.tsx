import { type NewsArticle } from "@/types/news";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Zap, Languages } from "lucide-react";
import RelativeTime from "@/components/RelativeTime";
import { TableSkeleton } from "./TableSkeleton";

interface NewsTableProps {
  newsArticles: NewsArticle[];
  isLoading: boolean;
  sortColumn: keyof NewsArticle;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof NewsArticle) => void;
  onShowSummary: (article: NewsArticle) => void;
  onOptimize: (id: bigint) => void;
  onTranslate: (id: bigint) => void;
}

export function NewsTable({
  newsArticles,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  onShowSummary,
  onOptimize,
  onTranslate,
}: NewsTableProps) {
  const getSortIndicator = (column: keyof NewsArticle) => {
    if (column === sortColumn) {
      return sortDirection === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">Image</TableHead>
            <TableHead
              className="cursor-pointer text-center hover:text-primary transition-colors"
              onClick={() => onSort("headline")}
            >
              Headline {getSortIndicator("headline")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center hover:text-primary transition-colors"
              onClick={() => onSort("category")}
            >
              Category {getSortIndicator("category")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center hover:text-primary transition-colors"
              onClick={() => onSort("source_name")}
            >
              Source {getSortIndicator("source_name")}
            </TableHead>
            <TableHead
              className="cursor-pointer text-center hover:text-primary transition-colors"
              onClick={() => onSort("created_at")}
            >
              Posted At {getSortIndicator("created_at")}
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        {isLoading ? (
          <TableSkeleton />
        ) : newsArticles.length === 0 ? (
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No articles found
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {newsArticles.map((article) => (
              <TableRow key={article.id.toString()}>
                <TableCell>
                  {article.image_link ? (
                    <img
                      src={article.image_link}
                      alt={article.headline}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">
                        No image
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex flex-col gap-2">
                    <span>{article.headline}</span>
                  </div>
                </TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.source_name}</TableCell>
                <TableCell>
                  <RelativeTime date={article.created_at} />
                </TableCell>
                <TableCell>
                  <ActionButtons
                    article={article}
                    onShowSummary={onShowSummary}
                    onOptimize={onOptimize}
                    onTranslate={onTranslate}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}

interface ActionButtonsProps {
  article: NewsArticle;
  onShowSummary: (article: NewsArticle) => void;
  onOptimize: (id: bigint) => void;
  onTranslate: (id: bigint) => void;
}

function ActionButtons({
  article,
  onShowSummary,
  onOptimize,
  onTranslate,
}: ActionButtonsProps) {
  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShowSummary(article)}
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
              onClick={() => onOptimize(article.id)}
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
              onClick={() => onTranslate(article.id)}
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
  );
}
