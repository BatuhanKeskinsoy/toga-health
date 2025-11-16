import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getDoctors } from "@/lib/services/provider/doctor";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;

  try {
    // Bu sitemap sayfası için doğrudan limit parametresi ile doktorları çek
    const doctorsResponse = await getDoctors(MAX_SITEMAP_URLS);

    if (!doctorsResponse?.status || !doctorsResponse.data?.data) {
      throw new Error("Doctors list fetch failed");
    }

    const doctors = doctorsResponse.data.data;

    if (!Array.isArray(doctors) || doctors.length === 0) {
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

    const urls = doctors.map((item: any) => {
      const slug = item.slug;
      const loc = `${siteURL}/${locale}/${slug}`;

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
    console.error("Doctors sitemap page build error:", error);
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


