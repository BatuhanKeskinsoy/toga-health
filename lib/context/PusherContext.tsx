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
  const [serverUser, setServerUser] = useState(initialServerUser);

  // Server user prop'u değiştiğinde state'i güncelle
  useEffect(() => {
    setServerUser(initialServerUser);
  }, [initialServerUser]);

  // Server user değiştiğinde notification count'u güncelle
  useEffect(() => {
    if (serverUser?.notification_count !== undefined) {
      setNotificationCount(serverUser.notification_count);
    }
  }, [serverUser?.notification_count]);

  // Notification fetch logic (sadece gerektiğinde)
  const fetchNotifications = useCallback(async (userId?: string | number) => {
    if (!userId) {
      return;
    }
    setNotificationsLoading(true);
    try {
      const res = await api.get(`/user/notifications`);
      setNotifications(res.data.data);

      // unread_count'u meta'dan al
      if (res.data.meta?.unread_count !== undefined) {
        setNotificationCount(res.data.meta.unread_count);
      }
    } catch (e) {
      console.error("❌ PusherContext: Bildirimleri çekerken hata:", e);
    } finally {
      setNotificationsLoading(false);
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

  // Pusher setup - sadece user varsa ve token varsa başlat
  // GEÇİCİ OLARAK KAPALI - Backend düzelince açılacak

  /* useEffect(() => {
    console.log("🔍 PusherContext: Pusher setup başlatılıyor...", {
      serverUser: serverUser?.id,
    });

    if (!serverUser?.id) {
      console.log("❌ PusherContext: User ID yok, Pusher kapatılıyor");
      // User yoksa Pusher'ı kapat
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    const token = getClientToken();
    console.log(
      "🔍 PusherContext: Token durumu:",
      token ? token : "Bulunamadı"
    );

    if (!token) {
      console.log("❌ PusherContext: Token yok, Pusher kapatılıyor");
      // Token yoksa Pusher'ı kapat
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
      return;
    }

    // Mevcut Pusher'ı kapat
    if (pusherRef.current) {
      console.log("🔍 PusherContext: Mevcut Pusher kapatılıyor");
      pusherRef.current.disconnect();
    }

    console.log("🔍 PusherContext: Yeni Pusher instance oluşturuluyor...", {
      pusherKey,
      pusherCluster,
      authEndpoint: `${baseURL}/pusher/auth`,
    });

    // Yeni token ile Pusher'ı başlat (private channel için auth gerekir)
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: `${baseURL}/pusher/auth`,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-User-ID": serverUser.id,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    });

    // Pusher event listener'ları ekle
    pusher.connection.bind("connected", () => {
      console.log("✅ PusherContext: Pusher bağlandı");
    });

    pusher.connection.bind("disconnected", () => {
      console.log("❌ PusherContext: Pusher bağlantısı kesildi");
    });

    pusher.connection.bind("error", (error: any) => {
      console.error("❌ PusherContext: Pusher hatası:", error);
      console.error(
        "❌ PusherContext: Error details:",
        JSON.stringify(error, null, 2)
      );
    });

    pusherRef.current = pusher;
    console.log("✅ PusherContext: Pusher instance oluşturuldu");

    return () => {
      console.log("🔍 PusherContext: Pusher cleanup");
      pusher.disconnect();
    };
  }, [serverUser?.id]); // serverUser.id değiştiğinde çalışır
 */
  // Notification channel subscription - Pusher'dan sonra
  // GEÇİCİ OLARAK KAPALI - Backend düzelince açılacak

  /*  useEffect(() => {
    console.log(
      "🔍 PusherContext: Notification channel subscription kontrolü...",
      {
        serverUser: serverUser?.id,
        pusherRef: !!pusherRef.current,
      }
    );

    if (!serverUser || !serverUser.id || !pusherRef.current) {
      console.log(
        "❌ PusherContext: Notification channel için gerekli koşullar sağlanmıyor"
      );
      setNotificationsLoading(false);
      return;
    }

    const handler = async (data: any) => {
      console.log("🔔 PusherContext: Notification event alındı:", data);

      // Önce notification'ları fetch et
      await fetchNotifications(serverUser.id);

      // Notification count'u güncelle
      try {
        const profileRes = await api.get("/user/profile");
        console.log(profileRes.data.data);
        if (profileRes.data.data?.notification_count !== undefined) {
          setNotificationCount(profileRes.data.data.notification_count);
          console.log(
            "🔍 PusherContext: Notification count güncellendi:",
            profileRes.data.data.notification_count
          );
        }
      } catch (error) {
        console.error("Notification count güncelleme hatası:", error);
      }
    };

    // Private channel kullan (auth gerektirir)
    const channelName = `private-notifications.${serverUser.id}`;
    console.log("🔍 PusherContext: Channel subscribe ediliyor:", channelName);

    const channel = pusherRef.current.subscribe(channelName);

    // Channel event listener'ları ekle
    channel.bind("pusher:subscription_succeeded", (data: any) => {
      console.log(
        "✅ PusherContext: Channel subscription başarılı:",
        channelName,
        data
      );
    });

    channel.bind("pusher:subscription_error", (error: any) => {
      console.error("❌ PusherContext: Channel subscription hatası:", error);
      console.error(
        "❌ PusherContext: Subscription error details:",
        JSON.stringify(error, null, 2)
      );
    });

    // Pusher state değişikliklerini takip et
    pusherRef.current.connection.bind("state_change", (states: any) => {
      console.log("🔍 PusherContext: Connection state değişti:", states);
    });

    channel.bind("notification.sent", handler);
    console.log("✅ PusherContext: Notification event listener eklendi");

    return () => {
      console.log("🔍 PusherContext: Channel cleanup");
      channel.unbind("notification.sent", handler);
      channel.unsubscribe();
    };
  }, [serverUser?.id, pusherRef.current, fetchNotifications]); */

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
        await fetchNotifications(serverUser?.id);

        // Notification count'u güncelle
        try {
          const profileRes = await api.get("/user/profile");
          if (profileRes.data.data?.notification_count !== undefined) {
            setNotificationCount(profileRes.data.data.notification_count);
          }
        } catch (error) {
          console.error(
            "❌ Mark as read sonrası notification count güncelleme hatası:",
            error
          );
        }
      } catch (e) {
        console.error("Bildirim okundu işaretlenirken hata:", e);
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
      await fetchNotifications(serverUser?.id);

      // Notification count'u güncelle
      try {
        const profileRes = await api.get("/user/profile");
        if (profileRes.data.data?.notification_count !== undefined) {
          setNotificationCount(profileRes.data.data.notification_count);
        }
      } catch (error) {
        console.error(
          "❌ Mark all as read sonrası notification count güncelleme hatası:",
          error
        );
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
