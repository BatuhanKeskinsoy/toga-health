import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getSitemap } from "@/lib/services/sitemap";
import type { SitemapCategory } from "@/lib/types/sitemap";

interface Sitemap {
  loc: string;
}

interface SitemapIndex {
  sitemaps: Sitemap[];
  lastmod: string;
}

const ALLOWED_CATEGORIES: SitemapCategory[] = [
  "branches",
  "diseases",
  "treatments",
  "hospital",
  "doctors",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; category: string }> }
) {
  const { locale, category } = await params;
  // [category].xml segmentinden gelen değerde ".xml" kalıntısı olabileceği için temizle
  const rawCategory = category.replace(/\.xml$/i, "");
  const normalizedCategory = rawCategory as SitemapCategory;

  if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`;
    return new NextResponse(emptyXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  const sitemapBaseUrl = `${siteURL}/sitemaps/${locale}/${normalizedCategory}`;
  const today = new Date().toISOString().split("T")[0];

  let totalPages = 1;

  try {
    // İlk sayfa için total_pages bilgisini al
    const sitemapResponse = await getSitemap(
      locale,
      normalizedCategory,
      MAX_SITEMAP_URLS,
      1
    );

    if (sitemapResponse && sitemapResponse.total_pages) {
      totalPages = sitemapResponse.total_pages;
    }
  } catch (error) {
    console.error("Providers sitemap total_pages fetch error:", error);
  }

  const sitemaps: SitemapIndex = {
    lastmod: today,
    sitemaps: Array.from({ length: totalPages }, (_, i) => ({
      loc: `${sitemapBaseUrl}/${i + 1}.xml`,
    })),
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.sitemaps
  .map(
    (sitemap) => `
  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemaps.lastmod}</lastmod>
  </sitemap>`
  )
  .join("")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}


