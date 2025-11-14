"use client";

import { useState } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import CustomCheckbox from "@/components/Customs/CustomCheckbox";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { useTranslations } from "next-intl";

interface RejectCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notifyUser: boolean, reason: string) => Promise<void>;
  commentAuthor: string;
}

export default function RejectCommentModal({
  isOpen,
  onClose,
  onConfirm,
  commentAuthor,
}: RejectCommentModalProps) {
  const [notifyUser, setNotifyUser] = useState(true);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      funcSweetAlert({
        title: "Uyarı!",
        text: "Lütfen bir reddetme nedeni giriniz.",
        icon: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      await onConfirm(notifyUser, reason);
      setReason("");
      setNotifyUser(true);
      onClose();
    } catch (error) {
      // Error handling zaten parent'ta yapılıyor
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Yorumu Reddet")}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {commentAuthor} {t("yorumunu reddediyorsunuz")}
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CustomTextarea
          id="reason"
          name="reason"
          label={t("Reddetme Nedeni")}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          disabled={loading}
          required
        />

        {/* Notify User Checkbox */}
        <CustomCheckbox
          id="notifyUser"
          checked={notifyUser}
          onChange={setNotifyUser}
          label={t("Kullanıcıya bildirim gönder")}
          disabled={loading}
          color="error"
        />

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            btnType="button"
            handleClick={onClose}
            isDisabled={loading}
            containerStyles="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={t("İptal")}
          />
          <CustomButton
            btnType="submit"
            isDisabled={loading || !reason.trim()}
            containerStyles="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={loading ? t("Yükleniyor") : t("Reddet")}
          />
        </div>
      </form>
    </CustomModal>
  );
}

