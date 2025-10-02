import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCities, getDistricts } from "@/lib/services/locations";
import { getBranchesLayoutData } from "@/lib/utils/getProvidersLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { City, District } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";
import { getBranchProviders } from "@/lib/services/categories/branches";

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
    const { providersTitle, countries } = await getBranchesLayoutData(
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
      title: `${providersTitle} - ${cityTitle}, ${countryTitle} | ${"Branşlar"} | Toga Health`,
      description: `${providersTitle} ${"branşları için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
      keywords: `${providersTitle}, ${cityTitle}, ${countryTitle}`,
      openGraph: {
        title: `${providersTitle} - ${cityTitle}, ${countryTitle} | ${"Branşlar"} | Toga Health`,
        description: `${providersTitle} ${"branşları için"} ${cityTitle}, ${countryTitle} ${"konumundaki uzman doktorlar ve hastanelerden randevu alın."}`,
        type: "website",
        locale: locale,
      },
    };
  } catch (error) {
    return {
      title: `${"Branşlar"} | Toga Health`,
      description:
        "Branşlar için uzman doktorlar ve hastanelerden randevu alın.",
    };
  }
}

export default async function BranchesPage({
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
    "/branches/[slug]/[country]/[city]",
    locale,
    { slug, country, city }
  )}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { branches, countries, providersTitle, sortBy, sortOrder, providerType } =
    await getBranchesLayoutData(locale, slug);

  // Branşlar bulunamazsa 404 döndür
  if (!branches.find((d) => d.slug === slug)) {
    notFound();
  }

  // Sadece şehre özel verileri çek
  const [citiesData, districtsData, initialProvidersData] = await Promise.all([
    getCities(country),
    getDistricts(country, city),
    getBranchProviders({
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
      title: t("Branşlar"),
      slug: getLocalizedUrl("/branches", locale),
      slugPattern: "/branches",
    },
    {
      title: providersTitle,
      slug: getLocalizedUrl("/branches/[slug]", locale, { slug }),
      slugPattern: "/branches/[slug]",
      params: { slug } as Record<string, string>,
    },
    {
      title: countryTitle,
      slug: getLocalizedUrl("/branches/[slug]/[country]", locale, {
        slug,
        country,
      }),
      slugPattern: "/branches/[slug]/[country]",
      params: { slug, country } as Record<string, string>,
    },
    {
      title: cityTitle,
      slug: getLocalizedUrl("/branches/[slug]/[country]/[city]", locale, {
        slug,
        country,
        city,
      }),
      slugPattern: "/branches/[slug]/[country]/[city]",
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
              categoryType="branches"
              diseases={[]}
              branches={
                branches?.map((item) => ({ ...item, title: item.name })) || []
              }
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
              categoryType="branches"
            />
          </div>
        </div>
      </div>
    </>
  );
}
