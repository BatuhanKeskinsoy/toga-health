export type SitemapCategory =
  | "branches"
  | "diseases"
  | "treatments"
  | "hospital"
  | "doctors";

export interface SitemapResponse {
  category: SitemapCategory;
  lang: string;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  urls: string[];
}


