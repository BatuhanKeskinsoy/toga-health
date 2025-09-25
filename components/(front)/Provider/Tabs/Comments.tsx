"use client";
import CommentCard from "@/components/others/Comment/CommentCard";
import CommentsPagination from "@/components/(front)/Provider/Comments/CommentsPagination";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

import { TabComponentProps, isHospitalDetailData, isDoctorDetailData } from "@/lib/types/provider/providerTypes";

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
  
  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  
  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  // API response'una göre tüm yorumları al
  const allComments = isHospitalDetailData(providerData) || isDoctorDetailData(providerData)
    ? providerData.comments
    : null;
  
  // Client-side pagination için yorumları filtrele
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const comments = allComments ? allComments.slice(startIndex, endIndex) : null;
  
  // Client-side pagination bilgilerini hesapla
  const totalComments = allComments ? allComments.length : 0;
  const totalPages = Math.ceil(totalComments / perPage);

  // Sayfa değiştiğinde sadece state'i güncelle (URL değişmez)
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Yorumlar bölümüne scroll yap
    const commentsSection = document.getElementById('comments-section');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="comments-section" className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{t("Yorumlar")}</h3>
        {totalComments > 0 && (
          <span className="bg-sitePrimary/10 text-sitePrimary text-sm font-medium px-2.5 py-0.5 rounded-full">
            {totalComments}
          </span>
        )}
      </div>
      <p className="text-gray-600 leading-relaxed">
        {t("Kaliteli hizmet anlayışımızı yansıtan gerçek hasta deneyimleri")}
      </p>
      
      {!comments || comments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Henüz yorum bulunmuyor")}</p>
        </div>
      ) : (
        <>
          {/* Yorumlar */}
          <div className="flex flex-col gap-4">
            {comments.map((comment: any, index: number) => (
              <CommentCard
                key={comment.id || index}
                userName="Anonim" // API'de author field yok
                rating={comment.rating}
                date={formatCommentDate(comment.created_at)}
                comment={comment.comment}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <CommentsPagination
              currentPage={currentPage}
              lastPage={totalPages}
              total={totalComments}
              perPage={perPage}
              onPageChange={handlePageChange}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
}

export default Comments;
