"use client";
import React from "react";
import { UserTypes } from "@/lib/types/user/UserTypes";
import {
  IoWarningOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

type Props = {
  user: UserTypes | null;
};

export default function ProfileStatusBanner({ user }: Props) {
  // Only show banner for individual users with a pending/approved/rejected request
  if (
    !user ||
    user.user_type !== "individual" ||
    !user.user_type_change ||
    !user.user_type_change.status
  ) {
    return null;
  }

  const {
    status,
    status_label,
    status_color,
    requested_type,
    rejection_reason,
  } = user.user_type_change;

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <IoWarningOutline className="text-lg min-w-[20px]" />;
      case "approved":
        return <IoCheckmarkCircleOutline className="text-lg min-w-[20px]" />;
      case "rejected":
        return <IoCloseCircleOutline className="text-lg min-w-[20px]" />;
      default:
        return <IoWarningOutline className="text-lg min-w-[20px]" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "approved":
        return "bg-green-50 border-green-200 text-green-800";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getRequestedTypeText = () => {
    switch (requested_type) {
      case "doctor":
        return "Doktor";
      case "corporate":
        return "Kurum";
      default:
        return requested_type;
    }
  };

  return (
    <div
      className={`relative w-full p-4 border-l-4 ${getStatusColor()} rounded-r-md shadow-sm animate-fadeOut`}
    >
        <div className="absolute lg:-top-2 lg:-right-2 top-0 right-0 bg-yellow-400 lg:p-1.5 p-1 max-lg:pb-3 max-lg:pl-3 lg:rounded-full rounded-bl-full text-white">{getStatusIcon()}</div>
        <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1">
            {status === "pending" && "Profesyonel Hesap Başvurusu Beklemede"}
            {status === "approved" && "Profesyonel Hesap Başvurunuz Onaylandı"}
            {status === "rejected" && "Profesyonel Hesap Başvurunuz Reddedildi"}
          </p>
          <p className="text-xs mb-1">
            {status === "pending" && (
              <>
                Hesap tipi: {getRequestedTypeText()} - Değerlendirme
                sürecindesiniz
              </>
            )}
            {status === "approved" && (
              <>
                Hesap tipiniz başarıyla {getRequestedTypeText()} olarak
                güncellendi
              </>
            )}
            {status === "rejected" && (
              <>
                Hesap tipi: {getRequestedTypeText()} -{" "}
                {rejection_reason || "Başvurunuz reddedildi"}
              </>
            )}
          </p>
          {status === "pending" && (
            <p className="text-xs opacity-75">
              Başvurunuz admin tarafından değerlendirilmektedir. En kısa sürede
              size dönüş yapılacaktır.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
