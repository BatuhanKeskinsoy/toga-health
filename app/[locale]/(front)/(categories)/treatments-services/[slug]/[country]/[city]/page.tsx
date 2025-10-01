import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCities, getDistricts } from "@/lib/services/locations";
import { getTreatmentsLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { City, District } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";
import { getTreatmentProviders } from "@/lib/services/categories/treatments";

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
    const { providersTitle, countries } = await getTreatmentsLayoutData(
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
      title: `${providersTitle} - ${cityTitle}, ${countryTitle} | ${"Tedaviler ve Hizmetler"} | Toga Health`,
      description: `${providersTitle} ${"tedavileri ve hizmetleri için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, ${cityTitle}, ${countryTitle}`,
      openGraph: {
        title: `${providersTitle} - ${cityTitle}, ${countryTitle} | ${"Tedaviler ve Hizmetler"} | Toga Health`,
        description: `${providersTitle} ${"tedavileri ve hizmetleri için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
      },
    };
  } catch (error) {
    return {
      title: `${"Tedaviler ve Hizmetler"} | Toga Health`,
      description:
        "Tedaviler ve Hizmetler için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function TreatmentsServicesPage({
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
    "/treatments-services/[slug]/[country]/[city]",
    locale,
    { slug, country, city }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { treatments, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getTreatmentsLayoutData(locale, slug);

  // Tedaviler ve Hizmetler bulunamazsa 404 döndür
  if (!treatments.find((d) => d.slug === slug)) {
    notFound();
  }

  // Sadece şehre özel verileri çek
  const [citiesData, districtsData, initialProvidersData] = await Promise.all([
    getCities(country),
    getDistricts(country, city),
    getTreatmentProviders({
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
      title: t("Tedaviler ve Hizmetler"),
      slug: getLocalizedUrl("/treatments-services", locale),
      slugPattern: "/treatments-services",
    },
    {
      title: providersTitle,
      slug: getLocalizedUrl("/treatments-services/[slug]", locale, { slug }),
      slugPattern: "/treatments-services/[slug]",
      params: { slug } as Record<string, string>,
    },
    {
      title: countryTitle,
      slug: getLocalizedUrl("/treatments-services/[slug]/[country]", locale, {
        slug,
        country,
      }),
      slugPattern: "/treatments-services/[slug]/[country]",
      params: { slug, country } as Record<string, string>,
    },
    {
      title: cityTitle,
      slug: getLocalizedUrl("/treatments-services/[slug]/[country]/[city]", locale, {
        slug,
        country,
        city,
      }),
      slugPattern: "/treatments-services/[slug]/[country]/[city]",
      params: { slug, country, city } as Record<string, string>,
    },
  ];

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
              categoryType="treatments-services"
              diseases={[]}
              branches={[]}
              treatmentsServices={
                treatments?.map((item) => ({ ...item, title: item.name })) || []
              }
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
              categoryType="treatments-services"
            />
          </div>
        </div>
      </div>
    </>
  );
}
