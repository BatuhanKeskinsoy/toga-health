import { siteURL } from "@/constants";
import { NextResponse } from "next/server";
import { getLanguages } from "@/lib/services/globals";

interface Sitemap {
  loc: string;
}

interface SitemapIndex {
  sitemaps: Sitemap[];
  lastmod: string;
}

export async function GET() {
  const sitemapBaseUrl = `${siteURL}/sitemaps`;
  const today = new Date().toISOString().split("T")[0];

  // getLanguages API'sinden aktif dilleri çek
  let localeCodes: string[] = [];
  try {
    const languagesResponse = await getLanguages();
    if (languagesResponse?.status && Array.isArray(languagesResponse.data)) {
      localeCodes = languagesResponse.data
        .filter((lang) => lang.status)
        .map((lang) => lang.code);
    }
  } catch (error) {
    console.error("Sitemap languages fetch error:", error);
  }

  // Her ihtimale karşı fallback
  if (localeCodes.length === 0) {
    localeCodes = ["tr", "en", "ar", "he"];
  }

  // Çok dilli sitemap index yapısı - her dil için constant-pages ve doctors sitemap'leri
  const sitemaps: SitemapIndex = {
    lastmod: today,
    sitemaps: [
      // Her dil için constant pages
      ...localeCodes.map((code) => ({
        loc: `${sitemapBaseUrl}/${code}/constant-pages.xml`,
      })),
      // Her dil için doctors sitemap
      ...localeCodes.map((code) => ({
        loc: `${sitemapBaseUrl}/${code}/doctors.xml`,
      })),
    ],
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
