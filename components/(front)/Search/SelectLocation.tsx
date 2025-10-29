"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { IoLocationOutline, IoChevronDownOutline } from "react-icons/io5";
import SearchInput from "./SearchInput";
import SelectedItemButton from "./SelectedItemButton";
import { useCountries } from "@/lib/hooks/useCountries";
import { useCities } from "@/lib/hooks/useCities";
import { useDistricts } from "@/lib/hooks/useDistricts";
import { useLocation, Location } from "@/lib/hooks/useLocation";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import SearchDropdown from "./SearchDropdown";
import CustomButton from "@/components/Customs/CustomButton";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { useTranslations } from "next-intl";

interface SelectLocationProps {
  value: { 
    country: Country | null; 
    city: City | null; 
    district: District | null;
  };
  onChange: (location: { 
    country: Country | null; 
    city: City | null; 
    district: District | null;
  }) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  initialLocation?: {
    country: Country | null;
    city: City | null;
    district: District | null;
  } | null;
}

// Gelişmiş arama fonksiyonu
const advancedSearch = (searchTerm: string, itemName: string): boolean => {
  
  // Normal arama
  if (itemName.includes(searchTerm)) {
    return true;
  }
  
  // Kelime bazlı arama
  const searchWords = searchTerm.split(' ').filter(word => word.length > 0);
  const itemWords = itemName.split(' ').filter(word => word.length > 0);
  
  // En az bir kelime eşleşiyorsa true döndür
  return searchWords.some(searchWord => 
    itemWords.some(itemWord => itemWord.includes(searchWord))
  );
};

const SelectLocation: React.FC<SelectLocationProps> = ({
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  initialLocation = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");

  // Global context'ten location bilgilerini al
  const { location: globalLocation, setLocation: setGlobalLocation } = useGlobalContext();

  // Hook'ları kullan
  const { countries, loading: countriesLoading, fetchCountries } = useCountries();
  const { cities, loading: citiesLoading } = useCities(
    value.country?.slug || null
  );
  const { districts, loading: districtsLoading } = useDistricts(
    value.country?.slug || null, // Added countrySlug here
    value.city?.slug || null
  );
  const { location, loading: locationLoading, updateLocation } = useLocation({
    initialLocation: initialLocation ? {
      country: initialLocation.country,
      city: initialLocation.city,
      district: initialLocation.district
    } : globalLocation
  });

  // Dropdown açıldığında ülkeleri yükle
  useEffect(() => {
    if (isOpen && countries.length === 0 && !countriesLoading) {
      fetchCountries();
    }
  }, [isOpen, countries.length, countriesLoading, fetchCountries]);

  // Cookie'den yüklenen konumu seç
  useEffect(() => {
    if (
      location &&
      location.country &&
      countries.length > 0 &&
      !value.country
    ) {
      const savedCountry = countries.find((c) => c.id === location.country.id);
      if (savedCountry) {
        onChange({ country: savedCountry, city: null, district: null });
        // Global context'i de güncelle
        setGlobalLocation({
          country: savedCountry,
          city: null,
          district: null
        });
      }
    }
  }, [location, countries, value.country, onChange, setGlobalLocation]);

  // Ülke seçildikten sonra cookie'den gelen şehri otomatik seç
  useEffect(() => {
    if (
      location &&
      location.country &&
      location.city &&
      cities.length > 0 &&
      value.country?.id === location.country.id &&
      !value.city
    ) {
      const savedCity = cities.find((c) => c.id === location.city.id);
      if (savedCity) {
        onChange({ country: value.country, city: savedCity, district: null });
        // Global context'i de güncelle
        setGlobalLocation({
          country: value.country,
          city: savedCity,
          district: null
        });
      }
    }
  }, [location, cities, value.country, value.city, onChange, setGlobalLocation]);

  // Şehir seçildikten sonra cookie'den gelen ilçeyi otomatik seç
  useEffect(() => {
    if (
      location &&
      location.city &&
      location.district &&
      districts.length > 0 &&
      value.city?.id === location.city.id &&
      !value.district
    ) {
      const savedDistrict = districts.find((d) => d.id === location.district.id);
      if (savedDistrict) {
        onChange({ country: value.country, city: value.city, district: savedDistrict });
        // Global context'i de güncelle
        setGlobalLocation({
          country: value.country,
          city: value.city,
          district: savedDistrict
        });
      }
    }
  }, [location, districts, value.city, value.district, onChange, setGlobalLocation]);

  // Filtrelenmiş ülkeler - gelişmiş arama ile
  const filteredCountries = countries.filter((country) =>
    advancedSearch(countrySearchTerm, country.name)
  );

  // Filtrelenmiş şehirler - gelişmiş arama ile
  const filteredCities = cities.filter((city) =>
    advancedSearch(citySearchTerm, city.name)
  );

  // Filtrelenmiş ilçeler - gelişmiş arama ile
  const filteredDistricts = districts.filter((district) =>
    advancedSearch(districtSearchTerm, district.name)
  );

  const handleSelect = useCallback(
    (option: Country | City | District, type: "country" | "city" | "district") => {
      if (type === "country") {
        const country = option as Country;
        onChange({ country, city: null, district: null });

        // Cookie'yi güncelle
        updateLocation({
          country,
          city: { id: 0, name: "", slug: "", country_id: 0, countrySlug: country.slug },
          district: { id: 0, name: "", slug: "", city_id: 0, citySlug: "" },
        });

        // Global context'i de güncelle
        setGlobalLocation({
          country,
          city: null,
          district: null,
        });

      } else if (type === "city") {
        // Şehir seçimi için ülke kontrolü
        if (!value.country) {
          return; // Ülke seçilmeden şehir seçilemez
        }
        
        const city = option as City;
        onChange({ country: value.country, city, district: null });

        // Cookie'yi güncelle
        updateLocation({
          country: value.country,
          city,
          district: { id: 0, name: "", slug: "", city_id: 0, citySlug: city.slug },
        });

        // Global context'i de güncelle
        setGlobalLocation({
          country: value.country,
          city,
          district: null,
        });

        // İlçe arama kutusunu temizle
        setDistrictSearchTerm("");
      } else {
        // İlçe seçimi için şehir kontrolü
        if (!value.city) {
          return; // Şehir seçilmeden ilçe seçilemez
        }
        
        const district = option as District;
        onChange({ country: value.country, city: value.city, district });

        // Cookie'yi güncelle
        updateLocation({
          country: value.country,
          city: value.city,
          district,
        });

        // Global context'i de güncelle
        setGlobalLocation({
          country: value.country,
          city: value.city,
          district,
        });

        setIsOpen(false);
      }

        // Arama kutularını temizle
        setCountrySearchTerm("");
        setCitySearchTerm("");
        setDistrictSearchTerm("");
    },
    [onChange, value.country, value.city, updateLocation, setGlobalLocation]
  );

  const handleClearCountry = useCallback(() => {
    if (onChange) {
      onChange({ country: null, city: null, district: null });
    }
    updateLocation(null);
    setGlobalLocation({ country: null, city: null, district: null });
    setCountrySearchTerm("");
    setCitySearchTerm("");
    setDistrictSearchTerm("");
  }, [onChange, updateLocation, setGlobalLocation]);

  const handleClearCity = useCallback(() => {
    onChange({ country: value.country, city: null, district: null });
    if (value.country) {
      updateLocation({
        country: value.country,
        city: { id: 0, name: "", slug: "", country_id: 0, countrySlug: value.country.slug },
        district: { id: 0, name: "", slug: "", city_id: 0, citySlug: "" }
      });
      setGlobalLocation({
        country: value.country,
        city: null,
        district: null
      });
    }
    setCitySearchTerm("");
    setDistrictSearchTerm("");
  }, [onChange, value.country, updateLocation, setGlobalLocation]);

  const handleClearDistrict = useCallback(() => {
    onChange({ country: value.country, city: value.city, district: null });
    if (value.country && value.city) {
      updateLocation({
        country: value.country,
        city: value.city,
        district: { id: 0, name: "", slug: "", city_id: 0, citySlug: value.city.slug }
      });
      setGlobalLocation({
        country: value.country,
        city: value.city,
        district: null
      });
    }
    setDistrictSearchTerm("");
  }, [onChange, value.country, value.city, updateLocation, setGlobalLocation]);

  const handleToggle = useCallback(() => {
    if (!disabled && !countriesLoading && !citiesLoading && !districtsLoading && !locationLoading) {
      setIsOpen(!isOpen);
    }
  }, [disabled, countriesLoading, citiesLoading, districtsLoading, locationLoading, isOpen]);

  // Görüntülenecek değer
  const displayValue = useMemo(() => {
    if (value.district && value.district.id > 0 && value.city && value.country) {
      return `${value.country.name} - ${value.city.name} - ${value.district.name}`;
    } else if (value.city && value.city.id > 0 && value.country) {
      return `${value.country.name} - ${value.city.name}`;
    } else if (value.country && value.country.id > 0) {
      return value.country.name;
    }
    return "";
  }, [value]);

  const isFloating = useMemo(() => value.country !== null, [value.country]);

  const t = useTranslations();

  // Dropdown içeriği
  const renderDropdownContent = () => (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Sol taraf - Ülkeler */}
      <div className="w-full lg:border-r lg:border-gray-200">
        <SearchInput
          title={t("Ülkeler")}
          placeholder="Ülke ara"
          value={countrySearchTerm}
          onChange={setCountrySearchTerm}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {/* Seçili ülke en üstte */}
          {value.country && (
            <>
              <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-2">
                <div className="p-1 text-xs font-medium text-gray-500 w-full">
                  {t("Seçili Ülke")}
                </div>
                <SelectedItemButton
                  title={value.country.name}
                  onClear={handleClearCountry}
                />
              </div>
            </>
          )}

          {filteredCountries.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm text-center">
              {t("Ülke bulunamadı")}
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {filteredCountries
                .filter(
                  (country) => !value.country || country.id !== value.country.id
                )
                .map((country, index) => (
                  <CustomButton
                    key={`country-${country.id}-${index}`}
                    handleClick={() => handleSelect(country, "country")}
                    containerStyles="flex items-center justify-between p-3 hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all text-sm font-medium border-b border-gray-200 last:border-b-0"
                    title={country.name}
                  />
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Orta taraf - Şehirler */}
      <div className="w-full lg:border-r lg:border-gray-200">
        <SearchInput
          title={`${t("Şehirler")} ${value.country ? `(${value.country.name})` : ""}`}
          placeholder={value.country ? t("Şehir ara") : t("Önce ülke seçiniz")}
          value={citySearchTerm}
          onChange={setCitySearchTerm}
          disabled={!value.country}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {!value.country ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-4 shadow-md">
                <IoLocationOutline className="text-2xl text-gray-400" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-lg font-semibold text-gray-700">
                  {t("Ülke Seçimi Gerekli")}
                </h4>
                <p className="text-sm text-gray-500">
                  {t("Şehirleri görmek için önce ülke seçiniz")}
                </p>
              </div>
            </div>
          ) : citiesLoading ? (
            <div className="py-28 flex items-center justify-center">
              <div className="animate-spin rounded-full m-0.5 size-12 border-t-2 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <>
              {/* Seçili şehir en üstte */}
              {value.city && (
                <>
                  <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-2">
                    <div className="p-1 text-xs font-medium text-gray-500 w-full">
                      {t("Seçili Şehir")}
                    </div>
                    <SelectedItemButton
                      title={value.city.name}
                      onClear={handleClearCity}
                    />
                  </div>
                </>
              )}

              {filteredCities.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm text-center">
                  {t("Şehir bulunamadı")}
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  {filteredCities
                    .filter((city) => !value.city || city.id !== value.city.id)
                    .map((city, index) => (
                      <CustomButton
                        key={`city-${city.id}-${index}`}
                        handleClick={() => handleSelect(city, "city")}
                        containerStyles="flex items-center justify-between p-3 hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all text-sm font-medium border-b border-gray-200 last:border-b-0"
                        title={city.name}
                        isDisabled={!value.country}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sağ taraf - İlçeler */}
      <div className="w-full">
        <SearchInput
          title={`${t("İlçeler")} ${value.city ? `(${value.city.name})` : ""}`}
          placeholder={value.city ? t("İlçe ara") : t("Önce şehir seçiniz")}
          value={districtSearchTerm}
          onChange={setDistrictSearchTerm}
          disabled={!value.city}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {!value.city ? (
            <div className="p-3 text-gray-500 text-sm text-center">
              {t("Önce şehir seçiniz")}
            </div>
          ) : districtsLoading ? (
            <div className="py-28 flex items-center justify-center">
              <div className="animate-spin rounded-full m-0.5 size-12 border-t-2 border-b-2 border-gray-400"></div>
            </div>
          ) : (
            <>
              {/* Seçili ilçe en üstte */}
              {value.district && (
                <>
                  <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-2">
                    <div className="p-1 text-xs font-medium text-gray-500 w-full">
                      {t("Seçili İlçe")}
                    </div>
                    <SelectedItemButton
                      title={value.district.name}
                      onClear={handleClearDistrict}
                    />
                  </div>
                </>
              )}

              {filteredDistricts.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm text-center">
                  {t("İlçe bulunamadı")}
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  {filteredDistricts
                    .filter((district) => !value.district || district.id !== value.district.id)
                    .map((district, index) => (
                      <CustomButton
                        key={`district-${district.id}-${index}`}
                        handleClick={() => handleSelect(district, "district")}
                        containerStyles="flex items-center justify-between p-3 hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all text-sm font-medium border-b border-gray-200 last:border-b-0"
                        title={district.name}
                        isDisabled={!value.city}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8] min-h-[54px] w-full ${className}`}>
        <IoLocationOutline className="text-2xl min-w-6 text-gray-400" />

        <div
          className="relative w-full bg-zinc-100 rounded-md cursor-pointer"
          onClick={handleToggle}
        >
          <div className="w-full outline-none pt-[8px] pb-[4px] px-2 peer bg-[#f9fafb] min-h-[24px] flex items-center">
            <span
              className={displayValue ? "text-gray-900" : "text-transparent"}
            >
              {displayValue || placeholder}
            </span>
          </div>

          <span
            className={`absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 cursor-text text-[#9da4ae] text-sm transition-all
              peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:top-0.5 w-[calc(100%+30px)]
              ${
                isFloating
                  ? "text-[10px] !text-[#4d5761] !-top-2 ltr:!-left-6 rtl:!-right-6"
                  : ""
              }`}
          >
            <div className="flex justify-between items-center gap-2 w-full">
              <span className="pointer-events-none select-none px-1.5 bg-[#f9fafb]">
                {t("Ülke, Şehir ve İlçe")}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </div>
          </span>
        </div>

        <IoChevronDownOutline
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      <SearchDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isMobile={true}
      >
        {renderDropdownContent()}
      </SearchDropdown>
    </>
  );
};

export default SelectLocation;
