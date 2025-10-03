"use client";
import { useState } from "react";
import {
  sendCreateMessageConversation,
  sendMessage,
} from "@/lib/services/messages/messages";
import type { Conversation, Message } from "@/lib/types/messages/messages";

interface UseSendMessageReturn {
  isLoading: boolean;
  error: string | null;
  createConversationAndSendMessage: (
    receiverId: number,
    title: string,
    content: string
  ) => Promise<{ conversation: Conversation; message: Message } | null>;
}

export function useSendMessage(): UseSendMessageReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createConversationAndSendMessage = async (
    receiverId: number,
    title: string,
    content: string
  ): Promise<{ conversation: Conversation; message: Message } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Önce konuşma oluştur veya mevcut konuşmayı getir
      const conversation = await sendCreateMessageConversation({
        receiver_id: receiverId,
        title,
      });

      // 2. Mesajı gönder
      const message = await sendMessage({
        conversation_id: conversation.id,
        receiver_id: receiverId,
        content,
      });

      setIsLoading(false);
      return { conversation, message };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Bir hata oluştu";
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return {
    isLoading,
    error,
    createConversationAndSendMessage,
  };
}

