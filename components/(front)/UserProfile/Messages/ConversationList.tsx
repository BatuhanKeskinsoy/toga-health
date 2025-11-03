"use client";
import React, { useState } from "react";
import { Conversation } from "@/lib/types/messages/messages";
import { convertDate } from "@/lib/functions/getConvertDate";
import { Link, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import CustomInput from "@/components/Customs/CustomInput";
import { IoSearchOutline } from "react-icons/io5";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isSidebar?: boolean;
  setSidebarStatus: (status: string) => void;
}

export default function ConversationList({
  conversations,
  isSidebar = false,
  setSidebarStatus,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const router = useRouter();

  // URL'den aktif conversation ID'sini al
  React.useEffect(() => {
    const getCurrentConversationId = () => {
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        const id = pathname.split("/").pop();
        return id && !isNaN(Number(id)) ? id : null;
      }
      return null;
    };

    // İlk yükleme
    const initialId = getCurrentConversationId();
    setActiveConversationId(initialId);

    // URL değişikliklerini dinle
    const handleRouteChange = () => {
      const newId = getCurrentConversationId();
      if (newId !== activeConversationId) {
        setActiveConversationId(newId);
      }
    };

    // Browser navigation için
    window.addEventListener("popstate", handleRouteChange);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [router, activeConversationId]);

  // Arama filtresi
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.other_participant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.last_message_content
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Mesajlar</h2>
          {/* Arama */}
          <CustomInput
            type="text"
            icon={<IoSearchOutline />}
            label="Konuşma ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation Listesi */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="flex flex-col items-center gap-2">
              <div className="text-4xl">💬</div>
              <p className="text-sm">
                {searchTerm ? "Arama sonucu bulunamadı" : "Henüz mesajınız yok"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={(() => {
                  const selected =
                    activeConversationId &&
                    Number(activeConversationId) === conversation.id;
                  return selected;
                })()}
                isSidebar={isSidebar}
                setSidebarStatus={setSidebarStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isSidebar?: boolean;
  setSidebarStatus: (status: string) => void;
}

function ConversationItem({
  conversation,
  isSelected,
  isSidebar = false,
  setSidebarStatus,
}: ConversationItemProps) {
  const participant = conversation.other_participant;
  const lastMessage = conversation.last_message;
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  // Localized URL oluştur
  const linkHref = getLocalizedUrl("/profile/messages/[id]", locale, {
    id: conversation.id.toString(),
  });

  // Link'e tıklandığında sidebar'ı kapat (sadece sidebar'da)
  const handleLinkClick = () => {
    if (isSidebar) {
      setSidebarStatus("");
    }
  };

  return (
    <Link
      href={linkHref}
      onClick={handleLinkClick}
      className={`block p-4 cursor-pointer transition-colors border-b-0 group ${
        isSelected
          ? "bg-sitePrimary/5 border-r-4 border-sitePrimary"
          : "hover:bg-sitePrimary/5"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          <div
            className={`relative min-w-12 w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-md transition-all duration-300 ${
              !isSelected ? "group-hover:scale-105" : ""
            }`}
          >
            <ProfilePhoto
              photo={participant.image_url}
              name={participant.name}
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
          {conversation.unread_count > 0 && (
            <div className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-0.5 w-full">
          <h3
            className={`text-sm font-semibold line-clamp-1 transition-colors duration-300 ${
              isSelected
                ? "text-sitePrimary"
                : "text-gray-900 group-hover:text-sitePrimary"
            }`}
          >
            {participant.name}
          </h3>

          <div className="flex items-center justify-between">
            <p
              className={`text-sm line-clamp-2 ${
                conversation.unread_count > 0
                  ? "text-gray-900 font-medium"
                  : "text-gray-600"
              }`}
            >
              {conversation.last_message_content || "Henüz mesaj yok"}
            </p>

            {conversation.unread_count > 0 && (
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
            )}
          </div>

          {/* User Type Badge */}
          <div className="flex items-center justify-end w-full -mb-2.5">
            {lastMessage && (
              <span className="text-xs text-gray-400">
                {convertDate(new Date(lastMessage.created_at), fullLocale)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
