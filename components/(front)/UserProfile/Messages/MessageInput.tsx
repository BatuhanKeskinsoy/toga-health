"use client";
import React, { useState, useRef, useEffect } from "react";
import { Conversation, Message } from "@/lib/types/messages/messages";
import { sendMessage } from "@/lib/services/messages/messages";
import { useSendMessage } from "@/lib/hooks/messages/useSendMessage";
import CustomInput from "@/components/Customs/CustomInput";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";

interface MessageInputProps {
  conversation: Conversation;
  onMessageSent: (message: Message) => void;
}

export default function MessageInput({
  conversation,
  onMessageSent,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createConversationAndSendMessage } = useSendMessage();
  const t = useTranslations();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) return;

    // Mevcut değerleri sakla (hata durumunda geri yüklemek için)
    const currentMessage = message;
    const currentFile = selectedFile;

    setIsLoading(true);

    // Önce input'ları temizle (optimistic update)
    setMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    try {
      // Tek fonksiyon ile mesaj gönder (file ile veya file olmadan)
      const newMessage = await sendMessage({
        conversation_id: conversation.id,
        receiver_id: conversation.other_participant.id,
        content: currentMessage.trim() || "",
        file: currentFile || undefined,
      });

      // Mesaj başarıyla gönderildiyse callback'i çağır
      if (newMessage) {
        onMessageSent(newMessage);
      }
    } catch (error: any) {
      console.error("Mesaj gönderilirken hata:", error);
      // Hata durumunda değerleri geri yükle
      setMessage(currentMessage);
      setSelectedFile(currentFile);
      // Dosya input'unu geri yüklemek için state yeterli (onChange otomatik tetiklenir)
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

  // Dosya state'i null olduğunda input'u da temizle
  useEffect(() => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [selectedFile]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Selected File Preview */}
      {selectedFile && (
        <div className="p-3 bg-gray-100 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">📎</span>
            <span className="text-sm font-medium text-gray-700">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <button
            onClick={removeFile}
            className="text-red-500 hover:text-red-700 text-base"
          >
            ✕
          </button>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-12 lg:gap-2 gap-4">
        {/* File Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="lg:col-span-1 col-span-2 flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          disabled={isLoading}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
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
        <div className="lg:col-span-9 col-span-10 relative">
          <CustomInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            label={t("Mesajınızı yazın")}
            disabled={isLoading}
          />

          {/* Character Count */}
          {message.length > 0 && (
            <div className="absolute -bottom-2 right-2 text-xs text-gray-400 bg-[#f9fafb] px-2">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* Send Button */}
        <CustomButton
          btnType="submit"
          containerStyles="lg:col-span-2 col-span-12 flex items-center justify-center gap-2 px-4 py-3 bg-sitePrimary text-white rounded-md hover:bg-sitePrimary/80 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
          title={isLoading ? "Yükleniyor" : "Gönder"}
          leftIcon={
            isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )
          }
          isDisabled={(!message.trim() && !selectedFile) || isLoading}
        />
      </form>

      <div className="ml-auto text-xs text-gray-500">
        {t("Enter tuşu ile mesajı gönderir")}
      </div>
    </div>
  );
}
