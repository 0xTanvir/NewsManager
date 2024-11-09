// app/actions/news.ts
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NewsArticle, NewsFilters, NewsListResponse } from "@/types/news";
import { revalidatePath } from "next/cache";

// Initialize Supabase client with SSR approach for server components and actions
async function createServerActionClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        setAll() {
          // Since we're in a server action, we don't set cookies here
          return;
        },
      },
    }
  );
}

export async function getNews(filters: NewsFilters): Promise<NewsListResponse> {
  try {
    const supabase = await createServerActionClient();
    const {
      limit = 20,
      offset = 0,
      query,
      sort = "created_at",
      order = "desc",
      category,
      source,
    } = filters;

    let queryBuilder = supabase.from("news").select("*", { count: "exact" });

    // Apply filters
    if (query) {
      // Using the new GIN index for headline search
      queryBuilder = queryBuilder.ilike("headline", `%${query}%`);
    }

    if (category && category !== "Categories") {
      queryBuilder = queryBuilder.eq("category", category);
    }

    if (source && source !== "Sources") {
      queryBuilder = queryBuilder.eq("source_name", source);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sort, { ascending: order === "asc" });

    // Apply pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as NewsArticle[],
      count: count || 0,
    };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function getNewsArticle(id: bigint): Promise<NewsArticle> {
  try {
    const supabase = await createServerActionClient();

    const { data, error } = await supabase
      .from("news")
      .select()
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as NewsArticle;
  } catch (error) {
    console.error("Error fetching news article:", error);
    throw error;
  }
}

export async function updateNews(
  id: bigint,
  news: Partial<NewsArticle>
): Promise<NewsArticle> {
  try {
    const supabase = await createServerActionClient();

    // Remove id, created_at, and updated_at from the update payload
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      id: _id,
      created_at: _created,
      updated_at: _updated,
      ...updateData
    } = news;
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const { data, error } = await supabase
      .from("news")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate the news list and detail pages
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/news/${id}`);

    return data as NewsArticle;
  } catch (error) {
    console.error("Error updating news:", error);
    throw error;
  }
}
