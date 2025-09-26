import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCities } from "@/lib/services/locations";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getDiseasesLayoutData } from "@/lib/utils/getDiseasesLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { City } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; country: string }>;
}): Promise<Metadata> {
  const { locale, slug, country } = await params;
  const t = await getTranslations({ locale });

  const { countries } = await getDiseasesLayoutData(locale, slug);

  const countryObj = countries.find((c) => c.slug === country);
  if (!countryObj) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const { diseaseTitle, countries } = await getDiseasesLayoutData(
      locale,
      slug
    );
    const countryObj = countries.find((c) => c.slug === country);
    const countryTitle = countryObj ? countryObj.name : country;

    return {
      title: `${diseaseTitle} - ${countryTitle} | ${"Hastalıklar"} | Toga Health`,
      description: `${diseaseTitle} ${"hastalığı için"} ${countryTitle} ${"ülkesindeki uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${diseaseTitle}, ${countryTitle}`,
      openGraph: {
        title: `${diseaseTitle} - ${countryTitle}`,
        description: `${diseaseTitle} ${"hastalığı için"} ${countryTitle} ${"ülkesindeki uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
      },
    };
  } catch (error) {
    return {
      title: `${"Hastalıklar"} | Toga Health`,
      description:
        "Hastalıklar için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function DiseasesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; country: string }>;
}) {
  const { locale, slug, country } = await params;
  const currentPath = `/${locale}${getLocalizedUrl(
    "/diseases/[slug]/[country]",
    locale,
    { slug, country }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, diseaseTitle, sortBy, sortOrder, providerType } =
    await getDiseasesLayoutData(locale, slug);

  // Hastalık bulunamazsa 404 döndür
  if (!diseases.find((d) => d.slug === slug)) {
    notFound();
  }

  // Sadece ülkeye özel verileri çek
  const [citiesData, initialProvidersData] = await Promise.all([
    getCities(country).catch((error) => {
      console.error("Cities fetch error:", error);
      return null;
    }),
    getDiseaseProviders({
      disease_slug: slug,
      country: country,
      page: 1,
      per_page: 20,
      sort_by: sortBy,
      sort_order: sortOrder,
      provider_type: providerType || undefined,
    }).catch((error) => {
      console.error("Providers fetch error:", error);
      return null;
    }),
  ]);

  const cities =
    citiesData?.cities?.map((city: City) => ({
      ...city,
      countrySlug: country,
    })) || [];

  // Ülke title'ı çek
  const countryObj = countries.find((c) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

  // Ülke bulunamazsa 404 döndür
  if (!countryObj) {
    notFound();
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    {
      title: t("Hastalıklar"),
      slug: getLocalizedUrl("/diseases", locale),
      slugPattern: "/diseases",
    },
    {
      title: diseaseTitle,
      slug: getLocalizedUrl("/diseases/[slug]", locale, { slug }),
      slugPattern: "/diseases/[slug]",
      params: { slug } as Record<string, string>,
    },
    {
      title: countryTitle,
      slug: getLocalizedUrl("/diseases/[slug]/[country]", locale, {
        slug,
        country,
      }),
      slugPattern: "/diseases/[slug]/[country]",
      params: { slug, country } as Record<string, string>,
    },
  ];

  return (
    <>
      <div className="container mx-auto lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4">
        <div className="flex max-lg:flex-col gap-4 w-full">
          <div className="lg:w-[320px] w-full">
            <ProvidersSidebar
              diseaseSlug={slug}
              country={country}
              categoryType="diseases"
              diseases={
                diseases?.map((item) => ({ ...item, title: item.name })) || []
              }
              branches={[]}
              treatmentsServices={[]}
              countries={countries}
              cities={cities}
              districts={[]}
              locale={locale}
              currentPath={currentPath}
            />
          </div>
          <div className="flex-1">
            <ProvidersView
              diseaseSlug={slug}
              diseaseName={diseaseTitle}
              country={country}
              categoryType="diseases"
              countryName={countryTitle}
              cityName={undefined}
              districtName={undefined}
              providers={initialProvidersData?.data?.providers?.data || []}
              pagination={initialProvidersData?.data?.providers?.pagination}
              totalProviders={
                initialProvidersData?.data?.providers?.summary
                  ?.total_providers ||
                initialProvidersData?.data?.providers?.pagination?.total ||
                0
              }
              sortBy={sortBy}
              sortOrder={sortOrder}
              providerType={providerType}
            />
          </div>
        </div>
      </div>
    </>
  );
}
