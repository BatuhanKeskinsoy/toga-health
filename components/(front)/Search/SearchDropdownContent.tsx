"use client";
import React, { useEffect } from "react";
import { useSearch } from "@/lib/hooks/useSearch";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import CustomButton from "@/components/others/CustomButton";

// Arama terimini vurgulama fonksiyonu
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200/30">
        {part}
      </span>
    ) : (
      part
    )
  );
};

interface SearchDropdownContentProps {
  isLocationSelected: boolean;
  searchTerm: string;
  countryId?: number;
  cityId?: number;
  districtId?: number;
}

const SearchDropdownContent: React.FC<SearchDropdownContentProps> = ({
  isLocationSelected,
  searchTerm,
  countryId,
  cityId,
  districtId,
}) => {
  const { search, loading, error, results } = useSearch({
    countryId,
    cityId,
    districtId,
  });

  useEffect(() => {
    if (isLocationSelected && searchTerm.length >= 2) {
      search(searchTerm);
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

  if (!results && !searchTerm.trim()) {
    return (
      <div className="w-full p-4">
        <div className="text-center py-8">
          <div className="text-lg font-medium text-green-600 mb-2">
            Popüler Branşlar
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
            {[
              { name: "Kardiyoloji", slug: "kardiyoloji" },
              { name: "Nöroloji", slug: "noroloji" },
              { name: "Ortopedi", slug: "ortopedi" },
              { name: "Onkoloji", slug: "onkoloji" },
              { name: "Dahiliye", slug: "dahiliye" },
              { name: "Kadın Hastalıkları", slug: "kadin-hastaliklari" },
              { name: "Çocuk Sağlığı", slug: "cocuk-sagligi" },
              { name: "Dermatoloji", slug: "dermatoloji" },
              { name: "Göz Hastalıkları", slug: "goz-hastaliklari" },
              { name: "Kulak Burun Boğaz", slug: "kulak-burun-bogaz" }
            ].map((branch) => (
              <Link
                key={branch.slug}
                href={`/uzmanlik-alanlari/${branch.slug}`}
                className="block"
              >
                <CustomButton
                  title={branch.name}
                  containerStyles="w-full p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-center transition-colors"
                  textStyles="text-sm"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!results && searchTerm.trim()) {
    return (
      <div className="w-full p-4">
        <div className="text-center py-8">
          <div className="text-lg font-medium text-green-600 mb-2">
            Arama Yapılabilir
          </div>
          <div className="text-sm text-gray-600">
            "{searchTerm}" için arama yapılabilir
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full p-4 h-full z-10">
      {/* Uzmanlar */}
      {results.results.specialists.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Uzmanlar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.results.specialists.map((specialist) => (
              <Link
                key={specialist.id}
                href={`/${specialist.branchSlug}/${specialist.slug}`}
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
                    {highlightSearchTerm(specialist.name, searchTerm)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {highlightSearchTerm(specialist.branch || specialist.category || '', searchTerm)}
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
          <h3 className="text-sm font-medium text-gray-900 mb-2">Hastaneler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.results.hospitals.map((hospital) => (
              <Link
                key={hospital.id}
                href={`/hospital/${hospital.slug}`}
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
                    {highlightSearchTerm(hospital.name, searchTerm)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {highlightSearchTerm(hospital.category, searchTerm)}
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
          <h3 className="text-sm font-medium text-gray-900 mb-2">Hastalıklar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.results.hastaliklar.map((hastalik) => (
              <Link
                key={hastalik.id}
                href={`/hastaliklar/${hastalik.slug}`}
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {highlightSearchTerm(hastalik.name, searchTerm)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {highlightSearchTerm(hastalik.category, searchTerm)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tedavi ve Hizmetler */}
      {results.results.tedaviHizmetler.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Tedavi ve Hizmetler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.results.tedaviHizmetler.map((tedavi) => (
              <Link
                key={tedavi.id}
                href={`/tedaviler-hizmetler/${tedavi.slug}`}
                className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {highlightSearchTerm(tedavi.name, searchTerm)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {highlightSearchTerm(tedavi.category, searchTerm)}
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
};

export default SearchDropdownContent;
