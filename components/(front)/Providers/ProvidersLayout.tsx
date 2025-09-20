import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import { getCountries } from "@/lib/services/locations";
import { getDiseases, getBranches, getTreatments } from "@/lib/services/categories";
import { Country } from "@/lib/types/locations/locationsTypes";

export default async function ProvidersLayout({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {
  const currentPath = `/${locale}/diseases/${slug}`;

  // Server-side'dan tüm verileri çek
  const [diseases, branches, treatmentsServices, countriesData] =
    await Promise.all([
      getDiseases(),
      getBranches(),
      getTreatments(),
      getCountries(),
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
          />
        </div>
      </div>
    </div>
  );
}
