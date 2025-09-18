"use client";
import CommentCard from "@/components/others/Comment/CommentCard";
import { useTranslations } from "next-intl";
import React from "react";

import { TabComponentProps, isHospitalData, isDoctorData } from "@/lib/types/provider/providerTypes";

function Comments({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations();
  const comments = providerData && isHospitalData(providerData)
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
      {comments.map((comment: any, index: number) => (
        <CommentCard
          key={comment.id || index}
          userName={comment.author}
          rating={comment.rating}
          date={comment.date}
          comment={comment.comment}
        />
      ))}
    </div>
  );
}

export default Comments;
