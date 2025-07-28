import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }: { params: Promise<{ locale: string, slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  return {
    title: "Hastalık Doktor Listesi" + " - " + "TOGA Health",
    description: t("Aradığınız hastalıkla ilgili hizmet veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz"),
  };
}

export default async function DiseasesPage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  // Server-side'dan tüm verileri çek
  const [diseasesRes, branchesRes, treatmentsRes, countriesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/diseases`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/branches`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/treatments-services`, { cache: 'no-store' }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/countries`, { cache: 'no-store' })
  ]);

  const [diseasesData, branchesData, treatmentsData, countriesData] = await Promise.all([
    diseasesRes.json(),
    branchesRes.json(),
    treatmentsRes.json(),
    countriesRes.json()
  ]);

  // Hastalık verilerini hazırla
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

  // Hastalık title'ı çek
  const diseaseObj = diseases.find((d: any) => normalizeSlug(d.slug) === normalizeSlug(slug));
  if (!diseaseObj) {
    notFound();
  }
  const diseaseTitle = diseaseObj.title;

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    { title: t("Hastalıklar"), slug: "/diseases", slugPattern: "/diseases" },
    { title: diseaseTitle, slug: `/diseases/${slug}`, slugPattern: "/diseases/[slug]", params: { slug } as Record<string, string> },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
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
            <ProvidersView diseaseSlug={slug} categoryType="diseases" />
          </div>
        </div>
      </div>
    </>
  );
}