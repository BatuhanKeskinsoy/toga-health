import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getCorporates } from "@/lib/services/provider/corporate";

interface Sitemap {
  loc: string;
}

interface SitemapIndex {
  sitemaps: Sitemap[];
  lastmod: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const sitemapBaseUrl = `${siteURL}/sitemaps/${locale}/corporates`;
  const today = new Date().toISOString().split("T")[0];

  let totalPages = 1;

  try {
    // İlk sayfayı MAX_SITEMAP_URLS per_page ile çek ve last_page bilgisini al
    const corporatesResponse = await getCorporates(MAX_SITEMAP_URLS, 1);
    if (corporatesResponse?.status && corporatesResponse.data) {
      totalPages = corporatesResponse.data.last_page || 1;
    }
  } catch (error) {
    console.error("Corporates sitemap total fetch error:", error);
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


