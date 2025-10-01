import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCities, getDistricts } from "@/lib/services/locations";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getDiseasesLayoutData } from "@/lib/utils/getProvidersLayoutData";
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
    district?: string;
  }>;
}): Promise<Metadata> {
  const { locale, slug, country, city, district } = await params;
  const t = await getTranslations({ locale });

  const districtsData = await getDistricts(country, city).catch(() => null);
  const districtObj = districtsData?.districts.find(
    (c: District) => c.slug === district
  );
  if (!districtObj) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  try {
    const { providersTitle, countries } = await getDiseasesLayoutData(
      locale,
      slug
    );
    const countryObj = countries.find((c) => c.slug === country);
    const countryTitle = countryObj ? countryObj.name : country;

    // Şehir ve ilçe bilgilerini al
    const [citiesData, districtsData] = await Promise.all([
      getCities(country).catch(() => null),
      getDistricts(country, city).catch(() => null),
    ]);

    const cities = citiesData?.cities || [];
    const districts = districtsData?.districts || [];

    const cityObj = cities.find((c: City) => c.slug === city);
    const cityTitle = cityObj ? cityObj.name : city;

    let districtTitle = district;
    if (district) {
      const districtObj = districts.find((d: District) => d.slug === district);
      districtTitle = districtObj ? districtObj.name : district;
    }

    const locationString = district
      ? `${districtTitle}, ${cityTitle}, ${countryTitle}`
      : `${cityTitle}, ${countryTitle}`;

    return {
      title: `${providersTitle} - ${locationString} | ${"Hastalıklar"} | Toga Health`,
      description: `${providersTitle} ${"hastalığı için"} ${locationString} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, ${locationString}`,
      openGraph: {
        title: `${providersTitle} - ${locationString} | ${"Hastalıklar"} | Toga Health`,
        description: `${providersTitle} ${"hastalığı için"} ${locationString} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
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
    district?: string;
  }>;
}) {
  const { locale, slug, country, city, district } = await params;
  const currentPath = `/${locale}${getLocalizedUrl(
    "/diseases/[slug]/[country]/[city]/[district]",
    locale,
    { slug, country, city, district: district || "" }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getDiseasesLayoutData(locale, slug);

  // Hastalık bulunamazsa 404 döndür
  if (!diseases.find((d) => d.slug === slug)) {
    notFound();
  }

  // Sadece ilçeye özel verileri çek
  const [citiesData, districtsData, initialProvidersData] = await Promise.all([
    getCities(country),
    getDistricts(country, city),
    getDiseaseProviders({
      providers_slug: slug,
      country: country,
      city: city,
      district: district,
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

  // İlçe title'ı çek
  let districtTitle = district;
  if (district) {
    const districtObj = districts.find((d: District) => d.slug === district);
    districtTitle = districtObj ? districtObj.name : district;

    // İlçe bulunamazsa 404 döndür
    if (!districtObj) {
      notFound();
    }
  }

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    {
      title: t("Hastalıklar"),
      slug: getLocalizedUrl("/diseases", locale),
      slugPattern: "/diseases",
    },
    {
      title: providersTitle,
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
  if (district) {
    breadcrumbs.push({
      title: districtTitle,
      slug: getLocalizedUrl(
        "/diseases/[slug]/[country]/[city]/[district]",
        locale,
        { slug, country, city, district }
      ),
      slugPattern: "/diseases/[slug]/[country]/[city]/[district]",
      params: { slug, country, city, district } as Record<string, string>,
    });
  }

  return (
    <>
      <div className="container mx-auto xl:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4">
        <div className="flex max-xl:flex-col gap-4 w-full">
          <div className="xl:w-[320px] w-full">
            <ProvidersSidebar
              providersSlug={slug}
              country={country}
              city={city}
              district={district}
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
              providersName={providersTitle}
              country={country}
              city={city}
              district={district}
              countryName={countryTitle}
              cityName={cityTitle}
              districtName={districtTitle}
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
