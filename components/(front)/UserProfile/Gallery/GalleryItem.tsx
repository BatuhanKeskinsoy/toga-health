"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GalleryItem as GalleryItemType } from "@/lib/types/user/galleryTypes";
import { deleteUserGallery } from "@/lib/services/user/gallery";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import CustomButton from "@/components/Customs/CustomButton";
import {
  IoPencilOutline,
  IoSearchOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { useLocale, useTranslations } from "next-intl";
import { convertDate } from "@/lib/functions/getConvertDate";

interface GalleryItemProps {
  item: GalleryItemType;
  onDelete: (id: number) => void;
  onEdit: (item: GalleryItemType) => void;
}

export default function GalleryItem({
  item,
  onDelete,
  onEdit,
}: GalleryItemProps) {
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  const t = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  // Modal açıldığında body scroll'u engelle
  useEffect(() => {
    if (showFullImage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showFullImage]);

  // YouTube video ID'sini çıkar
  const getYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // YouTube thumbnail URL oluştur
  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  };

  const handleDelete = async () => {
    const result = await funcSweetAlert({
      title: t("Emin misiniz?"),
      text: t("Bu galeri öğesi silinecek"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Evet, Sil"),
      cancelButtonText: t("İptal"),
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      try {
        await deleteUserGallery(item.id);
        onDelete(item.id);
        funcSweetAlert({
          title: t("Silindi"),
          text: t("Galeri öğesi başarıyla silindi"),
          icon: "success",
        });
      } catch (error) {
        funcSweetAlert({
          title: t("Hata"),
          text: t("Galeri öğesi silinirken bir hata oluştu"),
          icon: "error",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <>
      <div className="relative group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Resim/Video */}
        <div className="aspect-square relative">
          {item.type === "video" ? (
            // Video için YouTube thumbnail
            <Image
              src={getYouTubeThumbnail(item.image_url) || item.image_url}
              alt={item.title || "Video Thumbnail"}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowFullImage(true)}
            />
          ) : (
            // Resim için normal görüntüleme
            <Image
              src={item.image_url}
              alt={item.title || t("Galeri Resmi")}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setShowFullImage(true)}
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 lg:group-hover:bg-black/40 max-lg:bg-black/30 transition-all duration-300 flex items-start justify-end p-3">
            <div className="lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              <CustomButton
                leftIcon={<IoSearchOutline className="text-lg" />}
                containerStyles="bg-white/20 hover:bg-green-600/80 text-white p-2 rounded-full transition-all duration-200"
                handleClick={() => setShowFullImage(true)}
              />
              <CustomButton
                leftIcon={<IoPencilOutline className="text-lg" />}
                containerStyles="bg-white/20 hover:bg-blue-600/80 text-white p-2 rounded-full transition-all duration-200"
                handleClick={() => onEdit(item)}
              />
              <CustomButton
                leftIcon={
                  isDeleting ? (
                    <IoTrashOutline className="text-lg animate-spin" />
                  ) : (
                    <IoTrashOutline className="text-lg" />
                  )
                }
                containerStyles="bg-white/20 hover:bg-red-600/80 disabled:bg-red-300/80 text-white p-2 rounded-full transition-all duration-200"
                handleClick={handleDelete}
                isDisabled={isDeleting}
              />
            </div>
          </div>
        </div>

        {/* İçerik */}
        <div className="p-4">
          {item.title && (
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="capitalize">{item.type}</span>
            <span>{convertDate(new Date(item.created_at), fullLocale)}</span>
          </div>
        </div>
      </div>

      {/* Full Image/Video Modal */}
      {showFullImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center"
            onClick={() => setShowFullImage(false)}
          />
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {item.type === "video" ? (
              // Video için YouTube iframe
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    item.image_url
                  )}?autoplay=1`}
                  title={item.title || t("Video")}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // Resim için normal görüntüleme
              <Image
                src={item.image_url}
                alt={item.title || t("Galeri Resmi")}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
