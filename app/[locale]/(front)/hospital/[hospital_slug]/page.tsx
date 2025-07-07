import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import 'react-medium-image-zoom/dist/styles.css'

export const dynamic = "force-dynamic";

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    hospital_slug: string;
  }>;
}) {
  const { locale, hospital_slug } = await params;
  const t = await getTranslations({ locale });
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: hospital_slug, slug: `/hospital/${hospital_slug}` },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <ProviderView isHospital />
    </>
  );
}

export default Page;
