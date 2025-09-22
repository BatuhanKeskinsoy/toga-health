import ProvidersView from "@/components/(front)/Provider/Providers/ProvidersView";
import ProvidersSidebar from "@/components/(front)/Provider/Providers/ProbidersSidebar/ProvidersSidebar";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDiseases, getBranches, getTreatments } from "@/lib/services/categories";
import { getCountries } from "@/lib/services/locations";
import "react-medium-image-zoom/dist/styles.css";

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function DiseasesPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentPath = `/${locale}/diseases/${slug}`;
  const t = await getTranslations({ locale });

  // Server-side'dan tüm verileri çek
  const [diseases, branches, treatmentsServices, countriesData] = await Promise.all([
    getDiseases(),
    getBranches(),
    getTreatments(),
    getCountries()
  ]);
  
  // Hastalık title'ı çek
  const diseaseObj = diseases.find(
    (d) => normalizeSlug(d.slug) === normalizeSlug(slug)
  );
  if (!diseaseObj) {
    notFound();
  }
  const diseaseTitle = diseaseObj.name;

  const countries = countriesData || [];

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
    { title: t("Hastalıklar"), slug: "/diseases", slugPattern: "/diseases" },
    {
      title: diseaseTitle,
      slug: `/diseases/${slug}`,
      slugPattern: "/diseases/[slug]",
      params: { slug } as Record<string, string>,
    },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <div className="container mx-auto flex gap-4 ">
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
              diseaseName={diseaseTitle}
              categoryType="diseases"
              countryName={undefined}
              cityName={undefined}
              districtName={undefined}
            />
          </div>
        </div>
      </div>
    </>
  );
}
