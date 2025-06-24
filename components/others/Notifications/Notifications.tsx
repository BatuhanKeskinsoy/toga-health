"use client";
import React, { memo, useCallback } from "react";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePusherContext } from "@/lib/context/PusherContext";
import { notificationReadAll } from "@/lib/utils/notification/notificationReadAll";
import { useGlobalContext } from "@/app/Context/store";
import NotificationList from "./NotificationList";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import { useTranslations } from "next-intl";

function Notifications() {
  const { user } = useUser();
  const { notifications, notificationsLoading, refetchNotifications } = usePusherContext();
  const { mutateUser } = useUser();
  const { isMobile } = useGlobalContext();
  const t = useTranslations();

  const handleMarkAsReadAll = useCallback(async () => {
    try {
      await notificationReadAll();
      refetchNotifications();
      mutateUser();
    } catch (error) {
      console.error("Tüm bildirimleri okundu olarak işaretlerken hata:", error);
    }
  }, [refetchNotifications, mutateUser]);

  // Bildirimler her zaman görünsün, loading sadece overlay olarak çıksın
  return (
    <div className="relative flex flex-col pb-10">
      {notificationsLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sitePrimary"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      )}
      <MarkAllAsReadButton
        isReadAll={notifications.every((item) => item.read_at !== null)}
        onClick={handleMarkAsReadAll}
        isLoading={notificationsLoading}
        t={t}
      />
      <NotificationList
        notifications={notifications}
        mutateNotifications={refetchNotifications}
        mutateUser={mutateUser}
        isMobile={isMobile}
      />
    </div>
  );
}

export default memo(Notifications);
