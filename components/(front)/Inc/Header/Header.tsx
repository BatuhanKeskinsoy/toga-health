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

function Header() {
  const LANGS = [
    { code: "en", label: "English", flagSize: "text-xl" },
    { code: "tr", label: "Türkçe", flagSize: "text-lg" },
    { code: "ar", label: "عربي", flagSize: "text-lg" },
  ];

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  // Next.js 13 App Router için pathname ve query al
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const changeLanguage = (lang: string) => {
    if (lang === locale) return;

    const queryString = searchParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(url, { locale: lang });
  };

  return (
    <header className="shadow-md bg-white">
      <div className="h-20 flex items-center justify-between container mx-auto px-4 w-full">
        <Link
          href={"/"}
          title={t("Home")}
          className="relative h-20 flex items-center justify-center sm:w-[160px] w-[120px]"
        >
          <Image
            src={"/assets/logo/logo.svg"}
            alt="logo"
            width={160}
            height={0}
            className="absolute top-4 bg-white rounded-full shadow-lg"
          />
        </Link>
        <ul className="flex max-sm:hidden justify-center w-full items-center">
          <li>
            <Link
              href={"/"}
              title={t("Home")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("Home")}
            </Link>
          </li>
          <li>
            <Link
              href={"/"}
              title={t("About Us")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("About Us")}
            </Link>
          </li>
          <li>
            <Link
              href={"/contact"}
              title={t("Contact")}
              className="transition-all duration-300 px-2 hover:text-sitePrimary"
            >
              {t("Contact")}
            </Link>
          </li>
        </ul>
        <div className="flex gap-2 min-w-max items-center">
          <div className="relative sm:min-w-32 rounded-sm border border-gray-200 group hover:border-sitePrimary/10 hover:bg-sitePrimary hover:text-white transition-all duration-300">
            <CustomButton
              title={LANGS.find((l) => l.code === locale)?.label || "Language"}
              leftIcon={<IoFlagOutline className="text-xl" />}
              containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-between text-xs py-1.5 px-2"
              rightIcon={<IoChevronDownOutline className="text-base" />}
            />
            <ul className="absolute origin-top scale-y-0 group-hover:scale-100 transition-all duration-300 bg-white flex flex-col w-full shadow-md rounded-b-sm overflow-hidden border-gray-200 z-50">
              {LANGS.map(({ code, label, flagSize }) => (
                <li
                  key={code}
                  className="flex gap-1.5 border-b last:border-b-0 border-gray-200 cursor-pointer"
                  onClick={() => changeLanguage(code)}
                >
                  <CustomButton
                    title={label}
                    leftIcon={<IoFlagOutline className={flagSize} />}
                    containerStyles={`relative w-full overflow-hidden flex gap-1.5 items-center justify-between text-xs py-1.5 px-2
                      ${
                        locale === code
                          ? "bg-sitePrimary/20 text-sitePrimary font-semibold"
                          : "text-gray-600 hover:bg-sitePrimary/10 hover:text-sitePrimary"
                      }`}
                  />
                </li>
              ))}
            </ul>
          </div>
          <CustomButton
            title={t("Login")}
            leftIcon={<IoLogInOutline className="text-xl rtl:order-1" />}
            containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-1.5 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
