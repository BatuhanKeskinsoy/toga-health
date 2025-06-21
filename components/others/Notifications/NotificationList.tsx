import React from "react";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import NotificationItem from "./NotificationItem/NotificationItem";

interface NotificationListProps {
  notifications: NotificationItemTypes[];
  mutateNotifications: () => void;
  mutateUser: () => void;
  isMobile: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  mutateNotifications, 
  mutateUser, 
  isMobile 
}) => {
  return (
    <>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          mutateNotifications={mutateNotifications}
          mutateUser={mutateUser}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};

export default NotificationList; 