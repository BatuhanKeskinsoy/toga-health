"use client";
import CommentCard from "@/components/others/Comment/CommentCard";
import CommentsPagination from "@/components/(front)/Provider/Comments/CommentsPagination";
import { useTranslations } from "next-intl";
import React, { useState, useCallback, useMemo } from "react";
import { getClientToken } from "@/lib/utils/cookies";
import { usePusherContext } from "@/lib/context/PusherContext";
import {
  TabComponentProps,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";
import { useGlobalContext } from "@/app/Context/GlobalContext";
import CustomButton from "@/components/others/CustomButton";
import { CustomInput } from "@/components/others/CustomInput";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import {
  IoChatboxEllipsesOutline,
  IoCheckmarkCircle,
  IoStar,
} from "react-icons/io5";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import { sendComment } from "@/lib/services/comment/sendComment";

// Tarih formatı fonksiyonu - hydration safe
const formatCommentDate = (dateString: string, isClient: boolean = false): string => {
  try {
    const date = new Date(dateString);
    
    // Geçersiz tarih kontrolü
    if (isNaN(date.getTime())) {
      return "Tarih bilinmiyor";
    }

    // Server-side'da sadece statik format döndür
    if (!isClient) {
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Client-side'da relative time hesapla
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Az önce";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
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
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Tarih bilinmiyor";
  }
};

const Comments = React.memo(function Comments({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const t = useTranslations();
  const { setSidebarStatus } = useGlobalContext();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingComments, setPendingComments] = useState<any[]>([]);

  // PusherContext'ten user bilgilerini al
  const { serverUser } = usePusherContext();

  // Comment input handler - memoized
  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setComment(e.target.value);
    },
    []
  );

  // Rating handler
  const handleRatingChange = useCallback((newRating: number) => {
    setRating(newRating);
  }, []);

  // Submit comment handler
  const handleSubmitComment = useCallback(async () => {
    if (!comment || !serverUser || !providerData) return;

    // Client-side validation
    if (comment.length < 10) {
      funcSweetAlert({
        title: "Geçersiz Yorum",
        text: "Yorum en az 10 karakter olmalıdır.",
        icon: "warning",
        confirmButtonText: "Tamam",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const receiverId = isHospitalDetailData(providerData)
        ? providerData.id
        : isDoctorDetailData(providerData)
        ? providerData.id
        : 0;

      const response = await sendComment(receiverId, rating, comment);

      // Başarılı yorum için state'e ekle
      const newPendingComment = {
        id: `pending-${Date.now()}`,
        comment: comment,
        rating: rating,
        created_at: new Date().toISOString(),
        status: "pending",
        user: {
          name: serverUser.name,
          photo: serverUser.photo,
        },
      };

      setPendingComments((prev) => [newPendingComment, ...prev]);
      setComment("");
      setRating(5);

      // API'den gelen başarı mesajını göster
      funcSweetAlert({
        title: "Başarılı",
        text: response.message || "Yorum başarıyla oluşturuldu.",
        icon: "success",
        confirmButtonText: "Tamam",
      });
    } catch (error: any) {
      console.error("Yorum gönderme hatası:", error);

      // API validation hatası kontrolü
      if (error?.response?.data?.errors?.comment) {
        const errorMessage = error.response.data.errors.comment[0];
        funcSweetAlert({
          title: "Geçersiz Yorum",
          text: errorMessage,
          icon: "warning",
          confirmButtonText: "Tamam",
        });
      } else if (error?.response?.data?.message) {
        funcSweetAlert({
          title: "Hata",
          text: error.response.data.message,
          icon: "error",
          confirmButtonText: "Tamam",
        });
      } else {
        funcSweetAlert({
          title: "Hata",
          text: "Yorum gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    comment,
    rating,
    serverUser,
    providerData,
    isHospitalDetailData,
    isDoctorDetailData,
  ]);

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // User authentication kontrolü - hydration safe
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hydration sonrası user kontrolü
  React.useEffect(() => {
    setIsHydrated(true);
    setIsClient(true);
    const token = getClientToken();
    setIsUserLoggedIn(!!token && !!serverUser);
  }, [serverUser?.id]);

  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  // API response'una göre tüm yorumları al - memoized
  const allComments = useMemo(() => {
    return isHospitalDetailData(providerData) ||
      isDoctorDetailData(providerData)
      ? providerData.comments
      : null;
  }, [providerData]);

  // Client-side pagination için yorumları filtrele - memoized (pending comments dahil)
  const { comments, totalComments, totalPages } = useMemo(() => {
    // API'den gelen yorumlar + pending yorumlar
    const allCommentsWithPending = [
      ...(pendingComments || []),
      ...(allComments || []),
    ];

    if (allCommentsWithPending.length === 0) {
      return { comments: null, totalComments: 0, totalPages: 0 };
    }

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedComments = allCommentsWithPending.slice(
      startIndex,
      endIndex
    );
    const total = allCommentsWithPending.length;
    const pages = Math.ceil(total / perPage);

    return {
      comments: paginatedComments,
      totalComments: total,
      totalPages: pages,
    };
  }, [allComments, pendingComments, currentPage, perPage]);

  // Sayfa değiştiğinde sadece state'i güncelle (URL değişmez) - memoized
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Yorumlar bölümüne scroll yap
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

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

      {/* Hydration loading state */}
      {!isHydrated && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-md p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-sitePrimary"></div>
            <p className="text-sm text-gray-600 font-medium">
              {t("Yükleniyor")}
            </p>
          </div>
        </div>
      )}

      {/* Hydration safe rendering */}
      {isHydrated && isUserLoggedIn && serverUser && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md p-4 border border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative min-w-16 w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              <ProfilePhoto
                photo={serverUser.photo}
                name={serverUser.name}
                fontSize={22}
                size={64}
              />
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

          <div className="flex max-xl:flex-col gap-4 bg-white rounded-lg p-4 border border-blue-100">
            {/* Rating Section */}
            <div className="flex items-center gap-0.5 max-xl:w-full min-w-max">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`transition-colors ${
                    star <= rating
                      ? "text-yellow-400 hover:text-yellow-500"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <IoStar className="w-6 h-6" />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">{rating} / 5</span>
            </div>

            {/* Comment Input */}
            <div className="relative flex-1">
              <CustomInput
                type="text"
                label={t("Yorumunuzu giriniz")}
                value={comment}
                onChange={handleCommentChange}
                required
                icon={<IoChatboxEllipsesOutline />}
              />
              <div
                className={`absolute -top-2 right-2 text-xs bg-[#f9fafb] px-2 ${
                  comment.length < 10 ? "text-red-500" : "text-green-400"
                }`}
              >
                {comment.length} / ( +10 )
              </div>
            </div>

            {/* Submit Button */}
            <CustomButton
              handleClick={handleSubmitComment}
              title={isSubmitting ? t("Yükleniyor") : t("Yorum Yap")}
              leftIcon={
                isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <IoChatboxEllipsesOutline className="text-xl" />
                )
              }
              containerStyles={`flex items-center justify-center gap-2 py-3 px-6 min-w-max max-xl:w-full rounded-md transition-all duration-300 bg-sitePrimary hover:bg-sitePrimary/90 text-white text-sm font-semibold shadow-md hover:shadow-lg transform enabled:hover:-translate-y-0.5 disabled:opacity-50 disabled:!cursor-not-allowed disabled:transform-none`}
              isDisabled={!comment || comment.length < 10 || isSubmitting}
            />
          </div>
        </div>
      )}

      {isHydrated && !isUserLoggedIn && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-md p-6 border border-amber-200 shadow-sm">
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
                {t("Giriş Yap")}
              </h4>
              <p className="text-sm text-amber-700">
                {t("Yorum yapmak için giriş yapmanız gerekmektedir")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <p className="text-sm text-gray-600 mb-4">
              {t("Deneyiminizi paylaşmak için lütfen hesabınıza giriş yapın")}
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

      {!comments || comments.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Henüz yorum bulunmuyor")}</p>
        </div>
      ) : (
        <>
          {/* Yorumlar */}
          <div className="flex flex-col gap-4">
            {comments.map((comment: any, index: number) => (
              <div key={comment.id || index} className="relative">
                {/* Pending Comment Badge */}
                {comment.status === "pending" && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      <IoCheckmarkCircle className="w-3 h-3" />
                      Onay Bekliyor
                    </div>
                  </div>
                )}

                <div
                  className={`${
                    comment.status === "pending"
                      ? "opacity-75 border-amber-200 bg-amber-50/30"
                      : ""
                  }`}
                >
                   <CommentCard
                     userName={
                       comment.user?.name || comment.userName || "Dentalilan Kullanıcısı"
                     }
                     userAvatar={comment.user?.photo || comment.userPhoto}
                     rating={comment.rating}
                     date={formatCommentDate(comment.created_at, isClient)}
                     comment={comment.comment}
                   />
                </div>
              </div>
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
});

export default Comments;
