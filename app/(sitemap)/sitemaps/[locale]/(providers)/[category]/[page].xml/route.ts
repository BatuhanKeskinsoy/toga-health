import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getSitemap } from "@/lib/services/sitemap";
import type { SitemapCategory } from "@/lib/types/sitemap";

const ALLOWED_CATEGORIES: SitemapCategory[] = [
  "branches",
  "diseases",
  "treatments",
  "hospital",
  "doctors",
];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; category: string; page: string }> }
) {
  const { locale, category, page } = await params;
  // URL segmentinden gelen kategoride ".xml" kalmış olabilir, temizle
  const rawCategory = category.replace(/\.xml$/i, "");
  const normalizedCategory = rawCategory as SitemapCategory;

  if (!ALLOWED_CATEGORIES.includes(normalizedCategory)) {
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    return new NextResponse(emptyXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  const pageNumber = Math.max(1, parseInt(page, 10) || 1);

  try {
    const sitemapResponse = await getSitemap(
      locale,
      normalizedCategory,
      MAX_SITEMAP_URLS,
      pageNumber
    );

    const urlsArray = sitemapResponse?.urls || [];

    if (!Array.isArray(urlsArray) || urlsArray.length === 0) {
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
      return new NextResponse(emptyXml, {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    const today = new Date().toISOString().split("T")[0];

    const urls = urlsArray.map((path: string) => {
      // API "en/branches/..." gibi dönüyor; başa siteURL ekleyip başına '/' koyuyoruz
      const cleanedPath = path.startsWith("/") ? path.slice(1) : path;
      const loc = `${siteURL}/${cleanedPath}`;

      return {
        loc,
        lastmod: today,
        changefreq: "weekly",
        priority: "0.7",
      };
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error(
      `Providers sitemap page ${pageNumber} build error for category ${normalizedCategory}:`,
      error
    );
    const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
    return new NextResponse(emptyXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }
}


