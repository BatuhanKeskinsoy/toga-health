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
import api from "@/lib/axios";
import { notificationRead } from "@/lib/services/notification/notificationRead";
import { notificationReadAll } from "@/lib/services/notification/notificationReadAll";
import { getClientToken } from "@/lib/utils/cookies";
import { UserTypes } from "../types/user/UserTypes";
import { NotificationItemTypes } from "@/lib/types/notifications/notificationTypes";

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
  notificationCount: number;
  refetchNotifications: (userId?: string | number) => void;
  markAsRead: (notificationId: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  updateNotificationCount: (count: number) => void;
  messageCount: number;
  refetchMessageCount: (userId?: string | number) => void;
  updateMessageCount: (count: number) => void;
  serverUser: UserTypes; // Server user'ı context'te expose et
  updateServerUser: (user: any) => void; // Server user'ı güncellemek için
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({
  children,
  user: initialServerUser,
}: {
  children: React.ReactNode;
  user?: UserTypes;
}) => {
  const pusherRef = useRef<Pusher | null>(null);
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>(
    []
  );
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(
    initialServerUser?.notification_count || 0
  );
  const [messageCount, setMessageCount] = useState(
    initialServerUser?.message_count || 0
  );
  const [serverUser, setServerUser] = useState(initialServerUser);

  // Server user prop'u değiştiğinde state'i güncelle
  useEffect(() => {
    setServerUser(initialServerUser);
  }, [initialServerUser]);

  // Server user değiştiğinde notification ve message count'u güncelle
  useEffect(() => {
    if (serverUser?.notification_count !== undefined) {
      setNotificationCount(serverUser.notification_count);
    }
    if (serverUser?.message_count !== undefined) {
      setMessageCount(serverUser.message_count);
    }
  }, [serverUser?.notification_count, serverUser?.message_count]);

  // Notification fetch logic (sadece gerektiğinde)
  const fetchNotifications = useCallback(async (userId?: string | number) => {
    if (!userId) {
      return;
    }
    setNotificationsLoading(true);
    try {
      const res = await api.get(`/user/notifications`);
      const notifications = res.data.data;
      setNotifications(notifications);

      // Count'u notification'lardan hesapla (daha güvenilir)
      const unreadCount = notifications.filter(notification => !notification.read_at).length;
      setNotificationCount(unreadCount);
    } catch (e) {
      console.error("❌ PusherContext: Bildirimleri çekerken hata:", e);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  // Message count fetch logic
  const fetchMessageCount = useCallback(async (userId?: string | number) => {
    if (!userId) {
      return;
    }
    try {
      const res = await api.get(`/user/profile`);
      if (res.data.data?.message_count !== undefined) {
        setMessageCount(res.data.data.message_count);
      }
    } catch (e) {
      console.error("❌ PusherContext: Mesaj sayısını çekerken hata:", e);
    }
  }, []);

  const refetchNotifications = useCallback(
    (userId?: string | number) => {
      // User ID varsa onu kullan, yoksa server user'ı kullan
      const targetUserId = userId || serverUser?.id;
      if (targetUserId) {
        fetchNotifications(targetUserId);
      }
    },
    [serverUser?.id, fetchNotifications]
  );

  const refetchMessageCount = useCallback(
    (userId?: string | number) => {
      // User ID varsa onu kullan, yoksa server user'ı kullan
      const targetUserId = userId || serverUser?.id;
      if (targetUserId) {
        fetchMessageCount(targetUserId);
      }
    },
    [serverUser?.id, fetchMessageCount]
  );

  // Pusher setup - sadece user varsa ve token varsa başlat

  useEffect(() => {
    if (!serverUser?.id) {
      // User yoksa Pusher'ı kapat
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    const token = getClientToken();
    if (!token) {
      // Token yoksa Pusher'ı kapat
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    // Mevcut Pusher'ı kapat
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    // Yeni token ile Pusher'ı başlat (private channel için auth gerekir)
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: `${baseURL}/pusher/auth`,
      forceTLS: true,
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });


    pusher.connection.bind("error", (error: any) => {
      console.error("❌ PusherContext: Pusher hatası:", error);
    });

    pusherRef.current = pusher;

    return () => {
      pusher.disconnect();
    };
  }, [serverUser?.id]); // serverUser.id değiştiğinde çalışır

  // Notification channel subscription - Pusher'dan sonra
  useEffect(() => {
    if (!serverUser || !serverUser.id || !pusherRef.current) {
      setNotificationsLoading(false);
      return;
    }

    const notificationHandler = async (data: any) => {
      // Önce notification'ları fetch et
      await fetchNotifications(serverUser.id);

      // Notification count'u güncelle
      try {
        const profileRes = await api.get("/user/profile");
        if (profileRes.data.data?.notification_count !== undefined) {
          setNotificationCount(profileRes.data.data.notification_count);
        }
      } catch (error) {
        console.error("Notification count güncelleme hatası:", error);
      }
    };

    // Private channel kullan (auth gerektirir)
    const notificationChannelName = `private-notifications.${serverUser.id}`;
    const notificationChannel = pusherRef.current.subscribe(notificationChannelName);

    notificationChannel.bind("pusher:subscription_error", (error: any) => {
      console.error("❌ PusherContext: Notification channel subscription hatası:", error);
    });

    notificationChannel.bind("notification.sent", notificationHandler);

    return () => {
      notificationChannel.unbind("notification.sent", notificationHandler);
      notificationChannel.unsubscribe();
    };
  }, [serverUser?.id, pusherRef.current, fetchNotifications]);

  // Messages channel subscription - Pusher'dan sonra
  useEffect(() => {
    if (!serverUser || !serverUser.id || !pusherRef.current) {
      return;
    }

    const messageHandler = async (data: any) => {
      console.log("📨 PusherContext: Yeni mesaj alındı:", data);
      
      // Message count'u güncelle
      try {
        const profileRes = await api.get("/user/profile");
        if (profileRes.data.data?.message_count !== undefined) {
          setMessageCount(profileRes.data.data.message_count);
          // Server user'ı da güncelle
          setServerUser(prev => ({
            ...prev,
            message_count: profileRes.data.data.message_count
          }));
        }
      } catch (error) {
        console.error("Message count güncelleme hatası:", error);
      }
    };

    // Private channel kullan (auth gerektirir)
    const messageChannelName = `private-messages.${serverUser.id}`;
    const messageChannel = pusherRef.current.subscribe(messageChannelName);

    messageChannel.bind("pusher:subscription_error", (error: any) => {
      console.error("❌ PusherContext: Message channel subscription hatası:", error);
    });

    messageChannel.bind("message.sent", messageHandler);

    return () => {
      messageChannel.unbind("message.sent", messageHandler);
      messageChannel.unsubscribe();
    };
  }, [serverUser?.id, pusherRef.current]);

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
        // Notification'ları yenile (count otomatik güncellenecek)
        await fetchNotifications(serverUser?.id);
        
        // Server'dan güncel user bilgilerini çek ve notification count'u güncelle
        try {
          const profileRes = await api.get("/user/profile");
          if (profileRes.data.data?.notification_count !== undefined) {
            setNotificationCount(profileRes.data.data.notification_count);
            // Server user'ı da güncelle
            setServerUser(prev => ({
              ...prev,
              notification_count: profileRes.data.data.notification_count
            }));
          }
        } catch (error) {
          console.error("Notification count güncelleme hatası:", error);
        }
      } catch (e) {
        console.error("❌ PusherContext: Bildirim okundu işaretlenirken hata:", e);
      } finally {
        setNotificationsLoading(false);
      }
    },
    [serverUser?.id, fetchNotifications]
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setNotificationsLoading(true);
    try {
      await notificationReadAll();
      // Notification'ları yenile (count otomatik güncellenecek)
      await fetchNotifications(serverUser?.id);
      
      // Server'dan güncel user bilgilerini çek ve notification count'u güncelle
      try {
        const profileRes = await api.get("/user/profile");
        if (profileRes.data.data?.notification_count !== undefined) {
          setNotificationCount(profileRes.data.data.notification_count);
          // Server user'ı da güncelle
          setServerUser(prev => ({
            ...prev,
            notification_count: profileRes.data.data.notification_count
          }));
        }
      } catch (error) {
        console.error("Notification count güncelleme hatası:", error);
      }
    } catch (e) {
      console.error("Tüm bildirimleri okundu işaretlerken hata:", e);
    } finally {
      setNotificationsLoading(false);
    }
  }, [serverUser?.id, fetchNotifications]);

  // Notification count'u manuel güncellemek için
  const updateNotificationCount = useCallback((count: number) => {
    setNotificationCount(count);
  }, []);

  // Message count'u manuel güncellemek için
  const updateMessageCount = useCallback((count: number) => {
    setMessageCount(count);
  }, []);

  // Server user'ı güncellemek için
  const updateServerUser = useCallback((user: any) => {
    setServerUser(user);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      subscribe,
      unsubscribe,
      pusher: pusherRef.current,
      notifications,
      notificationsLoading,
      notificationCount,
      refetchNotifications,
      markAsRead,
      markAllAsRead,
      updateNotificationCount,
      messageCount,
      refetchMessageCount,
      updateMessageCount,
      serverUser,
      updateServerUser,
    }),
    [
      subscribe,
      unsubscribe,
      notifications,
      notificationsLoading,
      notificationCount,
      refetchNotifications,
      markAsRead,
      markAllAsRead,
      updateNotificationCount,
      messageCount,
      refetchMessageCount,
      updateMessageCount,
      serverUser,
      updateServerUser,
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
