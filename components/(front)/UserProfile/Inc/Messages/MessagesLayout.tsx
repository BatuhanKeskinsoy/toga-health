"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
        
        // Conversation'ları state'e kaydet
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

  // Pusher ile anlık güncellemeleri dinle (PusherContext'teki callback sistemi ile)
  useEffect(() => {
    const handleMessageUpdate = async (data: any) => {
      // Yeni mesaj geldiğinde conversation listesini güncelle
      if (data.conversation) {
        setConversations(prev => {
          const updated = prev.map(conv => 
            conv.id === data.conversation.id ? data.conversation : conv
          );
          return updated;
        });
      }
    };

    // PusherContext'teki message channel'ına callback ekle
    addConversationUpdateCallback(handleMessageUpdate);

    return () => {
      // Callback'i kaldır
      removeConversationUpdateCallback(handleMessageUpdate);
    };
  }, [addConversationUpdateCallback, removeConversationUpdateCallback]);

  // Conversation seçimi - artık Link ile yapılıyor, bu fonksiyon kaldırıldı

  // Body scroll'unu devre dışı bırak (sadece ana sayfa için)
  useEffect(() => {
    if (isSidebar) return; // Sidebar'da body scroll'u devre dışı bırakma
    
    // Mevcut scroll pozisyonunu kaydet
    const scrollY = window.scrollY;
    
    // Body'yi sabitle
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Cleanup - component unmount olduğunda scroll'u geri aç
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [isSidebar]);

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

  // Ana sayfa için normal layout
  return (
    <div className="flex h-[calc(100vh-200px)] bg-white lg:rounded-lg lg:shadow-sm overflow-hidden">
      {/* Sol Panel - Conversation Listesi */}
      <div className={`${selectedConversation ? 'hidden lg:flex' : 'flex'} w-full lg:w-[340px] border-r border-gray-200 flex-col`}>
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          isSidebar={false}
          setSidebarStatus={setSidebarStatus}
        />
      </div>

      {/* Sağ Panel - Chat Area */}
      <div className={`${selectedConversation ? 'flex' : 'hidden lg:flex'} flex-1 flex-col`}>
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
    </div>
  );
}
