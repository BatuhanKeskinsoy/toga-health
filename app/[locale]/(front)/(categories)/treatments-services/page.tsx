import ListCategories from "@/components/(front)/ListCategories";
import Breadcrumb from "@/components/others/Breadcrumb";
import axios from "@/lib/axios";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("Tedaviler ve Hizmetler") + " - " + "TOGA Health",
    description: t("Aradığınız tedavileri ve hizmetleri veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz"),
  };
}

export default async function TreatmentsServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const [{ data }, { locale }] = await Promise.all([
    axios.get("http://localhost:3000/api/categories/treatments-services"),
    params,
  ]);
  const t = await getTranslations({ locale });

  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Tedaviler ve Hizmetler"), slug: "/treatments-services" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <ListCategories
        data={data.data}
        title={t("Tedaviler ve Hizmetler")}
        description={t("Aradığınız tedavileri ve hizmetleri veren hastanelerden ve doktorlardan hemen randevu alabilirsiniz")}
        seeMoreLabel={t("Uzmanları/Doktorları Görüntüle")}
        locale={locale}
        categoryType="treatments-services"
      />
    </>
  );
}