"use client";
import CustomButton from "@/components/others/CustomButton";
import { forgotPassword, login } from "@/lib/utils/auth/authServices";
import { useTranslations } from "next-intl";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  IoCheckmark,
  IoEye,
  IoEyeOff,
  IoLogoFacebook,
  IoLogoGoogle,
} from "react-icons/io5";
import { mutate } from "swr";

interface ILoginProps {
  authLoading: boolean;
  setAuthLoading: Dispatch<SetStateAction<boolean>>;
  setAuth: Dispatch<SetStateAction<string>>;
}

function Login({ authLoading, setAuthLoading, setAuth }: ILoginProps) {
  const t = useTranslations();

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("batuhankeskinsoy55@gmail.com");
  const [password, setPassword] = useState("12345678");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      const res = await login(email, password, rememberMe);

      if (res.status === 200) {
        const { firstName, lastName, email, role } = res.data.user;
        const userData = { firstName, lastName, email, role };

        document.cookie = `swr-auth-token=${res.data.token}; path=/; ${
          rememberMe ? "expires=Fri, 31 Dec 9999 23:59:59 GMT" : ""
        }`;

        mutate("/auth/user/profile", userData, false);
      } else {
        funcSweetAlert({
          title: "Giriş Yapılamadı!",
          text: res.data.errors[0],
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";

      funcSweetAlert({
        title: "Giriş Yapılamadı!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
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
      const res = await forgotPassword(email);

      if (res.status === 200) {
        funcSweetAlert({
          title: "İşlem Başarılı!",
          text: res.data.message,
          icon: "success",
          confirmButtonText: "Tamam",
        });
      } else {
        funcSweetAlert({
          title: "İşlem Başarısız!",
          text: res.data.errors[0],
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0] || "Bilinmeyen bir hata oluştu.";

      funcSweetAlert({
        title: "İşlem Başarısız!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Tamam",
      });
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
          <label htmlFor="emailLogin" className="flex flex-col gap-4 w-full">
            <span>{t("E-Posta Adresiniz")}</span>
            <input
              type="email"
              id="emailLogin"
              required
              className="bg-white border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-3 px-6 outline-none text-base lg:min-w-[350px] max-lg:w-full"
              placeholder={t("E-Posta Adresinizi giriniz")}
              value={email}
              autoComplete="email"
              inputMode="email"
              tabIndex={1}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label htmlFor="passwordLogin" className="flex flex-col gap-4 w-full">
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
            <input
              type={showPassword ? "text" : "password"}
              id="passwordLogin"
              required
              className="bg-white border border-gray-200 focus:border-sitePrimary/50 rounded-lg py-3 px-6 outline-none text-base lg:min-w-[350px] max-lg:w-full"
              placeholder={t("Şifrenizi giriniz")}
              value={password}
              tabIndex={2}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
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
                <span className="font-light text-xs">{t("İle giriş yap")}</span>
              </div>
            </div>
          ))}
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
