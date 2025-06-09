"use client";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/others/CustomButton";
import LoadingData from "@/components/others/LoadingData";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { useUser } from "@/lib/hooks/auth/useUser";
import { IoCheckmark, IoClose, IoEye, IoEyeOff } from "react-icons/io5";
import { useTranslations } from "use-intl";
import { changePassword } from "@/lib/utils/user/changePassword";

export default function ProfileContent() {
  const t = useTranslations();
  const { user, isLoading } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user)
      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
  }, [user]);

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handlePasswordChange =
    (field: keyof typeof passwordForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const pwdValid = {
    minLength: passwordForm.newPassword.length >= 8,
    hasNumber: /\d/.test(passwordForm.newPassword),
    hasUpper: /[A-Z]/.test(passwordForm.newPassword),
    match: passwordForm.newPassword === passwordForm.confirmPassword,
  };

  const isProfileValid = form.name && form.email && form.phone;

  const isPasswordValid =
    passwordForm.currentPassword &&
    pwdValid.minLength &&
    pwdValid.hasNumber &&
    pwdValid.hasUpper &&
    pwdValid.match;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isProfileValid) return;
    funcSweetAlert({
      title: t("Profil güncellemesi henüz aktif değil!"),
      text: t("Lütfen daha sonra tekrar deneyin."),
      icon: "error",
      confirmButtonText: t("Tamam"),
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        passwordForm.confirmPassword
      );

      funcSweetAlert({
        title: t("Şifre Güncellendi!"),
        icon: "success",
        confirmButtonText: t("Tamam"),
      });

      // Formu sıfırla
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        t("İşlem Başarısız!");

      funcSweetAlert({
        title: t("İşlem Başarısız!"),
        text: message,
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }
  };

  if (isLoading) return <LoadingData count={5} />;

  return (
    <div className="flex flex-col lg:gap-8 gap-4 w-full bg-white lg:p-6 p-4 rounded-lg shadow-md shadow-gray-200">
      {/* PROFİL BİLGİLERİ FORMU */}
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
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
              label: t("Telefon Numaranız"),
              placeHolder: t("Telefon Numaranız"),
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
          title={"Profili Güncelle"}
          containerStyles={`py-3 px-4 lg:w-fit w-full rounded-md transition-all duration-300 lg:order-2 order-1 bg-sitePrimary/80 hover:bg-sitePrimary text-white ml-auto text-sm ${
            isProfileValid ? "opacity-100" : "opacity-50 !cursor-not-allowed"
          }`}
          isDisabled={!isProfileValid}
        />
      </form>

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
