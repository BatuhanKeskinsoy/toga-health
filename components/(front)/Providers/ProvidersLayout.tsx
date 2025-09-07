import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";

export default async function ProvidersLayout({
  slug,
  locale,
}: {
  slug: string;
  locale: string;
}) {

  // Server-side'dan tüm verileri çek
  const [diseasesRes, branchesRes, treatmentsRes, countriesRes] =
    await Promise.all([
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/categories/diseases`,
        { cache: "no-store" }
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/categories/branches`,
        { cache: "no-store" }
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/categories/treatments-services`,
        { cache: "no-store" }
      ),
      fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/api/countries`,
        { cache: "no-store" }
      ),
    ]);

  const [diseasesData, branchesData, treatmentsData, countriesData] =
    await Promise.all([
      diseasesRes.json(),
      branchesRes.json(),
      treatmentsRes.json(),
      countriesRes.json(),
    ]);

  // Hastalık verilerini hazırla
  const diseases = diseasesData.success
    ? diseasesData.data.map((disease: any) => ({
        ...disease,
        name: disease.title,
      }))
    : [];

  const branches = branchesData.success
    ? branchesData.data.map((branch: any) => ({
        ...branch,
        name: branch.title,
      }))
    : [];

  const treatmentsServices = treatmentsData.success
    ? treatmentsData.data.map((treatment: any) => ({
        ...treatment,
        name: treatment.title,
      }))
    : [];

  const countries = countriesData.success ? countriesData.data : [];


  return (
    <div className="container mx-auto flex gap-4">
      <div className="flex max-lg:flex-col gap-4 w-full">
        <div className="lg:w-[320px] w-full">
          <ProvidersSidebar
            diseaseSlug={slug}
            categoryType="diseases"
            diseases={diseases}
            branches={branches}
            treatmentsServices={treatmentsServices}
            countries={countries}
            cities={[]}
            districts={[]}
            locale={locale}
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
