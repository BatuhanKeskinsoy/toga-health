"use client";

import React, { useState, useRef } from "react";
import { CreateGalleryFormData } from "@/lib/types/user/galleryTypes";
import {
  createUserGallery,
  updateUserGallery,
} from "@/lib/services/user/gallery";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import CustomInput from "@/components/Customs/CustomInput";
import { useTranslations } from "next-intl";
interface GalleryUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  editItem?: any; // GalleryItem tipi için
}

export default function GalleryUploadModal({
  onClose,
  onSuccess,
  editItem,
}: GalleryUploadModalProps) {
  const [step, setStep] = useState<"type" | "image" | "video">("type");
  const [formData, setFormData] = useState<CreateGalleryFormData>({
    images: [],
    type: "image",
    title: "",
    titles: [],
  });
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();
  // Modal açıldığında edit item varsa formu doldur
  React.useEffect(() => {
    if (editItem) {
      setFormData({
        images: [],
        type: editItem.type,
        title: editItem.title || "",
        titles: [editItem.title || ""],
      });
      setStep(editItem.type);
    } else {
      setFormData({
        images: [],
        type: "image",
        title: "",
        titles: [],
      });
      setStep("type");
    }
  }, [editItem]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      funcSweetAlert({
        title: t("Uyarı"),
        text: t("Sadece görsel dosyaları yüklenebilir"),
        icon: "warning",
      });
    }

    // Edit modunda sadece tek dosya, create modunda birden fazla
    if (editItem) {
      setFormData((prev) => ({
        ...prev,
        images: [validFiles[0]], // Sadece ilk dosyayı al
        titles: [""], // Tek title
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
        titles: [...prev.titles, ...new Array(validFiles.length).fill("")],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      titles: prev.titles.filter((_, i) => i !== index),
    }));
  };

  const updateTitle = (index: number, title: string) => {
    setFormData((prev) => ({
      ...prev,
      titles: prev.titles.map((t, i) => (i === index ? title : t)),
    }));
  };

  // YouTube URL ekleme
  const addYoutubeUrl = () => {
    // Edit modunda sadece tek URL, create modunda birden fazla
    if (editItem) {
      setYoutubeUrls([""]); // Tek URL
    } else {
      setYoutubeUrls((prev) => [...prev, ""]);
    }
  };

  // YouTube URL güncelleme
  const updateYoutubeUrl = (index: number, url: string) => {
    setYoutubeUrls((prev) => prev.map((u, i) => (i === index ? url : u)));
  };

  // YouTube URL silme
  const removeYoutubeUrl = (index: number) => {
    setYoutubeUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === "image" && formData.images.length === 0) {
      funcSweetAlert({
        title: t("Uyarı"),
        text: t("En az bir görsel seçmelisiniz"),
        icon: "warning",
      });
      return;
    }

    if (step === "video" && youtubeUrls.length === 0) {
      funcSweetAlert({
        title: t("Uyarı"),
        text: t("En az bir YouTube URL girmelisiniz"),
        icon: "warning",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Form data'yı hazırla
      const submitData = {
        ...formData,
        type: step as "image" | "video",
        // Update için tek dosya/link gönder
        images: editItem
          ? step === "image"
            ? [formData.images[0]]
            : []
          : step === "image"
          ? formData.images
          : [],
        video_links: editItem
          ? step === "video"
            ? [youtubeUrls[0]]
            : []
          : step === "video"
          ? youtubeUrls
          : [],
        // Update için sadece tek title gönder
        titles: editItem ? [formData.title || ""] : formData.titles,
      };

      if (editItem) {
        await updateUserGallery(editItem.id, submitData);
        funcSweetAlert({
          title: t("Başarılı"),
          text: t("Galeri öğesi başarıyla güncellendi"),
          icon: "success",
        });
      } else {
        await createUserGallery(submitData);
        funcSweetAlert({
          title: t("Başarılı"),
          text: t(
            `Galeri ${
              step === "image" ? "fotoğrafları" : "videoları"
            } başarıyla yüklendi`
          ),
          icon: "success",
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      funcSweetAlert({
          title: t("Hata"),
        text: t(`Galeri yüklenirken bir hata oluştu`),
        icon: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Tip seçimi
  const renderTypeSelection = () => (
    <div className="flex flex-col gap-6 text-center">
      <p className="text-lg text-gray-700 font-medium">
        {t("Hangi tür galeri öğesi eklemek istiyorsunuz?")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Görsel Yükleme */}
        <div
          className="flex flex-col gap-3 border-2 border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
          onClick={() => setStep("image")}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{t("Görsel Yükle")}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("Bilgisayarınızdan görsel dosyalarını yükleyin")}
          </p>
          <div className="inline-flex items-center w-max mx-auto px-4 py-2 bg-sitePrimary/10 text-sitePrimary rounded-full text-sm font-medium">
            {t("Fotoğraf Yükle")}
          </div>
        </div>

        {/* Video URL */}
        <div
          className="flex flex-col gap-3 border-2 border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
          onClick={() => setStep("video")}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{t("Youtube Video Ekle")}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t("YouTube Video URL")}
          </p>
          <div className="inline-flex items-center w-max mx-auto px-4 py-2 bg-sitePrimary/10 text-sitePrimary rounded-full text-sm font-medium">
            {t("Youtube Video Ekle")}
          </div>
        </div>
      </div>

      {/* Bilgi Kutusu */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-l-4 border-sitePrimary">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sitePrimary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">{t("Bilgi")}</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t("Görseller için dosya yükleme, videolar için YouTube URL kullanabilirsiniz")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Görsel yükleme formu
  const renderImageForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Başlık */}
      <CustomInput
        label={t("Başlık")}
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      {/* Dosya Yükleme Alanı */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {editItem ? t("Yeni Fotoğraf Seçin") : t("Fotoğraf")}
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={!editItem}
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {editItem
                  ? t("Yeni fotoğrafı buraya sürükleyin veya")
                  : t("Fotoğrafı buraya sürükleyin veya")}
              </p>
              <CustomButton
                title={t("Dosya Seçin")}
                btnType="button"
                containerStyles="text-blue-600 hover:text-blue-500 font-medium bg-transparent border-none p-0"
                handleClick={() => fileInputRef.current?.click()}
              />
            </div>
            <p className="text-sm text-gray-500">
              {t("PNG, JPG, GIF dosyaları desteklenir")}
            </p>
          </div>
        </div>
      </div>

      {/* Seçilen Dosyalar */}
      {formData.images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editItem
              ? t("Seçilen Görsel")
              : `${t("Seçilen Görseller")} (${formData.images.length})`}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.images.map((file, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <CustomButton
                    btnType="button"
                    containerStyles="text-red-500 hover:text-red-700 bg-transparent border-none p-1"
                    handleClick={() => removeFile(index)}
                    leftIcon={
                      <svg
                        className="w-5 h-5"
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
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Butonlar */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <CustomButton
          title={t("Geri")}
          containerStyles="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          handleClick={() => setStep("type")}
        />
        <CustomButton
          title={isUploading ? t("Yükleniyor") : editItem ? t("Güncelle") : t("Yükle")}
          containerStyles="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors flex items-center space-x-2"
          handleClick={handleSubmit}
          isDisabled={isUploading || formData.images.length === 0}
        />
      </div>
    </form>
  );

  // Video URL formu
  const renderVideoForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Başlık */}
      <CustomInput
        label={t("Başlık")}
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
      />

      {/* YouTube URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {editItem ? t("Yeni YouTube Video URL") : t("YouTube Video URL")}
        </label>

        {youtubeUrls.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">
              {editItem
                ? t("Yeni video URL ekleyin")
                : t("Henüz video URL eklenmedi")}
            </p>
            <CustomButton
              title={editItem ? t("Yeni video URL ekleyin") : t("İlk videoyu ekle")}
              containerStyles="mt-2 text-blue-600 hover:text-blue-500 text-sm font-medium bg-transparent border-none p-0"
              handleClick={addYoutubeUrl}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {youtubeUrls.map((url, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex-1">
                  <CustomInput
                    label={"YouTube URL"}
                    value={url}
                    onChange={(e) => updateYoutubeUrl(index, e.target.value)}
                    type="url"
                  />
                </div>
                <CustomButton
                  title={t("Sil")}
                  btnType="button"
                  containerStyles="px-5 py-3.5 text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 self-end"
                  handleClick={() => removeYoutubeUrl(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Butonlar */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <CustomButton
          title={t("Geri")}
          btnType="button"
          containerStyles="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          handleClick={() => setStep("type")}
        />
        <CustomButton
          btnType="submit"
          title={isUploading ? t("Yükleniyor") : editItem ? t("Güncelle") : t("Yükle")}
          containerStyles="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-md transition-colors flex items-center space-x-2"
          handleClick={handleSubmit}
          isDisabled={isUploading || youtubeUrls.length === 0}
        />
      </div>
    </form>
  );

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title={
        step === "type"
          ? editItem
            ? t("Galeri Düzenle") 
            : t("Galeri Yükle")
          : step === "image"
          ? t("Görsel Yükle")
          : t("Youtube Video Ekle")
      }
    >
      {step === "type" && renderTypeSelection()}
      {step === "image" && renderImageForm()}
      {step === "video" && renderVideoForm()}
    </CustomModal>
  );
}
