import React from "react";
import AboutUs from "@/components/(front)/AboutUs/AboutUs";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations();
  const breadcrumbs = [
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