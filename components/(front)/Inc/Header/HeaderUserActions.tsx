"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import {
  IoChatboxEllipsesOutline,
  IoLogInOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { usePusherContext } from "@/lib/context/PusherContext";
import { useUser } from "@/lib/hooks/auth/useUser";
import { useTranslations } from "next-intl";

const HeaderUserActions = () => {
  const { setSidebarStatus } = useGlobalContext();
  const {
    notificationsLoading,
    notificationCount,
    serverUser: contextServerUser,
  } = usePusherContext();
  const t = useTranslations();
  const { user } = useUser({ serverUser: contextServerUser });

  const unreadCount = notificationCount || user?.notification_count || 0;

  if (user) {
    return (
      <div className="flex lg:gap-3 gap-1.5 items-center h-full">
        <button
          className="border border-transparent rounded-md hover:border-sitePrimary/20 group relative flex items-center h-10 lg:px-1 lg:h-12 overflow-hidden rtl:order-2 text-xs hover:bg-sitePrimary/10 hover:text-sitePrimary transition-all duration-300"
          onClick={() => setSidebarStatus("Auth")}
        >
          <div className="relative w-10 min-w-10 h-10 overflow-hidden rounded-md">
            <ProfilePhoto
              user={user}
              size={40}
              fontSize={16}
              responsiveSizes={{ desktop: 40, mobile: 40 }}
              responsiveFontSizes={{ desktop: 16, mobile: 16 }}
            />
          </div>
          <div className="flex flex-col items-start px-2 max-lg:hidden">
            <span className="text-xs lg:text-sm font-medium">{user.name}</span>
            <span className="text-[10px] lg:text-xs text-gray-500">
              {user.user_type === "individual"
                ? "Kullanıcı"
                : user.user_type === "doctor"
                ? "Doktor"
                : "Kurumsal"}
            </span>
          </div>
        </button>
        <div className="h-full w-[1px] bg-gray-200"></div>
        <div className="flex gap-2 items-center h-full">
          <CustomButton
            leftIcon={
              <IoNotificationsOutline
                className={`text-4xl lg:text-5xl p-1.5 lg:p-2 h-full border-gray-200 border rounded-md hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 transition-all duration-200`}
              />
            }
            containerStyles="relative h-full"
            rightIcon={
              unreadCount > 0 ? (
                <div
                  className={`absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center transition-all duration-200 ${
                    notificationsLoading ? "scale-125" : ""
                  }`}
                >
                  {unreadCount}
                </div>
              ) : null
            }
            handleClick={() => setSidebarStatus("Notification")}
          />
          <CustomButton
            leftIcon={
              <IoChatboxEllipsesOutline className="text-4xl lg:text-5xl p-1.5 lg:p-2 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-200" />
            }
            containerStyles="relative h-full"
            rightIcon={
              user.message_count > 0 ? (
                <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                  {user.message_count}
                </div>
              ) : null
            }
          />
        </div>
        <div className="h-full w-[1px] bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex lg:gap-3 gap-1.5 items-center h-full">
      <CustomButton
        id="Login"
        title={t("Giriş Yap")}
        leftIcon={
          <IoLogInOutline className="text-xl lg:text-2xl rtl:order-1" />
        }
        containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 h-full items-center rounded-sm text-sm lg:text-base border border-gray-200 py-1 lg:py-3 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
        handleClick={() => setSidebarStatus("Auth")}
      />
      <div className="h-full w-[1px] bg-gray-200"></div>
    </div>
  );
};

export default HeaderUserActions;
