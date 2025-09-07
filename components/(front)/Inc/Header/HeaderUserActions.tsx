"use client";
import React from "react";
import CustomButton from "@/components/others/CustomButton";
import {
  IoChatboxEllipsesOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { useAuthHandler } from "@/lib/utils/auth/useAuthHandler";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { usePusherContext } from "@/lib/context/PusherContext";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { useUser } from "@/lib/hooks/auth/useUser";

interface HeaderUserActionsProps {
  translations: {
    GirisYap: string;
  };
  user: UserTypes | null;
}

const HeaderUserActions: React.FC<HeaderUserActionsProps> = ({
  translations,
  user: propServerUser,
}) => {
  const { setSidebarStatus } = useGlobalContext();
  const { logout: clientLogout } = useAuthHandler();
  const { serverUser, notificationsLoading, notificationCount } =
    usePusherContext();
  const { user, clearUser } = useUser({ serverUser });

  const logout = async () => {
    await clientLogout();
    clearUser();
  };

  // Notification count'u PusherContext'ten al, yoksa user'dan al
  const unreadCount = notificationCount || user?.notification_count || 0;

  if (user) {
    return (
      <div className="flex lg:gap-3 gap-1.5 items-center h-9">
        <div className="flex items-center border h-full border-gray-200 hover:border-sitePrimary/20 rounded-[6px] group">
          <CustomButton
            title={user.name}
            textStyles="px-2.5 max-lg:hidden"
            leftIcon={
              <div className="relative w-9 h-9 overflow-hidden">
                <ProfilePhoto user={user} />
              </div>
            }
            containerStyles="relative flex items-center h-9 rounded-[7px] overflow-hidden rtl:order-2 text-xs group-hover:bg-sitePrimary/10 group-hover:text-sitePrimary"
            handleClick={() => setSidebarStatus("Auth")}
          />
        </div>
        <div className="h-full w-[1px] bg-gray-200"></div>
        <div className="flex gap-2 items-center h-full">
          <CustomButton
            leftIcon={
              <IoNotificationsOutline
                className={`text-4xl p-1.5 h-full border-gray-200 border rounded-md hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 transition-all duration-200`}
              />
            }
            containerStyles="relative"
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
              <IoChatboxEllipsesOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-200" />
            }
            containerStyles="relative"
            rightIcon={
              user.message_count > 0 ? (
                <div className="absolute -right-1 -top-1.5 size-4 text-[9px] bg-red-500 text-white rounded-full flex items-center justify-center">
                  {user.message_count}
                </div>
              ) : null
            }
          />
          <CustomButton
            leftIcon={
              <IoLogOutOutline className="text-4xl p-1.5 h-full border-gray-200 hover:bg-sitePrimary/10 hover:text-sitePrimary hover:border-sitePrimary/10 border rounded-md transition-all duration-200" />
            }
            handleClick={logout}
            containerStyles="max-lg:hidden"
          />
        </div>
        <div className="h-full w-[1px] bg-gray-200"></div>
      </div>
    );
  }

  return (
    <div className="flex lg:gap-3 gap-1.5 items-center h-9">
      <CustomButton
        id="Login"
        title={translations.GirisYap}
        leftIcon={<IoLogInOutline className="text-xl rtl:order-1" />}
        containerStyles="relative rtl:order-2 overflow-hidden flex gap-1.5 items-center rounded-sm text-sm border border-gray-200 py-2 px-3 rounded-lg hover:bg-sitePrimary hover:text-white hover:border-sitePrimary"
        handleClick={() => setSidebarStatus("Auth")}
      />
      <div className="h-full w-[1px] bg-gray-200"></div>
    </div>
  );
};

export default HeaderUserActions;
