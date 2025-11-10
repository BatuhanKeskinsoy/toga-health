"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  IoPersonOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoBusinessOutline,
  IoCardOutline,
  IoLanguageOutline,
  IoCloseCircle,
  IoMapOutline,
  IoHomeOutline,
} from "react-icons/io5";
import { MdOutlineMedicalServices } from "react-icons/md";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";
import CustomButton from "@/components/Customs/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { updateCorporateProfile } from "@/lib/services/user/updateProfile/updateProfile";
import CustomInput from "@/components/Customs/CustomInput";
import CustomSelect from "@/components/Customs/CustomSelect";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency, SpokenLanguage } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
import { useCities, useDistricts } from "@/lib/hooks/globals";
import { getSpokenLanguages } from "@/lib/services/globals";
import UpdateProfilePhoto from "../UpdateProfilePhoto";

interface GlobalData {
  timezones: Timezone[];
  currencies: Currency[];
  phoneCodes: string[];
  countries: Country[];
}

interface ProfileContentProps {
  user: UserTypes | null;
  globalData?: GlobalData;
}

export default function CorporateProfileContent({
  user,
  globalData,
}: ProfileContentProps) {
  const t = useTranslations();
  const { updateServerUser, serverUser } = usePusherContext();

  // PusherContext'ten gelen user'ı kullan (güncel user)
  const currentUser = serverUser || user;

  // Server-side'dan gelen verileri kullan
  const timezones = globalData?.timezones || [];
  const currencies = globalData?.currencies || [];
  const countries = globalData?.countries || [];

  // Client-side state'ler
  const [spokenLanguages, setSpokenLanguages] = useState<SpokenLanguage[]>([]);
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(
    currentUser?.location?.country_slug || null
  );
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(
    currentUser?.location?.city_slug || null
  );

  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);
  const { districts, isLoading: districtsLoading } = useDistricts(
    selectedCountrySlug,
    selectedCitySlug
  );

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    address: currentUser?.location?.address || "",
    city_slug: currentUser?.location?.city_slug || "",
    country_slug: currentUser?.location?.country_slug || "",
    district_slug: currentUser?.location?.district_slug || "",
    timezone: currentUser?.timezone,
    currency: currentUser?.currency,
    map_location: currentUser?.corporate_info?.map_location || "",
    facilities: currentUser?.corporate_info?.facilities || [],
  });

  const [selectedLanguages, setSelectedLanguages] = useState<SpokenLanguage[]>(
    []
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(
    currentUser?.corporate_info?.facilities || []
  );
  const [newFacility, setNewFacility] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Spoken Languages'i yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesData = await getSpokenLanguages();

        // Object'i array'e çevir
        const languagesArray: SpokenLanguage[] = Object.entries(
          languagesData.data
        ).map(([code, name]) => ({
          code,
          name: name as string,
        }));
        setSpokenLanguages(languagesArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // User prop'u değiştiğinde form'u güncelle
  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        address: currentUser.location?.address || "",
        city_slug: currentUser.location?.city_slug || "",
        country_slug: currentUser.location?.country_slug || "",
        district_slug: currentUser.location?.district_slug || "",
        timezone: currentUser.timezone,
        currency: currentUser.currency,
        map_location: currentUser.corporate_info?.map_location || "",
        facilities: currentUser.corporate_info?.facilities || [],
      });
      setSelectedCountrySlug(currentUser.location?.country_slug || null);
      setSelectedCitySlug(currentUser.location?.city_slug || null);
      setSelectedFacilities(currentUser.corporate_info?.facilities || []);
    }
  }, [currentUser]);

  // Seçili dilleri ayarla (spokenLanguages yüklendiğinde)
  useEffect(() => {
    if (currentUser?.corporate_info?.languages && spokenLanguages.length > 0) {
      const userLanguages = currentUser.corporate_info.languages
        .map((langName) =>
          spokenLanguages.find((lang) => lang.name === langName)
        )
        .filter((lang): lang is SpokenLanguage => lang !== undefined);

      if (userLanguages.length > 0) {
        setSelectedLanguages(userLanguages);
      }
    }
  }, [currentUser, spokenLanguages]);

  // Country değiştiğinde country_slug'ı güncelle
  useEffect(() => {
    if (form.country_slug && countries.length > 0) {
      const selectedCountry = countries.find(
        (c) => c.slug === form.country_slug
      );
      if (selectedCountry && selectedCountry.slug !== selectedCountrySlug) {
        setSelectedCountrySlug(selectedCountry.slug);
        // City'yi sıfırla
        setForm((prev) => ({ ...prev, city_slug: "", district_slug: "" }));
        setSelectedCitySlug(null);
      }
    }
  }, [form.country_slug, countries]);

  // City değiştiğinde city_slug'ı güncelle
  useEffect(() => {
    if (form.city_slug && cities.length > 0) {
      const selectedCity = cities.find((c) => c.slug === form.city_slug);
      if (selectedCity && selectedCity.slug !== selectedCitySlug) {
        setSelectedCitySlug(selectedCity.slug);
        // District'i sıfırla
        setForm((prev) => ({ ...prev, district_slug: "" }));
      }
    }
  }, [form.city_slug, cities]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageAdd = (option: any) => {
    if (
      option &&
      !selectedLanguages.find((lang) => lang.code === option.code)
    ) {
      setSelectedLanguages((prev) => [...prev, option]);
    }
  };

  const handleLanguageRemove = (code: string) => {
    setSelectedLanguages((prev) => prev.filter((lang) => lang.code !== code));
  };

  const handleFacilityAdd = () => {
    if (newFacility && newFacility.trim()) {
      setSelectedFacilities((prev) => [...prev, newFacility.trim()]);
      setNewFacility("");
    }
  };

  const handleFacilityRemove = (facility: string) => {
    setSelectedFacilities((prev) => prev.filter((f) => f !== facility));
  };

  // Options için helper fonksiyonlar
  const countryOptions = countries.map((country) => ({
    id: country.id,
    name: country.name,
    value: country.slug,
    slug: country.slug,
  }));

  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name,
    value: city.slug,
    slug: city.slug,
  }));

  const districtOptions = districts.map((district) => ({
    id: district.id,
    name: district.name,
    value: district.slug,
    slug: district.slug,
  }));

  const timezoneOptions = timezones.map((timezone, index) => ({
    id: index,
    name: timezone.name,
    value: timezone.name,
  }));

  const currencyOptions = currencies.map((currency, index) => ({
    id: index,
    name: `${currency.name} (${currency.symbol})`,
    value: currency.code,
  }));

  // Seçili olmayan dilleri filtrele
  const availableLanguages = spokenLanguages.filter(
    (lang) => !selectedLanguages.find((selected) => selected.code === lang.code)
  );

  const languageOptions = availableLanguages.map((lang, index) => ({
    id: index,
    name: lang.name,
    code: lang.code,
    value: lang.name,
  }));


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validasyon
    if (!form.name || !form.address) {
      await funcSweetAlert({
        title: t("Hata"),
        text: t("Lütfen tüm zorunlu alanları doldurun"),
        icon: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Slug'lardan name'leri al
      const selectedCountry = countries.find(
        (c) => c.slug === form.country_slug
      );
      const selectedCity = cities.find((c) => c.slug === form.city_slug);
      const selectedDistrict = districts.find(
        (d) => d.slug === form.district_slug
      );

      const body = {
        name: form.name,
        address: form.address,
        city: selectedCity?.name || "",
        country: selectedCountry?.name || "",
        district: selectedDistrict?.name || "",
        timezone: form.timezone,
        currency: form.currency,
        languages: selectedLanguages.map((lang) => lang.name),
        corporate: {
          map_location: form.map_location || undefined,
          facilities: selectedFacilities,
        },
      };

      const response = await updateCorporateProfile(body);

      if (response.status) {
        await funcSweetAlert({
          title: t("Başarılı"),
          text: t("Profil bilgileri güncellendi"),
          icon: "success",
        });

        updateServerUser(response.data);
      }
    } catch (error: any) {
      let errorMessage = t("Bir hata oluştu");

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      await funcSweetAlert({
        title: t("Hata"),
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex max-lg:flex-col lg:gap-8 gap-4 w-full bg-white lg:p-6 p-4 rounded-md shadow-md shadow-gray-200">
      {/* PROFİL FOTOĞRAFI FORMU */}
      <UpdateProfilePhoto user={user} />

      {/* PROFİL BİLGİLERİ FORMU */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
        {/* Kurum Bilgileri */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoBusinessOutline size={24} />
            {t("Kurum Bilgileri")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              label={t("Kurum Adı")}
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder={t("Kurum Adı")}
              icon={<IoBusinessOutline />}
              required
            />

            <CustomInput
              label={t("Adres")}
              name="address"
              value={form.address}
              onChange={handleInputChange}
              placeholder={t("Adres")}
              icon={<IoHomeOutline />}
              required
            />
          </div>
        </div>

        {/* Konum Bilgileri */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoLocationOutline size={24} />
            {t("Konum Bilgileri")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomSelect
              id="country"
              name="country"
              label={t("Ülke")}
              value={
                countryOptions.find((opt) => opt.value === form.country_slug) ||
                null
              }
              options={countryOptions}
              onChange={(option) => {
                setForm((prev) => ({
                  ...prev,
                  country_slug: option?.value || "",
                }));
              }}
              icon={<IoGlobeOutline />}
              required
            />

            <CustomSelect
              id="city"
              name="city"
              label={t("Şehir")}
              value={
                cityOptions.find((option) => option.value === form.city_slug) ||
                null
              }
              options={cityOptions}
              onChange={(option) => {
                setForm((prev) => ({
                  ...prev,
                  city_slug: option?.value || "",
                }));
              }}
              icon={<IoLocationOutline />}
              disabled={citiesLoading || !selectedCountrySlug}
              loading={citiesLoading}
              required
            />

            <CustomSelect
              id="district"
              name="district"
              label={t("İlçe")}
              value={
                districtOptions.find(
                  (option) => option.value === form.district_slug
                ) || null
              }
              options={districtOptions}
              onChange={(option) => {
                setForm((prev) => ({
                  ...prev,
                  district_slug: option?.value || "",
                }));
              }}
              icon={<IoMapOutline />}
              disabled={districtsLoading || !selectedCitySlug}
              loading={districtsLoading}
              required
            />
          </div>
        </div>

        {/* Sistem Ayarları */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoBusinessOutline size={24} />
            {t("Sistem Ayarları")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              id="timezone"
              name="timezone"
              label={t("Zaman Dilimi")}
              value={
                timezoneOptions.find((opt) => opt.value === form.timezone) ||
                null
              }
              options={timezoneOptions}
              onChange={(option) =>
                setForm((prev) => ({
                  ...prev,
                  timezone: option?.value,
                }))
              }
              icon={<IoGlobeOutline />}
              required
            />

            <CustomSelect
              id="currency"
              name="currency"
              label={t("Para Birimi")}
              value={
                currencyOptions.find((opt) => opt.value === form.currency) ||
                null
              }
              options={currencyOptions}
              onChange={(option) =>
                setForm((prev) => ({
                  ...prev,
                  currency: option?.value || "USD",
                }))
              }
              icon={<IoCardOutline />}
              required
            />
          </div>
        </div>

        {/* Harita Konumu */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoMapOutline size={24} />
            {t("Harita Konumu")}
          </h3>

          <CustomInput
            label={t("Harita Embed Kodu (iframe)")}
            name="map_location"
            value={form.map_location}
            onChange={handleInputChange}
            icon={<IoMapOutline />}
          />
        </div>

        {/* İmkanlar */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MdOutlineMedicalServices size={24} />
            {t("İmkanlar")}
          </h3>

          <div className="flex flex-col gap-3">
            <div className="grid gap-2 grid-cols-12">
              <div className="flex-1 lg:col-span-10 col-span-full">
                <CustomInput
                  label={t("Örn: Ameliyathane, Yoğun Bakım")}
                  name="newFacility"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  icon={<MdOutlineMedicalServices />}
                />
              </div>
              <div className="flex items-end lg:col-span-2 col-span-full">
                <CustomButton
                  btnType="button"
                  handleClick={handleFacilityAdd}
                  isDisabled={!newFacility.trim()}
                  containerStyles="px-6 py-2.5 bg-sitePrimary w-full h-full text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={t("Ekle")}
                />
              </div>
            </div>

            {selectedFacilities.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("Mevcut İmkanlar")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedFacilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-sitePrimary/10 text-sitePrimary rounded-md border border-sitePrimary/20 hover:bg-sitePrimary/20 transition-colors"
                    >
                      <span className="text-sm font-medium">{facility}</span>
                      <button
                        type="button"
                        onClick={() => handleFacilityRemove(facility)}
                        className="hover:scale-110 transition-transform"
                      >
                        <IoCloseCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diller */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoLanguageOutline size={24} />
            {t("Konuşulan Diller")}
          </h3>

          <div className="flex flex-col gap-3">
            <CustomSelect
              id="languages"
              name="languages"
              label={t("Dil Ekle")}
              value={undefined}
              options={languageOptions}
              onChange={handleLanguageAdd}
              icon={<IoLanguageOutline />}
              placeholder={t("Dil seçiniz")}
            />

            {selectedLanguages.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {t("Seçili Diller")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedLanguages.map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-center gap-2 px-3 py-2 bg-sitePrimary/10 text-sitePrimary rounded-md border border-sitePrimary/20 hover:bg-sitePrimary/20 transition-colors"
                    >
                      <span className="text-sm font-medium">{lang.name}</span>
                      <button
                        type="button"
                        onClick={() => handleLanguageRemove(lang.code)}
                        className="hover:scale-110 transition-transform"
                      >
                        <IoCloseCircle size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-sitePrimary text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("Yükleniyor") : t("Değişiklikleri Kaydet")}
          </button>
        </div>
      </form>
    </div>
  );
}
