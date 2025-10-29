"use client";
import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { IoCameraOutline, IoTrashOutline } from "react-icons/io5";
import { useTranslations } from "use-intl";
import { usePusherContext } from "@/lib/context/PusherContext";

import CustomButton from "@/components/Customs/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  updateProfilePhoto,
  deleteProfilePhoto,
} from "@/lib/services/user/updateProfile/profilePhoto";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { UserTypes } from "@/lib/types/user/UserTypes";

interface UpdateProfilePhotoProps {
  user: UserTypes | null;
}

export default function UpdateProfilePhoto({ user }: UpdateProfilePhotoProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateServerUser, serverUser } = usePusherContext();

  // PusherContext'ten gelen user'ı kullan (güncel user)
  const currentUser = serverUser || user;

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return funcSweetAlert({
        title: t("Hata"),
        text: t("Lütfen bir resim dosyası seçin."),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return funcSweetAlert({
        title: t("Hata"),
        text: t("Dosya boyutu 5MB'dan küçük olmalıdır."),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    }

    setProfilePhoto(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleProfilePhotoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!profilePhoto) return;

    setIsUploading(true);
    try {
      const response = await updateProfilePhoto(profilePhoto);

      if (response.status && response.data) {
        // Server user'ı güncelle (header'daki user bilgilerini korumak için)
        // API tüm user objesini döndürüyor, eksik alanlar varsa mevcut user ile birleştir
        const updatedUser = {
          ...currentUser,
          ...response.data,
        };
        updateServerUser(updatedUser);

        // Local state'i temizle
        fileInputRef.current!.value = "";
        setProfilePhoto(null);

        // Preview'ı temizle (API'den gelen fotoğraf serverUser'dan gelecek)
        setPhotoPreview(null);

        await funcSweetAlert({
          title: t("Başarılı"),
          text: t("Profil fotoğrafı güncellendi"),
          icon: "success",
          confirmButtonText: t("Tamam"),
        });
      }
    } catch (error: any) {
      await funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProfilePhoto = async (e: FormEvent) => {
    e.preventDefault();

    const confirmed = await funcSweetAlert({
      title: t("Emin misiniz?"),
      text: t("Profil fotoğrafınızı silmek üzeresiniz"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Evet, Sil"),
      cancelButtonText: t("Vazgeç"),
    });

    if (!confirmed.isConfirmed) return;

    setIsUploading(true);
    try {
      const response = await deleteProfilePhoto();

      if (response.status) {
        // Server user'ı güncelle (header'daki user bilgilerini korumak için)
        // Eğer response.data varsa kullan, yoksa mevcut user'dan photo'yu kaldır
        const updatedUser = response.data
          ? { ...currentUser, ...response.data }
          : { ...currentUser, photo: null };
        updateServerUser(updatedUser);

        // Local state'i temizle
        fileInputRef.current!.value = "";
        setProfilePhoto(null);
        setPhotoPreview(null);

        await funcSweetAlert({
          title: t("Başarılı"),
          text: t("Profil fotoğrafı silindi"),
          icon: "success",
          confirmButtonText: t("Tamam"),
        });
      }
    } catch (error: any) {
      await funcSweetAlert({
        title: t("İşlem Başarısız"),
        text: error?.response?.data?.message || t("İşlem Başarısız"),
        icon: "error",
        confirmButtonText: t("Tamam"),
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleProfilePhotoSubmit}
      className="flex flex-col gap-4 items-center lg:border-r p-4 lg:pt-0 lg:pr-8 max-lg:border-b border-gray-200"
    >
      <span>{t("Fotoğrafı Güncelle")}</span>
      <div className="relative flex flex-col items-center gap-4 w-fit group">
        {(photoPreview || currentUser?.photo) && (
          <CustomButton
            containerStyles="absolute -right-1.5 -top-1.5 rounded-full z-10 p-1.5 bg-sitePrimary opacity-80 hover:opacity-100 hover:scale-110 flex items-center justify-center text-white transition-all duration-300"
            leftIcon={<IoTrashOutline className="text-lg" />}
            handleClick={handleDeleteProfilePhoto}
          />
        )}
        <div className="relative min-w-36 w-36 h-36 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          <ProfilePhoto
            user={currentUser}
            photo={photoPreview || undefined}
            name={currentUser?.name}
            size={144}
            fontSize={48}
            responsiveSizes={{ desktop: 144, mobile: 144 }}
            responsiveFontSizes={{ desktop: 48, mobile: 48 }}
          />

          <label
            htmlFor="profile-photo"
            className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-300"
          >
            <IoCameraOutline className="text-white text-3xl" />
          </label>
          <input
            type="file"
            id="profile-photo"
            ref={fileInputRef}
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {profilePhoto && (
          <div className="flex flex-col gap-2 items-center">
            <p className="text-sm text-gray-600 truncate max-w-[150px]">
              {profilePhoto.name}
            </p>
            <CustomButton
              btnType="submit"
              title={isUploading ? t("Yükleniyor") : t("Fotoğrafı Güncelle")}
              containerStyles={`py-2 px-4 rounded-md transition-all duration-300 bg-sitePrimary/80 hover:bg-sitePrimary text-white text-xs w-full ${
                isUploading ? "opacity-50 !cursor-not-allowed" : "opacity-100"
              }`}
              isDisabled={isUploading}
            />
          </div>
        )}
      </div>
    </form>
  );
}

