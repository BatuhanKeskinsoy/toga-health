import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCorporateDetail } from "@/lib/services/provider/hospital";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { notFound, redirect } from "next/navigation";
import { getCities } from "@/lib/services/locations";
import { City } from "@/lib/types/locations/locationsTypes";
import 'react-medium-image-zoom/dist/styles.css'

export const dynamic = "force-dynamic";

async function Page({
  params,
}: {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  try {
    // URL yapısını kontrol et: [hospital_slug]/[country]/[city]
    if (slug.length < 1) {
      notFound();
    }

    const [hospital_slug, country, city] = slug;

    // Hastane bilgisini al
    const response = await getCorporateDetail(hospital_slug);
    
    if (!response.status || !response.data) {
      notFound();
    }

    const hospital = response.data;

    // Eğer sadece hospital_slug varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 1) {
      const hospitalCountry = hospital.location?.country_slug || 'turkiye';
      const hospitalCity = hospital.location?.city_slug || 'istanbul';
      
      redirect(`/${locale}/hastane/${hospital_slug}/${hospitalCountry}/${hospitalCity}`);
    }

    // Eğer sadece hospital_slug ve country varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 2) {
      const hospitalCity = hospital.location?.city_slug || 'istanbul';
      
      redirect(`/${locale}/hastane/${hospital_slug}/${country}/${hospitalCity}`);
    }

    // Tam 3 parametre olmalı: hospital_slug/country/city
    if (slug.length !== 3) {
      notFound();
    }

    // Şehir bilgisini kontrol et
    const citiesData = await getCities(country).catch(() => null);
    const cities = citiesData?.cities || [];
    const cityObj = cities.find((c: City) => c.slug === city);
    
    if (!cityObj) {
      notFound();
    }

    // Breadcrumb oluştur
    const breadcrumbs = [
      { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
      {
        title: hospital?.name || hospital_slug,
        slug: getLocalizedUrl(
          "/hospital/[...slug]",
          locale,
          { slug: slug.join('/') }
        ),
        slugPattern: "/hospital/[...slug]",
        params: { slug: slug.join('/') },
      },
    ];

    return (
      <>
        <div className="container mx-auto px-4 lg:flex hidden">
          <Breadcrumb crumbs={breadcrumbs} locale={locale} />
        </div>
        <ProviderView 
          isHospital={true}
          providerData={hospital} 
          providerError={null} 
        />
      </>
    );
  } catch (error) {
    notFound();
  }
}

export default Page;
