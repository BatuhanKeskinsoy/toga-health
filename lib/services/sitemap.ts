import { baseURL } from "@/constants";
import axios from "axios";
import type { SitemapCategory, SitemapResponse } from "@/lib/types/sitemap";

// Genel sitemap servisi
// Örnek params:
// lang: "en" | "tr" | "ar" | "he"
// category: "branches" | "diseases" | "treatments" | "hospital" | "doctors"
// page: 1
// per_page: 50
export const getSitemap = async (
  lang: string,
  category: SitemapCategory,
  per_page: number,
  page: number = 1
): Promise<SitemapResponse> => {
  try {
    const params: Record<string, string | number> = {
      lang,
      category,
      per_page,
      page,
    };

    const response = await axios.get(`${baseURL}/public/sitemap`, {
      params,
    });
    return response.data as SitemapResponse;
  } catch (error) {
    console.error("Get Sitemap API error:", error);
    throw error;
  }
};