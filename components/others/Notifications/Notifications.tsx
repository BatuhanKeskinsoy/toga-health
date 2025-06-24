"use client";
import React, { memo, useCallback } from "react";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePusherContext } from "@/lib/context/PusherContext";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import NotificationList from "./NotificationList";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import { useTranslations } from "next-intl";

function Notifications() {
  const { notifications, notificationsLoading, refetchNotifications, markAllAsRead, markAsRead } = usePusherContext();
  const { mutateUser } = useUser();
  const { isMobile } = useGlobalContext();
  const t = useTranslations();

  /* if (notificationsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full m-0.5 size-20 border-t-4 border-b-4 border-gray-400 group-hover:border-white"></div>
      </div>
    );
  } */

  return (
    <div className="relative flex flex-col pb-10">
      <MarkAllAsReadButton
        isReadAll={notifications.every((item) => item.read_at !== null)}
        onClick={markAllAsRead}
        isLoading={notificationsLoading}
        t={t}
      />
      <NotificationList
        notifications={notifications}
        mutateNotifications={refetchNotifications}
        markAsRead={markAsRead}
        mutateUser={mutateUser}
        isMobile={isMobile}
      />
    </div>
  );
}

export default memo(Notifications);
