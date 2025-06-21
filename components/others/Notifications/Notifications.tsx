"use client";
import React, { memo, useCallback } from "react";
import { useNotifications } from "@/lib/hooks/notifications/useNotifications";
import { useUser } from "@/lib/hooks/auth/useUser";
import { notificationReadAll } from "@/lib/utils/notification/notificationReadAll";
import { useGlobalContext } from "@/app/Context/store";
import NotificationList from "./NotificationList";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import { useTranslations } from "next-intl";

function Notifications() {
  const {
    notifications,
    isLoading,
    isError,
    mutate: mutateNotifications,
  } = useNotifications();
  const { mutateUser } = useUser();
  const { isMobile } = useGlobalContext();
  const t = useTranslations();

  const handleMarkAsReadAll = useCallback(async () => {
    try {
      await notificationReadAll();
      mutateNotifications();
      mutateUser();
    } catch (error) {
      console.error("Tüm bildirimleri okundu olarak işaretlerken hata:", error);
    }
  }, [mutateNotifications, mutateUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sitePrimary"></div>
        <span className="ml-2">Yükleniyor...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        <span>Bildirimler yüklenemedi.</span>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        <span>Hiç bildiriminiz yok.</span>
      </div>
    );
  }

  const isReadAll = notifications.every((item) => item.read_at !== null);

  return (
    <div className="relative flex flex-col pb-10">
      <MarkAllAsReadButton
        isReadAll={isReadAll}
        onClick={handleMarkAsReadAll}
        isLoading={false}
        t={t}
      />
      <NotificationList
        notifications={notifications}
        mutateNotifications={mutateNotifications}
        mutateUser={mutateUser}
        isMobile={isMobile}
      />
    </div>
  );
}

export default memo(Notifications);
