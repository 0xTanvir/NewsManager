export interface NewsArticle {
  id: bigint; // Changed from string to bigint to match BIGINT in SQL
  source_name: string;
  category: string;
  headline: string;
  story: string;
  summary: string | null; // Added to match SQL schema
  bullet_points: string[] | null; // Added to match SQL schema
  image_link: string | null; // Made nullable to match SQL schema
  source_link: string; // Unique constraint in SQL
  meta_description: string | null; // Made nullable to match SQL schema
  meta_keywords: string | null; // Made nullable to match SQL schema
  created_at: string; // Made required as it's NOT NULL in SQL
  updated_at: string; // Added to match SQL schema
}

export interface NewsFilters {
  limit?: number;
  offset?: number;
  query?: string;
  sort?: keyof NewsArticle;
  order?: "asc" | "desc";
  category?: string;
  source?: string;
}

export interface NewsListResponse {
  data: NewsArticle[];
  count: number;
}
