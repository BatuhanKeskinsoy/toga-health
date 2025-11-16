import { siteURL } from "@/constants";
import { NextResponse } from "next/server";

interface PageConfig {
  path: string;
  priority: string;
}

// Her dil için sabit sayfaları tanımla
function getPagesByLocale(locale: string): PageConfig[] {
  switch (locale) {
    case "tr":
      return [
        { path: "/tr", priority: "1.0" },
        { path: "/tr/hakkimizda", priority: "0.8" },
        { path: "/tr/iletisim", priority: "0.8" },
        { path: "/tr/sözleşmeler", priority: "0.6" },
      ];
    case "en":
      return [
        { path: "/en", priority: "1.0" },
        { path: "/en/aboutus", priority: "0.8" },
        { path: "/en/contact", priority: "0.8" },
        { path: "/en/contracts", priority: "0.6" },
      ];
    default:
      // Diğer diller için şimdilik ana sayfa ile sınırlı tut
      return [
        { path: `/${locale}`, priority: "1.0" },
      ];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  const pages = getPagesByLocale(locale);
  const today = new Date().toISOString().split("T")[0];

  const urls = pages.map((page) => ({
    loc: `${siteURL}${page.path}`,
    lastmod: today,
    changefreq: "monthly",
    priority: page.priority,
  }));

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
}


