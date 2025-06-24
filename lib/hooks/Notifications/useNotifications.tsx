"use client";
import { useEffect, useState, useCallback } from "react";
import Pusher from "pusher-js";
import { axios } from "@/lib/axios";
import { NotificationItemTypes } from "@/lib/types/notifications/NotificationTypes";
import { baseURL, pusherCluster, pusherKey } from "@/constants";

export function useNotifications(userId?: string | number) {
  const [notifications, setNotifications] = useState<NotificationItemTypes[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/user/notifications`);
      setNotifications(
        res.data.notifications || res.data.data || res.data || []
      );
    } catch (e) {
      // Hata yönetimi
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

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

    const channelName = `private-notifications.${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("notification.sent", () => {
      fetchNotifications();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, fetchNotifications]);

  return { notifications, loading, refetch: fetchNotifications };
}
