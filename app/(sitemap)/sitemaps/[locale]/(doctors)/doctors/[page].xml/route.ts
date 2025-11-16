import { NextResponse } from "next/server";
import { siteURL, MAX_SITEMAP_URLS } from "@/constants";
import { getDoctors, getDoctorDetail } from "@/lib/services/provider/doctor";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; page: string }> }
) {
  const { locale, page } = await params;
  const pageNumber = Math.max(1, parseInt(page, 10) || 1);

  try {
    // İlgili sitemap sayfası için limit + page parametreleriyle doktorları çek
    const doctorsResponse = await getDoctors(MAX_SITEMAP_URLS, pageNumber);

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

    // Her doktor için detay bilgiyi çek ve URL'yi tam, lokalize yapıda kur
    const urlsData = await Promise.all(
      doctors.map(async (item: any) => {
        try {
          const detailResponse = await getDoctorDetail(item.slug);
          if (!detailResponse?.status || !detailResponse.data) {
            return null;
          }

          const doctor = detailResponse.data;
          const doctorSlug = doctor.slug || item.slug;

          const specialty = doctor.doctor_info?.specialty;
          if (!specialty) {
            return null;
          }

          // Locale'e göre branş slug'ını seç
          let branchSlug: string | null = specialty.slug || null;
          if (
            locale !== "tr" &&
            specialty.translations &&
            Array.isArray(specialty.translations)
          ) {
            const translation = specialty.translations.find(
              (t: any) => t.lang === locale
            );
            if (translation?.slug) {
              branchSlug = translation.slug;
            }
          }

          const countrySlug = doctor.location?.country_slug;
          const citySlug = doctor.location?.city_slug;

          if (!doctorSlug || !branchSlug || !countrySlug || !citySlug) {
            return null;
          }

          const loc = `${siteURL}/${locale}/${doctorSlug}/${branchSlug}/${countrySlug}/${citySlug}`;

          return {
            loc,
            lastmod: today,
            changefreq: "weekly",
            priority: "0.7",
          };
        } catch (e) {
          console.error(
            `Doctor detail fetch error for slug ${item.slug}:`,
            e
          );
          return null;
        }
      })
    );

    const urls = urlsData.filter(
      (u): u is { loc: string; lastmod: string; changefreq: string; priority: string } =>
        u !== null
    );

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
    console.error(`Doctors sitemap page ${pageNumber} build error:`, error);
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

