"use client";

import React, { useEffect, useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { IoCameraOutline, IoCheckmark, IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useTranslations } from "use-intl";

import CustomButton from "@/components/others/CustomButton";
import LoadingData from "@/components/others/LoadingData";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { getShortName } from "@/lib/functions/getShortName";
import { useUser } from "@/lib/hooks/auth/useUser";
import { changePassword } from "@/lib/utils/user/changePassword";
import { updateProfile } from "@/lib/utils/user/updateProfile";
import { updateProfilePhoto } from "@/lib/utils/user/updateProfilePhoto";

export default function ProfileContent() {
  const t = useTranslations();
  const { user, isLoading } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "" });
  }, [user]);

  const handleChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordChange = (field: keyof typeof passwordForm) => (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const pwdValid = {
    minLength: passwordForm.newPassword.length >= 8,
    hasNumber: /\d/.test(passwordForm.newPassword),
    hasUpper: /[A-Z]/.test(passwordForm.newPassword),
    match: passwordForm.newPassword === passwordForm.confirmPassword,
  };

  const isProfileValid = Object.values(form).every(Boolean);
  const isPasswordValid = passwordForm.currentPassword && Object.values(pwdValid).every(Boolean);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return funcSweetAlert({ title: t("Hata!"), text: t("Lütfen geçerli bir resim dosyası seçin"), icon: "error", confirmButtonText: t("Tamam") });
    }

    if (file.size > 5 * 1024 * 1024) {
      return funcSweetAlert({ title: t("Hata!"), text: t("Dosya boyutu 5MB'dan küçük olmalıdır."), icon: "error", confirmButtonText: t("Tamam") });
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
      await updateProfilePhoto(profilePhoto);
      funcSweetAlert({ title: t("Profil Fotoğrafı Güncellendi!"), icon: "success", confirmButtonText: t("Tamam") });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error: any) {
      funcSweetAlert({ title: t("İşlem Başarısız!"), text: error?.response?.data?.message || t("İşlem Başarısız!"), icon: "error", confirmButtonText: t("Tamam") });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;

    try {
      await updateProfile(form.name, form.email, form.phone);
      funcSweetAlert({ title: t("Profil Güncellendi!"), icon: "success", confirmButtonText: t("Tamam") });
    } catch (error: any) {
      funcSweetAlert({ title: t("İşlem Başarısız!"), text: error?.response?.data?.message || t("İşlem Başarısız!"), icon: "error", confirmButtonText: t("Tamam") });
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword, passwordForm.confirmPassword);
      funcSweetAlert({ title: t("Şifre Güncellendi!"), icon: "success", confirmButtonText: t("Tamam") });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      funcSweetAlert({ title: t("İşlem Başarısız!"), text: error?.response?.data?.message || t("İşlem Başarısız!"), icon: "error", confirmButtonText: t("Tamam") });
    }
  };

  if (isLoading) return <LoadingData count={5} />;

  return (
    <div className="flex flex-col lg:gap-8 gap-4 w-full bg-white lg:p-6 p-4 rounded-lg shadow-md shadow-gray-200">
      <div className="flex max-lg:flex-col lg:gap-8 gap-4">
        {/* PROFİL FOTOĞRAFI FORMU */}
        <form
          onSubmit={handleProfilePhotoSubmit}
          className="flex flex-col gap-4 mb-6"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="w-36 min-w-36 h-36 rounded-full overflow-hidden border-4 border-gray-200 relative">
                {photoPreview ? (
                  <Image
                    src={photoPreview || "/placeholder.svg"}
                    alt={user.name}
                    title={user.name}
                    fill
                    className="object-cover"
                  />
                ) : user?.image ? (
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    title={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">
                      {getShortName(user.name)}
                    </span>
                  </div>
                )}

                <label
                  htmlFor="profile-photo"
                  className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
                >
                  <IoCameraOutline className="text-white text-3xl" />
                </label>
              </div>

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
                <p className="text-sm text-gray-600">{profilePhoto.name}</p>
                <CustomButton
                  btnType="submit"
                  title={
                    isUploading ? t("Yükleniyor") : t("Fotoğrafı Güncelle")
                  }
                  containerStyles={`py-2 px-4 rounded-md transition-all duration-300 bg-sitePrimary/80 hover:bg-sitePrimary text-white text-xs w-full ${
                    isUploading
                      ? "opacity-50 !cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  isDisabled={isUploading}
                />
              </div>
            )}
          </div>
        </form>

        {/* PROFİL BİLGİLERİ FORMU */}
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 w-full">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 gap-6">
            {[
              { key: "name", label: t("İsminiz"), placeHolder: t("İsminiz") },
              {
                key: "email",
                label: t("E-Posta Adresiniz"),
                placeHolder: t("E-Posta Adresinizi giriniz"),
              },
              {
                key: "phone",
                label: t("Telefon Numarası"),
                placeHolder: t("Telefon Numarası Giriniz"),
              },
            ].map(({ key, label, placeHolder }) => {
              const type =
                key === "email" ? "email" : key === "phone" ? "tel" : "text";
              return (
                <label
                  key={key}
                  htmlFor={key}
                  className="flex flex-col gap-4 w-full"
                >
                  <div className="flex justify-between">
                    <span className="text-sm">{label}</span>
                  </div>
                  <input
                    id={key}
                    type={type}
                    required
                    className="bg-gray-100 border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-3 px-6 outline-none text-base w-full"
                    placeholder={placeHolder}
                    value={form[key as keyof typeof form]}
                    onChange={handleChange(key as keyof typeof form)}
                  />
                </label>
              );
            })}
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
      </div>
      <hr className="border-gray-200" />

      {/* ŞİFRE DEĞİŞTİRME FORMU */}
      <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-8 gap-6">
          {[
            {
              key: "currentPassword",
              label: t("Şifreniz"),
              placeHolder: t("Şifrenizi giriniz"),
            },
            {
              key: "newPassword",
              label: t("Yeni Şifre"),
              placeHolder: t("Şifrenizi giriniz"),
            },
            {
              key: "confirmPassword",
              label: t("Yeni Şifre (Tekrar)"),
              placeHolder: t("Şifrenizi giriniz"),
            },
          ].map(({ key, label, placeHolder }, idx) => (
            <label
              key={key}
              htmlFor={key}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex justify-between">
                <span className="text-sm">{label}</span>
                {idx === 0 && (
                  <button
                    type="button"
                    className="self-end cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <IoEye className="text-xl animate-modalContentSmooth text-sitePrimary" />
                    ) : (
                      <IoEyeOff className="text-xl animate-modalContentSmooth hover:text-sitePrimary transition-all duration-300" />
                    )}
                  </button>
                )}
              </div>
              <input
                id={key}
                type={showPassword ? "text" : "password"}
                required
                className="bg-gray-100 border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-3 px-6 outline-none text-base w-full"
                placeholder={placeHolder}
                value={passwordForm[key as keyof typeof passwordForm]}
                onChange={handlePasswordChange(
                  key as keyof typeof passwordForm
                )}
              />
            </label>
          ))}
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
  );
}
