import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCities, getDistricts } from "@/lib/services/locations";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getDiseasesLayoutData } from "@/lib/utils/getDiseasesLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { City, District } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string;
    country: string;
    city: string;
  }>;
}): Promise<Metadata> {
  const { locale, slug, country, city } = await params;
  const t = await getTranslations({ locale });

  const citiesData = await getCities(country).catch(() => null);
  const cityObj = citiesData?.cities.find((c: City) => c.slug === city);
  if (!cityObj) {
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

    // Şehir bilgisini al
    const citiesData = await getCities(country).catch(() => null);
    const cities = citiesData?.cities || [];
    const cityObj = cities.find((c: City) => c.slug === city);
    const cityTitle = cityObj ? cityObj.name : city;

    return {
      title: `${diseaseTitle} - ${cityTitle}, ${countryTitle} | ${"Hastalıklar"} | Toga Health`,
      description: `${diseaseTitle} ${"hastalığı için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${diseaseTitle}, ${cityTitle}, ${countryTitle}`,
      openGraph: {
        title: `${diseaseTitle} - ${cityTitle}, ${countryTitle} | ${"Hastalıklar"} | Toga Health`,
        description: `${diseaseTitle} ${"hastalığı için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
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
  params: Promise<{
    locale: string;
    slug: string;
    country: string;
    city: string;
  }>;
}) {
  const { locale, slug, country, city } = await params;
  const currentPath = `/${locale}${getLocalizedUrl(
    "/diseases/[slug]/[country]/[city]",
    locale,
    { slug, country, city }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, diseaseTitle, sortBy, sortOrder, providerType } =
    await getDiseasesLayoutData(locale, slug);

  // Hastalık bulunamazsa 404 döndür
  if (!diseases.find((d) => d.slug === slug)) {
    notFound();
  }

  // Sadece şehre özel verileri çek
  const [citiesData, districtsData, initialProvidersData] = await Promise.all([
    getCities(country),
    getDistricts(country, city),
    getDiseaseProviders({
      providers_slug: slug,
      country: country,
      city: city,
      page: 1,
      per_page: 20,
      sort_by: sortBy,
      sort_order: sortOrder,
      provider_type: providerType || undefined,
    }).catch(() => null), // Hata durumunda null döndür
  ]);

  const cities =
    citiesData?.cities?.map((city: City) => ({
      ...city,
      countrySlug: country,
    })) || [];
  const districts =
    districtsData?.districts?.map((district: District) => ({
      ...district,
      citySlug: city,
    })) || [];

  // Ülke title'ı çek
  const countryObj = countries.find((c) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

  // Ülke bulunamazsa 404 döndür
  if (!countryObj) {
    notFound();
  }

  // Şehir title'ı çek
  const cityObj = cities.find((c: City) => c.slug === city);
  const cityTitle = cityObj ? cityObj.name : city;

  // Şehir bulunamazsa 404 döndür
  if (!cityObj) {
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
    {
      title: cityTitle,
      slug: getLocalizedUrl("/diseases/[slug]/[country]/[city]", locale, {
        slug,
        country,
        city,
      }),
      slugPattern: "/diseases/[slug]/[country]/[city]",
      params: { slug, country, city } as Record<string, string>,
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
              providersSlug={slug}
              country={country}
              city={city}
              categoryType="diseases"
              diseases={
                diseases?.map((item) => ({ ...item, title: item.name })) || []
              }
              branches={[]}
              treatmentsServices={[]}
              countries={countries}
              cities={cities}
              districts={districts}
              locale={locale}
              currentPath={currentPath}
            />
          </div>
          <div className="flex-1">
            <ProvidersView
              providersSlug={slug}
              providersName={diseaseTitle}
              country={country}
              city={city}
              countryName={countryTitle}
              cityName={cityTitle}
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
