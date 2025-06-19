import React from "react";
import { useNotifications } from "@/lib/hooks/Notifications/useNotifications";
import { NotificationItem } from "@/lib/types/notifications/NotificationTypes";

function Notifications() {
  const { notifications, isLoading, isError } = useNotifications();

  console.log(notifications);

  //if (isLoading) return <div>Yükleniyor...</div>;
  // if (isError) return <div>Bildirimler yüklenemedi.</div>;
   if (!notifications.data.length) return <div>Hiç bildiriminiz yok.</div>;


  return (
    <div className="flex flex-col gap-2">
      {notifications[0].data.map((notification: NotificationItem, i: number) => (
        <div key={notification.id} className={`p-3 border rounded-md bg-white shadow-sm ${notification.read_at ? "opacity-60" : ""}`}>
          <div className="font-semibold">{notification.data.title}</div>
          <div className="text-sm text-gray-700">{notification.data.message}</div>
          <div className="text-xs text-gray-400 mt-1 flex gap-2">
            <span>Tip: {notification.data.type}</span>
            <span>Oluşturulma: {new Date(notification.created_at).toLocaleString()}</span>
            {notification.read_at ? <span>Okundu</span> : <span>Okunmadı</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
