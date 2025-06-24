"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import Pusher from "pusher-js";
import { baseURL, pusherCluster, pusherKey } from "@/constants";
import { useUser } from "@/lib/hooks/auth/useUser";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { axios } from "@/lib/axios";
import { notificationRead } from "@/lib/utils/notification/notificationRead";
import { notificationReadAll } from "@/lib/utils/notification/notificationReadAll";

type ChannelEventHandler = (data: any) => void;

interface PusherContextType {
  subscribe: (
    channel: string,
    event: string,
    handler: ChannelEventHandler,
    isPrivate?: boolean
  ) => void;
  unsubscribe: (
    channel: string,
    event: string,
    handler: ChannelEventHandler
  ) => void;
  pusher: Pusher | null;
  notifications: NotificationItemTypes[];
  notificationsLoading: boolean;
  refetchNotifications: (userId?: string | number) => void;
  markAsRead: (notificationId: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {

  const pusherRef = useRef<Pusher | null>(null);
  const { user, isLoading: userLoading } = useUser();
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>(
    []
  );
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Notification fetch logic
  const fetchNotifications = useCallback(async (userId?: string | number) => {
    if (!userId) return;
    setNotificationsLoading(true);
    try {
      const res = await axios.get(`/user/notifications`);
      setNotifications(res.data.data);
    } catch (e) {
      console.error("Bildirimleri çekerken hata:", e);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  const refetchNotifications = (userId?: string | number) => {
    fetchNotifications(userId ?? user?.id);
  };

  useEffect(() => {
    if (!user || !user.id) {
      setNotificationsLoading(false);
      return;
    }
    setNotificationsLoading(true);
    fetchNotifications(user.id);
    if (!pusherRef.current) return;
    const handler = () => fetchNotifications(user.id);
    const channelName = `private-notifications.${user.id}`;
    const channel = pusherRef.current.subscribe(channelName);
    channel.bind("notification.sent", handler);
    return () => {
      channel.unbind("notification.sent", handler);
      channel.unsubscribe();
    };
  }, [user]);

  // Pusher setup
  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
      authEndpoint: `${baseURL}/pusher/auth`,
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });
    pusherRef.current = pusher;
    return () => {
      pusher.disconnect();
    };
  }, []);

  const subscribe = useCallback(
    (
      channelName: string,
      eventName: string,
      handler: ChannelEventHandler,
      isPrivate = true
    ) => {
      if (!pusherRef.current) return;
      const channel = pusherRef.current.subscribe(channelName);
      channel.bind(eventName, handler);
    },
    []
  );

  const unsubscribe = useCallback(
    (channelName: string, eventName: string, handler: ChannelEventHandler) => {
      if (!pusherRef.current) return;
      const channel = pusherRef.current.channel(channelName);
      if (channel) channel.unbind(eventName, handler);
    },
    []
  );

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: string | number) => {
      setNotificationsLoading(true);
      try {
        await notificationRead(String(notificationId));
        await fetchNotifications(user?.id);
      } catch (e) {
        console.error("Bildirim okundu işaretlenirken hata:", e);
      } finally {
        setNotificationsLoading(false);
      }
    },
    [user?.id, fetchNotifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      await notificationReadAll();
      await fetchNotifications(user?.id);
    } catch (e) {
      console.error("Tüm bildirimleri okundu işaretlerken hata:", e);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user?.id, fetchNotifications]);

  const contextValue = React.useMemo(
    () => ({
      subscribe,
      unsubscribe,
      pusher: pusherRef.current,
      notifications,
      notificationsLoading,
      refetchNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [
      subscribe,
      unsubscribe,
      notifications,
      notificationsLoading,
      refetchNotifications,
      markAsRead,
      markAllAsRead,
    ]
  );

  return (
    <PusherContext.Provider value={contextValue}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusherContext = () => {
  const ctx = useContext(PusherContext);
  if (!ctx)
    throw new Error("usePusherContext must be used within PusherProvider");
  return ctx;
};
