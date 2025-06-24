"use client";
import React, { createContext, useContext } from "react";
import { useNotifications } from "@/lib/hooks/notifications/useNotifications";
import { useUser } from "@/lib/hooks/auth/useUser";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";

interface NotificationContextType {
  notifications: NotificationItemTypes[];
  loading: boolean;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { notifications, loading, refetch } = useNotifications(user?.id);

  return (
    <NotificationContext.Provider value={{ notifications, loading, refetch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used within NotificationProvider");
  return ctx;
}; 