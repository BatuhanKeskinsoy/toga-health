"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { IoChatboxEllipsesOutline, IoSend } from "react-icons/io5";
import { replyToComment } from "@/lib/services/user/comments";
import { CustomInput } from "@/components/others/CustomInput";

interface InlineReplyFormProps {
  commentId: number;
  onReplySuccess?: (replyText: string) => void;
  existingReply?: any;
  isUpdate?: boolean;
}

export default function InlineReplyForm({
  commentId,
  onReplySuccess,
  existingReply,
  isUpdate = false,
}: InlineReplyFormProps) {
  const router = useRouter();
  const [reply, setReply] = useState(existingReply?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reply.trim()) {
      setError("Lütfen bir yanıt yazınız.");
      return;
    }

    if (reply.trim().length < 10) {
      setError("Yanıt en az 10 karakter olmalıdır.");
      return;
    }

    try {
      setLoading(true);
      await replyToComment(commentId, reply);

      // Callback ile parent component'e bildir
      if (onReplySuccess) {
        onReplySuccess(reply);
      }

      // Input'u temizle
      setReply("");
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Yanıt gönderilirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative w-full">
          <CustomInput
            value={reply}
            icon={<IoChatboxEllipsesOutline />}
            onChange={(e) => setReply(e.target.value)}
            label={
              isUpdate
                ? "Yanıtınızı düzenleyin..."
                : "Yanıtınızı buraya yazınız..."
            }
          />
          <div className="text-[10px] text-gray-500 absolute -bottom-2 right-3 bg-[#f9fafb] px-1">
            <span
              className={
                reply.trim().length < 10 ? "text-red-500" : "text-green-500"
              }
            >
              {reply.trim().length}
            </span>
            /10
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !reply.trim() || reply.trim().length < 10}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sitePrimary rounded-md hover:bg-sitePrimary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {loading ? (
            isUpdate ? (
              "Güncelleniyor..."
            ) : (
              "Gönderiliyor..."
            )
          ) : (
            <>
              <IoSend className="size-4 min-w-4" />
              <span>{isUpdate ? "Güncelle" : "Gönder"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
