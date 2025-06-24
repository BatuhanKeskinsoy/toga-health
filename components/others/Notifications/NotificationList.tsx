import React, { useMemo } from "react";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import NotificationItem from "./NotificationItem/NotificationItem";

interface NotificationListProps {
  notifications: NotificationItemTypes[];
  mutateNotifications: () => void;
  markAsRead: (notificationId: string | number) => Promise<void>;
  mutateUser: () => void;
  isMobile: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  mutateNotifications, 
  markAsRead,
  mutateUser, 
  isMobile 
}) => {
  const memoizedNotifications = useMemo(() => notifications, [notifications]);
  return (
    <>
      {memoizedNotifications.map((notification, idx) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          mutateNotifications={mutateNotifications}
          markAsRead={markAsRead}
          mutateUser={mutateUser}
          isMobile={isMobile}
          isNew={idx === 0}
        />
      ))}
    </>
  );
};

export default NotificationList; 