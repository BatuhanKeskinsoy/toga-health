"use client";
import React, { useState, useRef } from "react";
import { Conversation, Message } from "@/lib/types/messages/messages";
import { sendMessageWithoutFile, sendMessageWithFile } from "@/lib/services/messages/messages";
import { useSendMessage } from "@/lib/hooks/messages/useSendMessage";

interface MessageInputProps {
  conversation: Conversation;
  onMessageSent: (message: Message) => void;
}

export default function MessageInput({ conversation, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createConversationAndSendMessage } = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !selectedFile) return;
    
    setIsLoading(true);
    
    try {
      let newMessage: Message;
      
      if (selectedFile) {
        // File ile mesaj gönder
        newMessage = await sendMessageWithFile({
          conversation_id: conversation.id,
          receiver_id: conversation.other_participant.id,
          content: message.trim() || "",
          file: selectedFile,
        });
      } else {
        // Sadece text mesaj gönder
        newMessage = await sendMessageWithoutFile({
          conversation_id: conversation.id,
          receiver_id: conversation.other_participant.id,
          content: message.trim(),
        });
      }
      
      onMessageSent(newMessage);
      setMessage("");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Mesaj gönderilirken hata:", error);
      // Hata durumunda kullanıcıya bildirim gösterilebilir
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Dosya boyutu 5MB'dan büyük olamaz");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full">
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">📎</span>
            <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={1}
            style={{ minHeight: "48px", maxHeight: "120px" }}
            disabled={isLoading}
          />
          
          {/* Character Count */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-gray-400">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || isLoading}
          className="flex-shrink-0 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-2 text-xs text-gray-500">
        Enter tuşu ile gönder, Shift+Enter ile yeni satır
      </div>
    </div>
  );
}
