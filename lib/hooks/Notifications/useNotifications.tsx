"use client";
import { useEffect, useState, useCallback } from "react";
import Pusher from "pusher-js";
import { axios } from "@/lib/axios";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { baseURL } from "@/constants";

const PUSHER_KEY = "49c1649a36e98e50a346";
const PUSHER_CLUSTER = "eu";

export function useNotifications(userId?: string | number) {
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>([]);
  const [loading, setLoading] = useState(true);

  // Eski bildirimleri çek
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/user/notifications`);
      setNotifications(res.data.notifications || []);
    } catch (e) {
      // Hata yönetimi
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    // Token'ı localStorage'dan al
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Pusher ile dinle
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
      authEndpoint: `${baseURL}/pusher/auth`,
      auth: {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      },
    });

    pusher.connection.bind('connected', () => {
      console.log("[PUSHER] WebSocket bağlantısı açıldı.");
    });
    pusher.connection.bind('disconnected', () => {
      console.warn("[PUSHER] WebSocket bağlantısı kapandı.");
    });
    pusher.connection.bind('error', (err: any) => {
      console.error("[PUSHER] WebSocket bağlantı hatası:", err);
    });

    const channelName = `private-notifications.${userId}`;
    console.log(`[PUSHER] Kanal dinleniyor: ${channelName}`);
    const channel = pusher.subscribe(channelName);

    channel.bind("notification.sent", (data: any) => {
      // Pusher event'ini NotificationItemTypes tipine dönüştür
      const notification: NotificationItemTypes = {
        id: data.id || data.notification.id || data.timestamp || String(Date.now()),
        type: data.notification.type,
        notifiable_type: "User",
        notifiable_id: userId as number,
        data: data.notification,
        read_at: null,
        created_at: data.timestamp || new Date().toISOString(),
        updated_at: data.timestamp || new Date().toISOString(),
      };
      console.warn("YENİ BİLDİRİM GELDİ:", notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
      console.log("[PUSHER] WebSocket bağlantısı kapatıldı ve kanal aboneliği iptal edildi.");
    };
  }, [userId, fetchNotifications]);

  return { notifications, loading, refetch: fetchNotifications };
}
