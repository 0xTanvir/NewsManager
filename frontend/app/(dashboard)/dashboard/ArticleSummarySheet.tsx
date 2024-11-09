// components/ArticleSummary/ArticleSummarySheet.tsx
import { type NewsArticle } from "@/types/news";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import RelativeTime from "@/components/RelativeTime";

interface ArticleSummarySheetProps {
  article: NewsArticle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ArticleSummarySheet({
  article,
  open,
  onOpenChange,
}: ArticleSummarySheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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

        <div className="space-y-6">
          {/* Article Image and Headline */}
          <Card>
            <CardContent className="p-0">
              <AspectRatio ratio={16 / 9}>
                {article.image_link ? (
                  <img
                    src={article.image_link}
                    alt={article.headline}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-muted rounded-t-lg flex items-center justify-center">
                    <span className="text-muted-foreground">
                      No image available
                    </span>
                  </div>
                )}
              </AspectRatio>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{article.headline}</h3>
                <p className="text-sm text-muted-foreground">
                  {article.meta_description || "No description available"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Source and Date */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Source & Date
            </Label>
            <p className="text-sm">
              {article.source_name} • <RelativeTime date={article.created_at} />
            </p>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {article.summary || article.story}
              </p>
            </CardContent>
          </Card>

          {/* Key Points */}
          {article.bullet_points && article.bullet_points.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  {article.bullet_points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Category</Label>
            <p className="text-sm">{article.category}</p>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Keywords</Label>
            <p className="text-sm">
              {article.meta_keywords || "No keywords available"}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
