"use client";
import CustomButton from "@/components/others/CustomButton";
import { Link } from "@/i18n/navigation";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import { useTranslations } from "next-intl";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  IoCheckmark,
  IoClose,
  IoEye,
  IoEyeOff,
  IoLogoFacebook,
  IoLogoGoogle,
} from "react-icons/io5";

interface IRegisterProps {
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setAuth: Dispatch<SetStateAction<string>>;
}

function Register({ authLoading, setAuth, setAuthLoading }: IRegisterProps) {
  const t = useTranslations();
  const { register } = useAuthHandler();

  const [showPassword, setShowPassword] = useState(false);
  const [acceptKVKK, setAcceptKVKK] = useState(false);
  const [acceptMembership, setAcceptMembership] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const { name, email, password, passwordConfirm } = formData;

  const isPasswordValid =
    password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
  const passwordsMatch = password === passwordConfirm;

  const registerControl =
    name &&
    email &&
    isPasswordValid &&
    passwordsMatch &&
    acceptKVKK &&
    acceptMembership;

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setAuthLoading(true);

  try {
    await register({
      name,
      email,
      password,
      kvkk_approved: acceptKVKK,
      membership_approved: acceptMembership,
    });
  } finally {
    setAuthLoading(false);
  }
};

  const renderValidationIcon = (condition: boolean) =>
    condition ? (
      <IoCheckmark className="text-xl text-green-500 animate-modalContentSmooth" />
    ) : (
      <IoClose className="text-xl text-red-500 animate-modalContentSmooth" />
    );

  const renderInput = (
    id: keyof typeof formData,
    label: string,
    type:
      | "email"
      | "search"
      | "text"
      | "tel"
      | "url"
      | "none"
      | "numeric"
      | "decimal",
    autoComplete?: string,
    index?: number
  ) => (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span>{label}</span>
      <input
        id={id}
        type={type}
        required
        value={formData[id]}
        onChange={handleChange}
        autoComplete={autoComplete}
        inputMode={type}
        tabIndex={index}
        className="bg-white border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-2.5 px-6 outline-none text-base w-full"
        placeholder={label}
      />
    </label>
  );

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <form
        onSubmit={(e) => registerControl && handleRegister(e)}
        className="flex flex-col w-full h-full lg:gap-6 gap-3 justify-between"
      >
        <div className="flex flex-col lg:gap-8 gap-4 w-full lg:h-full h-max overflow-y-auto ltr:pr-3 rtl:pl-3">
          {renderInput("name", t("İsminiz"), "text", "given-name", 1)}
          {renderInput("email", t("E-Posta Adresiniz"), "email", "email", 2)}

          {["password", "passwordConfirm"].map((id, index) => (
            <label htmlFor={id} key={id} className="flex flex-col gap-4 w-full">
              {id === "password" && (
                <div className="flex w-full justify-between items-center">
                  <span>{t("Şifreniz")}</span>
                  <CustomButton
                    btnType="button"
                    leftIcon={
                      showPassword ? (
                        <IoEye className="text-xl animate-modalContentSmooth text-sitePrimary" />
                      ) : (
                        <IoEyeOff className="text-xl animate-modalContentSmooth" />
                      )
                    }
                    handleClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              )}
              {id === "passwordConfirm" && (
                <span>{t("Şifreniz (Tekrar)")}</span>
              )}
              <input
                id={id}
                type={showPassword ? "text" : "password"}
                required
                value={formData[id as keyof typeof formData]}
                onChange={handleChange}
                className="bg-white border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-2.5 px-6 outline-none text-base w-full"
                placeholder={
                  id === "password"
                    ? t("Şifrenizi giriniz")
                    : t("Şifreniz (Tekrar)")
                }
                autoComplete="off"
                tabIndex={3 + index}
              />
            </label>
          ))}

          {(password || passwordConfirm) && (
            <div className="flex flex-col gap-1.5 text-sm animate-sidebarBgSmooth origin-top-left">
              <div className="flex items-center gap-2">
                {renderValidationIcon(password.length >= 8)}
                <span>{t("Şifreniz, en az 8 karakter olmalıdır")} </span>
              </div>
              <div className="flex items-center gap-2">
                {renderValidationIcon(/\d/.test(password))}
                <span>{t("Şifrenizde en az 1 sayı olmalıdır")}</span>
              </div>
              <div className="flex items-center gap-2">
                {renderValidationIcon(/[A-Z]/.test(password))}
                <span>{t("Şifreniz, en az 1 büyük harf içermelidir")}</span>
              </div>
              <div className="flex items-center gap-2">
                {renderValidationIcon(passwordsMatch)}
                <span>{t("Şifreleriniz eşleşmelidir")}</span>
              </div>
            </div>
          )}

          <hr className="border-gray-200" />

          <div className="flex items-center gap-3 cursor-pointer group">
            <CustomButton
              title=""
              leftIcon={<IoCheckmark className="text-base" />}
              textStyles="hidden"
              btnType="button"
              containerStyles={`flex items-center justify-center gap-2 size-5 min-w-5 border rounded-md transition-all duration-300 ${
                acceptKVKK
                  ? "border-transparent bg-sitePrimary text-white"
                  : "border-gray-300 lg:group-hover:border-sitePrimary/50 text-transparent lg:group-hover:text-sitePrimary"
              }`}
              id="acceptKVKK"
              handleClick={() => setAcceptKVKK(!acceptKVKK)}
            />
            <label
              htmlFor="acceptKVKK"
              className={`transition-all duration-300 -mb-0.5 cursor-pointer select-none ${
                acceptKVKK
                  ? "text-sitePrimary"
                  : "lg:group-hover:text-sitePrimary"
              }`}
            >
              <p className="text-sm">
                <Link
                  className="font-medium text-gray-800 hover:text-blue-600 transition-all"
                  href="/policies/kvkk"
                >
                  {t("Kişisel Verilerin Korunması Kanunu")}
                </Link>{" "}
                <span className="font-normal">
                  {t("Okudum, Kabul Ediyorum")}
                </span>
              </p>
            </label>
          </div>

          <div className="flex items-center gap-3 cursor-pointer group">
            <CustomButton
              title=""
              leftIcon={<IoCheckmark className="text-base" />}
              textStyles="hidden"
              btnType="button"
              containerStyles={`flex items-center justify-center gap-2 size-5 min-w-5 border rounded-md transition-all duration-300 ${
                acceptMembership
                  ? "border-transparent bg-sitePrimary text-white"
                  : "border-gray-300 lg:group-hover:border-sitePrimary/50 text-transparent lg:group-hover:text-sitePrimary"
              }`}
              id="acceptMembership"
              handleClick={() => setAcceptMembership(!acceptMembership)}
            />
            <label
              htmlFor="acceptMembership"
              className={`transition-all duration-300 -mb-0.5 cursor-pointer select-none ${
                acceptMembership
                  ? "text-sitePrimary"
                  : "lg:group-hover:text-sitePrimary"
              }`}
            >
              <p className="text-sm">
                <Link
                  className="font-medium text-gray-800 hover:text-blue-600 transition-all"
                  href="/policies/membership"
                >
                  {t("Kullanıcı Sözleşmesi")}
                </Link>{" "}
                <span className="font-normal">
                  {t("Okudum, Kabul Ediyorum")}
                </span>
              </p>
            </label>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-gray-300"></div>
          <p className="font-[500]">{t("Ya da")}</p>
          <div className="h-[1px] flex-1 bg-gray-300"></div>
        </div>

        <div className="flex gap-4 text-base">
          {["Google", "Facebook"].map((provider, index) => (
            <div
              key={provider}
              className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer hover:bg-sitePrimary/10 hover:border-sitePrimary/10 hover:text-sitePrimary transition-all duration-300"
            >
              {index === 0 ? (
                <IoLogoGoogle className="text-4xl" />
              ) : (
                <IoLogoFacebook className="text-4xl" />
              )}
              <div className="flex flex-col items-start justify-center capitalize">
                <span className="font-medium text-sm">{provider}</span>
                <span className="font-light text-xs">{t("İle kayıt ol")}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex lg:flex-row flex-col items-center gap-2 w-full">
          <CustomButton
            title={t("Giriş Yap")}
            btnType="button"
            containerStyles="py-3 px-4 w-full rounded-md transition-all duration-300 bg-gray-200 hover:bg-gray-700 text-gray-600 hover:text-white lg:order-1 order-2"
            handleClick={() => setAuth("login")}
          />
          <CustomButton
            id="btnRegisterInRegisterPage"
            title={!authLoading ? t("Kayıt Ol") : t("Kayıt Olunuyor")}
            btnType="submit"
            containerStyles={`py-3 px-4 w-full rounded-md transition-all duration-300 lg:order-2 order-1 ${
              registerControl ? "opacity-100" : "opacity-50 !cursor-not-allowed"
            } ${
              !authLoading
                ? "bg-sitePrimary/80 hover:bg-sitePrimary text-white"
                : "bg-sitePrimary text-white hover:bg-sitePrimary"
            }`}
            isDisabled={!registerControl}
          />
        </div>
      </form>
    </div>
  );
}

export default Register;
