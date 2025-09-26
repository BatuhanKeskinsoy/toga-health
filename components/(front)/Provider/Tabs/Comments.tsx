"use client";
import CommentCard from "@/components/others/Comment/CommentCard";
import CommentsPagination from "@/components/(front)/Provider/Comments/CommentsPagination";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { getClientToken } from "@/lib/utils/cookies";
import { usePusherContext } from "@/lib/context/PusherContext";
import {
  TabComponentProps,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomButton from "@/components/others/CustomButton";

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

function Comments({ isHospital = false, providerData }: TabComponentProps) {
  const t = useTranslations();
  const { setSidebarStatus } = useGlobalContext();

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // PusherContext'ten user bilgilerini al
  const { serverUser } = usePusherContext();

  // User authentication kontrolü - doğrudan hesaplama (sonsuz döngü önlemek için)
  const token = getClientToken();
  const isUserLoggedIn = !!token && !!serverUser;
  const isLoadingUser = false;

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
  const allComments =
    isHospitalDetailData(providerData) || isDoctorDetailData(providerData)
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
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
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

      {/* User authentication loading state */}
      {isLoadingUser ? (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-sitePrimary"></div>
            <p className="text-sm text-gray-600 font-medium">
              {t("Kontrol ediliyor")}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Yorum yazma bölümü - sadece giriş yapmış kullanıcılar için */}
          {isUserLoggedIn && serverUser && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sitePrimary to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {serverUser.photo ? (
                    <img
                      src={serverUser.photo}
                      alt={serverUser.name || "User"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {(serverUser.name || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {serverUser.name || "Kullanıcı"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {t("Deneyiminizi paylaşın")}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-gray-600 mb-4">
                  {t(
                    "Bu sağlayıcı ile ilgili deneyiminizi diğer kullanıcılarla paylaşın"
                  )}
                </p>
                <button className="bg-gradient-to-r from-sitePrimary to-blue-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-sitePrimary/90 hover:to-blue-600/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  {t("Yorum Yap")}
                </button>
              </div>
            </div>
          )}

          {/* Giriş yapmamış kullanıcılar için güzel tasarım */}
          {!isUserLoggedIn && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-amber-800">
                    {t("Giriş Yapın")}
                  </h4>
                  <p className="text-sm text-amber-700">
                    {t("Yorum yapmak için giriş yapmanız gerekmektedir")}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-gray-600 mb-4">
                  {t(
                    "Deneyiminizi paylaşmak ve diğer kullanıcıların deneyimlerini okumak için hesabınıza giriş yapın"
                  )}
                </p>
                <div className="flex gap-3">
                  <CustomButton
                    handleClick={() => setSidebarStatus("Auth")}
                    containerStyles="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    title={t("Giriş Yap")}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

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
