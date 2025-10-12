"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { IoChatboxEllipsesOutline, IoSend } from "react-icons/io5";
import { replyToComment } from "@/lib/services/user/comments";
import { CustomInput } from "@/components/others/CustomInput";

interface InlineReplyFormProps {
  commentId: number;
  commentAuthor: string;
}

export default function InlineReplyForm({
  commentId,
  commentAuthor,
}: InlineReplyFormProps) {
  const router = useRouter();
  const [reply, setReply] = useState("");
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
      setReply("");
      router.refresh(); // Sayfayı yenile
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Yanıt gönderilirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <CustomInput
          value={reply}
          icon={<IoChatboxEllipsesOutline />}
          onChange={(e) => setReply(e.target.value)}
          label="Yanıtınızı buraya yazınız..."
        />
        <button
          type="submit"
          disabled={loading || !reply.trim()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-sitePrimary rounded-lg hover:bg-sitePrimary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
        >
          {loading ? (
            "Gönderiliyor..."
          ) : (
            <>
              <IoSend className="size-4" />
              <span>Gönder</span>
            </>
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
