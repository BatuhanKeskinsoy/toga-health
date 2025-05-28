"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  IoChatboxEllipsesOutline,
  IoChevronDownOutline,
  IoFlagOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/[locale]/Context/store";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";
import { useUser } from "@/lib/hooks/auth/useUser";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import { getShortName } from "@/lib/functions/getShortName";

function Header() {
  const { setSidebarStatus } = useGlobalContext();
  const { logout } = useAuthHandler();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, isLoading } = useUser();

  const LANGS = [
    { code: "en", label: "English" },
    { code: "tr", label: "Türkçe" },
    { code: "ar", label: "عربي" },
  ];

  const changeLanguage = (lang: string) => {
    if (lang === locale) return;

    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { locale: lang });
  };

  return (
    <header className="shadow-md shadow-gray-200 bg-white">
      <div className="h-20 flex items-center justify-between container mx-auto px-4 w-full">
        <Link
          href={"/"}
          title={t("Anasayfa")}
          className="relative h-20 flex items-center justify-center sm:w-[150px] w-[120px]"
        >
          <Image
            src={"/assets/logo/logo.svg"}
            alt="logo"
            width={150}
            height={0}
            priority
            className="absolute top-4 bg-white rounded-full shadow-lg"
          />
        </Link>
        <ul className="flex max-sm:hidden justify-center w-full items-center">
          <li>
            <Link
              href={"/"}
              title={t("Anasayfa")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("Anasayfa")}
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              title={t("Hakkımızda")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("Hakkımızda")}
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              title={t("İletişim")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("İletişim")}
            </Link>
          </li>
        </ul>
        <div className="flex gap-4 min-w-max items-center">
          
          {isLoading ? (
            <div className="animate-spin rounded-full m-0.5 lg:size-6 size-4 border-t-2 border-b-2 border-gray-400 group-hover:border-white"></div>
          ) : user ? (
            <div className="flex gap-2 items-center h-8">
              <div className="flex items-center border h-full border-gray-200 hover:border-sitePrimary/10 rounded-full group">
                <CustomButton
                  title={user.name}
                  textStyles="px-2.5"
                  leftIcon={
                    <span className="flex items-center h-full justify-center rounded-full bg-sitePrimary/10 group-hover:bg-sitePrimary text-sitePrimary group-hover:text-white text-[12px] font-medium uppercase size-8 min-w-8 transition-all duration-300">
                      {getShortName(user.name)}
                    </span>
                  }
                  containerStyles="relative flex items-center h-full rounded-full rtl:order-2 text-xs group-hover:bg-sitePrimary/10 group-hover:text-sitePrimary"
                  handleClick={() => setSidebarStatus("Auth")}
                />
              </div>
              <CustomButton
                leftIcon={
                  <IoNotificationsOutline className="text-3xl p-[5px] h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-full transition-all duration-300" />
                }
                containerStyles="relative"
                rightIcon={
                  <div className="absolute -right-1 -top-2 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">13</div>
                }
              />
              <CustomButton
                leftIcon={
                  <IoChatboxEllipsesOutline className="text-3xl p-[5px] h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-full transition-all duration-300" />
                }
                containerStyles="relative"
                rightIcon={
                  <div className="absolute -right-1 -top-2 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">2</div>
                }
              />
              <CustomButton
                leftIcon={
                  <IoLogOutOutline className="text-3xl p-[5px] h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-full transition-all duration-300" />
                }
                handleClick={logout}
              />
              <div className="h-full w-[1px] bg-gray-200"></div>
            </div>
          ) : (
            <CustomButton
              title={t("Giriş Yap")}
              leftIcon={<IoLogInOutline className="text-xl rtl:order-1" />}
              containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-1.5 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
              handleClick={() => setSidebarStatus("Auth")}
            />
          )}
          <div className="relative sm:min-w-28 rounded-sm border border-gray-200 hover:border-sitePrimary/10 hover:bg-sitePrimary hover:text-white transition-all duration-300 group">
            <CustomButton
              title={LANGS.find((l) => l.code === locale)?.label || "Language"}
              leftIcon={<IoFlagOutline className="text-xl" />}
              containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-between text-xs py-1.5 px-2"
              rightIcon={<IoChevronDownOutline className="text-base" />}
            />
            <ul className="absolute origin-top scale-y-0 group-hover:scale-100 transition-all duration-300 bg-white flex flex-col w-full shadow-md rounded-b-sm overflow-hidden border-gray-200 z-50">
              {LANGS.filter(({ code }) => code !== locale).map(
                ({ code, label }) => (
                  <li
                    key={code}
                    className="flex gap-1.5 border-b last:border-b-0 border-gray-200 cursor-pointer"
                    onClick={() => changeLanguage(code)}
                  >
                    <CustomButton
                      title={label}
                      leftIcon={<IoFlagOutline className="text-lg" />}
                      containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-between text-xs py-1.5 px-2 text-gray-600 hover:bg-sitePrimary/10 hover:text-sitePrimary"
                    />
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      <Sidebar />
    </header>
  );
}

export default Header;
