"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "use-intl";
import { updateAddress } from "@/lib/services/user/addresses";
import { UpdateAddressRequest, Address } from "@/lib/types/user/addressesTypes";
import CustomModal from "@/components/others/CustomModal";
import { CustomInput } from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import CustomButton from "@/components/others/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { useCities } from "@/lib/hooks/globals/useCities";
import { useDistricts } from "@/lib/hooks/globals/useDistricts";
import { IoGlobeOutline, IoLocationOutline, IoBusinessOutline } from "react-icons/io5";

interface EditAddressModalProps {
  address: Address;
  onClose: () => void;
  onSuccess: () => void;
  globalData?: any;
}

export default function EditAddressModal({
  address,
  onClose,
  onSuccess,
  globalData,
}: EditAddressModalProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  
  // Global data
  const countries = globalData?.countries || [];
  
  // Location cascade state
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  
  // Location hooks
  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);
  const { districts, isLoading: districtsLoading } = useDistricts(selectedCountrySlug, selectedCitySlug);
  
  // Options
  const countryOptions = countries.map((country: any) => ({
    id: country.id,
    name: country.name,
    value: country.slug,
  }));

  const cityOptions = cities.map((city: any) => ({
    id: city.id,
    name: city.name,
    value: city.slug,
  }));

  const districtOptions = districts.map((district: any) => ({
    id: district.id,
    name: district.name,
    value: district.slug,
  }));
  
  const [formData, setFormData] = useState({
    name: address.name,
    address: address.address,
    country_slug: "",
    city_slug: "",
    district_slug: "",
    postal_code: address.postal_code || "",
    is_default: address.is_default,
    is_active: address.is_active,
  });

  // Mevcut adres verilerini slug'lara çevir
  useEffect(() => {
    if (address && countries.length > 0) {
      const country = countries.find((c: any) => c.name === address.country);
      if (country) {
        setFormData(prev => ({
          ...prev,
          country_slug: country.slug,
        }));
        setSelectedCountrySlug(country.slug);
      }
    }
  }, [address, countries]);

  useEffect(() => {
    if (selectedCountrySlug && cities.length > 0) {
      const city = cities.find((c: any) => c.name === address.city);
      if (city) {
        setFormData(prev => ({
          ...prev,
          city_slug: city.slug,
        }));
        setSelectedCitySlug(city.slug);
      }
    }
  }, [selectedCountrySlug, cities, address.city]);

  useEffect(() => {
    if (selectedCitySlug && districts.length > 0) {
      const district = districts.find((d: any) => d.name === address.district);
      if (district) {
        setFormData(prev => ({
          ...prev,
          district_slug: district.slug,
        }));
      }
    }
  }, [selectedCitySlug, districts, address.district]);

  // Form alanlarını güncelle - CustomInput için event handler
  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // CustomSelect için handler'lar
  const handleCountryChange = (option: any) => {
    const countrySlug = option?.value || "";
    setFormData((prev) => ({
      ...prev,
      country_slug: countrySlug,
      city_slug: "",
      district_slug: "",
    }));
    setSelectedCountrySlug(countrySlug || null);
    setSelectedCitySlug(null);
  };

  const handleCityChange = (option: any) => {
    const citySlug = option?.value || "";
    setFormData((prev) => ({
      ...prev,
      city_slug: citySlug,
      district_slug: "",
    }));
    setSelectedCitySlug(citySlug || null);
  };

  const handleDistrictChange = (option: any) => {
    const districtSlug = option?.value || "";
    setFormData((prev) => ({
      ...prev,
      district_slug: districtSlug,
    }));
  };

  // Adres güncelleme gönder
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.country_slug ||
      !formData.city_slug ||
      !formData.district_slug
    ) {
      await funcSweetAlert({
        title: "Eksik Bilgi",
        text: "Lütfen tüm gerekli alanları doldurun.",
        icon: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Slug'ları name'lere çevir
      const selectedCountry = countries.find(c => c.slug === formData.country_slug);
      const selectedCity = cities.find(c => c.slug === formData.city_slug);
      const selectedDistrict = districts.find(d => d.slug === formData.district_slug);

      const submitData: UpdateAddressRequest = {
        name: formData.name,
        address: formData.address,
        country: selectedCountry?.name || formData.country_slug,
        city: selectedCity?.name || formData.city_slug,
        district: selectedDistrict?.name || formData.district_slug,
        postal_code: formData.postal_code,
        is_default: formData.is_default,
        is_active: formData.is_active,
      };

      await updateAddress(address.id, submitData);

      await funcSweetAlert({
        title: "Başarılı!",
        text: "Adresiniz başarıyla güncellendi.",
        icon: "success",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      await funcSweetAlert({
        title: "Hata!",
        text:
          error?.response?.data?.message ||
          "Bir hata oluştu. Lütfen tekrar deneyin.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={true} onClose={onClose} title="Adres Düzenle">
      <div className="space-y-6">
        <CustomInput
          label="Başlık Örnek: Ana Muayenehane"
          value={formData.name}
          onChange={handleInputChange("name")}
          required
        />

        <CustomInput
          label="Açık Adres"
          value={formData.address}
          onChange={handleInputChange("address")}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomSelect
            id="country"
            name="country"
            label="Ülke Seçiniz"
            value={countryOptions.find(option => option.value === formData.country_slug) || null}
            options={countryOptions}
            onChange={handleCountryChange}
            required
            icon={<IoGlobeOutline />}
          />
          <CustomSelect
            id="city"
            name="city"
            label="Şehir Seçiniz"
            value={cityOptions.find(option => option.value === formData.city_slug) || null}
            options={cityOptions}
            onChange={handleCityChange}
            required
            icon={<IoLocationOutline />}
            disabled={!selectedCountrySlug || citiesLoading}
            loading={citiesLoading}
          />
          <CustomSelect
            id="district"
            name="district"
            label="İlçe Seçiniz"
            value={districtOptions.find(option => option.value === formData.district_slug) || null}
            options={districtOptions}
            onChange={handleDistrictChange}
            required
            icon={<IoBusinessOutline />}
            disabled={!selectedCitySlug || districtsLoading}
            loading={districtsLoading}
          />
        </div>

        <CustomInput
          label="Posta Kodu"
          value={formData.postal_code}
          onChange={handleInputChange("postal_code")}
        />

        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData(prev => ({ ...prev, is_default: e.target.checked }))}
              className="w-5 h-5 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
            />
            <span className="text-sm text-gray-700">
              Varsayılan adres olarak ayarla
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="w-5 h-5 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
            />
            <span className="text-sm text-gray-700">Aktif</span>
          </label>
        </div>

        <div className="flex max-lg:flex-col justify-end gap-3 pt-4">
          <CustomButton
            title="İptal"
            containerStyles="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            handleClick={onClose}
          />
          <CustomButton
            title={isLoading ? "Güncelleniyor..." : "Adres Güncelle"}
            containerStyles="px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
            handleClick={handleSubmit}
            isDisabled={isLoading}
          />
        </div>
      </div>
    </CustomModal>
  );
}
