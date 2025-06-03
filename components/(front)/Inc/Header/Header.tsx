"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IoChatboxEllipsesOutline,
  IoFlagOutline,
  IoLogInOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogOutOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { useGlobalContext } from "@/app/[locale]/Context/store";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";
import { useUser } from "@/lib/hooks/auth/useUser";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import { getShortName } from "@/lib/functions/getShortName";
import MarqueeBanner from "@/components/others/MarqueeBanner";

function Header() {
  const { setSidebarStatus, locale } = useGlobalContext();
  const { logout } = useAuthHandler();
  const t = useTranslations();

  const { user, isLoading } = useUser();
  return (
    <>
      <div className="bg-gray-200 w-full">
        <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
          <div className="lg:w-[65px] lg:min-w-[65px] w-[55px] min-w-[55px] max-lg:hidden" />
          <div className="relative overflow-hidden w-full h-full flex items-center">
            <MarqueeBanner
              speed={25}
              messages={
                "Türkiye'nin en iyi doktorlarında ve Türkiye'nin en çok tercih edilen hastanelerinde tedavi olun. Paketlerimizi tercih eden danışanlarımızı VIP araçlarımızla karşılıyor, en konforlu ve en güvenilir konaklama hizmetlerini sunuyoruz."
              }
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs min-w-max ltr:border-l rtl:border-r border-gray-300 px-2 *:hover:text-sitePrimary *:cursor-pointer *:transition-all *:duration-300">
            <IoLogoInstagram className="text-lg" />
            <IoLogoFacebook className="text-lg" />
            <FaXTwitter className="text-base" />
          </div>
        </div>
      </div>
      <header className="shadow-md shadow-gray-200 bg-white">
        <div className="h-20 flex items-center justify-between container mx-auto px-4 w-full">
          <Link
            href={"/"}
            title={t("Anasayfa")}
            className="relative lg:min-h-[130px] min-h-[110px] flex items-center justify-center lg:w-[130px] w-[110px] lg:min-w-[130px] min-w-[110px] transition-all duration-300"
          >
            <Image
              src="/assets/logo/logo.svg"
              alt="logo"
              fill
              priority
              className="object-cover bg-white rounded-full shadow-lg"
            />
          </Link>
          <ul className="flex max-lg:hidden justify-center w-full items-center">
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
          <div className="flex lg:gap-3 gap-1.5 min-w-max items-center">
            {isLoading ? (
              <div className="animate-spin rounded-full m-0.5 lg:size-6 size-4 border-t-2 border-b-2 border-gray-400 group-hover:border-white"></div>
            ) : user ? (
              <div className="flex lg:gap-3 gap-1.5 items-center h-10">
                <div className="flex items-center border h-full border-sitePrimary/10 hover:border-sitePrimary/20 rounded-md group">
                  <CustomButton
                    title={user.name}
                    textStyles="px-2.5 max-lg:hidden"
                    leftIcon={
                      <span className="flex items-center h-full justify-center ltr:lg:rounded-l-md ltr:lg:rounded-r-none rtl:lg:rounded-r-md rtl:lg:rounded-l-none rounded-md bg-sitePrimary/10 group-hover:bg-sitePrimary text-sitePrimary group-hover:text-white text-sm font-medium uppercase size-10 min-w-10 transition-all duration-300">
                        {getShortName(user.name)}
                      </span>
                    }
                    containerStyles="relative flex items-center h-full rounded-md rtl:order-2 text-xs group-hover:bg-sitePrimary/10 group-hover:text-sitePrimary"
                    handleClick={() => setSidebarStatus("Auth")}
                  />
                </div>
                <CustomButton
                  leftIcon={
                    <IoNotificationsOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-300" />
                  }
                  containerStyles="relative"
                  rightIcon={
                    <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                      13
                    </div>
                  }
                />
                <CustomButton
                  leftIcon={
                    <IoChatboxEllipsesOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-300" />
                  }
                  containerStyles="relative"
                  rightIcon={
                    <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                      2
                    </div>
                  }
                />
                <CustomButton
                  leftIcon={
                    <IoLogOutOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-300" />
                  }
                  handleClick={logout}
                  containerStyles="max-lg:hidden"
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
            <div className="relative lg:min-w-max rounded-md border border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 transition-all duration-300 group">
              <CustomButton
                title={locale}
                textStyles="text-sm font-medium uppercase"
                containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-between text-xs py-2 px-2"
                handleClick={() => setSidebarStatus("Lang")}
              />
            </div>
          </div>
        </div>
        <Sidebar />
      </header>
    </>
  );
}

export default Header;
