"use client";
import React, { useState } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import { useTranslations } from "next-intl";

interface ProfessionalAccountTypeSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDoctor: () => void;
  onSelectCorporate: () => void;
}

export default function ProfessionalAccountTypeSelection({
  isOpen,
  onClose,
  onSelectDoctor,
  onSelectCorporate,
}: ProfessionalAccountTypeSelectionProps) {
  const t = useTranslations();

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <span className="text-2xl">🏥</span>
          <span>Profesyonel Hesap Başvurusu</span>
        </span>
      }
      allowOutsideClick={true}
      allowEscapeKey={true}
    >
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-7.5 font-medium">
          {t("Hangi tür profesyonel hesap için başvuru yapmak istiyorsunuz?")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[600px] mx-auto">
          {/* Doktor Seçeneği */}
          <div
            onClick={onSelectDoctor}
            className="border-2 border-gray-200 rounded-2xl p-5 md:p-7.5 cursor-pointer transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg hover:shadow-sitePrimary/15"
          >
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-sitePrimary/30 transition-transform duration-300 hover:scale-110">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                <circle cx="12" cy="8" r="2" fill="white" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2.5">
              Doktor
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-3.75">
              {t("Bireysel doktor hesabı oluşturun ve hastalarınızla randevular oluşturun.")}
            </p>
            <div className="mt-3.75 px-4 py-2 bg-sitePrimary/10 rounded-full inline-block transition-all duration-300 hover:bg-sitePrimary/20 hover:scale-105">
              <span className="text-xs text-sitePrimary font-semibold">
                Başvuru Yap
              </span>
            </div>
          </div>

          {/* Kurum Seçeneği */}
          <div
            onClick={onSelectCorporate}
            className="border-2 border-gray-200 rounded-2xl p-5 md:p-7.5 cursor-pointer transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg hover:shadow-sitePrimary/15"
          >
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-sitePrimary/30 transition-transform duration-300 hover:scale-110">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 12H15V17H13V12H11V10H13V7H15V10H17V12Z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2.5">
              Kurum
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-3.75">
              {t("Hastane veya klinik hesabı oluşturun ve kurumsal hizmetlerinizi sunun.")}
            </p>
            <div className="mt-3.75 px-4 py-2 bg-sitePrimary/10 rounded-full inline-block transition-all duration-300 hover:bg-sitePrimary/20 hover:scale-105">
              <span className="text-xs text-sitePrimary font-semibold">
                Başvuru Yap
              </span>
            </div>
          </div>
        </div>

        <div className="mt-7.5 p-5 bg-gradient-to-br from-gray-50 to-gray-200 rounded-2xl border-l-4 border-sitePrimary shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sitePrimary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-1 font-semibold">Bilgi</p>
              <p className="text-[13px] text-slate-600 leading-snug">
                {t("Profesyonel hesabınız onaylandıktan sonra randevu alma ve verme özelliklerine erişebileceksiniz.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
