import React from "react";
import { useNotifications } from "@/lib/hooks/notifications/useNotifications";
import { NotificationItem } from "@/lib/types/notifications/NotificationTypes";
import { convertDate } from "@/lib/functions/getConvertDate";

function Notifications() {
  const { notifications, isLoading, isError } = useNotifications();

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Bildirimler yüklenemedi.</div>;
  if (!notifications.length) return <div>Hiç bildiriminiz yok.</div>;

  return (
    <div className="flex flex-col">
      {notifications.map((notification: NotificationItem, i: number) => (
        <div
          key={notification.id}
          className={`flex flex-col gap-2 lg:px-8 px-4 py-4 bg-sitePrimary/10 border-b last:border-b-0 border-gray-300 ${
            notification.read_at ? "opacity-60" : ""
          }`}
        >
          <div className="font-medium text-sitePrimary text-sm">
            {notification.data.title}
          </div>
          <div className="text-gray-700 text-xs">
            {notification.data.message}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 flex gap-2">
            <span>{convertDate(new Date(notification.created_at))}</span>
            {notification.read_at ? <span>Okundu</span> : <span>Okunmadı</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
