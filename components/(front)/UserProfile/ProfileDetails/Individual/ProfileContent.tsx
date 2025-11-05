"use client";
import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import {
  IoCallOutline,
  IoCheckmark,
  IoClose,
  IoEye,
  IoEyeOff,
  IoLockClosedOutline,
  IoMailOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoCalendarOutline,
  IoMapOutline,
  IoBusinessOutline,
  IoCardOutline,
} from "react-icons/io5";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

import CustomButton from "@/components/Customs/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  changePassword,
  updateEmail,
  sendEmailChangeCode,
  updatePhone,
  sendPhoneChangeCode,
} from "@/lib/services/user/updateProfile/others";
import { updateProfile } from "@/lib/services/user/updateProfile/updateProfile";
import CustomInput from "@/components/Customs/CustomInput";
import CustomSelect from "@/components/Customs/CustomSelect";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
import { useCities, useDistricts } from "@/lib/hooks/globals";
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

export default function ProfileContent({
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
  const phoneCodes = globalData?.phoneCodes || [];
  const countries = globalData?.countries || [];

  // Client-side hook'ları - cascade seçim için
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(
    null
  );
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);

  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);
  const { districts, isLoading: districtsLoading } = useDistricts(
    selectedCountrySlug,
    selectedCitySlug
  );

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
    name: user?.name || "",
    email: user?.email || "",
    phone_code: user?.phone_code || "",
    phone_number: user?.phone_number || "",
    birth_date: formatBirthDate(user?.birth_date || ""),
    gender: user?.gender || "",
    address: user?.location?.address || "",
    country_slug: user?.location?.country_slug || "",
    city_slug: user?.location?.city_slug || "",
    district_slug: user?.location?.district_slug || "",
    timezone: user?.timezone || "",
    currency: user?.currency || "",
  });

  // Email ve Phone verification state'leri
  const [emailVerification, setEmailVerification] = useState({
    new_email: "",
  });

  const [phoneVerification, setPhoneVerification] = useState({
    phone_code: "",
    phone_number: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // User prop'u veya serverUser değiştiğinde form'u güncelle
  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone_code: currentUser?.phone_code || "",
        phone_number: currentUser?.phone_number || "",
        birth_date: formatBirthDate(currentUser?.birth_date || ""),
        gender: currentUser?.gender || "",
        address: currentUser?.location?.address || "",
        country_slug: currentUser?.location?.country_slug || "",
        city_slug: currentUser?.location?.city_slug || "",
        district_slug: currentUser?.location?.district_slug || "",
        timezone: currentUser?.timezone || "",
        currency: currentUser?.currency || "",
      });

      // Cascade seçim için slug'ları set et
      setSelectedCountrySlug(currentUser?.location?.country_slug || null);
      setSelectedCitySlug(currentUser?.location?.city_slug || null);
    }
  }, [currentUser]);

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

  const handleCountryChange = (option: any) => {
    const countrySlug = option?.value || "";
    setForm((prev) => ({
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
    setForm((prev) => ({ ...prev, city_slug: citySlug, district_slug: "" }));
    setSelectedCitySlug(citySlug || null);
  };

  const handleDistrictChange = (option: any) => {
    setForm((prev) => ({ ...prev, district_slug: option?.value || "" }));
  };

  // Email verification handler
  const handleEmailUpdate = async () => {
    if (!emailVerification.new_email) {
      funcSweetAlert({
        title: t("Hata"),
        text: t("Lütfen yeni e-posta adresini girin"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
      return;
    }

    try {
      // Önce doğrulama kodunu gönder
      await sendEmailChangeCode(emailVerification.new_email);

      funcSweetAlert({
        title: t("Doğrulama Kodu Gönderildi"),
        text: t("E-posta adresinize doğrulama kodu gönderildi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });

      // SweetAlert ile verification code al
      const { value: verificationCode } = await funcSweetAlert({
        title: t("E-Maili Güncelle"),
        text: t("E-posta adresinize gönderilen doğrulama kodunu girin"),
        icon: "question",
        input: "text",
        inputPlaceholder: t("Doğrulama kodu"),
        showCancelButton: true,
        confirmButtonText: t("E-Maili Güncelle"),
        cancelButtonText: t("Vazgeç"),
      });

      if (!verificationCode) return;

      // Email'i güncelle
      await updateEmail(emailVerification.new_email, verificationCode);

      setForm((prev) => ({ ...prev, email: emailVerification.new_email }));
      setEmailVerification({ new_email: "" });

      funcSweetAlert({
        title: t("E-posta Güncellendi"),
        text: t("E-posta adresiniz başarıyla güncellendi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("Hata"),
        text:
          error?.response?.data?.errors?.verification_code[0] ||
          error?.response?.data?.errors?.new_email[0] ||
          error?.response?.data?.error ||
          t("İşlem başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  // Phone verification handler
  const handlePhoneUpdate = async () => {
    if (!phoneVerification.phone_code || !phoneVerification.phone_number) {
      funcSweetAlert({
        title: t("Hata"),
        text: t("Lütfen telefon kodu ve numarasını girin"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
      return;
    }

    try {
      // Önce doğrulama kodunu gönder
      await sendPhoneChangeCode(
        phoneVerification.phone_code,
        phoneVerification.phone_number
      );

      funcSweetAlert({
        title: t("Doğrulama Kodu Gönderildi"),
        text: t("Telefon numaranıza doğrulama kodu gönderildi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });

      // SweetAlert ile verification code al
      const { value: verificationCode } = await funcSweetAlert({
        title: t("Telefonu Güncelle"),
        text: t("Telefon numaranıza gönderilen doğrulama kodunu girin"),
        icon: "question",
        input: "text",
        inputPlaceholder: t("Doğrulama kodu"),
        showCancelButton: true,
        confirmButtonText: t("Telefonu Güncelle"),
        cancelButtonText: t("Vazgeç"),
      });

      if (!verificationCode) return;

      // Telefonu güncelle
      await updatePhone(
        phoneVerification.phone_code,
        phoneVerification.phone_number,
        verificationCode
      );

      setForm((prev) => ({
        ...prev,
        phone_code: phoneVerification.phone_code,
        phone_number: phoneVerification.phone_number,
      }));
      setPhoneVerification({ phone_code: "", phone_number: "" });

      funcSweetAlert({
        title: t("Telefon Güncellendi"),
        text: t("Telefon numaranız başarıyla güncellendi"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });
    } catch (error: any) {
      funcSweetAlert({
        title: t("Hata"),
        text:
          error?.response?.data?.errors?.verification_code[0] ||
          error?.response?.data?.errors?.new_phone[0] ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          t("İşlem başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  const pwdValid = {
    minLength: passwordForm.newPassword.length >= 8,
    hasNumber: /\d/.test(passwordForm.newPassword),
    hasUpper: /[A-Z]/.test(passwordForm.newPassword),
    match: passwordForm.newPassword === passwordForm.confirmPassword,
  };

  const isProfileValid =
    form.name &&
    form.birth_date &&
    form.gender &&
    form.address &&
    form.country_slug &&
    form.city_slug &&
    form.district_slug;
  const isPasswordValid =
    passwordForm.currentPassword && Object.values(pwdValid).every(Boolean);

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;

    try {
      const response = await updateProfile({
        name: form.name,
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
      if (response?.data && currentUser) {
        const updatedUser = {
          ...currentUser,
          ...response.data,
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
    <div className="flex max-lg:flex-col lg:gap-8 gap-4 w-full bg-white lg:p-6 p-4 rounded-md shadow-md shadow-gray-200">
      {/* PROFİL FOTOĞRAFI FORMU */}
      <UpdateProfilePhoto user={user} />

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
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
            {/* İsim ve Doğum Tarihi */}
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

            <hr className="col-span-full border-gray-200" />

            {/* Mevcut İletişim Bilgileri */}
            <div className="col-span-full flex flex-col gap-4">
              <h3 className="flex max-lg:mx-auto">
                {t("Mevcut İletişim Bilgileri")}
              </h3>
              <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 grid-cols-1 gap-4 col-span-full">
                {/* Email Row */}
                <div className="col-span-1 max-lg:col-span-full">
                  <div className="flex items-center gap-3 p-1.5 bg-gray-50 border border-gray-100 rounded-md h-full">
                    <IoMailOutline className="text-xl min-w-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] max-lg:text-sm text-gray-500">{t("E-Posta")}</p>
                      <p className="font-medium text-xs max-lg:text-base">{form.email}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 max-lg:col-span-full">
                  <div className="flex gap-2 h-full max-2xl:flex-col max-2xl:w-full">
                    <div className="flex-1 min-w-max max-lg:w-full">
                      <CustomInput
                        id="new_email"
                        type="email"
                        label={t("Yeni E-Posta Adresi")}
                        value={emailVerification.new_email}
                        onChange={(e) =>
                          setEmailVerification((prev) => ({
                            ...prev,
                            new_email: e.target.value,
                          }))
                        }
                        icon={iconMap.email}
                      />
                    </div>
                    <div className="flex items-end">
                      <CustomButton
                        btnType="button"
                        title={t("Doğrulama İsteği Gönder")}
                        containerStyles="py-2 px-4 lg:w-fit w-full rounded-md transition-all duration-300 lg:order-2 order-1 bg-sitePrimary/80 hover:bg-sitePrimary text-white ml-auto text-sm lg:text-xs h-full min-w-max"
                        handleClick={handleEmailUpdate}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Row */}
                <div className="col-span-1 max-lg:col-span-full">
                  <div className="flex items-center gap-3 p-1.5 bg-gray-50 border border-gray-100 rounded-md h-full">
                    <IoCallOutline className="text-xl min-w-5 text-gray-400" />
                    <div>
                      <p className="text-[10px] max-lg:text-sm text-gray-500">{t("Telefon")}</p>
                      <p className="font-medium text-xs max-lg:text-base">
                        {form.phone_code} {form.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 max-lg:col-span-full">
                  <div className="flex gap-2 h-full max-xl:flex-col max-xl:w-full">
                    <div className="w-full min-w-max max-lg:w-full">
                      <CustomSelect
                        id="new_phone_code"
                        name="new_phone_code"
                        label={t("Ülke Kodu")}
                        value={
                          phoneCodeOptions.find(
                            (option) =>
                              option.value === phoneVerification.phone_code
                          ) || null
                        }
                        options={phoneCodeOptions}
                        onChange={(option) =>
                          setPhoneVerification((prev) => ({
                            ...prev,
                            phone_code: option?.value || "",
                          }))
                        }
                        icon={<IoCallOutline />}
                      />
                    </div>
                    <div className="w-full min-w-max max-lg:w-full">
                      <CustomInput
                        id="new_phone_number"
                        type="tel"
                        label={t("Yeni Telefon Numarası")}
                        value={phoneVerification.phone_number}
                        onChange={(e) =>
                          setPhoneVerification((prev) => ({
                            ...prev,
                            phone_number: e.target.value,
                          }))
                        }
                        icon={iconMap.phone_number}
                      />
                    </div>
                    <div className="flex items-end">
                      <CustomButton
                        btnType="button"
                        title={t("Doğrulama İsteği Gönder")}
                        containerStyles="py-2 px-4 lg:w-fit w-full rounded-md transition-all duration-300 lg:order-2 order-1 bg-sitePrimary/80 hover:bg-sitePrimary text-white ml-auto text-sm lg:text-xs h-full min-w-max"
                        handleClick={handlePhoneUpdate}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="col-span-full border-gray-200" />

            {/* Ülke ve Şehir yan yana */}
            <div className="flex max-xl:flex-col gap-4 col-span-full">
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
