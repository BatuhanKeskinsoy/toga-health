"use client";
import React from "react";
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

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Bildirimler yüklenemedi.</div>;
  if (!notifications.length) return <div>Hiç bildiriminiz yok.</div>;

  const isReadAll = notifications.every(
    (item) => item.read_at !== null
  );

  const handleMarkAsReadAll = async () => {
    try {
      await notificationReadAll();
      mutateNotifications();
      mutateUser();
    } catch (error) {
      console.error(error);
    }
  };

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

export default Notifications;
