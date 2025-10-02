"use client";
import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/lib/types/messages/messages";
import { getMessageDetail } from "@/lib/services/messages/messages";
import { convertDate } from "@/lib/functions/getConvertDate";
import { getShortName } from "@/lib/functions/getShortName";
import { usePusherContext } from "@/lib/context/PusherContext";
import MessageInput from "./MessageInput";

interface ChatAreaProps {
  conversation: Conversation;
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { pusher, serverUser } = usePusherContext();

  // Mesajları yükle
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessageDetail(conversation.id);
        // Mesajları tarih sırasına göre sırala (en eski üstte, en yeni altta)
        const sortedMessages = data.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(sortedMessages);
      } catch (err: any) {
        console.error("Mesajlar yüklenirken hata:", err);
        setError("Mesajlar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation.id]);

  // Pusher ile yeni mesajları dinle
  useEffect(() => {
    if (!pusher) return;

    const channelName = `private-conversations.${conversation.id}`;
    const channel = pusher.subscribe(channelName);

    const handleNewMessage = (data: any) => {
      console.log("Yeni mesaj alındı:", data);
      // Yeni mesajı listeye ekle
      if (data.message) {
        setMessages((prev) => {
          const updated = [...prev, data.message];
          // Yeni mesaj eklendikten sonra sırala
          return updated.sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      }
    };

    channel.bind("message.sent", handleNewMessage);

    return () => {
      channel.unbind("message.sent", handleNewMessage);
      channel.unsubscribe();
    };
  }, [pusher, conversation.id]);

  // Mesaj gönderildiğinde listeye ekle
  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      // Yeni mesaj eklendikten sonra sırala
      return updated.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  };

  // Scroll'u en alta götür
  const scrollToBottom = (smooth = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: smooth ? "smooth" : "instant",
        block: "end"
      });
    }, 100);
  };

  // Mesajlar değiştiğinde scroll (smooth)
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [messages]);

  // İlk yüklemede scroll'u en alta götür (instant)
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom(false);
    }
  }, [loading, messages.length]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Mesajlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold">
            {getShortName(conversation.other_participant.name)}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {conversation.other_participant.name}
            </h3>
            <p className="text-sm text-gray-500">
              {conversation.other_participant.user_type === "doctor" &&
                "👨‍⚕️ Doktor"}
              {conversation.other_participant.user_type === "corporate" &&
                "🏥 Hastane"}
              {conversation.other_participant.user_type === "individual" &&
                "👤 Bireysel"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 bg-gray-50">
        <div className="flex flex-col gap-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <div className="text-4xl">💬</div>
                <div className="flex flex-col gap-2">
                  <p>Henüz mesaj yok</p>
                  <p className="text-sm">İlk mesajı siz gönderin!</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                currentUserId={serverUser?.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col gap-3">
          <MessageInput
            conversation={conversation}
            onMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  currentUserId?: number;
}

function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  // API'den gelen is_sender değeri güvenilir olmayabilir, 
  // sender_id ile mevcut kullanıcı ID'sini karşılaştırarak kontrol et
  const isSender = currentUserId ? message.sender_id === currentUserId : message.is_sender;
  const participant = isSender ? message.sender : message.receiver;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isSender ? "flex-row-reverse" : "flex-row"
        } items-end gap-2`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
        >
          {participant ? getShortName(participant.name) : "?"}
        </div>

        {/* Message Content */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSender
              ? "bg-red-500 text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm">{message.content}</p>

          {/* File Attachment */}
          {message.file_url && (
            <div className="flex flex-col gap-2">
              {message.file_type?.startsWith("image/") ? (
                <img
                  src={message.file_url}
                  alt="Attachment"
                  className="max-w-full h-auto rounded-lg"
                />
              ) : (
                <a
                  href={message.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm underline"
                >
                  <span>📎</span>
                  <span>{message.file_name}</span>
                </a>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1">
            <p
              className={`text-xs ${
                isSender ? "text-red-100" : "text-gray-500"
              }`}
            >
              {convertDate(new Date(message.created_at))}
            </p>
            {message.is_read && isSender && <span>✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
