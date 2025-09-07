"use client";
import React, { useEffect } from "react";
import { useSearch } from "@/lib/hooks/useSearch";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IoChevronForward } from "react-icons/io5";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

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
  const { search, loading, error, results } = useSearch({
    countryId,
    cityId,
    districtId,
  });
  const locale = useLocale();

  useEffect(() => {
    if (isLocationSelected) {
      // Eğer searchTerm boşsa veya 2 harfden azsa, popüler branşları çek
      if (!searchTerm || searchTerm.trim().length < 2) {
        search("");
      } else {
        search(searchTerm);
      }
    }
  }, [searchTerm, isLocationSelected, search]);

  if (!isLocationSelected) {
    return (
      <div className="w-full p-4">
        <div className="text-center py-8">
          <div className="text-lg font-medium text-gray-900 mb-2">
            Arama yapabilmek için lokasyon seçiniz
          </div>
          <div className="text-sm text-gray-600">
            Lütfen önce ülke ve şehir seçiniz
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full m-0.5 size-6 border-t-2 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4">
        <div className="text-center py-8">
          <div className="text-lg font-medium text-red-600 mb-2">Hata</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // Popüler branşlar gösteriliyor
  if (
    results &&
    results.results.popularBranches &&
    results.results.popularBranches.length > 0
  ) {
    return (
      <div className="w-full p-4">
        <div className="text-lg font-medium text-green-600 mb-4">
          Popüler Branşlar
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {results.results.popularBranches.map((branch, index) => (
            <Link
              key={`branch-${branch.slug}-${index}`}
              href={getLocalizedUrl("/branches/[slug]", locale, {
                slug: branch.slug,
              })}
              className="flex items-center justify-between gap-2 w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors"
              title={branch.name + " Doktorları"}
            >
              <span className="text-xs font-medium">
                {branch.name} Doktorları
              </span>
              <IoChevronForward className="text-xl text-gray-500" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Arama sonuçları gösteriliyor
  if (results && searchTerm.trim()) {
    return (
      <div className="flex flex-col gap-4 w-full h-full p-4">
        {/* Uzmanlar */}
        {results.results.specialists.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Uzmanlar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.specialists.map((specialist, index) => (
                <Link
                  key={`specialist-${specialist.id}-${index}`}
                  href={getLocalizedUrl(
                    `/${specialist.slug}/${specialist.branchSlug}`,
                    locale
                  )}
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  {specialist.photo && (
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src={specialist.photo}
                        alt={specialist.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {specialist.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {specialist.branch || specialist.category || ""}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hastaneler */}
        {results.results.hospitals.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Hastaneler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.hospitals.map((hospital, index) => (
                <Link
                key={`hospital-${hospital.id}-${index}`}
                  href={getLocalizedUrl("/hospital/[slug]", locale, {
                    slug: hospital.slug,
                  })}
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  {hospital.photo && (
                    <div className="flex-shrink-0 mr-3">
                      <Image
                        src={hospital.photo}
                        alt={hospital.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
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

        {/* Hastalıklar */}
        {results.results.hastaliklar.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Hastalıklar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.hastaliklar.map((hastalik, index) => {
                // Dil bazlı base path belirle
                const basePath = locale === 'tr' ? '/hastaliklar' : '/diseases';
                
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
                    <div className="flex-1 min-w-0">
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

        {/* Tedavi ve Hizmetler */}
        {results.results.tedaviHizmetler.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Tedavi ve Hizmetler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.results.tedaviHizmetler.map((tedavi, index) => (
                <Link
                  key={`tedavi-${tedavi.id}-${index}`}
                  href={getLocalizedUrl("/treatments-services/[slug]", locale, {
                    slug: tedavi.slug,
                  })}
                  className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {tedavi.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {tedavi.category}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sonuç bulunamadı */}
        {results.totalCount === 0 && (
          <div className="text-center py-8">
            <div className="text-lg font-medium text-gray-900 mb-2">
              Sonuç Bulunamadı
            </div>
            <div className="text-sm text-gray-600">
              "{searchTerm}" için sonuç bulunamadı
            </div>
          </div>
        )}
      </div>
    );
  }

  // Varsayılan durum
  return (
    <div className="w-full p-4">
      <div className="text-center py-8">
        <div className="text-lg font-medium text-green-600 mb-2">
          Arama Yapılabilir
        </div>
        <div className="text-sm text-gray-600">
          Arama yapmak için yazmaya başlayın
        </div>
      </div>
    </div>
  );
};

export default SearchDropdownContent;
