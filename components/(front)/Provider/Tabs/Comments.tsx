"use client";
import CommentCard from "@/components/others/Comment/CommentCard";
import { useTranslations } from "next-intl";
import React from "react";

import { TabComponentProps, isHospitalData, isDoctorData } from "@/lib/types/provider/providerTypes";
import { ApprovedComment } from "@/lib/types/provider/doctorTypes";

// Tarih formatı fonksiyonu
const formatCommentDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return "Bugün";
  } else if (diffInDays === 1) {
    return "Dün";
  } else if (diffInDays < 7) {
    return `${diffInDays} gün önce`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} hafta önce`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ay önce`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} yıl önce`;
  }
};

function Comments({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations();
  const comments: ApprovedComment[] | null = providerData && isHospitalData(providerData)
    ? providerData.approved_comments
    : providerData && isDoctorData(providerData)
    ? providerData.approved_comments
    : null;

  if (!comments) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800">{t("Yorumlar")}</h3>
      <p className="text-gray-600 leading-relaxed">
        {t("Kaliteli hizmet anlayışımızı yansıtan gerçek hasta deneyimleri")}
      </p>
      
      {comments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Henüz yorum bulunmuyor")}</p>
        </div>
      ) : (
        comments.map((comment: ApprovedComment, index: number) => (
          <CommentCard
            key={comment.id || index}
            userName={comment.author}
            rating={comment.rating}
            date={formatCommentDate(comment.comment_date)}
            comment={comment.comment}
          />
        ))
      )}
    </div>
  );
}

export default Comments;
