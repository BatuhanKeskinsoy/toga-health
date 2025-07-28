import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: "Hastalık Doktor Listesi" + " - " + "TOGA Health",
    description: "Aradığınız hastalıkla ilgili hizmet veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz",
  };
}

export default async function DiseasesPage({ params }: { params: Promise<{ locale: string, slug: string, country: string }> }) {
  const { locale, slug, country } = await params;
  const t = await getTranslations({ locale });

  // Server-side'dan tüm verileri çek
  const [diseasesRes, branchesRes, treatmentsRes, countriesRes, citiesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/diseases`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/branches`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/treatments-services`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/countries`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/cities/${country}`, { cache: 'no-store' })
  ]);

  const [diseasesData, branchesData, treatmentsData, countriesData, citiesData] = await Promise.all([
    diseasesRes.json(),
    branchesRes.json(),
    treatmentsRes.json(),
    countriesRes.json(),
    citiesRes.json()
  ]);

  // Verileri hazırla
  const diseases = diseasesData.success ? diseasesData.data.map((disease: any) => ({
    ...disease,
    name: disease.title
  })) : [];

  const branches = branchesData.success ? branchesData.data.map((branch: any) => ({
    ...branch,
    name: branch.title
  })) : [];

  const treatmentsServices = treatmentsData.success ? treatmentsData.data.map((treatment: any) => ({
    ...treatment,
    name: treatment.title
  })) : [];

  const countries = countriesData.success ? countriesData.data : [];
  const cities = citiesData.success ? citiesData.data : [];

  // Hastalık title'ı çek
  const diseaseObj = diseases.find((d: any) => d.slug === slug);
  const diseaseTitle = diseaseObj ? diseaseObj.title : slug;

  // Ülke title'ı çek
  const countryObj = countries.find((c: any) => c.slug === country);
  const countryTitle = countryObj ? countryObj.name : country;

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    { title: t("Hastalıklar"), slug: "/diseases", slugPattern: "/diseases" },
    { title: diseaseTitle, slug: `/diseases/${slug}`, slugPattern: "/diseases/[slug]", params: { slug } as Record<string, string> },
    { title: countryTitle, slug: `/diseases/${slug}/${country}`, slugPattern: "/diseases/[slug]/[country]", params: { slug, country } as Record<string, string> },
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
              diseases={diseases}
              branches={branches}
              treatmentsServices={treatmentsServices}
              countries={countries}
              cities={cities}
              districts={[]}
              locale={locale}
            />
          </div>
          <div className="flex-1">
            <ProvidersView diseaseSlug={slug} country={country} categoryType="diseases" />
          </div>
        </div>
      </div>
    </>
  );
} 