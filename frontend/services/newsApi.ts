// services/newsApi.ts
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
}

interface NewsListResponse {
  data: NewsArticle[];
  count: number;
}

interface NewsFilters {
  limit?: number;
  offset?: number;
  query?: string;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  source?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// TODO: Replace with actual API URL from environment variables
const baseUrl = "http://localhost:8000";

export const newsApi = {
  // Helper function to handle API responses
  async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "An error occurred" }));
      throw new ApiError(response.status, error.message || "An error occurred");
    }
    return response.json();
  },

  // Get list of news articles with filters
  async getNews(filters: NewsFilters): Promise<NewsListResponse> {
    const params = new URLSearchParams();

    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.offset) params.append("offset", filters.offset.toString());
    if (filters.query) params.append("query", filters.query);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.order) params.append("order", filters.order);
    if (filters.category && filters.category !== "All")
      params.append("category", filters.category);
    if (filters.source && filters.source !== "All")
      params.append("source_name", filters.source);

    const response = await fetch(
      `${baseUrl}/api/v1/news/?${params.toString()}`,
      {
        next: { revalidate: 0 }, // Disable caching for this request
      }
    );
    return this.handleResponse<NewsListResponse>(response);
  },

  // Get single news article
  async getNewsArticle(id: string): Promise<NewsArticle> {
    const response = await fetch(`${baseUrl}/api/v1/news/${id}`, {
      next: { revalidate: 0 },
    });
    return this.handleResponse<NewsArticle>(response);
  },

  // Create news article
  async createNews(news: Partial<NewsArticle>): Promise<NewsArticle> {
    const response = await fetch("${baseUrl}/api/v1/news/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(news),
    });
    return this.handleResponse<NewsArticle>(response);
  },

  // Update news article
  async updateNews(
    id: string,
    news: Partial<NewsArticle>
  ): Promise<NewsArticle> {
    const response = await fetch(`${baseUrl}/api/v1/news/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(news),
    });
    return this.handleResponse<NewsArticle>(response);
  },

  // Delete news article
  async deleteNews(id: string): Promise<{ message: string }> {
    const response = await fetch(`${baseUrl}/api/v1/news/${id}`, {
      method: "DELETE",
    });
    return this.handleResponse<{ message: string }>(response);
  },

  // Bulk create news articles
  async bulkCreateNews(
    newsList: Partial<NewsArticle>[]
  ): Promise<NewsArticle[]> {
    const response = await fetch("${baseUrl}/api/v1/news/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsList),
    });
    return this.handleResponse<NewsArticle[]>(response);
  },
};
