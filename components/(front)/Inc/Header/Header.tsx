"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  IoChatboxEllipsesOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/store";
import Sidebar from "@/components/(front)/Inc/Sidebar/Sidebar";
import { useUser } from "@/lib/hooks/auth/useUser";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import MarqueeBanner from "@/components/others/MarqueeBanner";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getSocialIcon } from "@/lib/functions/getSocialIcon";
import { GeneralSettings } from "@/lib/types/generalsettings/generalsettingsTypes";
import { siteURL } from "@/constants";

function Header({ generals }: { generals: GeneralSettings }) {
  const { setSidebarStatus, locale } = useGlobalContext();
  const { logout } = useAuthHandler();
  const t = useTranslations();

  const { user, isLoading } = useUser();
  
  return (
    <div>
      <div className="bg-gray-200 w-full">
        <div className="container relative mx-auto px-2 flex items-center bg-gray-200 w-full h-9">
          <div className="lg:w-[65px] lg:min-w-[65px] w-[55px] min-w-[55px]" />
          <div className="relative overflow-hidden w-full h-full flex items-center">
            <MarqueeBanner speed={25} messages={generals.scrolling_text} />
          </div>
          <div className="flex items-center gap-2 text-xs min-w-max ltr:border-l rtl:border-r border-gray-300 px-2">
            {generals.social_media.map((social: any, key: number) => (
              <Link
                key={key}
                href={social.url}
                className="flex text-lg hover:text-sitePrimary transition-all duration-300"
                target="_blank"
              >
                {getSocialIcon(social.name)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <header className="shadow-md shadow-gray-200 bg-white">
        <div className="lg:h-20 h-16 flex items-center justify-between container mx-auto px-4 w-full">
          <Link
            href={"/"}
            title={t("Anasayfa")}
            className="relative lg:min-h-[130px] min-h-[115px] flex items-center justify-center lg:w-[130px] w-[115px] lg:min-w-[130px] min-w-[115px] transition-all duration-300"
          >
            <Image
              src={`${siteURL}/${generals.site_logo}`}
              alt="logo"
              fill
              priority
              sizes="(max-width: 1024px) 115px, 130px"
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
                href={"/aboutus"}
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
              <div className="flex lg:gap-3 gap-1.5 items-center h-9">
                <div className="flex items-center border h-full border-gray-200 hover:border-sitePrimary/20 rounded-[6px] group">
                  <CustomButton
                    title={user.name}
                    textStyles="px-2.5 max-lg:hidden"
                    leftIcon={<ProfilePhoto user={user} />}
                    containerStyles="relative flex items-center h-9 rounded-[7px] overflow-hidden rtl:order-2 text-xs group-hover:bg-sitePrimary/10 group-hover:text-sitePrimary"
                    handleClick={() => setSidebarStatus("Auth")}
                  />
                </div>
                <CustomButton
                  leftIcon={
                    <IoNotificationsOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-300" />
                  }
                  containerStyles="relative"
                  rightIcon={user.notification_count > 0 ? (
                    <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                      {user.notification_count}
                    </div>
                  ) : null}
                  handleClick={() => setSidebarStatus("Notification")}
                />
                <CustomButton
                  leftIcon={
                    <IoChatboxEllipsesOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-300" />
                  }
                  containerStyles="relative"
                  rightIcon={user.message_count > 0 ? (
                    <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                      {user.message_count}
                    </div>
                  ) : null}
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
                containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-2 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
                handleClick={() => setSidebarStatus("Auth")}
              />
            )}
            <div className="relative lg:min-w-max rounded-md border border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 transition-all duration-300 group">
              <CustomButton
                title={locale}
                textStyles="text-base font-medium uppercase"
                containerStyles="relative w-full overflow-hidden flex gap-1.5 items-center justify-betweenxs py-1.5 px-1.5"
                handleClick={() => setSidebarStatus("Lang")}
              />
            </div>
          </div>
        </div>
        <Sidebar />
      </header>
    </div>
  );
}

export default Header;
