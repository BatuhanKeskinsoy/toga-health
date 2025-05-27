"use client";
import CustomButton from "@/components/others/CustomButton";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import React from "react";
import {
  IoChevronDownOutline,
  IoFlagOutline,
  IoLogInOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/[locale]/Context/store";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";

function Header() {
  const { setSidebarStatus } = useGlobalContext();
  const LANGS = [
    { code: "en", label: "English" },
    { code: "tr", label: "Türkçe" },
    { code: "ar", label: "عربي" },
  ];

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        <div className="flex gap-2 min-w-max items-center">
          <div className="relative sm:min-w-28 rounded-sm border border-gray-200 group hover:border-sitePrimary/10 hover:bg-sitePrimary hover:text-white transition-all duration-300">
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
          <CustomButton
            title={t("Giriş Yap")}
            leftIcon={<IoLogInOutline className="text-xl rtl:order-1" />}
            containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-1.5 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
            handleClick={() => setSidebarStatus("Auth")}
          />
        </div>
      </div>
      <Sidebar />
    </header>
  );
}

export default Header;
