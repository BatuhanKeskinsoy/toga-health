import ListCategories from "@/components/(front)/ListCategories";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getTreatments } from "@/lib/services/categories/treatments";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

export default async function TreatmentsServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const categoriesData = await getTreatments();

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Tedaviler ve Hizmetler"), slug: getLocalizedUrl("/treatments-services", locale) },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ListCategories
        data={categoriesData?.map(item => ({ ...item, title: item.name })) || []}
        title={t("Tedaviler ve Hizmetler")}
        description={t("Aradığınız tedavileri ve hizmetleri veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz")}
        seeMoreLabel={t("Uzmanları/Doktorları Görüntüle")}
        locale={locale}
        categoryType="treatments-services"
      />
    </>
  );
}