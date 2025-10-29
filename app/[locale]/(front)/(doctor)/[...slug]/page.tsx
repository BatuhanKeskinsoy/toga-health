import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getDoctorDetail } from "@/lib/services/provider/doctor";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { notFound, redirect } from "next/navigation";
import { getCities } from "@/lib/services/locations";
import { City } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  try {
    // URL yapısını kontrol et
    if (slug.length < 1) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const [specialist_slug, branch_slug, country, city] = slug;

    // Doktor bilgisini al
    const response = await getDoctorDetail(specialist_slug);
    
    if (!response.status || !response.data) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const doctor = response.data;

    // Eksik parametreler için noindex
    if (slug.length < 4) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Branch slug'ını kontrol et - metadata için de kontrol et
    const specialty = doctor.doctor_info?.specialty;
    if (!specialty) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Branch slug'ının geçerli olup olmadığını kontrol et
    let isValidBranch = specialty.slug === branch_slug;
    if (!isValidBranch && specialty.translations && Array.isArray(specialty.translations)) {
      isValidBranch = specialty.translations.some((translation: any) => 
        translation.slug === branch_slug
      );
    }
    
    if (!isValidBranch) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Şehir bilgisini kontrol et - metadata için basit kontrol yeterli
    const citiesData = await getCities(country).catch(() => null);
    const cities = citiesData?.cities || [];
    const cityObj = cities.find((c: City) => c.slug === city);
    
    if (!cityObj) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const doctorName = doctor.name || specialist_slug;
    const specialtyName = doctor.doctor_info?.specialty?.name || branch_slug;
    const countryName = doctor.location?.country || country;
    const cityName = doctor.location?.city || city;
    const districtName = doctor.location?.district;

    const title = `${doctorName} - ${specialtyName} - ${cityName} ${districtName ? `${districtName}` : ""} ${t("Doktorlar")} | Toga Health`
    const description = `${doctorName} ${specialtyName} uzmanı ${cityName} ${districtName ? `${districtName}` : ""} konumunda hizmet vermektedir. Randevu alın ve en iyi sağlık hizmetini alın.`
    const keywords = `${doctorName}, ${cityName} ${specialtyName} ${t("Doktorlar")}, ${cityName} ${districtName ? `${districtName}` : ""} ${specialtyName} ${t("Doktorlar")}`

    return {
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: "profile",
        locale: locale,
        images: doctor.photo ? [
          {
            url: doctor.photo,
            width: 400,
            height: 400,
            alt: doctorName,
          }
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: doctor.photo ? [doctor.photo] : [],
      },
    };
  } catch (error) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

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
    // URL yapısını kontrol et: [specialist_slug]/[branch_slug]/[country]/[city]/[district?]
    if (slug.length < 1) {
      notFound();
    }

    const [specialist_slug, branch_slug, country, city] = slug;

    // Doktor bilgisini al
    const response = await getDoctorDetail(specialist_slug);
    
    if (!response.status || !response.data) {
      notFound();
    }

    const doctor = response.data;

    // Eğer sadece specialist_slug varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 1) {
      const doctorBranch = doctor.doctor_info?.specialty?.slug;
      if (!doctorBranch) {
        notFound();
      }
      
      const doctorCountry = doctor.location?.country_slug;
      const doctorCity = doctor.location?.city_slug;
      
      redirect(`/${locale}/${specialist_slug}/${doctorBranch}/${doctorCountry}/${doctorCity}`);
    }

    // Eğer sadece specialist_slug ve branch_slug varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 2) {
      const doctorCountry = doctor.location?.country_slug;
      const doctorCity = doctor.location?.city_slug;
      
      redirect(`/${locale}/${specialist_slug}/${branch_slug}/${doctorCountry}/${doctorCity}`);
    }

    // Eğer sadece specialist_slug, branch_slug ve country varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 3) {
      const doctorCity = doctor.location?.city_slug;
      
      redirect(`/${locale}/${specialist_slug}/${branch_slug}/${country}/${doctorCity}`);
    }

    // Tam 4 parametre olmalı: specialist_slug/branch_slug/country/city
    if (slug.length !== 4) {
      notFound();
    }

  // Branch slug'ını kontrol et - specialty bilgisini al
    const specialty = doctor.doctor_info?.specialty;
    if (!specialty) {
      notFound();
    }

    // Branch slug'ının geçerli olup olmadığını kontrol et
    // Önce mevcut slug ile kontrol et
    let isValidBranch = specialty.slug === branch_slug;
    
    // Eğer eşleşmiyorsa, translations array'inde kontrol et
    if (!isValidBranch && specialty.translations && Array.isArray(specialty.translations)) {
      isValidBranch = specialty.translations.some((translation: any) => 
        translation.slug === branch_slug
      );
    }
    
    // Branch slug geçersizse 404
    if (!isValidBranch) {
      notFound();
    }

    // Şehir bilgisini kontrol et
    const citiesData = await getCities(country).catch(() => null);
    const cities = citiesData?.cities || [];
    const cityObj = cities.find((c: City) => c.slug === city);
    
    // Şehir API'sinden bulunamazsa, doktorun location bilgisini kontrol et
    if (!cityObj) {
      // Doktorun primary location'ı URL ile eşleşiyorsa geçerli say
      const doctorCountrySlug = doctor.location?.country_slug;
      const doctorCitySlug = doctor.location?.city_slug;
      
      if (doctorCountrySlug === country && doctorCitySlug === city) {
        // Sayfayı göster (doktorun konumu eşleşiyor)
      } else {
        // Hiçbiri eşleşmiyorsa 404
        notFound();
      }
    }

    // Breadcrumb oluştur
    const breadcrumbs = [
      { title: t("Anasayfa"), slug: "/", slugPattern: "/" },
      {
        title: doctor?.name || specialist_slug,
        slug: getLocalizedUrl(
          "/[...slug]",
          locale,
          { slug: slug.join('/') }
        ),
        slugPattern: "/[...slug]",
        params: { slug: slug.join('/') },
      },
    ];

    return (
      <>
        <div className="container mx-auto px-4 lg:flex hidden">
          <Breadcrumb crumbs={breadcrumbs} locale={locale} />
        </div>
        <ProviderView 
          isHospital={false}
          providerData={doctor} 
          providerError={null} 
        />
      </>
    );
  } catch (error) {
    notFound();
  }
}

export default Page;
