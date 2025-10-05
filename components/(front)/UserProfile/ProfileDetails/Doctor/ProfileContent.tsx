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
  IoMedicalOutline,
  IoBookOutline,
  IoTimeOutline,
  IoStarOutline,
} from "react-icons/io5";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

import CustomButton from "@/components/others/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { changePassword } from "@/lib/services/user/changePassword";
import { updateDoctorProfile } from "@/lib/services/user/updateDoctorProfile";
import { updateProfilePhoto } from "@/lib/services/user/updateProfilePhoto";
import { deleteProfilePhoto } from "@/lib/services/user/deleteProfilePhoto";
import { CustomInput } from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
import { 
  useCities, 
  useDistricts, 
  useBranches, 
  useDiseases, 
  useTreatments, 
  useServices 
} from "@/lib/hooks/globals";
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

  // Client-side hook'ları
  const { branches, isLoading: branchesLoading } = useBranches();
  const { diseases, isLoading: diseasesLoading } = useDiseases();
  const { treatments, isLoading: treatmentsLoading } = useTreatments();
  const { services, isLoading: servicesLoading } = useServices();

  // Cascade seçim için
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string | null>(null);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  
  const { cities, isLoading: citiesLoading } = useCities(selectedCountrySlug);
  const { districts, isLoading: districtsLoading } = useDistricts(selectedCountrySlug, selectedCitySlug);

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
    // Temel bilgiler
    name: user?.name || "",
    email: user?.email || "",
    phone_code: user?.phone_code || "+90",
    phone_number: user?.phone_number || "",
    birth_date: formatBirthDate(user?.birth_date || ""),
    gender: user?.gender || "",
    address: user?.location?.address || "",
    country_slug: user?.location?.country_slug || "",
    city_slug: user?.location?.city_slug || "",
    district_slug: user?.location?.district_slug || "",
    timezone: user?.timezone || "Europe/Istanbul",
    currency: user?.currency || "TRY",
    
    // Doctor bilgileri
    type: user?.doctor?.type || "specialist",
    specialty_id: user?.doctor?.specialty_id || 1,
    experience: user?.doctor?.experience || 0,
    description: user?.doctor?.description || "",
    map_location: user?.doctor?.map_location || "",
    review_count: user?.doctor?.review_count || 0,
    disease_ids: user?.doctor?.disease_ids || [],
    treatment_ids: user?.doctor?.treatment_ids || [],
    service_ids: user?.doctor?.service_ids || [],
    consultation_fee: user?.doctor?.consultation_fee || 0,
    examination_fee: user?.doctor?.examination_fee || 0,
    appointment_duration: user?.doctor?.appointment_duration || 30,
    online_consultation: user?.doctor?.online_consultation || false,
    home_visit: user?.doctor?.home_visit || false,
    emergency_available: user?.doctor?.emergency_available || false,
    is_available: user?.doctor?.is_available || true,
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
        name: user?.name || "",
        email: user?.email || "",
        phone_code: user?.phone_code ?? "+90",
        phone_number: user?.phone_number || "",
        birth_date: formatBirthDate(user?.birth_date || ""),
        gender: user?.gender || "",
        address: user?.location?.address || "",
        country_slug: user?.location?.country_slug || "",
        city_slug: user?.location?.city_slug || "",
        district_slug: user?.location?.district_slug || "",
        timezone: user?.timezone ?? "Europe/Istanbul",
        currency: user?.currency ?? "TRY",
        
        type: user?.doctor?.type || "specialist",
        specialty_id: user?.doctor?.specialty_id || 1,
        experience: user?.doctor?.experience || 0,
        description: user?.doctor?.description || "",
        map_location: user?.doctor?.map_location || "",
        review_count: user?.doctor?.review_count || 0,
        disease_ids: user?.doctor?.disease_ids || [],
        treatment_ids: user?.doctor?.treatment_ids || [],
        service_ids: user?.doctor?.service_ids || [],
        consultation_fee: user?.doctor?.consultation_fee || 0,
        examination_fee: user?.doctor?.examination_fee || 0,
        appointment_duration: user?.doctor?.appointment_duration || 30,
        online_consultation: user?.doctor?.online_consultation || false,
        home_visit: user?.doctor?.home_visit || false,
        emergency_available: user?.doctor?.emergency_available || false,
        is_available: user?.doctor?.is_available || true,
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

  // Seçenekleri hazırla
  const genderOptions = [
    { id: 1, name: t("Erkek"), value: "male" },
    { id: 2, name: t("Kadın"), value: "female" },
    { id: 3, name: t("Belirtmek istemiyorum"), value: "other" },
  ];

  const doctorTypeOptions = [
    { id: 1, name: t("Uzman Doktor"), value: "specialist" },
    { id: 2, name: t("Pratisyen Doktor"), value: "general" },
  ];

  const timezoneOptions = timezones.map((timezone) => ({
    id: timezone.id,
    name: `${timezone.name} (${timezone.offset})`,
    value: timezone.name,
  }));

  const currencyOptions = currencies.map((currency) => ({
    id: currency.id,
    name: `${currency.name} (${currency.code})`,
    value: currency.code,
  }));

  const phoneCodeOptions = phoneCodes.map((code, index) => ({
    id: index + 1,
    name: code,
    value: code,
  }));

  const countryOptions = countries.map((country) => ({
    id: country.id,
    name: country.name,
    value: country.slug,
  }));

  const cityOptions = cities.map((city) => ({
    id: city.id,
    name: city.name,
    value: city.slug,
  }));

  const districtOptions = districts.map((district) => ({
    id: district.id,
    name: district.name,
    value: district.slug,
  }));

  const branchOptions = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    value: branch.id,
  }));

  const diseaseOptions = diseases.map((disease) => ({
    id: disease.id,
    name: disease.name,
    value: disease.id,
  }));

  const treatmentOptions = treatments.map((treatment) => ({
    id: treatment.id,
    name: treatment.name,
    value: treatment.id,
  }));

  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.name,
    value: service.id,
  }));

  // Handler'lar
  const handleChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSelectChange = (field: keyof typeof form) => (option: any) => {
    setForm((prev) => ({ ...prev, [field]: option?.value || "" }));
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

  const handleMultiSelectChange = (field: keyof typeof form) => (options: any[]) => {
    const values = options.map(option => option.value);
    setForm((prev) => ({ ...prev, [field]: values }));
  };

  // Validation
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
    form.district_slug &&
    form.specialty_id &&
    form.experience > 0;

  const isPasswordValid =
    passwordForm.currentPassword && Object.values(pwdValid).every(Boolean);

  // Photo handlers
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

      fileInputRef.current!.value = "";
      setProfilePhoto(null);
      setPhotoPreview(null);

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

      fileInputRef.current!.value = "";
      setProfilePhoto(null);
      setPhotoPreview(null);

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

  // Profile submit
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;

    try {
      const response = await updateDoctorProfile({
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
        doctor: {
          type: form.type,
          specialty_id: form.specialty_id,
          experience: form.experience,
          description: form.description,
          map_location: form.map_location,
          review_count: form.review_count,
          disease_ids: form.disease_ids,
          treatment_ids: form.treatment_ids,
          service_ids: form.service_ids,
          treatments: [], // TODO: Implement treatments management
          services: [], // TODO: Implement services management
          education: [], // TODO: Implement education management
          experience_list: [], // TODO: Implement experience management
          languages: [], // TODO: Implement languages management
          certifications: [], // TODO: Implement certifications management
          consultation_fee: form.consultation_fee,
          examination_fee: form.examination_fee,
          appointment_duration: form.appointment_duration,
          online_consultation: form.online_consultation,
          home_visit: form.home_visit,
          emergency_available: form.emergency_available,
          working_days: {
            monday: { open: "09:00", close: "17:00" },
            tuesday: { open: "09:00", close: "17:00" },
            wednesday: { open: "09:00", close: "17:00" },
            thursday: { open: "09:00", close: "17:00" },
            friday: { open: "09:00", close: "17:00" },
            saturday: { closed: true },
            sunday: { closed: true },
          },
          holidays: [],
          is_available: form.is_available,
        },
      });

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
          doctor: {
            ...user.doctor,
            ...form,
          },
        };
        updateServerUser(updatedUser);
      }
      
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

  // Password submit
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
    type: <IoMedicalOutline />,
    specialty_id: <IoMedicalOutline />,
    experience: <IoStarOutline />,
    description: <IoBookOutline />,
    map_location: <IoLocationOutline />,
    consultation_fee: <IoCardOutline />,
    examination_fee: <IoCardOutline />,
    appointment_duration: <IoTimeOutline />,
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
        {/* TEMEL BİLGİLER FORMU */}
        <form
          onSubmit={handleProfileSubmit}
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <span className="flex mb-3 max-lg:mx-auto">
            {t("Doktor Profilini Güncelle")}
          </span>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 max-lg:gap-4">
            {/* Temel Bilgiler */}
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

            {/* Konum Bilgileri */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomSelect
                  id="country"
                  name="country"
                  label={t("Ülke Seçiniz")}
                  value={countryOptions.find((option) => option.value === form.country_slug) || null}
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
                  value={cityOptions.find((option) => option.value === form.city_slug) || null}
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
                  value={districtOptions.find((option) => option.value === form.district_slug) || null}
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

            {/* İletişim Bilgileri */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-1/3 max-lg:w-full">
                <CustomSelect
                  id="phone_code"
                  name="phone_code"
                  label={t("Ülke Kodu")}
                  value={phoneCodeOptions.find((option) => option.value === form.phone_code) || null}
                  options={phoneCodeOptions}
                  onChange={handleSelectChange("phone_code")}
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
                  value={genderOptions.find((option) => option.value === form.gender) || null}
                  options={genderOptions}
                  onChange={handleSelectChange("gender")}
                  icon={<IoPersonOutline />}
                />
              </div>
            </div>

            {/* Doktor Bilgileri */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomSelect
                  id="type"
                  name="type"
                  label={t("Doktor Tipi")}
                  value={doctorTypeOptions.find((option) => option.value === form.type) || null}
                  options={doctorTypeOptions}
                  onChange={handleSelectChange("type")}
                  required
                  icon={<IoMedicalOutline />}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="specialty_id"
                  name="specialty_id"
                  label={t("Uzmanlık Alanı")}
                  value={branchOptions.find((option) => option.value === form.specialty_id) || null}
                  options={branchOptions}
                  onChange={handleSelectChange("specialty_id")}
                  required
                  icon={<IoMedicalOutline />}
                  disabled={branchesLoading}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  id="experience"
                  type="number"
                  label={t("Deneyim Yılı")}
                  value={form.experience}
                  onChange={handleChange("experience")}
                  required
                  icon={<IoStarOutline />}
                />
              </div>
            </div>

            <div className="col-span-full">
              <CustomInput
                id="description"
                type="text"
                label={t("Hakkınızda Kısa Bilgi")}
                value={form.description}
                onChange={handleChange("description")}
                icon={<IoBookOutline />}
              />
            </div>

            {/* Fiyat Bilgileri */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomInput
                  id="consultation_fee"
                  type="number"
                  label={t("Konsültasyon Ücreti")}
                  value={form.consultation_fee}
                  onChange={handleChange("consultation_fee")}
                  icon={<IoCardOutline />}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  id="examination_fee"
                  type="number"
                  label={t("Muayene Ücreti")}
                  value={form.examination_fee}
                  onChange={handleChange("examination_fee")}
                  icon={<IoCardOutline />}
                />
              </div>
              <div className="w-full">
                <CustomInput
                  id="appointment_duration"
                  type="number"
                  label={t("Randevu Süresi (Dakika)")}
                  value={form.appointment_duration}
                  onChange={handleChange("appointment_duration")}
                  icon={<IoTimeOutline />}
                />
              </div>
            </div>

            {/* Saat Dilimi ve Para Birimi */}
            <div className="flex max-lg:flex-col gap-4 col-span-full">
              <div className="w-full">
                <CustomSelect
                  id="timezone"
                  name="timezone"
                  label={t("Saat Dilimi Seçiniz")}
                  value={timezoneOptions.find((option) => option.value === form.timezone) || null}
                  options={timezoneOptions}
                  onChange={handleSelectChange("timezone")}
                  required
                  icon={<IoGlobeOutline />}
                />
              </div>
              <div className="w-full">
                <CustomSelect
                  id="currency"
                  name="currency"
                  label={t("Para Birimi Seçiniz")}
                  value={currencyOptions.find((option) => option.value === form.currency) || null}
                  options={currencyOptions}
                  onChange={handleSelectChange("currency")}
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
