"use client";
import React, { useState, useEffect } from "react";
import CustomSelect from "@/components/Customs/CustomSelect";
import { useCountries } from "@/lib/hooks/useCountries";
import { useCities } from "@/lib/hooks/useCities";
import { useLocation } from "@/lib/hooks/useLocation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getDistricts } from "@/lib/services/locations";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { AiOutlineClose } from "react-icons/ai";

interface LocationFiltersProps {
  selectedLocation: {
    country: Country | null;
    city: City | null;
    district: District | null;
  };
  countries: Country[];
  cities: City[];
  districts: District[];
  locale: string;
  currentPath: string;
  onFilterChange?: () => void;
}

function LocationFilters({
  selectedLocation,
  countries,
  cities,
  districts,
  locale,
  currentPath,
  onFilterChange
}: LocationFiltersProps) {
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);
  const [dynamicDistricts, setDynamicDistricts] = useState<any[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  // Hook'ları kullan - sadece select açıldığında veri çek
  const {
    countries: dynamicCountries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const { cities: dynamicCities, loading: citiesLoading } = useCities(
    currentLocation.country?.slug || null
  );
  const { updateLocation } = useLocation();

  // selectedLocation prop'u değiştiğinde currentLocation'ı güncelle
  useEffect(() => {
    setCurrentLocation(selectedLocation);
  }, [selectedLocation]);

  // Ülkeleri sadece select açıldığında yükle
  useEffect(() => {
    if (dynamicCountries.length === 0 && !countriesLoading) {
      fetchCountries();
    }
  }, []);

  // İlçeleri dinamik olarak çek (eğer prop'tan gelen districts boşsa)
  useEffect(() => {
    const fetchDistricts = async () => {
      if (
        districts.length === 0 &&
        currentLocation.city?.slug &&
        currentLocation.country?.slug
      ) {
        setDistrictsLoading(true);
        try {
          const data = await getDistricts(
            currentLocation.country.slug,
            currentLocation.city.slug
          );
          setDynamicDistricts(data.districts);
        } catch (error) {
          console.error("Error fetching districts:", error);
        } finally {
          setDistrictsLoading(false);
        }
      }
    };

    fetchDistricts();
  }, [
    districts.length,
    currentLocation.city?.slug,
    currentLocation.country?.slug,
  ]);

  // URL oluşturma fonksiyonu - düzeltildi
  const createUrl = (params: {
    diseaseSlug?: string;
    country?: string;
    city?: string;
    district?: string;
    categoryType?: string;
  }) => {
    const {
      country: newCountry,
      city: newCity,
      district: newDistrict,
    } = params;

    // URL'yi mevcut path'e göre oluştur
    const pathParts = currentPath.split("/").filter(Boolean); // Boş string'leri filtrele

    // Locale'i çıkar (ilk eleman)
    const pathWithoutLocale = pathParts.slice(1);

    // Hastalık sayfasındaysa
    if (pathWithoutLocale[0] === "diseases" && pathWithoutLocale.length > 1) {
      const diseaseSlug = pathWithoutLocale[1]; // İkinci eleman hastalık slug'ı
      let url = `/diseases/${diseaseSlug}`;

      // Yeni değerler varsa onları kullan, yoksa mevcut değerleri kullan
      if (newCountry) {
        url += `/${newCountry}`;
        if (newCity) url += `/${newCity}`;
        if (newDistrict) url += `/${newDistrict}`;
      } else if (currentLocation.country?.slug) {
        url += `/${currentLocation.country.slug}`;
        if (newCity) {
          url += `/${newCity}`;
          if (newDistrict) url += `/${newDistrict}`;
        } else if (currentLocation.city?.slug) {
          url += `/${currentLocation.city.slug}`;
          if (newDistrict) url += `/${newDistrict}`;
        } else if (currentLocation.district?.slug) {
          url += `/${currentLocation.district.slug}`;
        }
      }

      return getLocalizedUrl(url, locale);
    }

    // Diğer sayfalar için
    let url = `/${pathWithoutLocale[0]}`;
    if (pathWithoutLocale[1]) url += `/${pathWithoutLocale[1]}`;

    if (newCountry) {
      url += `/${newCountry}`;
      if (newCity) url += `/${newCity}`;
      if (newDistrict) url += `/${newDistrict}`;
    } else if (currentLocation.country?.slug) {
      url += `/${currentLocation.country.slug}`;
      if (newCity) {
        url += `/${newCity}`;
        if (newDistrict) url += `/${newDistrict}`;
      } else if (currentLocation.city?.slug) {
        url += `/${currentLocation.city.slug}`;
        if (newDistrict) url += `/${newDistrict}`;
      } else if (currentLocation.district?.slug) {
        url += `/${currentLocation.district.slug}`;
      }
    }

    return getLocalizedUrl(url, locale);
  };

  // Konum seçimi
  const handleLocationSelect = (
    type: "country" | "city" | "district",
    item: any
  ) => {
    if (!item) return;

    if (type === "country") {
      const country = item;
      if (country.id !== currentLocation.country?.id) {
        setCurrentLocation({ country, city: null, district: null });
        updateLocation({
          country,
          city: null,
          district: null,
        });
        // Ülke değiştiğinde şehir ve ilçe silinir
        onFilterChange?.();
        window.location.href = createUrl({ country: country.slug });
      }
    } else if (type === "city") {
      const city = item;
      if (city.id !== currentLocation.city?.id && currentLocation.country) {
        setCurrentLocation({
          country: currentLocation.country,
          city,
          district: null,
        });
        updateLocation({
          country: currentLocation.country,
          city,
          district: null,
        });
        // Şehir değiştiğinde ilçe silinir
        onFilterChange?.();
        window.location.href = createUrl({
          country: currentLocation.country.slug,
          city: city.slug,
        });
      }
    } else if (type === "district") {
      const district = item;
      if (
        district.id !== currentLocation.district?.id &&
        currentLocation.country &&
        currentLocation.city
      ) {
        setCurrentLocation({
          country: currentLocation.country,
          city: currentLocation.city,
          district,
        });
        updateLocation({
          country: currentLocation.country,
          city: {
            ...currentLocation.city,
            countrySlug: currentLocation.country.slug,
          },
          district,
        });
        onFilterChange?.();
        window.location.href = createUrl({
          country: currentLocation.country.slug,
          city: currentLocation.city.slug,
          district: district.slug,
        });
      }
    }
  };

  // Kullanılacak verileri belirle (prop'tan gelenler öncelikli)
  const displayCountries = countries.length > 0 ? countries : dynamicCountries;
  const displayCities = cities.length > 0 ? cities : dynamicCities;
  const displayDistricts = districts.length > 0 ? districts : dynamicDistricts;

  // Filtreleri temizleme fonksiyonları
  const clearCountry = () => {
    setCurrentLocation({ country: null, city: null, district: null });
    updateLocation({ country: null, city: null, district: null });
    window.location.href = createUrl({ country: undefined });
  };

  const clearCity = () => {
    setCurrentLocation({ ...currentLocation, city: null, district: null });
    updateLocation({
      country: currentLocation.country,
      city: null,
      district: null,
    });
    window.location.href = createUrl({
      country: currentLocation.country?.slug,
      city: undefined,
    });
  };

  const clearDistrict = () => {
    setCurrentLocation({ ...currentLocation, district: null });
    updateLocation({
      country: currentLocation.country,
      city: currentLocation.city,
      district: null,
    });
    window.location.href = createUrl({
      country: currentLocation.country?.slug,
      city: currentLocation.city?.slug,
      district: undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <CustomSelect
          id="country"
          name="country"
          label="Ülke"
          value={currentLocation.country}
          options={displayCountries}
          onChange={(option) => handleLocationSelect("country", option)}
          placeholder="Ülke seçiniz"
          disabled={countriesLoading}
          loading={countriesLoading}
          className="flex-1"
        />
        {currentLocation.country && (
          <button
            onClick={clearCountry}
            className="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            title="Ülke filtresini temizle"
          >
            <AiOutlineClose className="text-base" />
          </button>
        )}
      </div>

      {currentLocation.country && (
        <div className="flex items-center gap-2">
          <CustomSelect
            id="city"
            name="city"
            label="Şehir"
            value={currentLocation.city}
            options={displayCities}
            onChange={(option) => handleLocationSelect("city", option)}
            placeholder="Şehir seçiniz"
            disabled={citiesLoading}
            loading={citiesLoading}
            className="flex-1"
          />
          {currentLocation.city && (
            <button
              onClick={clearCity}
              className="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              title="Şehir filtresini temizle"
            >
              <AiOutlineClose className="text-base" />
            </button>
          )}
        </div>
      )}

      {currentLocation.city && (
        <div className="flex items-center gap-2">
          <CustomSelect
            id="district"
            name="district"
            label="İlçe"
            value={currentLocation.district}
            options={displayDistricts}
            onChange={(option) => handleLocationSelect("district", option)}
            placeholder="İlçe seçiniz"
            disabled={districtsLoading}
            loading={districtsLoading}
            className="flex-1"
          />
          {currentLocation.district && (
            <button
              onClick={clearDistrict}
              className="px-3 py-3.5 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              title="İlçe filtresini temizle"
            >
              <AiOutlineClose className="text-base" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationFilters;
