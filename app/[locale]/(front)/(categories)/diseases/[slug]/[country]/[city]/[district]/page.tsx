import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: "Hastalık Doktor Listesi" + " - " + "TOGA Health",
    description: "Aradığınız hastalıkla ilgili hizmet veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz",
  };
}

export default async function DiseasesPage({ params }: { params: Promise<{ locale: string, slug: string, country: string, city: string, district?: string }> }) {
  const { locale, slug, country, city, district } = await params;
  const t = await getTranslations({ locale });

  // Hastalık title'ı çek
  const diseasesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/diseases`, { cache: 'no-store' });
  const diseasesData = await diseasesRes.json();
  const diseaseObj = diseasesData.data.find((d: any) => d.slug === slug);
  const diseaseTitle = diseaseObj ? diseaseObj.title : slug;

  // Ülke title'ı çek
  const countriesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/countries`, { cache: 'no-store' });
  const countriesData = await countriesRes.json();
  const countryObj = countriesData.data.find((c: any) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

  // Şehir title'ı çek
  let cityTitle = city;
  if (countryObj) {
    const citiesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/cities/${country}`, { cache: 'no-store' });
    const citiesData = await citiesRes.json();
    const cityObj = citiesData.data.find((c: any) => c.slug === city);
    if (cityObj) cityTitle = cityObj.name;

    // İlçe title'ı çek
    if (district) {
      const districtsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/districts/${city}`, { cache: 'no-store' });
      const districtsData = await districtsRes.json();
      const districtObj = districtsData.data.find((d: any) => d.slug === district);
      var districtTitle = districtObj ? districtObj.name : district;
    }
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    { title: t("Hastalıklar"), slug: "/diseases", slugPattern: "/diseases" },
    { title: diseaseTitle, slug: `/diseases/${slug}`, slugPattern: "/diseases/[slug]", params: { slug } as Record<string, string> },
    { title: countryTitle, slug: `/diseases/${slug}/${country}`, slugPattern: "/diseases/[slug]/[country]", params: { slug, country } as Record<string, string> },
    { title: cityTitle, slug: `/diseases/${slug}/${country}/${city}`, slugPattern: "/diseases/[slug]/[country]/[city]", params: { slug, country, city } as Record<string, string> },
  ];
  if (district) {
    breadcrumbs.push({
      title: districtTitle,
      slug: `/diseases/${slug}/${country}/${city}/${district}`,
      slugPattern: "/diseases/[slug]/[country]/[city]/[district]",
      params: { slug, country, city, district } as Record<string, string>
    });
  }

  return (
    <>
      <div className="container mx-auto lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ProvidersView diseaseSlug={slug} country={country} city={city} district={district} categoryType="diseases" />
    </>
  );
} 