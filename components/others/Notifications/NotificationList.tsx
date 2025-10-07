import React, { useMemo } from "react";
import { NotificationItemTypes } from "../../../lib/types/notifications/notificationTypes";
import NotificationItem from "./NotificationItem/NotificationItem";
import { IoNotificationsOutline } from "react-icons/io5";

interface NotificationListProps {
  notifications: NotificationItemTypes[];
  mutateNotifications: () => void;
  markAsRead: (notificationId: string | number) => Promise<void>;
  isMobile: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  mutateNotifications,
  markAsRead,
  isMobile,
}) => {
  const memoizedNotifications = useMemo(() => notifications, [notifications]);
  
  // Boş notifications durumu
  if (memoizedNotifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <IoNotificationsOutline className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Henüz Bildirim Yok
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Yeni bildirimleriniz burada görünecek. Randevu onayları, hatırlatmalar ve diğer önemli güncellemeler için bu alanı takip edin.
        </p>
      </div>
    );
  }
  
  return (
    <>
      {memoizedNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          mutateNotifications={mutateNotifications}
          markAsRead={markAsRead}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};

export default NotificationList;
