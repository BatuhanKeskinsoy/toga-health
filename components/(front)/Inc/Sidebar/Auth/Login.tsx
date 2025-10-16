"use client";
import CustomButton from "@/components/others/CustomButton";
import { CustomInput } from "@/components/others/CustomInput";
import GoogleOneTap from "@/components/others/GoogleOneTap";
import { useAuthHandler } from "@/lib/hooks/auth/useAuthHandler";
import { useTranslations } from "next-intl";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  IoCheckmark,
  IoEye,
  IoEyeOff,
  IoLockClosedOutline,
  IoLogoFacebook,
  IoLogoGoogle,
  IoMailOutline,
} from "react-icons/io5";

interface ILoginProps {
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setAuth: Dispatch<SetStateAction<string>>;
}

function Login({ authLoading, setAuthLoading, setAuth }: ILoginProps) {
  const t = useTranslations();
  const { login, forgotPassword } = useAuthHandler();

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("batuhankeskinsoy55@gmail.com");
  const [password, setPassword] = useState("Bk123456");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setAuthLoading(true);
    try {
      await login(email, password, rememberMe);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    setAuthLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      setAuthLoading(false);
    }
  };

  const loginControl = email !== "" && password !== "";

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <form
        onSubmit={(e) => loginControl && handleLogin(e)}
        className="flex flex-col w-full lg:gap-6 gap-3 h-full justify-between"
      >
        <div className="flex flex-col gap-4 w-full h-full">
          <CustomInput
            id="emailLogin"
            required
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            tabIndex={1}
            value={email}
            icon={<IoMailOutline />}
            label={t("E-Posta Adresiniz")}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <CustomInput
            id="passwordLogin"
            required
            type={showPassword ? "text" : "password"}
            name="passwordLogin"
            autoComplete="password"
            tabIndex={2}
            value={password}
            icon={<IoLockClosedOutline />}
            label={t("Şifrenizi giriniz")}
            onChange={(e: any) => setPassword(e.target.value)}
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
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 cursor-pointer py-1.5 group">
              <CustomButton
                title=""
                leftIcon={<IoCheckmark className="text-base" />}
                textStyles="hidden"
                btnType="button"
                containerStyles={`flex items-center justify-center gap-2 w-4 h-4 border rounded-md transition-all duration-300 ${
                  rememberMe
                    ? "border-transparent bg-sitePrimary text-white"
                    : "border-gray-300 lg:group-hover:border-sitePrimary/50 text-transparent lg:group-hover:text-sitePrimary"
                }`}
                id="rememberMe"
                handleClick={() => setRememberMe(!rememberMe)}
              />
              <label
                htmlFor="rememberMe"
                className={`transition-all duration-300 -mb-0.5 cursor-pointer select-none text-sm ${
                  rememberMe
                    ? "text-sitePrimary"
                    : "lg:group-hover:text-sitePrimary"
                }`}
              >
                {t("Beni Hatırla")}
              </label>
            </div>
            <CustomButton
              title={t("Şifremi Unuttum?")}
              containerStyles="text-xs tracking-wide min-w-max hover:text-sitePrimary transition-all duration-300"
              btnType="button"
              handleClick={handleForgotPassword}
            />
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-4">
          <div className="h-[1px] flex-1 bg-gray-300"></div>
          <p className="font-[500]">{t("Ya da")}</p>
          <div className="h-[1px] flex-1 bg-gray-300"></div>
        </div>

        <div className="flex gap-4 text-base">
          <GoogleOneTap
            mode="login"
            autoPrompt={false}
            onSuccess={() => {
              // Başarılı giriş sonrası işlemler
              console.log("Google ile giriş başarılı");
            }}
            onError={(error) => {
              console.error("Google giriş hatası:", error);
            }}
            className="w-full"
          />
          <div
            className="flex lg:gap-3 gap-4 items-center justify-center border border-gray-200 rounded-md px-2 py-3 w-full cursor-pointer hover:bg-sitePrimary/10 hover:border-sitePrimary/10 hover:text-sitePrimary transition-all duration-300"
          >
            <IoLogoFacebook className="text-4xl" />
            <div className="flex flex-col items-start justify-center capitalize">
              <span className="font-medium text-sm">Facebook</span>
              <span className="font-light text-xs">{t("İle giriş yap")}</span>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="flex lg:flex-row flex-col items-center gap-2 w-full">
          <CustomButton
            title={t("Kayıt Ol")}
            btnType="button"
            containerStyles={`py-3 px-4 w-full rounded-md transition-all duration-300 bg-gray-200 hover:bg-gray-700 text-gray-600 hover:text-white lg:order-1 order-2`}
            handleClick={() => setAuth("register")}
          />
          <CustomButton
            id="btnLoginInLoginPage"
            title={!authLoading ? t("Giriş Yap") : t("Giriş Yapılıyor")}
            btnType="submit"
            containerStyles={`py-3 px-4 w-full rounded-md transition-all duration-300 lg:order-2 order-1 ${
              loginControl ? "opacity-100" : "opacity-50 !cursor-not-allowed"
            } ${
              !authLoading
                ? "bg-sitePrimary/80 hover:bg-sitePrimary text-white"
                : "bg-sitePrimary text-white hover:bg-sitePrimary"
            }`}
            isDisabled={!loginControl}
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
