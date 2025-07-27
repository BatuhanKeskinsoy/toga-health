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
import { useLocation } from "@/lib/hooks/useLocation";
import SearchDropdown from "./SearchDropdown";
import CustomButton from "@/components/others/CustomButton";

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
}

// Türkçe karakterleri normalize eden fonksiyon
const normalizeTurkishChars = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/Ç/g, 'C')
    .replace(/Ğ/g, 'G')
    .replace(/İ/g, 'I')
    .replace(/Ö/g, 'O')
    .replace(/Ş/g, 'S')
    .replace(/Ü/g, 'U');
};

// Gelişmiş arama fonksiyonu
const advancedSearch = (searchTerm: string, itemName: string): boolean => {
  const normalizedSearchTerm = normalizeTurkishChars(searchTerm);
  const normalizedItemName = normalizeTurkishChars(itemName);
  
  // Normal arama
  if (normalizedItemName.includes(normalizedSearchTerm)) {
    return true;
  }
  
  // Kelime bazlı arama
  const searchWords = normalizedSearchTerm.split(' ').filter(word => word.length > 0);
  const itemWords = normalizedItemName.split(' ').filter(word => word.length > 0);
  
  // En az bir kelime eşleşiyorsa true döndür
  return searchWords.some(searchWord => 
    itemWords.some(itemWord => itemWord.includes(searchWord))
  );
};

const SelectLocation: React.FC<SelectLocationProps> = ({
  value,
  onChange,
  placeholder = "Ülke, şehir ve ilçe seçiniz",
  required = false,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [districtSearchTerm, setDistrictSearchTerm] = useState("");

  // Hook'ları kullan
  const { countries, loading: countriesLoading } = useCountries();
  const { cities, loading: citiesLoading } = useCities(
    value.country?.slug || null
  );
  const { districts, loading: districtsLoading } = useDistricts(
    value.country?.slug || null,
    value.city?.slug || null
  );
  const { location, loading: locationLoading, updateLocation } = useLocation();

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
      }
    }
  }, [location, countries, value.country, onChange]);

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
      }
    }
  }, [location, cities, value.country, value.city, onChange]);

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
      }
    }
  }, [location, districts, value.city, value.district, onChange]);

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
          city: { id: 0, name: "", slug: "", countrySlug: country.slug },
          district: { id: 0, name: "", slug: "", citySlug: "" },
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
          district: { id: 0, name: "", slug: "", citySlug: city.slug },
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

        setIsOpen(false);
      }

        // Arama kutularını temizle
        setCountrySearchTerm("");
        setCitySearchTerm("");
        setDistrictSearchTerm("");
    },
    [onChange, value.country, value.city, updateLocation]
  );

  const handleClearCountry = useCallback(() => {
    onChange({ country: null, city: null, district: null });
    updateLocation({ country: null, city: null, district: null });
    setCountrySearchTerm("");
    setCitySearchTerm("");
    setDistrictSearchTerm("");
  }, [onChange, updateLocation]);

  const handleClearCity = useCallback(() => {
    onChange({ country: value.country, city: null, district: null });
    updateLocation({ country: value.country, city: null, district: null });
    setCitySearchTerm("");
    setDistrictSearchTerm("");
  }, [onChange, value.country, updateLocation]);

  const handleClearDistrict = useCallback(() => {
    onChange({ country: value.country, city: value.city, district: null });
    updateLocation({ country: value.country, city: value.city, district: null });
    setDistrictSearchTerm("");
  }, [onChange, value.country, value.city, updateLocation]);

  const handleToggle = useCallback(() => {
    if (!disabled && !countriesLoading && !citiesLoading && !districtsLoading && !locationLoading) {
      setIsOpen(!isOpen);
    }
  }, [disabled, countriesLoading, citiesLoading, districtsLoading, locationLoading, isOpen]);

  // Görüntülenecek değer
  const displayValue = useMemo(() => {
    if (value.district && value.city && value.country) {
      return `${value.country.name} - ${value.city.name} - ${value.district.name}`;
    } else if (value.city && value.country) {
      return `${value.country.name} - ${value.city.name}`;
    } else if (value.country) {
      return value.country.name;
    }
    return "";
  }, [value]);

  const isFloating = useMemo(() => value.country !== null, [value.country]);

  // Dropdown içeriği
  const renderDropdownContent = () => (
    <div className="flex flex-col lg:flex-row w-full">
      {/* Sol taraf - Ülkeler */}
      <div className="w-full lg:border-r lg:border-gray-200">
        <SearchInput
          title="Ülkeler"
          placeholder="Ülke ara..."
          value={countrySearchTerm}
          onChange={setCountrySearchTerm}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {/* Seçili ülke en üstte */}
          {value.country && (
            <>
              <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-2">
                <div className="p-1 text-xs font-medium text-gray-500 w-full">
                  Seçili Ülke
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
              Ülke bulunamadı
            </div>
          ) : (
            <div className="grid grid-cols-1">
              {filteredCountries
                .filter(
                  (country) => !value.country || country.id !== value.country.id
                )
                .map((country) => (
                  <CustomButton
                    key={`country-${country.id}`}
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
          title={`Şehirler ${value.country ? `(${value.country.name})` : ""}`}
          placeholder={value.country ? "Şehir ara..." : "Önce ülke seçiniz"}
          value={citySearchTerm}
          onChange={setCitySearchTerm}
          disabled={!value.country}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {!value.country ? (
            <div className="p-3 text-gray-500 text-sm text-center">
              Önce ülke seçiniz
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
                      Seçili Şehir
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
                  Şehir bulunamadı
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  {filteredCities
                    .filter((city) => !value.city || city.id !== value.city.id)
                    .map((city) => (
                      <CustomButton
                        key={`city-${city.id}`}
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
          title={`İlçeler ${value.city ? `(${value.city.name})` : ""}`}
          placeholder={value.city ? "İlçe ara..." : "Önce şehir seçiniz"}
          value={districtSearchTerm}
          onChange={setDistrictSearchTerm}
          disabled={!value.city}
        />
        <div className="max-h-[calc(400px-100px)] overflow-y-auto">
          {!value.city ? (
            <div className="p-3 text-gray-500 text-sm text-center">
              Önce şehir seçiniz
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
                      Seçili İlçe
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
                  İlçe bulunamadı
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  {filteredDistricts
                    .filter((district) => !value.district || district.id !== value.district.id)
                    .map((district) => (
                      <CustomButton
                        key={`district-${district.id}`}
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
    <div className={className}>
      <div className="flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8] w-full">
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
                Ülke, Şehir ve İlçe
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
    </div>
  );
};

export default SelectLocation;
