"use client";
import React, { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/lib/types/messages/messages";
import { getMessageDetail } from "@/lib/services/messages/messages";
import { convertDate } from "@/lib/functions/getConvertDate";
import { usePusherContext } from "@/lib/context/PusherContext";
import MessageInput from "./MessageInput";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { Link as I18nLink } from "@/i18n/navigation";
import Link from "next/link";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale } from "next-intl";

interface ChatAreaProps {
  conversation: Conversation;
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { pusher, serverUser } = usePusherContext();
  const locale = useLocale();
  // Mesajları yükle
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await getMessageDetail(conversation.id);
        // Mesajları tarih sırasına göre sırala (en eski üstte, en yeni altta)
        const sortedMessages = data.sort(
          (a, b) =>
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
    if (!pusher) {
      return;
    }

    const channelName = `private-conversation.${conversation.id}`;
    const channel = pusher.subscribe(channelName);

    const handleNewMessage = (data: any) => {
      // Yeni mesajı listeye ekle
      if (data.message) {
        setMessages((prev) => {
          // Aynı mesaj zaten varsa ekleme (duplicate kontrolü)
          const existingMessage = prev.find(
            (msg) => msg.id === data.message.id
          );
          if (existingMessage) {
            return prev;
          }

          const updated = [...prev, data.message];
          // Yeni mesaj eklendikten sonra sırala
          return updated.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
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

  // Mesaj gönderildiğinde listeye ekle (sadece kendi gönderdiğimiz mesajlar için)
  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => {
      // Aynı mesaj zaten varsa ekleme (duplicate kontrolü)
      const existingMessage = prev.find((msg) => msg.id === newMessage.id);
      if (existingMessage) {
        return prev;
      }

      const updated = [...prev, newMessage];
      // Yeni mesaj eklendikten sonra sırala
      return updated.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  };

  // Scroll'u en alta götür (her zaman instant)
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // scrollIntoView ile tam en alta git
      messagesEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "nearest",
      });
    }
  };

  // Mesajlar değiştiğinde scroll (instant)
  useEffect(() => {
    if (messages.length > 0) {
      // Gecikme ile scroll'u daha güvenilir hale getir
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [messages]);

  // İlk yüklemede scroll'u en alta götür (instant)
  useEffect(() => {
    if (!loading && messages.length > 0) {
      // Gecikme ile scroll'u daha güvenilir hale getir
      setTimeout(() => {
        scrollToBottom();
      }, 50);
    }
  }, [loading, messages.length]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sitePrimary mx-auto mb-4"></div>
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
          {/* Geri Butonu - Sadece mobilde görünür */}
          <I18nLink
            href={getLocalizedUrl("/profile/messages", locale)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </I18nLink>

          <div className="relative min-w-12 w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
            <ProfilePhoto
              photo={conversation.other_participant.image_url}
              name={conversation.other_participant.name}
              size={48}
              fontSize={16}
              responsiveSizes={{
                desktop: 48,
                mobile: 48,
              }}
              responsiveFontSizes={{
                desktop: 16,
                mobile: 16,
              }}
            />
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
                conversation={conversation}
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
  conversation: Conversation;
}

function MessageBubble({
  message,
  currentUserId,
  conversation,
}: MessageBubbleProps) {
  // API'den gelen is_sender değeri güvenilir olmayabilir,
  // sender_id ile mevcut kullanıcı ID'sini karşılaştırarak kontrol et
  const isSender = currentUserId
    ? message.sender_id === currentUserId
    : message.is_sender;

  // Sender bilgisi yoksa veya eksikse conversation'dan al
  const participant = isSender
    ? message.sender?.image_url
      ? message.sender
      : conversation.participant1?.id === currentUserId
      ? conversation.participant1
      : conversation.participant2
    : message.receiver || conversation.other_participant;

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isSender ? "flex-row-reverse" : "flex-row"
        } items-end gap-2`}
      >
        <div className="relative min-w-10 w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
          <ProfilePhoto
            photo={
              isSender
                ? participant?.image_url
                : conversation.other_participant.image_url
            }
            name={
              isSender
                ? participant?.name || "Kullanıcı"
                : conversation.other_participant.name
            }
            size={40}
            fontSize={16}
            responsiveSizes={{
              desktop: 40,
              mobile: 40,
            }}
            responsiveFontSizes={{
              desktop: 14,
              mobile: 14,
            }}
          />
        </div>

        {/* Message Content */}
        <div
          className={`flex flex-col gap-1 px-4 py-2 rounded-2xl ${
            isSender
              ? "bg-[#c02121] text-white rounded-br-md"
              : "bg-white text-gray-900 rounded-bl-md shadow-sm"
          }`}
        >
          <p className="text-sm">{message.content}</p>

          {/* File Attachment */}
          {message.file_url && (
            <div className="flex flex-col gap-2">
              {(() => {
                // Image kontrolü: file_type veya dosya uzantısından
                const isImage =
                  message.file_type?.startsWith("image/") ||
                  message.file_extension
                    ?.toLowerCase()
                    .match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ||
                  message.file_name
                    ?.toLowerCase()
                    .match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);

                return isImage ? (
                  <Link href={message.file_url} target="_blank">
                    <img
                      src={message.file_url}
                      alt="Attachment"
                      className="max-w-full h-auto rounded-lg border-4 border-gray-100/50 my-2"
                      onError={(e) => {
                        // Image yüklenemezse link olarak göster
                        e.currentTarget.style.display = "none";
                        const nextElement = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = "inline-flex";
                        }
                      }}
                    />
                  </Link>
                ) : (
                  <Link
                    href={message.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm underline"
                  >
                    <span>📎</span>
                    <span>{message.file_name}</span>
                  </Link>
                );
              })()}
            </div>
          )}

          {/* Timestamp */}
          <div
            className={`text-xs flex items-center gap-1 ${
              isSender
                ? "text-white/80 justify-end"
                : "text-gray-500 justify-start"
            }`}
          >
            <p>{convertDate(new Date(message.created_at))}</p>
          </div>
        </div>
        {isSender && (
          <div className="h-full flex items-center">
            <IoCheckmarkDoneOutline
              className={`text-xl ${
                message.is_read ? "text-blue-500" : "text-gray-400"
              } `}
            />
          </div>
        )}
      </div>
    </div>
  );
}
