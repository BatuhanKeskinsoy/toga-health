"use client";
import React from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import { useRouter } from "@/i18n/navigation";

interface CountryRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryRequiredModal({
  isOpen,
  onClose,
}: CountryRequiredModalProps) {
  const router = useRouter();

  const handleGoToProfile = () => {
    onClose();
    router.push("/profile");
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span>Profil Bilgisi Gerekli</span>
        </span>
      }
      allowOutsideClick={true}
      allowEscapeKey={true}
    >
      <div className="text-center py-5">
        <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-amber-500 to-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
          <span className="text-4xl">🌍</span>
        </div>
        <p className="text-base text-gray-700 mb-2.5 font-medium">
          Profesyonel Hesap Başvurusu İçin Ülke Bilgisi Gerekli
        </p>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-5">
          Profesyonel hesap başvurusu yapabilmek için öncelikle profil
          bilgilerinize ülke bilgisi eklemeniz gerekmektedir.
        </p>
      </div>
      <div className="flex gap-3 justify-center">
        <CustomButton
          handleClick={onClose}
          containerStyles="px-4 py-2 text-sm rounded-md bg-gray-600 hover:bg-gray-700 text-white transition-colors"
          title="İptal"
        />
        <CustomButton
          handleClick={handleGoToProfile}
          containerStyles="px-4 py-2 text-sm rounded-md bg-sitePrimary hover:bg-sitePrimary/90 text-white transition-colors"
          title="Şimdi Ekle"
        />
      </div>
    </CustomModal>
  );
}
