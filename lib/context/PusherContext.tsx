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
// import { useUser } from "@/lib/hooks/auth/useUser"; // Kaldırıldı
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { axios } from "@/lib/axios";
import { notificationRead } from "@/lib/utils/notification/notificationRead";
import { notificationReadAll } from "@/lib/utils/notification/notificationReadAll";
import { getClientToken } from "@/lib/utils/cookies";

type ChannelEventHandler = (data: any) => void;

interface PusherContextType {
  user: any; // Server-side'dan gelen user
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
  notificationCount: number; // Server-side'dan gelen count
  messageCount: number; // Server-side'dan gelen count
  refetchNotifications: (userId?: string | number) => void;
  markAsRead: (notificationId: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  mutateUser: (newUser: any) => void;
}

const PusherContext = createContext<PusherContextType | undefined>(undefined);

export const PusherProvider = ({ 
  children, 
  user: serverUser 
}: { 
  children: React.ReactNode;
  user?: any;
}) => {

  const pusherRef = useRef<Pusher | null>(null);
  // Client-side user state'i
  const [clientUser, setClientUser] = useState<any>(null);
  
  // Client-side user'ı öncelikle kullan (real-time güncellenir), yoksa server-side user'ı kullan
  const user = clientUser || serverUser;

  // Server-side user'ı client-side'a senkronize et
  useEffect(() => {
    if (serverUser && !clientUser) {
      setClientUser(serverUser);
    }
  }, [serverUser, clientUser]);

  const [notifications, setNotifications] = useState<NotificationItemTypes[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false); // Artık loading yok

  // Server-side'dan gelen notification_count'u kullan
  const notificationCount = user?.notification_count || 0;
  const messageCount = user?.message_count || 0;

  // Notification fetch logic (sadece gerektiğinde)
  const fetchNotifications = useCallback(async (userId?: string | number) => {
    if (!userId) {
      return;
    }
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

  const refetchNotifications = useCallback((userId?: string | number) => {
    // User ID varsa onu kullan, yoksa mevcut user'ı kullan
    const targetUserId = userId || user?.id;
    if (targetUserId) {
      fetchNotifications(targetUserId);
    }
  }, [user?.id, fetchNotifications]);

  // Notification channel subscription - Pusher'dan sonra
  useEffect(() => {
    if (!user || !user.id || !pusherRef.current) {
      setNotificationsLoading(false);
      return;
    }
    
    const handler = async () => {
      // Önce notification'ları fetch et
      await fetchNotifications(user.id);
      
      // Sonra profile API'sinden güncel user verisini çek
      try {
        const profileRes = await axios.get('/user/profile');
        
        // User'ı güncelle
        if (profileRes.data.user) {
          setClientUser(profileRes.data.user);
        }
      } catch (error) {
        console.error('❌ Profile API hatası:', error);
      }
    };
    const channelName = `private-notifications.${user.id}`;
    const channel = pusherRef.current.subscribe(channelName);
    channel.bind("notification.sent", handler);
    
    return () => {
      channel.unbind("notification.sent", handler);
      channel.unsubscribe();
    };
  }, [user?.id, pusherRef.current, fetchNotifications]);

  // Pusher setup - tek useEffect ile
  useEffect(() => {
    if (!user?.id) return;

    const token = getClientToken();
    if (!token) return;

    // Mevcut Pusher'ı kapat
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

      // Yeni token ile Pusher'ı başlat
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
        forceTLS: true,
        authEndpoint: `${baseURL}/pusher/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
      pusherRef.current = pusher;
      
    return () => {
      pusher.disconnect();
    };
  }, [user?.id]); // user.id değiştiğinde çalışır

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
      user, // Server-side'dan gelen user
      subscribe,
      unsubscribe,
      pusher: pusherRef.current,
      notifications,
      notificationsLoading,
      notificationCount, // Server-side'dan gelen count
      messageCount, // Server-side'dan gelen count
      refetchNotifications,
      markAsRead,
      markAllAsRead,
      mutateUser: setClientUser,
    }),
    [
      user,
      clientUser,
      subscribe,
      unsubscribe,
      notifications,
      notificationsLoading,
      notificationCount,
      messageCount,
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
