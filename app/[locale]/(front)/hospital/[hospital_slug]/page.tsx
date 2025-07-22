import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getHospital } from "@/lib/hooks/provider/useHospital";
import { notFound } from "next/navigation";
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
  
  // Server-side'da hastane verisini çek
  const { hospital, error } = await getHospital(hospital_slug);
  
  // Eğer hastane bulunamazsa 404 sayfasına yönlendir
  if (!hospital || error) {
    notFound();
  }
  
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: hospital?.name || hospital_slug, slug: `/hospital/${hospital_slug}` },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ProviderView 
        isHospital 
        hospitalData={hospital}
        hospitalError={error}
      />
    </>
  );
}

export default Page;
