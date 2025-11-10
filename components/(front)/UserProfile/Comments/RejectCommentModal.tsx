"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

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

  // Modal açıldığında scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-md shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Yorumu Reddet
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {commentAuthor} kullanıcısının yorumunu reddediyorsunuz
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reddetme Nedeni
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder="Yorumun reddedilme nedenini belirtiniz"
                disabled={loading}
              />
            </div>

            {/* Notify User Checkbox */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyUser}
                  onChange={(e) => setNotifyUser(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">
                  Kullanıcıya bildirim gönder
                </span>
              </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading || !reason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Yükleniyor" : "Reddet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

