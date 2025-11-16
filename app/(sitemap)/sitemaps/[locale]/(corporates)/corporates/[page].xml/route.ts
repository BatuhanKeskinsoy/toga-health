import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getCorporates } from "@/lib/services/provider/corporate";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; page: string }> }
) {
  const { locale, page } = await params;
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);

  try {
    // İlgili sitemap sayfası için per_page + page parametreleriyle hastaneleri çek
    const corporatesResponse = await getCorporates(MAX_SITEMAP_URLS, pageNumber);

    if (!corporatesResponse?.status || !corporatesResponse.data?.data) {
      throw new Error("Hospitals list fetch failed");
    }

    const hospitals = corporatesResponse.data.data;

    if (!Array.isArray(hospitals) || hospitals.length === 0) {
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

    const urls = hospitals
      .map((item: any) => {
        const slug = item.slug;
        const countrySlug = item.location?.country_slug;
        const citySlug = item.location?.city_slug;

        if (!slug || !countrySlug || !citySlug) {
          return null;
        }

        // Locale'e göre path segmenti:
        // tr  => /hastane
        // diğer tüm diller => /hospital
        const hospitalSegment = locale === "tr" ? "hastane" : "hospital";

        // /[locale]/(hastane|hospital)/[hospital_slug]/[country_slug]/[city_slug]
        const loc = `${siteURL}/${locale}/${hospitalSegment}/${slug}/${countrySlug}/${citySlug}`;

        return {
          loc,
          lastmod: today,
          changefreq: "weekly",
          priority: "0.9",
        };
      })
      .filter(
        (u): u is { loc: string; lastmod: string; changefreq: string; priority: string } =>
          u !== null
      );

    if (urls.length === 0) {
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
      return new NextResponse(emptyXml, {
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

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
    console.error(`Hospitals sitemap page ${pageNumber} build error:`, error);
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


