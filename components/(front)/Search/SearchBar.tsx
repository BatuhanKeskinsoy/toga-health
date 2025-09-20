"use client";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import SelectLocation from "./SelectLocation";
import SearchDropdown from "./SearchDropdown";
import SearchDropdownContent from "./SearchDropdownContent";
import { useLocation } from "@/lib/hooks/useLocation";
import Link from "next/link";
import React, { useState, useEffect, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";

interface SearchBarProps {
  initialLocation?: {
    country: Country | null;
    city: City | null;
    district: District | null;
  } | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialLocation = null }) => {
  const [search, setSearch] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    country: Country | null;
    city: City | null;
    district: District | null;
  }>({
    country: initialLocation?.country || null,
    city: initialLocation?.city || null,
    district: initialLocation?.district || null
  });

  // Hook'ları kullan
  const { location, loading: locationLoading, updateLocation } = useLocation({
    initialLocation: initialLocation ? {
      country: initialLocation.country,
      city: initialLocation.city,
      district: initialLocation.district
    } : null
  });

  // Cookie'den yüklenen konumu seç (sadece initialLocation yoksa)
  useEffect(() => {
    if (location && !initialLocation) {
      setSelectedLocation({
        country: location.country,
        city: location.city,
        district: location.district
      });
    }
  }, [location, initialLocation]);

  // initialLocation değiştiğinde selectedLocation'ı güncelle
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation({
        country: initialLocation.country,
        city: initialLocation.city,
        district: initialLocation.district
      });
    }
  }, [initialLocation]);

  // Konum değişikliğini handle et
  const handleLocationChange = useCallback((newLocation: { 
    country: Country; 
    city: City; 
    district: District;
  }) => {
    setSelectedLocation({
      country: newLocation.country,
      city: newLocation.city,
      district: newLocation.district
    });
    
    updateLocation({
      country: newLocation.country,
      city: newLocation.city,
      district: newLocation.district
    });
  }, [updateLocation]);

  // Search input değiştiğinde dropdown kontrolü
  const handleSearchChange = useCallback((e: any) => {
    const value = e.target.value;
    setSearch(value);
    
    // Sadece web'de 2 harf kontrolü yap, mobilde dropdown açık kalsın
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      // Web'de 2 harf yazıldığında dropdown aç
      if (value.trim().length >= 2) {
        setIsSearchDropdownOpen(true);
      } else {
        setIsSearchDropdownOpen(false);
      }
    }
    // Mobilde dropdown kontrolü yapma, sadece çarpı butonuna basınca kapanır
  }, []);

  // Search input'a tıklandığında popüler branşları göster
  const handleSearchFocus = useCallback(() => {
    setIsSearchDropdownOpen(true);
  }, []);

  // Search dropdown'ı kapat
  const handleCloseSearchDropdown = useCallback(() => {
    setIsSearchDropdownOpen(false);
  }, []);

  // Location seçili mi kontrolü - sadece ülke seçimi yeterli
  const isLocationSelected = Boolean(selectedLocation.country);

  return (
    <div className="relative w-full">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:gap-4">
        {/* Arama Kutusu */}
        <div className="w-full lg:w-1/2">
          <CustomInput
            id="search"
            required
            type="text"
            name="search"
            autoComplete="search"
            inputMode="search"
            tabIndex={1}
            value={search}
            icon={<IoSearchOutline />}
            label={"Uzman, Branş, Hastalık veya Kurum Ara"}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
          />
          
          <SearchDropdown
            isOpen={isSearchDropdownOpen}
            onClose={handleCloseSearchDropdown}
            isMobile={true}
            searchValue={search}
            onSearchChange={handleSearchChange}
            onSearchFocus={handleSearchFocus}
          >
            <SearchDropdownContent 
              isLocationSelected={isLocationSelected}
              searchTerm={search}
              countryId={selectedLocation.country?.id}
              cityId={selectedLocation.city?.id}
              districtId={selectedLocation.district?.id}
              selectedLocation={selectedLocation}
            />
          </SearchDropdown>
        </div>
        
        {/* Konum Seçimi */}
        <div className="w-full lg:w-1/2">
          <SelectLocation
            key="search-bar-location"
            value={{
              country: selectedLocation.country,
              city: selectedLocation.city,
              district: selectedLocation.district
            }}
            onChange={handleLocationChange}
            placeholder="Ülke seçiniz (şehir ve ilçe opsiyonel)"
            required
            initialLocation={initialLocation ? {
              country: initialLocation.country,
              city: initialLocation.city,
              district: initialLocation.district
            } : undefined}
          />
        </div>
        
        {/* Ara Butonu */}
        <div className="w-full lg:w-auto">
          <Link href="" className="w-full lg:w-auto">
            <CustomButton
              title="Ara"
              leftIcon={<IoSearchOutline className="text-xl lg:text-2xl" />}
              containerStyles="flex items-center justify-center gap-2 bg-sitePrimary text-white px-6 py-3 rounded-md w-full lg:w-auto min-w-[120px] hover:bg-sitePrimary/90 transition-colors"
              textStyles="text-base lg:text-lg font-medium"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
