import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCities, getDistricts } from "@/lib/services/locations";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { getDiseasesLayoutData } from "@/lib/utils/getDiseasesLayoutData";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { City, District } from "@/lib/types/locations/locationsTypes";
import "react-medium-image-zoom/dist/styles.css";

export default async function DiseasesPage({ 
  params,
}: { 
  params: Promise<{ locale: string, slug: string, country: string, city: string, district?: string }>;
}) {
  const { locale, slug, country, city, district } = await params;
  const currentPath = `/${locale}${getLocalizedUrl("/diseases/[slug]/[country]/[city]/[district]", locale, { slug, country, city, district: district || "" })}`;
  const t = await getTranslations({ locale });

  // Layout'tan ortak verileri al
  const { diseases, countries, diseaseTitle, sortBy, sortOrder, providerType } = await getDiseasesLayoutData(locale, slug);

  // Sadece ilçeye özel verileri çek
  const [citiesData, districtsData, initialProvidersData] = await Promise.all([
    getCities(country),
    getDistricts(country, city),
    getDiseaseProviders({
      disease_slug: slug,
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

  const cities = citiesData?.cities?.map((city: City) => ({
    ...city,
    countrySlug: country
  })) || [];
  const districts = districtsData?.districts?.map((district: District) => ({
    ...district,
    citySlug: city
  })) || [];

  // Ülke title'ı çek
  const countryObj = countries.find((c) => c.slug === country);
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
    { 
      title: t("Hastalıklar"), 
      slug: getLocalizedUrl("/diseases", locale), 
      slugPattern: "/diseases" 
    },
    { 
      title: diseaseTitle, 
      slug: getLocalizedUrl("/diseases/[slug]", locale, { slug }), 
      slugPattern: "/diseases/[slug]", 
      params: { slug } as Record<string, string> 
    },
    { 
      title: countryTitle, 
      slug: getLocalizedUrl("/diseases/[slug]/[country]", locale, { slug, country }), 
      slugPattern: "/diseases/[slug]/[country]", 
      params: { slug, country } as Record<string, string> 
    },
    { 
      title: cityTitle, 
      slug: getLocalizedUrl("/diseases/[slug]/[country]/[city]", locale, { slug, country, city }), 
      slugPattern: "/diseases/[slug]/[country]/[city]", 
      params: { slug, country, city } as Record<string, string> 
    },
  ];
  if (district) {
    breadcrumbs.push({
      title: districtTitle,
      slug: getLocalizedUrl("/diseases/[slug]/[country]/[city]/[district]", locale, { slug, country, city, district }),
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