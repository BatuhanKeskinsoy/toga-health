import ListCategories from "@/components/(front)/ListCategories";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getBranches } from "@/lib/services/categories/branches";

export default async function BranchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const categoriesData = await getBranches();

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Branşlar"), slug: "/branches" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 xl:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ListCategories
        data={categoriesData?.map(item => ({ ...item, title: item.name })) || []}
        title={t("Branşlar")}
        description={t("Aradığınız branşa ve uzmanlık alanına sahip doktorlardan hemen randevu alabilirsiniz")}
        seeMoreLabel={t("Uzmanları/Doktorları Görüntüle")}
        locale={locale}
        categoryType="branches"
      />
    </>
  );
}
