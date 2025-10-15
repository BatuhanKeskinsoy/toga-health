"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { IoChatboxEllipsesOutline, IoSend } from "react-icons/io5";
import { replyToComment } from "@/lib/services/user/comments";
import { CustomInput } from "@/components/others/CustomInput";

interface InlineReplyFormProps {
  commentId: number;
  existingReply?: string;
  isUpdate?: boolean;
  onReplySuccess?: (replyText: string) => void;
}

export default function InlineReplyForm({ 
  commentId, 
  existingReply, 
  isUpdate = false,
  onReplySuccess
}: InlineReplyFormProps) {
  const router = useRouter();
  const [reply, setReply] = useState(existingReply || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reply.trim()) {
      setError("Lütfen bir yanıt yazınız.");
      return;
    }

    try {
      setLoading(true);
      await replyToComment(commentId, reply);
      
      // Callback ile parent component'e bildir
      if (onReplySuccess) {
        onReplySuccess(reply);
      }
      
      // Güncelleme modunda değilse input'u temizle
      if (!isUpdate) {
        setReply("");
      }
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Yanıt gönderilirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <CustomInput
        value={reply}
        icon={<IoChatboxEllipsesOutline />}
        onChange={(e) => setReply(e.target.value)}
        label={isUpdate ? "Yanıtınızı güncelleyin..." : "Yanıtınızı buraya yazınız..."}
      />
      <button
        type="submit"
        disabled={loading || !reply.trim()}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sitePrimary rounded-md hover:bg-sitePrimary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
      >
        {loading ? (
          isUpdate ? "Güncelleniyor..." : "Gönderiliyor..."
        ) : (
          <>
            <IoSend className="size-4 min-w-4" />
            <span>{isUpdate ? "Güncelle" : "Gönder"}</span>
          </>
        )}
      </button>
    </form>
  );
}
