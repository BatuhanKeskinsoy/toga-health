import React from "react";
import AboutUs from "@/components/(front)/AboutUs/AboutUs";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getLocale } from "next-intl/server";

export default async function Page() {
  /* const locale = await getLocale();
  const t = await getTranslations();
  console.log("Aktif dil (locale):", locale); // ✅ log sunucuya düşer
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("İletişim"), slug: "/contact" },
  ]; */
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        {/* <Breadcrumb crumbs={breadcrumbs} /> */}
      </div>
      <AboutUs />
    </>
  );
}