import ListCategories from "@/components/(front)/ListCategories";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getDiseases } from "@/lib/services/categories/diseases";

export default async function DiseasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const categoriesData = await getDiseases();

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Hastalıklar"), slug: "/diseases" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ListCategories
        data={categoriesData?.map(item => ({ ...item, title: item.name })) || []}
        title={t("Hastalıklar")}
        description={t("Aradığınız hastalıkla ilgili hizmet veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz")}
        seeMoreLabel={t("Uzmanları/Doktorları Görüntüle")}
        locale={locale}
        categoryType="diseases"
      />
    </>
  );
}
