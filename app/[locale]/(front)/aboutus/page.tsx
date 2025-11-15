import React from "react";
import AboutUs from "@/components/(front)/AboutUs/AboutUs";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getSettings } from "@/lib/services/settings";

async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const settings = await getSettings();
  
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: t("Hakkımızda"), slug: getLocalizedUrl("/aboutus", locale) },
  ];
  
  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <AboutUs settings={settings} locale={locale} />
    </>
  );
}

export default Page;