"use client";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import SelectLocation from "./SelectLocation";
import SearchDropdown from "./SearchDropdown";
import SearchCategories from "./SearchCategories";
import { useLocation } from "@/lib/hooks/useLocation";
import { Link } from "@/i18n/navigation";
import React, { useState, useEffect, useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface Country {
  id: number;
  name: string;
  code: string;
}

interface City {
  id: number;
  name: string;
  countryId: number;
}

interface SearchCategory {
  id: string;
  title: string;
  description: string;
}

const SearchBar: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    country: Country | null;
    city: City | null;
  }>({ country: null, city: null });

  // Hook'ları kullan
  const { location, loading: locationLoading, updateLocation } = useLocation();

  // Cookie'den yüklenen konumu seç
  useEffect(() => {
    if (location) {
      setSelectedLocation({
        country: location.country,
        city: location.city
      });
    }
  }, [location]);

  // Konum değişikliğini handle et
  const handleLocationChange = useCallback((newLocation: { country: Country | null; city: City | null }) => {
    setSelectedLocation(newLocation);
    
    if (newLocation.country && newLocation.city) {
      updateLocation({
        country: newLocation.country,
        city: newLocation.city
      });
    }
  }, [updateLocation]);

  // Search input'a focus olduğunda dropdown aç
  const handleSearchFocus = useCallback(() => {
    setIsSearchDropdownOpen(true);
  }, []);

  // Search dropdown'ı kapat
  const handleCloseSearchDropdown = useCallback(() => {
    setIsSearchDropdownOpen(false);
  }, []);

  // Kategori seçimi
  const handleCategorySelect = useCallback((category: SearchCategory) => {
    console.log("Seçilen kategori:", category);
    setIsSearchDropdownOpen(false);
  }, []);

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
            onChange={(e: any) => setSearch(e.target.value)}
            onFocus={handleSearchFocus}
          />
          
          <SearchDropdown
            isOpen={isSearchDropdownOpen}
            onClose={handleCloseSearchDropdown}
            isMobile={true}
          >
            <SearchCategories onCategorySelect={handleCategorySelect} />
          </SearchDropdown>
        </div>
        
        {/* Konum Seçimi */}
        <div className="w-full lg:w-1/3">
          <SelectLocation
            value={selectedLocation}
            onChange={handleLocationChange}
            placeholder="Ülke ve şehir seçiniz"
            required
          />
        </div>
        
        {/* Ara Butonu */}
        <div className="w-full lg:w-auto">
          <Link href="/search" className="w-full lg:w-auto">
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
