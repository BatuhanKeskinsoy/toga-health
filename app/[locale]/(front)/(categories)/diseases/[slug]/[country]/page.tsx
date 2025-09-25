import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCountries, getCities } from "@/lib/services/locations";
import { getDiseases } from "@/lib/services/categories";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getServerProviderFilters } from "@/lib/utils/cookies";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { Country, City } from "@/lib/types/locations/locationsTypes";
import "react-medium-image-zoom/dist/styles.css";

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

  // Cookie'den filtreleri al
  const cookieFilters = await getServerProviderFilters();
  const sortBy = cookieFilters?.sortBy || "created_at";
  const sortOrder = cookieFilters?.sortOrder || "desc";
  const providerType = cookieFilters?.providerType || null;

  // Sadece gerekli verileri çek
  const [diseases, countriesData, citiesData, initialProvidersData] =
    await Promise.all([
      getDiseases(),
      getCountries(),
      getCities(country),
      getDiseaseProviders({
        disease_slug: slug,
        country: country,
        page: 1,
        per_page: 20,
        sort_by: sortBy,
        sort_order: sortOrder,
        provider_type: providerType || undefined,
      }).catch(() => null), // Hata durumunda null döndür
    ]);

  const countries: Country[] = countriesData || [];
  const cities =
    citiesData?.cities?.map((city: City) => ({
      ...city,
      countrySlug: country,
    })) || [];

  // Hastalık title'ı çek
  const diseaseObj = diseases.find((d) => d.slug === slug);
  const diseaseTitle = diseaseObj ? diseaseObj.name : slug;

  // Ülke title'ı çek
  const countryObj = countries.find((c: Country) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

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
