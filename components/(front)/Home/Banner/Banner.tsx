import React from "react";
import SearchBar from "@/components/(front)/Search/SearchBar";
import { getServerLocationData } from "@/lib/utils/getServerLocation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import StatsSection from "@/components/(front)/Home/Banner/StatsSection";

interface BannerProps {
  doctors_count: number;
  hospitals_count: number;
  countries_count: number;
  locale: string;
}

async function Banner({
  doctors_count,
  hospitals_count,
  countries_count,
  locale,
}: BannerProps) {
  const initialLocation = await getServerLocationData();
  const t = await getTranslations({ locale });
  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Clean Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.03),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.03),transparent_60%)]"></div>

        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>

        {/* Clean Geometric Shapes */}
        <div className="absolute top-16 right-20 w-32 h-32 bg-sitePrimary/6 rounded-md transform rotate-12"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-sitePrimary/8 rounded-md transform -rotate-6"></div>
        <div className="absolute top-1/2 right-32 w-16 h-16 bg-sitePrimary/5 rounded-full"></div>

        {/* Large Clean Shapes */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-sitePrimary/4 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sitePrimary/3 rounded-full"></div>
      </div>

      {/* Main Content with Layout */}
      <div className="relative container mx-auto px-4">
        <div className="grid xl:grid-cols-[3fr_1fr] xl:gap-16 items-end">
          {/* Left Side - Content */}
          <div className="relative flex flex-col gap-6 xl:gap-8 justify-center text-center xl:text-left xl:min-h-[650px] py-12">
            {/* Hero Title */}
            <div className="flex flex-col gap-3 xl:gap-4 ltr:text-left rtl:text-right">
              <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight">
                <span className="text-slate-700">
                  {t("Sağlığınız İçin En İyisini Bulun")}
                </span>
              </h1>

              <p className="text-lg sm:text-xl xl:text-2xl text-slate-600 font-light leading-relaxed mx-auto xl:mx-0">
                {t(
                  "Uzman doktorlar, modern hastaneler ve kaliteli sağlık hizmetleri için tek platform"
                )}
              </p>
            </div>

            {/* Search Section */}
            <div className="w-full mx-auto max-w-4xl xl:mx-0">
              <SearchBar
                key="main-search-bar"
                initialLocation={initialLocation}
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center xl:justify-start items-center gap-4 xl:gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="font-medium">{t("Güvenli ve Güvenilir")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="font-medium">{t("Profesyonel Hizmet")}</span>
              </div>
            </div>

            {/* İstatistikler */}
            <StatsSection
              doctorsCount={doctors_count}
              hospitalsCount={hospitals_count}
              countriesCount={countries_count}
              locale={locale}
            />
          </div>

          {/* Right Side - Doctor Image Placeholder */}
          <div className="relative flex justify-center xl:justify-end mt-8 xl:mt-0 w-full h-full max-xl:hidden">
            <Image
              src="/assets/banner/BannerDoctor.webp"
              alt="Banner"
              fill
              priority
              sizes="(max-width: 1024px) 0vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
