import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getSpecialist } from "@/lib/hooks/provider/useSpecialist";
import 'react-medium-image-zoom/dist/styles.css'

export const dynamic = "force-dynamic";

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    branch_slug: string;
    specialist_slug: string;
  }>;
}) {
  const { locale, branch_slug, specialist_slug } = await params;
  const t = await getTranslations({ locale });
  
  // Server-side'da doktor verisini çek
  const { specialist, error } = await getSpecialist(specialist_slug);
  
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: specialist?.name || specialist_slug, slug: `/${branch_slug}/${specialist_slug}` },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} />
      </div>
      <ProviderView 
        specialistData={specialist}
        specialistError={error}
      />
    </>
  );
}

export default Page;
