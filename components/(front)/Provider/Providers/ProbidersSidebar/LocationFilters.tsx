"use client";
import React, { useState, useEffect } from "react";
import CustomSelect from "@/components/others/CustomSelect";
import { useCountries } from "@/lib/hooks/useCountries";
import { useCities } from "@/lib/hooks/useCities";
import { useLocation } from "@/lib/hooks/useLocation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getDistricts } from "@/lib/services/locations";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";

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
}

function LocationFilters({ 
  selectedLocation, 
  countries, 
  cities, 
  districts, 
  locale 
}: LocationFiltersProps) {
  const [currentLocation, setCurrentLocation] = useState(selectedLocation);
  const [dynamicDistricts, setDynamicDistricts] = useState<any[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  
  // Hook'ları kullan - sadece select açıldığında veri çek
  const { countries: dynamicCountries, loading: countriesLoading, fetchCountries } = useCountries();
  const { cities: dynamicCities, loading: citiesLoading } = useCities(currentLocation.country?.slug || null);
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
      if (districts.length === 0 && currentLocation.city?.slug && currentLocation.country?.slug) {
        setDistrictsLoading(true);
        try {
          const data = await getDistricts(currentLocation.country.slug, currentLocation.city.slug);
          setDynamicDistricts(data.districts);
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setDistrictsLoading(false);
        }
      }
    };

    fetchDistricts();
  }, [districts.length, currentLocation.city?.slug, currentLocation.country?.slug]);

  // URL oluşturma fonksiyonu - düzeltildi
  const createUrl = (params: {
    diseaseSlug?: string;
    country?: string;
    city?: string;
    district?: string;
    categoryType?: string;
  }) => {
    const { country: newCountry, city: newCity, district: newDistrict } = params;
    
    // URL'yi mevcut path'e göre oluştur
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean); // Boş string'leri filtrele
    
    // Locale'i çıkar (ilk eleman)
    const pathWithoutLocale = pathParts.slice(1);
    
    // Hastalık sayfasındaysa
    if (pathWithoutLocale[0] === 'diseases' && pathWithoutLocale.length > 1) {
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
  const handleLocationSelect = (type: "country" | "city" | "district", item: any) => {
    if (!item) return;

    if (type === "country") {
      const country = item;
      if (country.id !== currentLocation.country?.id) {
        setCurrentLocation({ country, city: null, district: null });
        updateLocation({
          country,
          city: null,
          district: null
        });
        // Ülke değiştiğinde şehir ve ilçe silinir
        window.location.href = createUrl({ country: country.slug });
      }
    } else if (type === "city") {
      const city = item;
      if (city.id !== currentLocation.city?.id && currentLocation.country) {
        setCurrentLocation({ country: currentLocation.country, city, district: null });
        updateLocation({
          country: currentLocation.country,
          city,
          district: null
        });
        // Şehir değiştiğinde ilçe silinir
        window.location.href = createUrl({ 
          country: currentLocation.country.slug, 
          city: city.slug 
        });
      }
    } else if (type === "district") {
      const district = item;
      if (district.id !== currentLocation.district?.id && currentLocation.country && currentLocation.city) {
        setCurrentLocation({ country: currentLocation.country, city: currentLocation.city, district });
        updateLocation({
          country: currentLocation.country,
          city: { ...currentLocation.city, countrySlug: currentLocation.country.slug },
          district
        });
        window.location.href = createUrl({ 
          country: currentLocation.country.slug, 
          city: currentLocation.city.slug, 
          district: district.slug 
        });
      }
    }
  };

  // Kullanılacak verileri belirle (prop'tan gelenler öncelikli)
  const displayCountries = countries.length > 0 ? countries : dynamicCountries;
  const displayCities = cities.length > 0 ? cities : dynamicCities;
  const displayDistricts = districts.length > 0 ? districts : dynamicDistricts;

  return (
    <div className="flex flex-col gap-4">
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
        className="w-full"
      />

      {currentLocation.country && (
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
          className="w-full"
        />
      )}

      {currentLocation.city && (
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
          className="w-full"
        />
      )}
    </div>
  );
}

export default LocationFilters; 