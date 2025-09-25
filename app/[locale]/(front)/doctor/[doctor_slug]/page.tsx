import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getDoctorDetail } from "@/lib/services/provider/doctor";
import { notFound } from "next/navigation";
import 'react-medium-image-zoom/dist/styles.css'

export const dynamic = "force-dynamic";

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    doctor_slug: string;
  }>;
}) {
  const { locale, doctor_slug } = await params;
  const t = await getTranslations({ locale });
  
  // Server-side'da doktor verisini çek (tüm yorumlarla birlikte)
  let doctor = null;
  let error = null;
  
  try {
    const response = await getDoctorDetail(doctor_slug);
    if (response.status && response.data) {
      // API'den gelen veriyi direkt kullan
      doctor = response.data;
    } else {
      error = "Doktor bulunamadı";
    }
  } catch (err) {
    error = "Doktor verisi yüklenirken hata oluştu";
    console.error("Doctor detail error:", err);
  }
  
  // Eğer doktor bulunamazsa 404 sayfasına yönlendir
  if (!doctor || error) {
    notFound();
  }
  
  const breadcrumbs = [
    { title: t("Anasayfa"), slug: "/" },
    { title: doctor?.name || doctor_slug, slug: `/doctor/${doctor_slug}` },
  ];

  return (
    <>
      <div className="container mx-auto px-4 lg:flex hidden">
        <Breadcrumb crumbs={breadcrumbs} locale={locale} />
      </div>
      <ProviderView 
        isHospital={false}
        providerData={doctor}
        providerError={error}
      />
    </>
  );
}

export default Page;
