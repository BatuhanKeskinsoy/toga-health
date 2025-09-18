import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCorporateDetail } from "@/lib/services/provider/hospital";
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
  let hospital = null;
  let error = null;
  
  try {
    const response = await getCorporateDetail(hospital_slug);
    if (response.status && response.data) {
      hospital = response.data;
    } else {
      error = "Hastane bulunamadı";
    }
  } catch (err) {
    error = "Hastane verisi yüklenirken hata oluştu";
    console.error("Hospital detail error:", err);
  }
  
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
