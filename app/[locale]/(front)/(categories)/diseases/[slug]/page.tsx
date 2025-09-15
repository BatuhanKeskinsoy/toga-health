import ProvidersLayout from "@/components/(front)/Providers/ProvidersLayout";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getDiseases } from "@/lib/services/categories/diseases";

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
  const t = await getTranslations({ locale });

  // Server-side'dan tüm verileri çek
  const diseases = await getDiseases();
  
  // Hastalık title'ı çek
  const diseaseObj = diseases.find(
    (d) => normalizeSlug(d.slug) === normalizeSlug(slug)
  );
  if (!diseaseObj) {
    notFound();
  }
  const diseaseTitle = diseaseObj.name;

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
      <ProvidersLayout slug={slug} locale={locale} />
    </>
  );
}
