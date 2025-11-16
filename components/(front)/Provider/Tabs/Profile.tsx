"use client";
import React from "react";
import { useTranslations, useLocale } from "next-intl";

import {
  TabComponentProps,
  isHospitalData,
  isDoctorData,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";

function Profile({
  isHospital = false,
  providerData,
  selectedAddress,
}: TabComponentProps) {
  const t = useTranslations();
  const locale = useLocale();

  // Dil kodunu (tr, en, de, ar, he...) aktif locale'e göre insan okunur hale çevir
  const languageDisplayNames = React.useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: "language" });
    } catch {
      return null;
    }
  }, [locale]);

  const getLanguageLabel = (code: string) => {
    if (languageDisplayNames) {
      const label = languageDisplayNames.of(code);
      if (label) {
        return label.charAt(0).toUpperCase() + label.slice(1);
      }
    }
    return code.toUpperCase();
  };

  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-md">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  // API response'una göre data'yı al
  const infoData = isHospitalDetailData(providerData)
    ? ('corporate_info' in providerData ? providerData.corporate_info : providerData.data?.corporate_info)
    : isDoctorDetailData(providerData)
    ? ('doctor_info' in providerData ? providerData.doctor_info : providerData.data?.doctor_info)
    : isHospitalData(providerData)
    ? providerData.corporate
    : isDoctorData(providerData)
    ? providerData.doctor
    : null;

  // Doctor için specialty bilgisini al
  const specialty = isDoctorDetailData(providerData) && infoData && 'specialty' in infoData
    ? infoData.specialty
    : null;

  // Languages bilgisini al
  const languages = infoData && 'languages' in infoData && Array.isArray(infoData.languages)
    ? infoData.languages
    : [];

  // Facilities bilgisini al (sadece hospital için)
  const facilities = isHospitalDetailData(providerData) && infoData && 'facilities' in infoData && Array.isArray(infoData.facilities)
    ? infoData.facilities
    : [];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {isHospital ? t("Hastane Bilgileri") : t("Profil Bilgileri")}
        </h3>
      </div>

      {/* Specialty (Doctor için) */}
      {specialty && (
        <div className="flex flex-col gap-2">
          <h4 className="text-md font-medium text-gray-700">
            {t("Uzmanlık Alanı")}
          </h4>
          <div className="bg-sitePrimary/10 text-sitePrimary px-3 py-2 rounded-md text-sm font-medium">
            {specialty.name}
          </div>
        </div>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-md font-medium text-gray-700">
            {t("Konuşulan Diller")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang: string, index: number) => (
              <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {getLanguageLabel(lang)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Facilities (Hospital için) */}
      {facilities.length > 0 && (
        <div className="flex flex-col gap-2">
          <h4 className="text-md font-medium text-gray-700">
            {t("Hastane Olanakları")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {facilities.map((facility: string, index: number) => (
              <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {facility}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
