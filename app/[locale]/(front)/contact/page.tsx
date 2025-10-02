import React from "react";
import Contact from "@/components/(front)/Contact/Contact";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";

async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("İletişim"), slug: "/contact" },
  ];
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <Contact />
    </>
  );
}

export default Page;
