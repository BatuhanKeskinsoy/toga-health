"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMessages } from "@/lib/services/messages/messages";
import { Conversation } from "@/lib/types/messages/messages";
import ConversationList from "./ConversationList";
import ChatArea from "./ChatArea";

interface MessagesLayoutProps {
  conversationId?: string;
}

export default function MessagesLayout({ conversationId }: MessagesLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Conversation seçimi - artık Link ile yapılıyor, bu fonksiyon kaldırıldı

  // Body scroll'unu devre dışı bırak
  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-gray-600">Mesajlar yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm">
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

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Sol Panel - Conversation Listesi */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
        />
      </div>

      {/* Sağ Panel - Chat Area */}
      <div className="flex-1 flex flex-col">
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
