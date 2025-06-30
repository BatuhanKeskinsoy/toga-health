import React from "react";
import AboutUs from "@/components/(front)/AboutUs/AboutUs";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Hakkımızda"), slug: "/aboutus" },
  ];
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <AboutUs />
    </>
  );
}

export default Page;