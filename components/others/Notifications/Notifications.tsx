"use client";
import React, { useState } from "react";
import { useNotifications } from "@/lib/hooks/notifications/useNotifications";
import NotificationItem from "@/components/others/Notifications/NotificationItem";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import CustomButton from "@/components/others/CustomButton";
import { useUser } from "@/lib/hooks/auth/useUser";
import { notificationReadAll } from "@/lib/utils/notification/notificationReadAll";
import { useGlobalContext } from "@/app/Context/store";

function Notifications() {
  const {
    notifications,
    isLoading,
    isError,
    mutate: mutateNotifications,
  } = useNotifications();
  const { mutateUser } = useUser();
  const { isMobile } = useGlobalContext();

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Bildirimler yüklenemedi.</div>;
  if (!notifications.length) return <div>Hiç bildiriminiz yok.</div>;

  const isReadAll = notifications.every(
    (item: NotificationItemTypes) => item.read_at !== null
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
    <div className="relative flex flex-col">
      <CustomButton
        containerStyles={`absolute right-0 top-0 text-[10px] px-3 py-1 bg-sitePrimary/10 text-sitePrimary hover:bg-sitePrimary hover:text-white rounded-bl-md z-10 transition-transform duration-300 ${
          isReadAll ? "translate-x-full" : "translate-x-0"
        }`}
        title="Tümünü Okundu Olarak İşaretle"
        handleClick={handleMarkAsReadAll}
      />
      {notifications.map((notification: NotificationItemTypes) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          mutateNotifications={mutateNotifications}
          mutateUser={mutateUser}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

export default Notifications;
