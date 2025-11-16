"use client";
import React, { useEffect, useState, FormEvent } from "react";
import {
  IoPersonOutline,
  IoCalendarOutline,
  IoMaleFemaleOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoBusinessOutline,
  IoCardOutline,
  IoLanguageOutline,
  IoMedkitOutline,
  IoCloseCircle,
} from "react-icons/io5";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";
import CustomButton from "@/components/Customs/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { updateDoctorProfile } from "@/lib/services/user/updateProfile/updateProfile";
import CustomInput from "@/components/Customs/CustomInput";
import CustomSelect from "@/components/Customs/CustomSelect";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency, SpokenLanguage, ExpertTitle } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
import { useCities } from "@/lib/hooks/globals";
import { getBranches } from "@/lib/services/categories/branches";
import { getSpokenLanguages, getExpertTitles } from "@/lib/services/globals";
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

interface Branch {
  id: number;
  name: string;
  slug: string;
}

export default function DoctorProfileContent({
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [spokenLanguages, setSpokenLanguages] = useState<SpokenLanguage[]>([]);
  const [expertTitles, setExpertTitles] = useState<ExpertTitle[]>([]);
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(
    currentUser?.location?.country_slug || null
  );

  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);

  // Birth date formatı için helper fonksiyon
  const formatBirthDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  const [form, setForm] = useState({
    name: currentUser?.name || "",
    birth_date: formatBirthDate(currentUser?.birth_date || ""),
    gender: currentUser?.gender || "male",
    city_slug: currentUser?.location?.city_slug || "",
    country_slug: currentUser?.location?.country_slug || "",
    timezone: currentUser?.timezone,
    currency: currentUser?.currency,
    expert_title_id: null as number | null,
  });

  const [selectedLanguages, setSelectedLanguages] = useState<SpokenLanguage[]>(
    []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  // Branches, Spoken Languages ve Expert Titles'i yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesData, languagesData, expertTitlesData] = await Promise.all([
          getBranches(),
          getSpokenLanguages(),
          getExpertTitles(),
        ]);

        setBranches(branchesData as any);

        // Object'i array'e çevir
        const languagesArray: SpokenLanguage[] = Object.entries(
          languagesData.data
        ).map(([code, name]) => ({
          code,
          name: name as string,
        }));
        setSpokenLanguages(languagesArray);

        // Expert titles'ı set et
        if (expertTitlesData.status && expertTitlesData.data) {
          setExpertTitles(expertTitlesData.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // User prop'u değiştiğinde form'u güncelle (sadece ilk yüklemede)
  useEffect(() => {
    if (currentUser && !isFormInitialized) {
      const newForm = {
        name: currentUser.name || "",
        birth_date: formatBirthDate(currentUser.birth_date || ""),
        gender: currentUser.gender || "male",
        city_slug: currentUser.location?.city_slug || "",
        country_slug: currentUser.location?.country_slug || "",
        timezone: currentUser.timezone,
        currency: currentUser.currency,
        expert_title_id: null as number | null,
      };

      setForm(newForm);
      
      // Country slug'ı set et
      if (currentUser.location?.country_slug) {
        setSelectedCountrySlug(currentUser.location.country_slug);
      }
      
      setIsFormInitialized(true);
    }
  }, [currentUser, isFormInitialized]);

  // Seçili dilleri ayarla (spokenLanguages yüklendiğinde)
  useEffect(() => {
    if (currentUser?.doctor_info?.languages && spokenLanguages.length > 0) {
      const userLanguages = currentUser.doctor_info.languages
        .map((langName) =>
          spokenLanguages.find((lang) => lang.name === langName)
        )
        .filter((lang): lang is SpokenLanguage => lang !== undefined);

      if (userLanguages.length > 0) {
        setSelectedLanguages(userLanguages);
      }
    }
  }, [currentUser, spokenLanguages]);

  // Expert title'ı ayarla (expertTitles yüklendiğinde)
  useEffect(() => {
    if (currentUser?.expert_title && expertTitles.length > 0) {
      const userExpertTitle = expertTitles.find(
        (title) => title.name === currentUser.expert_title
      );

      if (userExpertTitle) {
        setForm((prev) => ({
          ...prev,
          expert_title_id: userExpertTitle.id,
        }));
      }
    }
  }, [currentUser, expertTitles]);

  // Country değiştiğinde country_slug'ı güncelle
  useEffect(() => {
    if (form.country_slug && countries.length > 0) {
      const selectedCountry = countries.find((c) => c.slug === form.country_slug);
      if (selectedCountry && selectedCountry.slug !== selectedCountrySlug) {
        setSelectedCountrySlug(selectedCountry.slug);
      }
    }
  }, [form.country_slug, countries]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  const branchOptions = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    value: branch.id.toString(),
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

  const genderOptions = [
    { id: 1, name: t("Erkek"), value: "male" },
    { id: 2, name: t("Kadın"), value: "female" },
    { id: 3, name: t("Belirtmek istemiyorum"), value: "other" },
  ];

  const expertTitleOptions = expertTitles.map((title) => ({
    id: title.id,
    name: title.name,
    value: title.id.toString(),
  }));


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validasyon
    if (!form.name || !form.birth_date) {
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
      const selectedCountry = countries.find((c) => c.slug === form.country_slug);
      const selectedCity = cities.find((c) => c.slug === form.city_slug);

      const body = {
        name: form.name,
        birth_date: form.birth_date,
        gender: form.gender,
        city: selectedCity?.name || "",
        country: selectedCountry?.name || "",
        timezone: form.timezone,
        currency: form.currency,
        languages: selectedLanguages.map((lang) => lang.name),
        doctor: {
          specialty_id: currentUser?.doctor_info?.specialty_id,
          expert_title_id: form.expert_title_id ? Number(form.expert_title_id) : undefined,
          settings: [],
        },
      };

      const response = await updateDoctorProfile(body);

      if (response.status) {
        await funcSweetAlert({
          title: t("Başarılı"),
          text: t("Profil bilgileri güncellendi"),
          icon: "success",
        });

        // Server user'ı güncelle
        updateServerUser(response.data);
        
        // Form'un tekrar initialize olmaması için flag'i koru
        // (çünkü form zaten güncel verilerle dolu)
      }
    } catch (error: any) {
      let errorMessage = t("Bir hata oluştu");
      
      if (error.response?.data?.errors) {
        // errors object'inden tüm hataları al
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors)
          .flat()
          .join(", ");
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
        {/* Kişisel Bilgiler */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoPersonOutline size={24} />
            {t("Kişisel Bilgiler")}
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            <CustomInput
              label={t("Ad Soyad")}
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder={t("Ad Soyad")}
              icon={<IoPersonOutline />}
              required
            />

            <CustomInput
              label={t("Doğum Tarihi")}
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={handleInputChange}
              icon={<IoCalendarOutline />}
              required
            />

            <CustomSelect
              id="gender"
              name="gender"
              label={t("Cinsiyet")}
              value={
                genderOptions.find((opt) => opt.value === form.gender) || null
              }
              options={genderOptions}
              onChange={(option) =>
                setForm((prev) => ({
                  ...prev,
                  gender: option?.value || "male",
                }))
              }
              icon={<IoMaleFemaleOutline />}
              required
            />
            <div className="cursor-not-allowed opacity-50" title={t("Uzmanlık alanınız değiştirilemez")}>
              <CustomSelect
                id="specialty_id"
                name="specialty_id"
                label={t("Uzmanlık Alanı")}
                value={
                  currentUser?.doctor_info?.specialty
                    ? {
                        id: currentUser.doctor_info.specialty.id,
                        name: currentUser.doctor_info.specialty.name,
                        value: currentUser.doctor_info.specialty.id.toString(),
                      }
                    : null
                }
                options={branchOptions}
                onChange={() => {}}
                icon={<IoMedkitOutline />}
                disabled={true}
              />
            </div>

            <CustomSelect
              id="expert_title_id"
              name="expert_title_id"
              label={t("Uzmanlık Ünvanı")}
              value={
                expertTitleOptions.find(
                  (opt) => opt.value === form.expert_title_id?.toString()
                ) || null
              }
              options={expertTitleOptions}
              onChange={(option) =>
                setForm((prev) => ({
                  ...prev,
                  expert_title_id: option ? Number(option.value) : null,
                }))
              }
              icon={<IoMedkitOutline />}
            />
          </div>
        </div>

        {/* Konum Bilgileri */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <IoLocationOutline size={24} />
            {t("Konum Bilgileri")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomSelect
              id="country"
              name="country"
              label={t("Ülke")}
              value={
                countryOptions.find((opt) => opt.value === form.country_slug) || null
              }
              options={countryOptions}
              onChange={(option) =>
                setForm((prev) => ({ ...prev, country_slug: option?.value || "" }))
              }
              icon={<IoGlobeOutline />}
              required
            />

            <CustomSelect
              id="city"
              name="city"
              label={t("Şehir")}
              value={
                cityOptions.find((option) => option.value === form.city_slug) || null
              }
              options={cityOptions}
              onChange={(option) =>
                setForm((prev) => ({ ...prev, city_slug: option?.value || "" }))
              }
              icon={<IoLocationOutline />}
              disabled={citiesLoading || !selectedCountrySlug}
              loading={citiesLoading}
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
              value={null}
              options={languageOptions}
              onChange={handleLanguageAdd}
              icon={<IoLanguageOutline />}
              placeholder={t("Dil seçiniz")}
            />

            {/* Seçili Diller */}
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
