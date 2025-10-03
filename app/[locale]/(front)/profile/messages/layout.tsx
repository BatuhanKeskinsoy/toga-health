"use client";
import React, { useState, useEffect } from "react";
import { getMessages } from "@/lib/services/messages/messages";
import { Conversation } from "@/lib/types/messages/messages";
import ConversationList from "@/components/(front)/UserProfile/Inc/Messages/ConversationList";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { usePusherContext } from "@/lib/context/PusherContext";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface MessagesLayoutProps {
  children: React.ReactNode;
}

export default function MessagesLayout({ children }: MessagesLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSidebarStatus } = useGlobalContext();
  const { addConversationUpdateCallback, removeConversationUpdateCallback } = usePusherContext();
  const pathname = usePathname();
  const locale = useLocale();

  // URL'den conversation ID'sini çıkar
  const conversationId = pathname.split('/').pop();
  
  // conversationId'nin gerçek bir ID olup olmadığını kontrol et (sadece sayı olmalı)
  const isValidConversationId = conversationId && !isNaN(Number(conversationId));
  

  // Conversation'ları yükle
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await getMessages();
        setConversations(data);
      } catch (err: any) {
        console.error("Conversation'ları yüklerken hata:", err);
        setError("Mesajlar yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // URL'den conversation ID'sini al ve conversation'ı seç
  useEffect(() => {
    if (isValidConversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id.toString() === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        setSelectedConversation(null);
      }
    } else {
      setSelectedConversation(null);
    }
  }, [conversationId, conversations, isValidConversationId]);

  // Pusher ile anlık güncellemeleri dinle
  useEffect(() => {
    const handleMessageUpdate = async (data: any) => {
      if (data.conversation) {
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === data.conversation.id ? data.conversation : conv
          );
          return updated;
        });
      }
    };

    addConversationUpdateCallback(handleMessageUpdate);

    return () => {
      removeConversationUpdateCallback(handleMessageUpdate);
    };
  }, [addConversationUpdateCallback, removeConversationUpdateCallback]);

  // Body scroll'unu devre dışı bırak
  useEffect(() => {
    const scrollY = window.scrollY;
    
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] bg-white lg:rounded-lg lg:shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sitePrimary"></div>
              <p className="text-gray-600">Mesajlar yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] bg-white lg:rounded-lg lg:shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 text-6xl">⚠️</div>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // URL'den conversation ID'sini al
  const hasConversationId = isValidConversationId;

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white lg:rounded-lg lg:shadow-sm overflow-hidden">
      {/* Sol Panel - Conversation Listesi */}
      <div className={`${hasConversationId ? 'hidden lg:flex' : 'flex'} w-full lg:w-[340px] border-r border-gray-200 flex-col`}>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          isSidebar={false}
          setSidebarStatus={setSidebarStatus}
        />
      </div>

      {/* Sağ Panel - Children (ChatArea veya placeholder) */}
      <div className={`${hasConversationId ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
        {children}
      </div>
    </div>
  );
}
