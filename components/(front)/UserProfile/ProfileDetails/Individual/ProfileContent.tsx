"use client";
import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  IoCallOutline,
  IoCameraOutline,
  IoCheckmark,
  IoClose,
  IoEye,
  IoEyeOff,
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
  IoTrashOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoCalendarOutline,
  IoMapOutline,
  IoBusinessOutline,
  IoCardOutline,
} from "react-icons/io5";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

import CustomButton from "@/components/others/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { changePassword } from "@/lib/services/user/updateProfile/others";
import { updateProfile } from "@/lib/services/user/updateProfile/updateProfile";
import { updateProfilePhoto, deleteProfilePhoto } from "@/lib/services/user/updateProfile/profilePhoto";
import { CustomInput } from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
import { useCities, useDistricts } from "@/lib/hooks/globals";
import ProfilePhoto from "@/components/others/ProfilePhoto";

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

export default function ProfileContent({
  user,
  globalData,
}: ProfileContentProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateServerUser } = usePusherContext();

  // Server-side'dan gelen verileri kullan
  const timezones = globalData?.timezones || [];
  const currencies = globalData?.currencies || [];
  const phoneCodes = globalData?.phoneCodes || [];
  const countries = globalData?.countries || [];

  // Client-side hook'ları - cascade seçim için
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  
  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);
  const { districts, isLoading: districtsLoading } = useDistricts(selectedCountrySlug, selectedCitySlug);

  // Birth date formatı için helper fonksiyon
  const formatBirthDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // YYYY-MM-DD formatına çevir
    } catch (error) {
      return "";
    }
  };

  const [form, setForm] = useState({
    name: user?.name,
    email: user?.email,
    phone_code: user?.phone_code,
    phone_number: user?.phone_number,
    birth_date: formatBirthDate(user?.birth_date),
    gender: user?.gender,
    address: user?.location?.address,
    country_slug: user?.location?.country_slug,
    city_slug: user?.location?.city_slug,
    district_slug: user?.location?.district_slug,
    timezone: user?.timezone,
    currency: user?.currency,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // User prop'u değiştiğinde form'u güncelle
  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name,
        email: user?.email,
        phone_code: user?.phone_code ?? "+90",
        phone_number: user?.phone_number,
        birth_date: formatBirthDate(user?.birth_date),
        gender: user?.gender,
        address: user?.location?.address,
        country_slug: user?.location?.country_slug,
        city_slug: user?.location?.city_slug,
        district_slug: user?.location?.district_slug,
        timezone: user?.timezone ?? "Europe/Istanbul",
        currency: user?.currency ?? "TRY",
      });

      // Cascade seçim için slug'ları set et
      setSelectedCountrySlug(user?.location?.country_slug || null);
      setSelectedCitySlug(user?.location?.city_slug || null);

      // Profil fotoğrafı güncellendiğinde local state'i temizle
      if (user.photo) {
        setPhotoPreview(null);
        setProfilePhoto(null);
      }
    }
  }, [user]);

  // Cinsiyet seçenekleri
  const genderOptions = [
    { id: 1, name: t("Erkek"), value: "male" },
    { id: 2, name: t("Kadın"), value: "female" },
    { id: 3, name: t("Belirtmek istemiyorum"), value: "other" },
  ];

  // Timezone seçenekleri
  const timezoneOptions = timezones.map((timezone) => ({
    id: timezone.id,
    name: `${timezone.name} (${timezone.offset})`,
    value: timezone.name,
  }));

  // Currency seçenekleri
  const currencyOptions = currencies.map((currency) => ({
    id: currency.id,
    name: `${currency.name} (${currency.code})`,
    value: currency.code,
  }));

  // Phone Code seçenekleri
  const phoneCodeOptions = phoneCodes.map((code, index) => ({
    id: index + 1,
    name: code,
    value: code,
  }));

  // Country seçenekleri
  const countryOptions = countries.map((country) => ({
    id: country.id,
    name: country.name,
    value: country.slug,
  }));

  // City seçenekleri
  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name,
    value: city.slug,
  }));

  // District seçenekleri
  const districtOptions = districts.map((district) => ({
    id: district.id,
    name: district.name,
    value: district.slug,
  }));

  const handleChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePasswordChange =
    (field: keyof typeof passwordForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleGenderChange = (option: any) => {
    setForm((prev) => ({ ...prev, gender: option?.value || "" }));
  };

  const handleTimezoneChange = (option: any) => {
    setForm((prev) => ({ ...prev, timezone: option?.value || "" }));
  };

  const handleCurrencyChange = (option: any) => {
    setForm((prev) => ({ ...prev, currency: option?.value || "" }));
  };

  const handlePhoneCodeChange = (option: any) => {
    setForm((prev) => ({ ...prev, phone_code: option?.value || "" }));
  };

  const handleCountryChange = (option: any) => {
    const countrySlug = option?.value || "";
    setForm((prev) => ({ ...prev, country_slug: countrySlug, city_slug: "", district_slug: "" }));
    setSelectedCountrySlug(countrySlug || null);
    setSelectedCitySlug(null);
  };

  const handleCityChange = (option: any) => {
    const citySlug = option?.value || "";
    setForm((prev) => ({ ...prev, city_slug: citySlug, district_slug: "" }));
    setSelectedCitySlug(citySlug || null);
  };

  const handleDistrictChange = (option: any) => {
    setForm((prev) => ({ ...prev, district_slug: option?.value || "" }));
  };

  const pwdValid = {
    minLength: passwordForm.newPassword.length >= 8,
    hasNumber: /\d/.test(passwordForm.newPassword),
    hasUpper: /[A-Z]/.test(passwordForm.newPassword),
    match: passwordForm.newPassword === passwordForm.confirmPassword,
  };

  const isProfileValid =
    form.name &&
    form.email &&
    form.phone_code &&
    form.phone_number &&
    form.birth_date &&
    form.gender &&
    form.address &&
    form.country_slug &&
    form.city_slug &&
    form.district_slug;
  const isPasswordValid =
    passwordForm.currentPassword && Object.values(pwdValid).every(Boolean);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return funcSweetAlert({
        title: t("Hata"),
        text: t("Lütfen geçerli bir fotoğraf dosyası seçin"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return funcSweetAlert({
        title: t("Hata"),
        text: t("Dosya boyutu 5MB'dan küçük olmalıdır."),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }

    setProfilePhoto(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfilePhotoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profilePhoto) return;

    setIsUploading(true);
    try {
      const response = await updateProfilePhoto(profilePhoto);

      // Local state'i temizle
      fileInputRef.current!.value = "";
      setProfilePhoto(null);
      setPhotoPreview(null);

      // Sayfayı yenile
      window.location.reload();
      funcSweetAlert({
        title: t("Fotoğraf Güncellendi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;

    try {
      const response = await updateProfile({
        name: form.name,
        email: form.email,
        phone_code: form.phone_code,
        phone_number: form.phone_number,
        birth_date: form.birth_date,
        gender: form.gender,
        address: form.address,
        country: form.country_slug,
        city: form.city_slug,
        district: form.district_slug,
        timezone: form.timezone,
        currency: form.currency,
      });

      // Global state'i güncelle
      if (response?.data && user) {
        const updatedUser = {
          ...user,
          name: form.name,
          email: form.email,
          phone_code: form.phone_code,
          phone_number: form.phone_number,
          birth_date: form.birth_date,
          gender: form.gender,
          location: {
            ...user.location,
            address: form.address,
            country_slug: form.country_slug,
            city_slug: form.city_slug,
            district_slug: form.district_slug,
          },
          timezone: form.timezone,
          currency: form.currency,
        };
        updateServerUser(updatedUser);
      }
      // Sayfayı yenile
      window.location.reload();
      funcSweetAlert({
        title: t("Profil Güncellendi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );
      funcSweetAlert({
        title: t("Şifre Güncellendi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  const handleDeleteProfilePhoto = async (e: FormEvent) => {
    e.preventDefault();

    const confirmed = await funcSweetAlert({
      title: t("Emin misiniz?"),
      text: t("Profil fotoğrafınızı silmek üzeresiniz"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Evet, Sil"),
      cancelButtonText: t("Vazgeç"),
    });

    if (!confirmed.isConfirmed) return;

    setIsUploading(true);
    try {
      await deleteProfilePhoto();

      // Local state'i temizle
      fileInputRef.current!.value = "";
      setProfilePhoto(null);
      setPhotoPreview(null);

      // Sayfayı yenile
      window.location.reload();
      funcSweetAlert({
        title: t("Fotoğraf Silindi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const iconMap: Record<string, React.ReactNode> = {
    name: <IoPersonOutline />,
    email: <IoMailOutline />,
    phone_code: <IoCallOutline />,
    phone_number: <IoCallOutline />,
    birth_date: <IoCalendarOutline />,
    gender: <IoPersonOutline />,
    address: <IoLocationOutline />,
    country: <IoGlobeOutline />,
    city: <IoMapOutline />,
    district: <IoBusinessOutline />,
    timezone: <IoGlobeOutline />,
    currency: <IoCardOutline />,
  };

  return (
    <div className="flex max-lg:flex-col lg:gap-8 gap-4 w-full bg-white lg:p-6 p-4 rounded-lg shadow-md shadow-gray-200">
      {/* PROFİL FOTOĞRAFI FORMU */}
      <form
        onSubmit={handleProfilePhotoSubmit}
        className="flex flex-col gap-4 items-center border-r border-gray-200 p-4 lg:pt-0 lg:pr-8"
      >
        <span>{t("Fotoğrafı Güncelle")}</span>
        <div className="relative flex flex-col items-center gap-4 w-fit group">
          {(photoPreview || user?.photo) && (
            <CustomButton
              containerStyles="absolute -right-1.5 -top-1.5 rounded-full z-10 p-1.5 bg-sitePrimary opacity-80 hover:opacity-100 hover:scale-110 flex items-center justify-center text-white transition-all duration-300"
              leftIcon={<IoTrashOutline className="text-lg" />}
              handleClick={handleDeleteProfilePhoto}
            />
          )}
          <div className="relative min-w-36 w-36 h-36 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
            <ProfilePhoto
              user={user}
              photo={photoPreview}
              name={user?.name}
              size={144}
              fontSize={48}
              responsiveSizes={{ desktop: 144, mobile: 144 }}
              responsiveFontSizes={{ desktop: 48, mobile: 48 }}
            />

            <label
              htmlFor="profile-photo"
              className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
            >
              <IoCameraOutline className="text-white text-3xl" />
            </label>
            <input
              type="file"
              id="profile-photo"
              ref={fileInputRef}
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {profilePhoto && (
            <div className="flex flex-col gap-2 items-center">
              <p className="text-sm text-gray-600 truncate max-w-[150px]">
                {profilePhoto.name}
              </p>
              <CustomButton
                btnType="submit"
                title={isUploading ? t("Yükleniyor") : t("Fotoğrafı Güncelle")}
                containerStyles={`py-2 px-4 rounded-md transition-all duration-300 bg-sitePrimary/80 hover:bg-sitePrimary text-white text-xs w-full ${
                  isUploading ? "opacity-50 !cursor-not-allowed" : "opacity-100"
                }`}
                isDisabled={isUploading}
              />
            </div>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-4 w-full">
        {/* PROFİL BİLGİLERİ FORMU */}
        <form
          onSubmit={handleProfileSubmit}
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <span className="flex mb-3 max-lg:mx-auto">
            {t("Profili Güncelle")}
          </span>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-lg:gap-4">
            {/* İsim ve Email yan yana */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomInput
                  id="name"
                  type="text"
                  label={t("İsminiz")}
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                  icon={iconMap.name}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  id="email"
                  type="email"
                  label={t("E-Posta Adresiniz")}
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                  icon={iconMap.email}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  id="birth_date"
                  type="date"
                  label={t("Doğum Tarihi")}
                  value={form.birth_date}
                  onChange={handleChange("birth_date")}
                  required
                  icon={iconMap.birth_date}
                />
              </div>
            </div>

            {/* Ülke ve Şehir yan yana */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomSelect
                  id="country"
                  name="country"
                  label={t("Ülke Seçiniz")}
                  value={
                    countryOptions.find(
                      (option) => option.value === form.country_slug
                    ) || null
                  }
                  options={countryOptions}
                  onChange={handleCountryChange}
                  required
                  icon={<IoGlobeOutline />}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="city"
                  name="city"
                  label={t("Şehir Seçiniz")}
                  value={
                    cityOptions.find(
                      (option) => option.value === form.city_slug
                    ) || null
                  }
                  options={cityOptions}
                  onChange={handleCityChange}
                  required
                  icon={<IoMapOutline />}
                  disabled={!selectedCountrySlug || citiesLoading}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="district"
                  name="district"
                  label={t("İlçe Seçiniz")}
                  value={
                    districtOptions.find(
                      (option) => option.value === form.district_slug
                    ) || null
                  }
                  options={districtOptions}
                  onChange={handleDistrictChange}
                  required
                  icon={<IoBusinessOutline />}
                  disabled={!selectedCitySlug || districtsLoading}
                />
              </div>
            </div>

            <div className="col-span-full">
              <CustomInput
                id="address"
                type="text"
                label={t("Adres")}
                value={form.address}
                onChange={handleChange("address")}
                required
                icon={iconMap.address}
              />
            </div>
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-1/3 max-lg:w-full">
                <CustomSelect
                  id="phone_code"
                  name="phone_code"
                  label={t("Ülke Kodu")}
                  value={
                    phoneCodeOptions.find(
                      (option) => option.value === form.phone_code
                    ) || null
                  }
                  options={phoneCodeOptions}
                  onChange={handlePhoneCodeChange}
                  required
                  icon={<IoCallOutline />}
                />
              </div>
              <div className="w-2/3 max-lg:w-full">
                <CustomInput
                  id="phone_number"
                  type="tel"
                  label={t("Telefon Numarası")}
                  value={form.phone_number}
                  onChange={handleChange("phone_number")}
                  required
                  icon={<IoCallOutline />}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="gender"
                  name="gender"
                  label={t("Cinsiyet Seçiniz")}
                  value={
                    genderOptions.find(
                      (option) => option.value === form.gender
                    ) || null
                  }
                  options={genderOptions}
                  onChange={handleGenderChange}
                  icon={<IoPersonOutline />}
                />
              </div>
            </div>

            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomSelect
                  id="timezone"
                  name="timezone"
                  label={t("Saat Dilimi Seçiniz")}
                  value={
                    timezoneOptions.find(
                      (option) => option.value === form.timezone
                    ) || null
                  }
                  options={timezoneOptions}
                  onChange={handleTimezoneChange}
                  required
                  icon={<IoGlobeOutline />}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="currency"
                  name="currency"
                  label={t("Para Birimi Seçiniz")}
                  value={
                    currencyOptions.find(
                      (option) => option.value === form.currency
                    ) || null
                  }
                  options={currencyOptions}
                  onChange={handleCurrencyChange}
                  required
                  icon={<IoCardOutline />}
                />
              </div>
            </div>
          </div>

          <CustomButton
            btnType="submit"
            title={t("Profili Güncelle")}
            containerStyles={`py-3 px-4 lg:w-fit w-full rounded-md transition-all duration-300 lg:order-2 order-1 bg-sitePrimary/80 hover:bg-sitePrimary text-white ml-auto text-sm ${
              isProfileValid ? "opacity-100" : "opacity-50 !cursor-not-allowed"
            }`}
            isDisabled={!isProfileValid}
          />
        </form>

        <hr className="border-gray-200" />

        {/* ŞİFRE DEĞİŞTİRME FORMU */}
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <span className="max-lg:mx-auto">{t("Şifreyi Güncelle")}</span>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <CustomInput
              label={t("Şifreniz")}
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange("currentPassword")}
              icon={<IoLockClosedOutline />}
              required
              autoComplete="current-password"
              labelSlot={
                <CustomButton
                  btnType="button"
                  leftIcon={
                    showPassword ? (
                      <IoEye className="text-xl animate-modalContentSmooth text-sitePrimary" />
                    ) : (
                      <IoEyeOff className="text-xl animate-modalContentSmooth hover:text-sitePrimary transition-all duration-300" />
                    )
                  }
                  handleClick={() => setShowPassword((prev) => !prev)}
                />
              }
            />

            <CustomInput
              label={t("Yeni Şifre")}
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange("newPassword")}
              icon={<IoLockClosedOutline />}
              required
              autoComplete="new-password"
            />

            <CustomInput
              label={t("Yeni Şifre (Tekrar)")}
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange("confirmPassword")}
              icon={<IoLockClosedOutline />}
              required
              autoComplete="new-password"
            />
          </div>

          {(passwordForm.newPassword || passwordForm.confirmPassword) && (
            <div className="flex flex-col gap-1.5 text-sm animate-sidebarBgSmooth origin-top-left">
              {Object.entries(pwdValid).map(([rule, valid]) => (
                <div key={rule} className="flex items-center gap-2">
                  {valid ? (
                    <IoCheckmark className="text-xl text-green-500 animate-modalContentSmooth" />
                  ) : (
                    <IoClose className="text-xl text-red-500 animate-modalContentSmooth" />
                  )}
                  <span>
                    {rule === "minLength"
                      ? t("Şifreniz, en az 8 karakter olmalıdır")
                      : rule === "hasNumber"
                      ? t("Şifrenizde en az 1 sayı olmalıdır")
                      : rule === "hasUpper"
                      ? t("Şifreniz, en az 1 büyük harf içermelidir")
                      : t("Şifreleriniz eşleşmelidir")}
                  </span>
                </div>
              ))}
            </div>
          )}

          <CustomButton
            btnType="submit"
            title={t("Şifreyi Güncelle")}
            containerStyles={`py-3 px-4 lg:w-fit w-full rounded-md transition-all duration-300 lg:order-2 order-1 bg-sitePrimary/80 hover:bg-sitePrimary text-white ml-auto text-sm ${
              isPasswordValid ? "opacity-100" : "opacity-50 !cursor-not-allowed"
            }`}
            isDisabled={!isPasswordValid}
          />
        </form>
      </div>
    </div>
  );
}
