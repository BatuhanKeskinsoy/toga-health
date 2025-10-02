"use client";
import React, { useState } from "react";
import { Conversation } from "@/lib/types/messages/messages";
import { convertDate } from "@/lib/functions/getConvertDate";
import { getShortName } from "@/lib/functions/getShortName";
import { Link } from "@/i18n/navigation";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
}

export default function ConversationList({
  conversations,
  selectedConversation,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Arama filtresi
  const filteredConversations = conversations.filter(conversation =>
    conversation.other_participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.last_message_content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">Mesajlar</h2>
          
          {/* Arama */}
          <div className="relative">
          <input
            type="text"
            placeholder="Konuşma ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
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
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation?.id === conversation.id}
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
}

function ConversationItem({ conversation, isSelected }: ConversationItemProps) {
  const participant = conversation.other_participant;
  const lastMessage = conversation.last_message;
  
  return (
    <Link
      href={`/profil/mesajlarim/${conversation.id}` as any}
      className={`block p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-red-50 border-r-4 border-red-500" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-semibold text-lg">
            {getShortName(participant.name)}
          </div>
          {conversation.unread_count > 0 && (
            <div className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {conversation.unread_count > 9 ? "9+" : conversation.unread_count}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-sm font-semibold truncate ${
                isSelected ? "text-red-700" : "text-gray-900"
              }`}>
                {participant.name}
              </h3>
              {lastMessage && (
                <span className="text-xs text-gray-500">
                  {convertDate(new Date(lastMessage.created_at))}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <p className={`text-sm truncate ${
                conversation.unread_count > 0 ? "text-gray-900 font-medium" : "text-gray-600"
              }`}>
                {conversation.last_message_content || "Henüz mesaj yok"}
              </p>
              
              {conversation.unread_count > 0 && (
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
              )}
            </div>

            {/* User Type Badge */}
            <div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                participant.user_type === "doctor" 
                  ? "bg-blue-100 text-blue-800"
                  : participant.user_type === "corporate"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {participant.user_type === "doctor" && "👨‍⚕️ Doktor"}
                {participant.user_type === "corporate" && "🏥 Hastane"}
                {participant.user_type === "individual" && "👤 Bireysel"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
