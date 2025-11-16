import { siteURL } from "@/constants";
import { NextResponse } from "next/server";

interface Sitemap {
  loc: string;
}

interface SitemapIndex {
  sitemaps: Sitemap[];
  lastmod: string;
}

export async function GET() {
  let sitemaps: SitemapIndex = {
    sitemaps: [],
    lastmod: new Date().toISOString().split("T")[0],
  };

  sitemaps.sitemaps = [
    {
      loc: `${siteURL}/constant-pages-sitemap.xml`,
    },
    {
      loc: `${siteURL}/blog-details-sitemap.xml`,
    },
    {
      loc: `${siteURL}/listing-locations-sitemap.xml`,
    },
    {
      loc: `${siteURL}/listing-categories-sitemap.xml`,
    },
    {
      loc: `${siteURL}/listing-details-sitemap.xml`,
    },
    {
      loc: `${siteURL}/individual-branches-locations-sitemap.xml`,
    },
    {
      loc: `${siteURL}/individual-details-sitemap.xml`,
    },
    {
      loc: `${siteURL}/company-details-sitemap.xml`,
    },
    {
      loc: `${siteURL}/company-locations-sitemap.xml`,
    },
    {
      loc: `${siteURL}/event-details-sitemap.xml`,
    },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.sitemaps
    ?.map(
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
