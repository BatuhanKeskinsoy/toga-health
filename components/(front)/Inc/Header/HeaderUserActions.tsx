"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import {
  IoChatboxEllipsesOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/store";
import { useUser } from "@/lib/hooks/auth/useUser";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import ProfilePhoto from "@/components/others/ProfilePhoto";

interface HeaderUserActionsProps {
  translations: {
    GirisYap: string;
  };
}

const HeaderUserActions: React.FC<HeaderUserActionsProps> = ({ translations }) => {
  const { setSidebarStatus, locale } = useGlobalContext();
  const { logout } = useAuthHandler();
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="animate-spin rounded-full m-0.5 lg:size-6 size-4 border-t-2 border-b-2 border-gray-400 group-hover:border-white"></div>
    );
  }

  if (user) {
    return (
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
    );
  }

  return (
    <CustomButton
      title={translations.GirisYap}
      leftIcon={<IoLogInOutline className="text-xl rtl:order-1" />}
      containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-2 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
      handleClick={() => setSidebarStatus("Auth")}
    />
  );
};

export default HeaderUserActions; 