"use client";
import React, { useEffect } from "react";
import { useSearch } from "@/lib/hooks/useSearch";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  IoChevronForward,
  IoLocationOutline,
  IoInformationCircleOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";

interface SearchDropdownContentProps {
  isLocationSelected: boolean;
  searchTerm: string;
  countryId?: number;
  cityId?: number;
  districtId?: number;
  selectedLocation?: {
    country: any | null;
    city: any | null;
    district: any | null;
  };
}

const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  isLocationSelected,
  searchTerm,
  countryId,
  cityId,
  districtId,
  selectedLocation,
}) => {
  const { search, searchPopularBranches, loading, error, results } = useSearch({
    countryId: countryId?.toString(),
    cityId: cityId?.toString(),
    districtId: districtId?.toString(),
  });
  const locale = useLocale();
  const t = useTranslations();
  useEffect(() => {
    // Artık ülke seçimi zorunlu değil, direkt arama yapabilir
    // Eğer searchTerm boşsa veya 2 harfden azsa, popüler branşları çek
    if (!searchTerm || searchTerm.trim().length < 2) {
      searchPopularBranches();
    } else {
      search(searchTerm);
    }
  }, [searchTerm, search, searchPopularBranches]);

  // Artık ülke seçimi zorunlu değil, direkt arama yapabilir
  // if (!isLocationSelected) {
  //   return (
  //     <div className="w-full p-8">
  //       <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
  //         <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
  //           <IoLocationOutline className="text-4xl text-blue-600" />
  //         </div>
  //         <div className="text-center space-y-4 max-w-md">
  //           <h3 className="text-2xl font-bold text-gray-900">
  //             {t("Konum Seçimi Gerekli")}
  //           </h3>
  //           <p className="text-lg text-gray-600 leading-relaxed">
  //             {t(
  //               "Arama yapabilmek için lütfen önce ülke seçiniz. Şehir ve ilçe seçimi opsiyoneldir"
  //             )}
  //           </p>
  //           <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 rounded-md px-4 py-3">
  //             <IoInformationCircleOutline className="text-lg" />
  //             <span>{t("Ülke seçimi zorunludur")}</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full size-6 border-2 border-gray-300 border-t-sitePrimary"></div>
          </div>
          <div className="text-sm text-gray-600">{t("Arama yapılıyor")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <IoInformationCircleOutline className="text-2xl text-red-600" />
            </div>
            <div className="space-y-2">
              <div className="text-lg font-semibold text-red-600">
                {t("Arama Hatası")}
              </div>
              <div className="text-sm text-gray-600 max-w-sm">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Popüler branşlar gösteriliyor
  if (
    results &&
    results.data &&
    results.data.results.popularBranches &&
    results.data.results.popularBranches.length > 0
  ) {
    return (
      <div className="w-full p-4">
        <div className="text-lg font-medium text-green-600">
          {t("Popüler Branşlar")}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 py-3">
          {results.data.results.popularBranches.map((branch, index) => (
            <Link
              key={`branch-${branch.slug}-${index}`}
              href={getLocalizedUrl("/branches/[slug]", locale, {
                slug: branch.slug,
              })}
              className="flex items-center justify-between gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors"
              title={branch.name + " Doktorlar"}
            >
              <span className="text-xs font-medium">
                {branch.name} {t("Doktorlar")}
              </span>
              <IoChevronForward className="text-xl text-gray-500" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Arama sonuçları gösteriliyor
  if (results && results.data && searchTerm.trim()) {
    return (
      <div className="flex flex-col gap-4 w-full h-full p-4">
        {/* Doktorlar */}
        {results.data.results.specialists &&
          results.data.results.specialists.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-base font-medium text-sitePrimary mb-2 bg-sitePrimary/5 w-full px-4 py-2">
                {t("Doktorlar")}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.data.results.specialists.map((doctor, index) => (
                  <Link
                    key={`doctor-${doctor.id}-${index}`}
                    href={getLocalizedUrl("/[...slug]", locale, {
                      slug: [
                        doctor.slug,
                        doctor.branchSlug,
                        doctor.country_slug,
                        doctor.city_slug,
                      ].join("/"),
                    })}
                    className="flex items-center p-3 border gap-3 border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {doctor.photo && (
                      <div className="flex-shrink-0">
                        <Image
                          src={doctor.photo}
                          alt={doctor.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                        />
                      </div>
                    )}
                    <div className="flex flex-col w-full items-start">
                      <div className="font-medium text-gray-900">
                        {`${doctor.expert_title ? `${doctor.expert_title} ` : ""}${doctor.name}`}
                      </div>
                      <div className="text-xs text-gray-600">
                        {doctor.branch || ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {/* Hastaneler */}
        {results.data.results.hospitals.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium text-sitePrimary mb-2 bg-sitePrimary/5 w-full px-4 py-2">
              {t("Hastaneler")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.data.results.hospitals.map((hospital, index) => (
                <Link
                  key={`hospital-${hospital.id}-${index}`}
                  href={getLocalizedUrl("/hospital/[...slug]", locale, {
                    slug: [
                      hospital.slug,
                      hospital.country_slug,
                      hospital.city_slug,
                    ].join("/"),
                  })}
                  className="flex items-center p-3 border gap-3 border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  {hospital.photo && (
                    <div className="flex-shrink-0">
                      <Image
                        src={hospital.photo}
                        alt={hospital.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-col w-full items-start">
                    <div className="font-medium text-gray-900">
                      {hospital.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {hospital.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Branşlar */}
        {results.data.results.branches.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium text-sitePrimary mb-2 bg-sitePrimary/5 w-full px-4 py-2">
              {t("Branşlar")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.data.results.branches.map((branch, index) => {
                // Dil bazlı base path belirle
                const basePath =
                  locale === "tr" ? "/uzmanlik-alanlari" : "/branches";

                let href = getLocalizedUrl("/branches/[slug]", locale, {
                  slug: branch.slug,
                });
                if (isLocationSelected && countryId) {
                  const countrySlug = selectedLocation?.country?.name
                    ?.toLowerCase()
                    .replace(/ğ/g, "g")
                    .replace(/ü/g, "u")
                    .replace(/ş/g, "s")
                    .replace(/ı/g, "i")
                    .replace(/ö/g, "o")
                    .replace(/ç/g, "c")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                  if (cityId) {
                    const citySlug = selectedLocation?.city?.name
                      ?.toLowerCase()
                      .replace(/ğ/g, "g")
                      .replace(/ü/g, "u")
                      .replace(/ş/g, "s")
                      .replace(/ı/g, "i")
                      .replace(/ö/g, "o")
                      .replace(/ç/g, "c")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                    let districtSlug = selectedLocation?.district?.name
                      ? selectedLocation.district.name
                          .toLowerCase()
                          .replace(/ğ/g, "g")
                          .replace(/ü/g, "u")
                          .replace(/ş/g, "s")
                          .replace(/ı/g, "i")
                          .replace(/ö/g, "o")
                          .replace(/ç/g, "c")
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                      : null;

                    href = getLocalizedUrl(
                      `${basePath}/${branch.slug}/${countrySlug}/${citySlug}` +
                        (districtSlug ? `/${districtSlug}` : ""),
                      locale
                    );
                  } else {
                    href = getLocalizedUrl(
                      `${basePath}/${branch.slug}/${countrySlug}`,
                      locale
                    );
                  }
                }
                return (
                  <Link
                    key={`branch-${branch.id}-${index}`}
                    href={href}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-medium text-gray-900">
                      {branch.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Hastalıklar */}
        {results.data.results.hastaliklar.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium text-sitePrimary mb-2 bg-sitePrimary/5 w-full px-4 py-2">
              {t("Hastalıklar")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.data.results.hastaliklar.map((hastalik, index) => {
                // Dil bazlı base path belirle
                const basePath = locale === "tr" ? "/hastaliklar" : "/diseases";

                let href = getLocalizedUrl("/diseases/[slug]", locale, {
                  slug: hastalik.slug,
                });
                if (isLocationSelected && countryId) {
                  const countrySlug = selectedLocation?.country?.name
                    ?.toLowerCase()
                    .replace(/ğ/g, "g")
                    .replace(/ü/g, "u")
                    .replace(/ş/g, "s")
                    .replace(/ı/g, "i")
                    .replace(/ö/g, "o")
                    .replace(/ç/g, "c")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                  if (cityId) {
                    const citySlug = selectedLocation?.city?.name
                      ?.toLowerCase()
                      .replace(/ğ/g, "g")
                      .replace(/ü/g, "u")
                      .replace(/ş/g, "s")
                      .replace(/ı/g, "i")
                      .replace(/ö/g, "o")
                      .replace(/ç/g, "c")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                    let districtSlug = selectedLocation?.district?.name
                      ? selectedLocation.district.name
                          .toLowerCase()
                          .replace(/ğ/g, "g")
                          .replace(/ü/g, "u")
                          .replace(/ş/g, "s")
                          .replace(/ı/g, "i")
                          .replace(/ö/g, "o")
                          .replace(/ç/g, "c")
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                      : null;

                    href = getLocalizedUrl(
                      `${basePath}/${hastalik.slug}/${countrySlug}/${citySlug}` +
                        (districtSlug ? `/${districtSlug}` : ""),
                      locale
                    );
                  } else {
                    href = getLocalizedUrl(
                      `${basePath}/${hastalik.slug}/${countrySlug}`,
                      locale
                    );
                  }
                }
                return (
                  <Link
                    key={`hastalik-${hastalik.id}-${index}`}
                    href={href}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col w-full items-start">
                      <div className="font-medium text-gray-900">
                        {hastalik.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {hastalik.category}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Tedaviler ve Hizmetler */}
        {results.data.results.tedaviHizmetler.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-base font-medium text-sitePrimary mb-2 bg-sitePrimary/5 w-full px-4 py-2">
              {t("Tedaviler ve Hizmetler")}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.data.results.tedaviHizmetler.map((treatment, index) => {
                // Dil bazlı base path belirle
                const basePath =
                  locale === "tr"
                    ? "/tedaviler-hizmetler"
                    : "/treatments-services";

                let href = getLocalizedUrl(
                  "/treatments-services/[slug]",
                  locale,
                  {
                    slug: treatment.slug,
                  }
                );
                if (isLocationSelected && countryId) {
                  const countrySlug = selectedLocation?.country?.name
                    ?.toLowerCase()
                    .replace(/ğ/g, "g")
                    .replace(/ü/g, "u")
                    .replace(/ş/g, "s")
                    .replace(/ı/g, "i")
                    .replace(/ö/g, "o")
                    .replace(/ç/g, "c")
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "");
                  if (cityId) {
                    const citySlug = selectedLocation?.city?.name
                      ?.toLowerCase()
                      .replace(/ğ/g, "g")
                      .replace(/ü/g, "u")
                      .replace(/ş/g, "s")
                      .replace(/ı/g, "i")
                      .replace(/ö/g, "o")
                      .replace(/ç/g, "c")
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-")
                      .replace(/^-|-$/g, "");
                    let districtSlug = selectedLocation?.district?.name
                      ? selectedLocation.district.name
                          .toLowerCase()
                          .replace(/ğ/g, "g")
                          .replace(/ü/g, "u")
                          .replace(/ş/g, "s")
                          .replace(/ı/g, "i")
                          .replace(/ö/g, "o")
                          .replace(/ç/g, "c")
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/^-|-$/g, "")
                      : null;

                    href = getLocalizedUrl(
                      `${basePath}/${treatment.slug}/${countrySlug}/${citySlug}` +
                        (districtSlug ? `/${districtSlug}` : ""),
                      locale
                    );
                  } else {
                    href = getLocalizedUrl(
                      `${basePath}/${treatment.slug}/${countrySlug}`,
                      locale
                    );
                  }
                }
                return (
                  <Link
                    key={`treatment-${treatment.id}-${index}`}
                    href={href}
                    className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex flex-col w-full items-start">
                      <div className="font-medium text-gray-900">
                        {treatment.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        {treatment.category}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Sonuç bulunamadı */}
        {results.data.totalCount === 0 && (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <IoSearchOutline className="text-2xl text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="text-lg font-semibold text-gray-900">
                  {t("Sonuç Bulunamadı")}
                </div>
                <div className="text-sm text-gray-600 max-w-sm">
                  "{searchTerm}" {t("Sonuç bulunamadı, farklı anahtar kelimeler deneyin")}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Varsayılan durum
  return (
    <div className="w-full p-6">
      <div className="text-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <IoSearchOutline className="text-2xl text-green-600" />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-green-600">
              {t("Arama Yapılabilir")}
            </div>
            <div className="text-sm text-gray-600 max-w-sm">
              {t("Arama yapmak için yazmaya başlayın veya popüler branşları keşfedin")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDropdownContent;
