"use client";
import React, { useState, useEffect } from "react";
import { getMessages } from "@/lib/services/messages/messages";
import { Conversation } from "@/lib/types/messages/messages";
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import { usePusherContext } from "@/lib/context/PusherContext";

interface MessagesLayoutProps {
  conversationId?: string;
  isSidebar?: boolean;
}

export default function MessagesLayout({ conversationId, isSidebar }: MessagesLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSidebarStatus } = useGlobalContext();
  const { addConversationUpdateCallback, removeConversationUpdateCallback } = usePusherContext();

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
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id.toString() === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      } else {
        setSelectedConversation(null);
      }
    } else {
      setSelectedConversation(null);
    }
  }, [conversationId, conversations]);

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

  if (loading) {
    return (
      <div className={`flex ${isSidebar ? 'h-full' : 'h-[calc(100vh-200px)]'} ${!isSidebar ? 'bg-white lg:rounded-lg lg:shadow-sm' : ''}`}>
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
      <div className={`flex ${isSidebar ? 'h-full' : 'h-[calc(100vh-200px)]'} ${!isSidebar ? 'bg-white lg:rounded-lg lg:shadow-sm' : ''}`}>
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

  // Sidebar için sadece conversation listesi göster
  if (isSidebar) {
    return (
      <div className="flex h-full flex-col">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          isSidebar={true}
          setSidebarStatus={setSidebarStatus}
        />
      </div>
    );
  }

  // Ana sayfa için sadece ChatArea göster (layout'ta ConversationList zaten var)
  return (
    <div className="flex-1 flex-col">
      {selectedConversation ? (
        <ChatArea conversation={selectedConversation} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="text-gray-400 text-6xl">💬</div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold text-gray-700">
                  Bir konuşma seçin
                </h3>
                <p className="text-gray-500">
                  Sol taraftan bir kişi seçerek konuşmaya başlayın
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
