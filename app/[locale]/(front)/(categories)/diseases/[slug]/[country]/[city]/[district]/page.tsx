import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    { title: t("Hastalıklar"), slug: "/diseases", slugPattern: "/diseases" },
    { title: slug, slug: `/diseases/${slug}`, slugPattern: "/diseases/[slug]", params: { slug } as Record<string, string> },
    { title: country, slug: `/diseases/${slug}/${country}`, slugPattern: "/diseases/[slug]/[country]", params: { slug, country } as Record<string, string> },
    { title: city, slug: `/diseases/${slug}/${country}/${city}`, slugPattern: "/diseases/[slug]/[country]/[city]", params: { slug, country, city } as Record<string, string> },
  ];
  if (district) {
    breadcrumbs.push({
      title: district,
      slug: `/diseases/${slug}/${country}/${city}/${district}`,
      slugPattern: "/diseases/[slug]/[country]/[city]/[district]",
      params: { slug, country, city, district } as Record<string, string>
    });
  }

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ProvidersView diseaseSlug={slug} country={country} city={city} district={district} />
    </>
  );
} 