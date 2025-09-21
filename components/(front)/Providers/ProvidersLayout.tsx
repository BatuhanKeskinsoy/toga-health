import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import { getCountries } from "@/lib/services/locations";
import { getDiseases, getBranches, getTreatments } from "@/lib/services/categories";
import { getDiseaseProviders } from "@/lib/services/categories/diseases";
import { Country } from "@/lib/types/locations/locationsTypes";

export default async function ProvidersLayout({
  slug,
  locale,
  searchParams,
}: {
  slug: string;
  locale: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const currentPath = `/${locale}/diseases/${slug}`;
  const country = searchParams?.country as string || "turkiye";
  const city = searchParams?.city as string;
  const district = searchParams?.district as string;

  // Server-side'dan tüm verileri çek
  const [diseases, branches, treatmentsServices, countriesData, initialProvidersData] =
    await Promise.all([
      getDiseases(),
      getBranches(),
      getTreatments(),
      getCountries(),
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


  return (
    <div className="container mx-auto flex gap-4">
      <div className="flex max-lg:flex-col gap-4 w-full">
        <div className="lg:w-[320px] w-full">
          <ProvidersSidebar
            diseaseSlug={slug}
            categoryType="diseases"
            diseases={diseases?.map(item => ({ ...item, title: item.name })) || []}
            branches={branches?.map(item => ({ ...item, title: item.name })) || []}
            treatmentsServices={treatmentsServices?.map(item => ({ ...item, title: item.name })) || []}
            countries={countries}
            cities={[]}
            districts={[]}
            locale={locale}
            currentPath={currentPath}
          />
        </div>
        <div className="flex-1">
          <ProvidersView 
            diseaseSlug={slug} 
            categoryType="diseases"
            locale={locale}
            country={country}
            city={city}
            district={district}
            initialData={initialProvidersData}
          />
        </div>
      </div>
    </div>
  );
}
