"use client";
import { useEffect, useState, useCallback } from "react";
import { axios } from "@/lib/axios";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { usePusherContext } from "@/lib/context/PusherContext";

export function useNotifications(userId?: string | number) {
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscribe, unsubscribe } = usePusherContext();

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/user/notifications`);
      setNotifications(
        res.data.notifications || res.data.data || res.data || []
      );
    } catch (e) {
      console.error("Bildirimleri çekerken hata:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const handler = () => fetchNotifications();
    const channelName = `private-notifications.${userId}`;
    subscribe(channelName, "notification.sent", handler, true);
    return () => {
      unsubscribe(channelName, "notification.sent", handler);
    };
  }, [userId, subscribe, unsubscribe, fetchNotifications]);

  return { notifications, loading, refetch: fetchNotifications };
}
