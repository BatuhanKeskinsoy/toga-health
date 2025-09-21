import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCountries, getCities, getDistricts } from "@/lib/services/locations";
import { getDiseases, getBranches, getTreatments } from "@/lib/services/categories";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";

export default async function DiseasesPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ locale: string, slug: string, country: string, city: string, district?: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { locale, slug, country, city, district } = await params;
  const currentPath = `/${locale}/diseases/${slug}/${country}/${city}${district ? `/${district}` : ''}`;
  const t = await getTranslations({ locale });

  // Server-side'dan tüm verileri çek
  const [diseases, branches, treatmentsServices, countriesData, citiesData, districtsData, initialProvidersData] = await Promise.all([
    getDiseases(),
    getBranches(),
    getTreatments(),
    getCountries(),
    getCities(country),
    getDistricts(country, city),
    getDiseaseProviders({
      disease_slug: slug,
      country: country,
      city: city,
      district: district,
      page: 1,
      per_page: 20,
    }).catch(() => null), // Hata durumunda null döndür
  ]);

  const countries: Country[] = countriesData || [];
  const cities = citiesData?.cities?.map((city: City) => ({
    ...city,
    countrySlug: country
  })) || [];
  const districts = districtsData?.districts?.map((district: District) => ({
    ...district,
    citySlug: city
  })) || [];

  // Hastalık title'ı çek
  const diseaseObj = diseases.find((d) => d.slug === slug);
  const diseaseTitle = diseaseObj ? diseaseObj.name : slug;

  // Ülke title'ı çek
  const countryObj = countries.find((c: Country) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

  // Şehir title'ı çek
  let cityTitle = city;
  let districtTitle = district;
  if (countryObj) {
    const cityObj = cities.find((c: City) => c.slug === city);
    if (cityObj) cityTitle = cityObj.name;

    // İlçe title'ı çek
    if (district) {
      const districtObj = districts.find((d: District) => d.slug === district);
      districtTitle = districtObj ? districtObj.name : district;
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
      <div className="container mx-auto flex gap-4">
        <div className="flex max-lg:flex-col gap-4 w-full">
          <div className="lg:w-[320px] w-full">
            <ProvidersSidebar 
              diseaseSlug={slug}
              country={country}
              city={city}
              district={district}
              categoryType="diseases"
              diseases={diseases?.map(item => ({ ...item, title: item.name })) || []}
              branches={branches?.map(item => ({ ...item, title: item.name })) || []}
              treatmentsServices={treatmentsServices?.map(item => ({ ...item, title: item.name })) || []}
              countries={countries}
              cities={cities}
              districts={districts}
              locale={locale}
              currentPath={currentPath}
            />
          </div>
          <div className="flex-1">
            <ProvidersView 
              diseaseSlug={slug} 
              diseaseName={diseaseTitle}
              country={country} 
              city={city} 
              district={district} 
              categoryType="diseases"
              countryName={countryTitle}
              cityName={cityTitle}
              districtName={districtTitle}
              providers={initialProvidersData?.data?.providers?.data || []}
              pagination={initialProvidersData?.data?.providers?.pagination}
              totalProviders={initialProvidersData?.data?.providers?.summary?.total_providers || initialProvidersData?.data?.providers?.pagination?.total || 0}
            />
          </div>
        </div>
      </div>
    </>
  );
} 