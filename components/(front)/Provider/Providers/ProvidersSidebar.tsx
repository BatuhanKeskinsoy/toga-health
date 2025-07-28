"use client";
import React, { useState, useEffect } from "react";
import { useCountries } from "@/lib/hooks/useCountries";
import { useCities } from "@/lib/hooks/useCities";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { useLocation } from "@/lib/hooks/useLocation";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomSelect from "@/components/others/CustomSelect";

interface ProvidersSidebarProps {
  diseaseSlug?: string;
  country?: string;
  city?: string;
  district?: string;
  categoryType?: "diseases" | "branches" | "treatments-services";
}

interface Country {
  id: number;
  name: string;
  slug: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
  countrySlug: string;
}

interface District {
  id: number;
  name: string;
  slug: string;
  citySlug: string;
}

interface Disease {
  id: number;
  name: string;
  title: string;
  slug: string;
}

interface Branch {
  id: number;
  name: string;
  title: string;
  slug: string;
}

interface TreatmentService {
  id: number;
  name: string;
  title: string;
  slug: string;
}

function ProvidersSidebar({ diseaseSlug, country, city, district, categoryType = "diseases" }: ProvidersSidebarProps) {
  const locale = useLocale();
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [treatmentsServices, setTreatmentsServices] = useState<TreatmentService[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    country: Country | null;
    city: City | null;
    district: District | null;
  }>({ country: null, city: null, district: null });

  // Hook'ları kullan
  const { countries, loading: countriesLoading, fetchCountries } = useCountries();
  const { cities, loading: citiesLoading } = useCities(selectedLocation.country?.slug || null);
  const { districts, loading: districtsLoading } = useDistricts(
    selectedLocation.country?.slug || null,
    selectedLocation.city?.slug || null
  );
  const { location, loading: locationLoading, updateLocation } = useLocation();

  // Ülkeleri yükle
  useEffect(() => {
    if (countries.length === 0 && !countriesLoading) {
      fetchCountries();
    }
  }, [countries.length, countriesLoading, fetchCountries]);

  // Mevcut konumu seç
  useEffect(() => {
    if (location) {
      setSelectedLocation({
        country: location.country,
        city: location.city,
        district: location.district
      });
    }
  }, [location]);

  // URL'deki konum parametrelerini kontrol et ve seç
  useEffect(() => {
    if (country && !selectedLocation.country) {
      // URL'deki ülke slug'ını kullanarak ülkeyi bul
      const urlCountry = countries.find(c => c.slug === country);
      if (urlCountry) {
        setSelectedLocation(prev => ({ ...prev, country: urlCountry }));
      }
    }
  }, [country, countries, selectedLocation.country]);

  useEffect(() => {
    if (city && selectedLocation.country && !selectedLocation.city) {
      // URL'deki şehir slug'ını kullanarak şehri bul
      const urlCity = cities.find(c => c.slug === city);
      if (urlCity) {
        setSelectedLocation(prev => ({ ...prev, city: urlCity }));
      }
    }
  }, [city, cities, selectedLocation.country, selectedLocation.city]);

  useEffect(() => {
    if (district && selectedLocation.city && !selectedLocation.district) {
      // URL'deki ilçe slug'ını kullanarak ilçeyi bul
      const urlDistrict = districts.find(d => d.slug === district);
      if (urlDistrict) {
        setSelectedLocation(prev => ({ ...prev, district: urlDistrict }));
      }
    }
  }, [district, districts, selectedLocation.city, selectedLocation.district]);

  // Hastalıkları yükle
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const response = await fetch('/api/categories/diseases');
        const data = await response.json();
        if (data.success) {
          // Disease interface'ini CustomSelect'in Option interface'i ile uyumlu hale getir
          const diseasesWithName = data.data.map((disease: any) => ({
            ...disease,
            name: disease.title
          }));
          setDiseases(diseasesWithName);
        }
      } catch (error) {
        console.error('Hastalıklar yüklenirken hata:', error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/categories/branches');
        const data = await response.json();
        if (data.success) {
          // Branch interface'ini CustomSelect'in Option interface'i ile uyumlu hale getir
          const branchesWithName = data.data.map((branch: any) => ({
            ...branch,
            name: branch.title
          }));
          setBranches(branchesWithName);
        }
      } catch (error) {
        console.error('Branşlar yüklenirken hata:', error);
      }
    };

    const fetchTreatmentsServices = async () => {
      try {
        const response = await fetch('/api/categories/treatments-services');
        const data = await response.json();
        if (data.success) {
          // TreatmentService interface'ini CustomSelect'in Option interface'i ile uyumlu hale getir
          const treatmentsWithName = data.data.map((treatment: any) => ({
            ...treatment,
            name: treatment.title
          }));
          setTreatmentsServices(treatmentsWithName);
        }
      } catch (error) {
        console.error('Tedavi hizmetleri yüklenirken hata:', error);
      }
    };

    fetchDiseases();
    fetchBranches();
    fetchTreatmentsServices();
  }, []);

  // Konum seçimi
  const handleLocationSelect = (type: "country" | "city" | "district", item: any) => {
    if (type === "country") {
      const country = item as Country;
      setSelectedLocation({ country, city: null, district: null });
      if (country) {
        updateLocation({
          country,
          city: { id: 0, name: "", slug: "", countrySlug: country.slug },
          district: { id: 0, name: "", slug: "", citySlug: "" }
        });
        // URL'yi güncelle
        window.location.href = createUrl({ country: country.slug });
      }
    } else if (type === "city") {
      const city = item as City;
      setSelectedLocation({ country: selectedLocation.country, city, district: null });
      if (selectedLocation.country && city) {
        updateLocation({
          country: selectedLocation.country,
          city,
          district: { id: 0, name: "", slug: "", citySlug: city.slug }
        });
        // URL'yi güncelle
        window.location.href = createUrl({ 
          country: selectedLocation.country.slug, 
          city: city.slug 
        });
      }
    } else if (type === "district") {
      const district = item as District;
      setSelectedLocation({ country: selectedLocation.country, city: selectedLocation.city, district });
      if (selectedLocation.country && selectedLocation.city && district) {
        updateLocation({
          country: selectedLocation.country,
          city: selectedLocation.city,
          district
        });
        // URL'yi güncelle
        window.location.href = createUrl({ 
          country: selectedLocation.country.slug, 
          city: selectedLocation.city.slug, 
          district: district.slug 
        });
      }
    }
  };

  // URL oluşturma fonksiyonu
  const createUrl = (params: {
    diseaseSlug?: string;
    country?: string;
    city?: string;
    district?: string;
    categoryType?: string;
  }) => {
    const { diseaseSlug: newDiseaseSlug, country: newCountry, city: newCity, district: newDistrict, categoryType: newCategoryType } = params;
    
    // Mevcut değerleri kullan veya yeni değerleri
    const finalDiseaseSlug = newDiseaseSlug || diseaseSlug;
    const finalCountry = newCountry || country;
    const finalCity = newCity || city;
    const finalDistrict = newDistrict || district;
    const finalCategoryType = newCategoryType || categoryType;

    if (finalCategoryType === "diseases" && finalDiseaseSlug) {
      let url = `/diseases/${finalDiseaseSlug}`;
      if (finalCountry) url += `/${finalCountry}`;
      if (finalCity) url += `/${finalCity}`;
      if (finalDistrict) url += `/${finalDistrict}`;
      return getLocalizedUrl(url, locale);
    } else if (finalCategoryType === "branches") {
      let url = `/branches`;
      if (finalCountry) url += `/${finalCountry}`;
      if (finalCity) url += `/${finalCity}`;
      if (finalDistrict) url += `/${finalDistrict}`;
      return getLocalizedUrl(url, locale);
    } else if (finalCategoryType === "treatments-services") {
      let url = `/treatments-services`;
      if (finalCountry) url += `/${finalCountry}`;
      if (finalCity) url += `/${finalCity}`;
      if (finalDistrict) url += `/${finalDistrict}`;
      return getLocalizedUrl(url, locale);
    }

    return "/";
  };

  // Mevcut hastalık bilgisini al
  const currentDisease = diseases.find(d => d.slug === diseaseSlug);

  // Kategori seçenekleri
  const categoryOptions = [
    { id: 1, name: "Hastalıklar", slug: "diseases" },
    { id: 2, name: "Branşlar", slug: "branches" },
    { id: 3, name: "Tedaviler ve Hizmetler", slug: "treatments-services" }
  ];

  const currentCategory = categoryOptions.find(c => c.slug === categoryType);

  return (
    <div className="w-full bg-white rounded-md sticky top-4 p-4 shadow-md shadow-gray-200">
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-lg">Filtreler</h3>
        
        {/* Kategori Seçimi */}
          <CustomSelect
            id="category"
            name="category"
            label="Kategori"
            value={currentCategory}
            options={categoryOptions}
            onChange={(option) => {
              if (option) {
                window.location.href = createUrl({ categoryType: option.slug });
              }
            }}
            placeholder="Kategori seçiniz"
            disabled={false}
            loading={false}
            className="w-full"
          />

        {/* Hastalık Seçimi (sadece hastalıklar sayfasında) */}
        {categoryType === "diseases" && (
            <CustomSelect
              id="disease"
              name="disease"
              label="Hastalık"
              value={currentDisease}
              options={diseases}
              onChange={(option) => {
                if (option) {
                  window.location.href = createUrl({ diseaseSlug: option.slug });
                }
              }}
              placeholder="Hastalık seçiniz"
              disabled={false}
              loading={false}
              className="w-full"
            />
        )}

        {/* Konum Seçimi */}
        <div className="flex flex-col gap-4">
          <CustomSelect
            id="country"
            name="country"
            label="Ülke"
            value={selectedLocation.country}
            options={countries}
            onChange={(option) => handleLocationSelect("country", option)}
            placeholder="Ülke seçiniz"
            disabled={countriesLoading}
            loading={countriesLoading}
            className="w-full"
          />

          {selectedLocation.country && (
            <CustomSelect
              id="city"
              name="city"
              label="Şehir"
              value={selectedLocation.city}
              options={cities}
              onChange={(option) => handleLocationSelect("city", option)}
              placeholder="Şehir seçiniz"
              disabled={citiesLoading}
              loading={citiesLoading}
              className="w-full"
            />
          )}

          {selectedLocation.city && (
            <CustomSelect
              id="district"
              name="district"
              label="İlçe"
              value={selectedLocation.district}
              options={districts}
              onChange={(option) => handleLocationSelect("district", option)}
              placeholder="İlçe seçiniz"
              disabled={districtsLoading}
              loading={districtsLoading}
              className="w-full"
            />
          )}
        </div>

        {/* Seçili Filtreler */}
        {(currentDisease || selectedLocation.country) && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Seçili Filtreler</label>
            <div className="space-y-2">
              {currentDisease && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Hastalık:</span> {currentDisease.title}
                </div>
              )}
              {selectedLocation.country && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">Konum:</span> {[
                    selectedLocation.country.name,
                    selectedLocation.city?.name,
                    selectedLocation.district?.name
                  ].filter(Boolean).join(' - ')}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProvidersSidebar;
