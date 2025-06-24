"use client";
import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import Pusher from "pusher-js";
import { baseURL, pusherCluster, pusherKey } from "@/constants";
import { useUser } from "@/lib/hooks/auth/useUser";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { axios } from "@/lib/axios";

type ChannelEventHandler = (data: any) => void;

interface PusherContextType {
  subscribe: (channel: string, event: string, handler: ChannelEventHandler, isPrivate?: boolean) => void;
  unsubscribe: (channel: string, event: string, handler: ChannelEventHandler) => void;
  pusher: Pusher | null;
  notifications: NotificationItemTypes[];
  notificationsLoading: boolean;
  refetchNotifications: () => void;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ children }: { children: React.ReactNode }) => {
  const pusherRef = useRef<Pusher | null>(null);
  const { user, isLoading: userLoading } = useUser();
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  // Notification fetch logic
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setNotificationsLoading(true);
    try {
      const res = await axios.get(`/user/notifications`);
      setNotifications(
        res.data.notifications || res.data.data || res.data || []
      );
    } catch (e) {
      console.error("Bildirimleri çekerken hata:", e);
    } finally {
      setNotificationsLoading(false);
    }
  }, [user?.id]);

  // Notification subscribe logic
  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    if (!pusherRef.current) return;
    const handler = () => fetchNotifications();
    const channelName = `private-notifications.${user.id}`;
    const channel = pusherRef.current.subscribe(channelName);
    channel.bind("notification.sent", handler);
    return () => {
      channel.unbind("notification.sent", handler);
      channel.unsubscribe();
    };
  }, [user?.id, fetchNotifications]);

  // Pusher setup
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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

  const subscribe = useCallback((channelName: string, eventName: string, handler: ChannelEventHandler, isPrivate = true) => {
    if (!pusherRef.current) return;
    const channel = pusherRef.current.subscribe(channelName);
    channel.bind(eventName, handler);
  }, []);

  const unsubscribe = useCallback((channelName: string, eventName: string, handler: ChannelEventHandler) => {
    if (!pusherRef.current) return;
    const channel = pusherRef.current.channel(channelName);
    if (channel) channel.unbind(eventName, handler);
  }, []);

  // Eğer user yüklenmiyorsa children'ı render etme
  if (userLoading || !user) return null;

  return (
    <PusherContext.Provider
      value={{
        subscribe,
        unsubscribe,
        pusher: pusherRef.current,
        notifications,
        notificationsLoading,
        refetchNotifications: fetchNotifications,
      }}
    >
      {children}
    </PusherContext.Provider>
  );
};

export const usePusherContext = () => {
  const ctx = useContext(PusherContext);
  if (!ctx) throw new Error("usePusherContext must be used within PusherProvider");
  return ctx;
}; 