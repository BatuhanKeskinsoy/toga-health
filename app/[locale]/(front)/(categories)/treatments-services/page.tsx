import ListCategories from "@/components/(front)/ListCategories";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function TreatmentsServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/categories/treatments-services`, { cache: 'no-store' });
  const { data: categoriesData } = await data.json();

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Tedaviler ve Hizmetler"), slug: "/treatments-services" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ListCategories
        data={categoriesData}
        title={t("Tedaviler ve Hizmetler")}
        description={t("Aradığınız tedavileri ve hizmetleri veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz")}
        seeMoreLabel={t("Uzmanları/Doktorları Görüntüle")}
        locale={locale}
        categoryType="treatments-services"
      />
    </>
  );
}