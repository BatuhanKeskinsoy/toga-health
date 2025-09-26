import React from "react";
import ProviderView from "@/components/(front)/Provider/ProviderView";
import Breadcrumb from "@/components/others/Breadcrumb";
import { getTranslations } from "next-intl/server";
import { getCorporateDetail } from "@/lib/services/provider/hospital";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { notFound, redirect } from "next/navigation";
import { getCities } from "@/lib/services/locations";
import { City } from "@/lib/types/locations/locationsTypes";
import { Metadata } from "next";
import "react-medium-image-zoom/dist/styles.css";
import { siteName } from "@/constants";

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

    const [hospital_slug, country, city] = slug;

    // Hastane bilgisini al
    const response = await getCorporateDetail(hospital_slug);

    if (!response.status || !response.data) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const hospital = response.data;

    // Eksik parametreler için noindex
    if (slug.length < 3) {
      return {
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    // Şehir bilgisini kontrol et
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

    const hospitalName = hospital.name || hospital_slug;
    const hospitalType = hospital.corporate_info?.type || "hastane";
    const countryName = hospital.location?.country || country;
    const cityName = hospital.location?.city || city;
    const districtName = hospital.location?.district;
    
    const title = `${hospitalName} - ${cityName} ${districtName ? `${districtName}` : ""} ${t("Hastaneler")} | ${siteName}`
    const description = `${hospitalName}, ${cityName} ${districtName ? `${districtName}` : ""} konumunda hizmet vermektedir. Randevu alın ve en iyi sağlık hizmetini alın.`
    const keywords = `${hospitalName}, ${cityName} ${t("Hastaneler")}, ${countryName} ${cityName} ${districtName ? `${districtName}` : ""} ${t("Hastaneler")}`

    return {
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: "website",
        locale: locale,
        images: hospital.photo
          ? [
              {
                url: hospital.photo,
                width: 400,
                height: 400,
                alt: hospitalName,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
        images: hospital.photo ? [hospital.photo] : [],
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
      const hospitalCountry = hospital.location?.country_slug || "turkiye";
      const hospitalCity = hospital.location?.city_slug || "istanbul";

      redirect(
        `/${locale}/hastane/${hospital_slug}/${hospitalCountry}/${hospitalCity}`
      );
    }

    // Eğer sadece hospital_slug ve country varsa, eksik parametreleri tamamla ve redirect et
    if (slug.length === 2) {
      const hospitalCity = hospital.location?.city_slug || "istanbul";

      redirect(
        `/${locale}/hastane/${hospital_slug}/${country}/${hospitalCity}`
      );
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
        slug: getLocalizedUrl("/hospital/[...slug]", locale, {
          slug: slug.join("/"),
        }),
        slugPattern: "/hospital/[...slug]",
        params: { slug: slug.join("/") },
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
