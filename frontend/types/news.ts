export interface NewsArticle {
  id: string;
  source_name: string;
  category: string;
  headline: string;
  story: string;
  published_at: string;
  image_link: string;
  source_link: string;
  meta_description: string;
  meta_keywords: string;
  created_at?: string;
  updated_at?: string;
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
