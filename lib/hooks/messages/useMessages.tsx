"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/axios";
import { Conversation, Message } from "@/lib/types/messages/messages";
import { usePusherContext } from "@/lib/context/PusherContext";

export function useMessages(userId?: string | number) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { subscribe, unsubscribe } = usePusherContext();

  const fetchConversations = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`/messaging/conversations`);
      setConversations(res.data.data.data || []);
    } catch (e) {
      console.error("Konuşmaları çekerken hata:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const handler = () => fetchConversations();
    const channelName = `private-messages.${userId}`;
    subscribe(channelName, "message.sent", handler, true);
    return () => {
      unsubscribe(channelName, "message.sent", handler);
    };
  }, [userId, subscribe, unsubscribe, fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useMessageCount(userId?: string | number) {
  const [messageCount, setMessageCount] = useState(0);
  const { subscribe, unsubscribe } = usePusherContext();

  const fetchMessageCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/user/profile`);
      setMessageCount(res.data.data?.message_count || 0);
    } catch (e) {
      console.error("Mesaj sayısını çekerken hata:", e);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const handler = () => fetchMessageCount();
    const channelName = `private-messages.${userId}`;
    subscribe(channelName, "message.sent", handler, true);
    return () => {
      unsubscribe(channelName, "message.sent", handler);
    };
  }, [userId, subscribe, unsubscribe, fetchMessageCount]);

  return { messageCount, refetch: fetchMessageCount };
}
