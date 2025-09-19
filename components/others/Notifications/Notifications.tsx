"use client";
import React, { memo, useCallback, useEffect } from "react";
import { useUser } from "@/lib/hooks/auth/useUser";
import { usePusherContext } from "@/lib/context/PusherContext";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import NotificationList from "./NotificationList";
import MarkAllAsReadButton from "./MarkAllAsReadButton";
import { useTranslations } from "next-intl";

interface NotificationsProps {
  serverUser?: any;
}

function Notifications({ serverUser }: NotificationsProps) {
  const { notifications, notificationsLoading, refetchNotifications, markAllAsRead, markAsRead, serverUser: contextServerUser } = usePusherContext();
  const { user, updateUser } = useUser({ serverUser: contextServerUser || serverUser });
  const { isMobile } = useGlobalContext();
  const t = useTranslations();

  console.log("🔔 Notifications: Component render edildi", {
    notifications: notifications.length,
    notificationsLoading,
    user: user?.id,
    contextServerUser: contextServerUser?.id,
    serverUser: serverUser?.id
  });

  // Component mount olduğunda notification'ları fetch et
  useEffect(() => {
    const activeUser = user || contextServerUser || serverUser;
    console.log("🔔 Notifications: useEffect çalıştı", {
      user: user?.id,
      contextServerUser: contextServerUser?.id,
      serverUser: serverUser?.id,
      activeUser: activeUser?.id
    });
    
    if (activeUser?.id) {
      console.log("🔔 Notifications: Fetching notifications for user:", activeUser.id);
      refetchNotifications(activeUser.id);
    } else {
      console.log("❌ Notifications: User ID bulunamadı, fetch iptal edildi");
    }
  }, [user?.id, contextServerUser?.id, serverUser?.id, refetchNotifications]);

  if (notificationsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full m-0.5 size-20 border-t-4 border-b-4 border-gray-400 group-hover:border-white"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col pb-10">
      {/* Sadece notifications varsa MarkAllAsReadButton'ı göster */}
      {notifications.length > 0 && (
        <MarkAllAsReadButton
          isReadAll={notifications.every((item) => item.read_at !== null)}
          onClick={markAllAsRead}
          isLoading={notificationsLoading}
          t={t}
        />
      )}
      <NotificationList
        notifications={notifications}
        mutateNotifications={refetchNotifications}
        markAsRead={markAsRead}
        mutateUser={updateUser}
        isMobile={isMobile}
      />
    </div>
  );
}

export default memo(Notifications);
